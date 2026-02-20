

#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <RTClib.h>
#include <Preferences.h>
#include <SPI.h>
#include <MAX6675.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>




// ================= CONNECTION SETTINGS ===============
const char* WIFI_SSID = "LAPTOP-6TP7LM62 4300";
const char* WIFI_PASS = "a3C72\64";

const char* MQTT_HOST = "f97b49e6540e4182841eaa2b449327a7.s1.eu.hivemq.cloud";
const int   MQTT_PORT = 8883;
const char* MQTT_USER = "Bhargav";
const char* MQTT_PASS = "CyclopsX69";

String DEVICE_ID = "ESP_A";

unsigned long lastPublish = 0;
WiFiClientSecure wifiClient;
PubSubClient client(wifiClient);




// ================= PIN DEFINITIONS =================
#define RELAY_PIN    26
#define BUZZER_PIN   27

#define ENC_DT       32
#define ENC_CLK      33
#define ENC_SW       25

// MAX6675 (SPI)
#define MAX6675_SCK  18
#define MAX6675_SO   19
#define MAX6675_CS   5

// ================= SYSTEM LIMITS =================
#define HYSTERESIS     1.0
#define MAX_SAFE_TEMP 135.0

// ================= OBJECTS =================
LiquidCrystal_I2C lcd(0x27, 20, 4);
RTC_DS3231 rtc;
Preferences preferences;
MAX6675 thermocouple(MAX6675_CS, MAX6675_SO, MAX6675_SCK);

// ================= VARIABLES =================
float currentTemp = 0.0;
float setTemp = 40.0;

unsigned long setTime = 60;       // seconds
unsigned long elapsedTime = 0;

bool isRunning = false;
bool isPaused  = false;
int  menuState = 0;

int lastEncoded = 0;

// ==================================================

// ================= MQTT CALLBACK ===================
// void mqttCallback(char* topic, byte* payload, unsigned int length) {
//   Serial.print("[CMD] Topic: ");
//   Serial.println(topic);

//   Serial.print("[CMD] Payload: ");
//   String msg = "";
//   for (int i = 0; i < length; i++) msg += (char)payload[i];
//   Serial.println(msg);

//   // ===== SIMPLE JSON COMMAND HANDLING =====
//   if (msg.indexOf("start") >= 0) {
//     Serial.println("[ACTION] Oven START");
//   }

//   if (msg.indexOf("stop") >= 0) {
//     Serial.println("[ACTION] Oven STOP");
//   }

//   if (msg.indexOf("set_temp") >= 0) {
//     int vStart = msg.indexOf("value") + 7;
//     int vEnd = msg.indexOf("}", vStart);
//     int setTemp = msg.substring(vStart, vEnd).toInt();
//     Serial.print("[ACTION] SET TEMP = ");
//     Serial.println(setTemp);
//   }

//   if (msg.indexOf("reset_timer") >= 0) {
//     Serial.println("[ACTION] RESET TIMER");
//     // later: elapsed = 0;
//   }
// }





// Updated MQTT callback 
void mqttCallback(char* topic, byte* payload, unsigned int length) {

  String msg = "";
  for (int i = 0; i < length; i++) msg += (char)payload[i];

  Serial.println("\n[MQTT CMD]");
  Serial.println(topic);
  Serial.println(msg);

  // -------- START --------
  if (msg.indexOf("\"cmd\":\"start\"") >= 0) {
    if (!isRunning) {
      startCycle();
      Serial.println("MQTT: START");
    }
  }

  // -------- STOP --------
  else if (msg.indexOf("\"cmd\":\"stop\"") >= 0) {
    performReset();
    Serial.println("MQTT: STOP");
  }

  // -------- SET TEMP --------
  else if (msg.indexOf("set_temp") >= 0) {
    int idx = msg.indexOf("value");
    if (idx >= 0) {
      int newTemp = msg.substring(idx + 7).toInt();
      if (newTemp > 0 && newTemp < MAX_SAFE_TEMP) {
        setTemp = newTemp;
        preferences.putFloat("setTemp", setTemp);
        Serial.print("MQTT: SET TEMP = ");
        Serial.println(setTemp);
      }
    }
  }

  // -------- SET TIME --------
  else if (msg.indexOf("set_time") >= 0) {
    int idx = msg.indexOf("value");
    if (idx >= 0) {
      int newTime = msg.substring(idx + 7).toInt();
      if (newTime > 0) {
        setTime = newTime;
        preferences.putULong("setTime", setTime);
        Serial.print("MQTT: SET TIME = ");
        Serial.println(setTime);
      }
    }
  }
}




void connectWiFi() {
  Serial.print("Connecting to WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("OK!");
}




void connectMQTT() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT...");
    if (client.connect(DEVICE_ID.c_str(), MQTT_USER, MQTT_PASS)) {
      Serial.println("OK!");

      // ===== NEW: SUBSCRIBE AFTER CONNECT =====
      // String subTopic = "ovens/" + DEVICE_ID + "/command";
      // client.subscribe(subTopic.c_str());

      String subTopic = "esp1/oven1/command";
      client.subscribe(subTopic.c_str());

      Serial.print("Subscribed to: ");
      Serial.println(subTopic); 

    } else {
      Serial.print("Failed: ");
      Serial.println(client.state());
      delay(1500);
    }
  }
}


void setup() {

  // =================== CONNECTION SETUP =========================
  Serial.begin(115200);
  connectWiFi();
  wifiClient.setInsecure();
  client.setServer(MQTT_HOST, MQTT_PORT);

  // ===== NEW: SET CALLBACK =====
  client.setCallback(mqttCallback);

  connectMQTT();
 
// =============== HARDWARE SETUP ===============================
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);

  pinMode(ENC_DT, INPUT_PULLUP);
  pinMode(ENC_CLK, INPUT_PULLUP);
  pinMode(ENC_SW, INPUT_PULLUP);

  lcd.init();
  lcd.backlight();
  lcd.print("System Booting");

  // -------- I2C INIT --------
  Wire.begin(21, 22);

  if (!rtc.begin()) {
    lcd.setCursor(0, 1);
    lcd.print("RTC ERROR!");
  }

  // -------- SPI INIT --------
  SPI.begin(MAX6675_SCK, MAX6675_SO, -1, MAX6675_CS);
  thermocouple.begin();
  thermocouple.setSPIspeed(4000000);

  preferences.begin("oven", false);

  if (preferences.getBool("running", false)) {
    recoverState();
  }

  delay(1500);
  lcd.clear();
}

// ==================================================
void loop() {
  readEncoder();
  readTemperature();
  controlSystem();
  updateDisplay();
}

// ==================================================
void readTemperature() {
  static unsigned long lastRead = 0;
  if (millis() - lastRead < 500) return;

  thermocouple.read();
  float t = thermocouple.getCelsius();

  if (!isnan(t) && t > 0 && t < MAX_SAFE_TEMP) {
    currentTemp = t;

  }
  lastRead = millis();

////////////////////////////////////////////////////////////////////
  if (!client.connected()) connectMQTT();
  client.loop();

  if (millis() - lastPublish > 2000) {
    lastPublish = millis();

    int elapsed = millis() / 1000;

    // String payload = "{";
    // payload += "\"oven1\": " + String(currentTemp) + ",";
    // payload += "\"elapsed\": " + String(elapsed);
    // payload += "}";

    String payload = "{";
    payload += "\"running\":" + String(isRunning ? "true" : "false") + ",";
    payload += "\"temp\":" + String(currentTemp) + ",";
    payload += "\"setTemp\":" + String(setTemp) + ",";
    payload += "\"elapsed\":" + String(elapsedTime) + ",";
    payload += "\"setTime\":" + String(setTime);
    payload += "}";


    // String topic = "ovens/" + DEVICE_ID + "/telemetry";

    String topic = "esp1/oven1/data";

    String power_status = "esp1/oven1/status";

    String power_payload = "{";
    power_payload += "\"power\":\"true\"";
    power_payload += "}";

    client.publish(topic.c_str(), payload.c_str());
    client.publish(power_status.c_str(), power_payload.c_str());
    
    Serial.println("[TX] " + topic + " -> " + payload);
  }
}

// ==================================================
void controlSystem() {
  if (isRunning && !isPaused) {
    static unsigned long lastSec = 0;
    if (millis() - lastSec >= 1000) {
      elapsedTime++;
      preferences.putULong("elapsed", elapsedTime);
      lastSec = millis();
    }

    if (elapsedTime >= setTime) {
      finishCycle();
      return;
    }

    if (currentTemp < setTemp - HYSTERESIS)
      digitalWrite(RELAY_PIN, HIGH);
    else if (currentTemp >= setTemp)
      digitalWrite(RELAY_PIN, LOW);
  } else {
    digitalWrite(RELAY_PIN, LOW);
  }
}

// ==================================================
void readEncoder() {
  static unsigned long pressStart = 0;
  static bool longPress = false;

  // ----- BUTTON -----
  if (digitalRead(ENC_SW) == LOW) {
    if (pressStart == 0) pressStart = millis();
    if (millis() - pressStart > 3000 && !longPress) {
      longPress = true;
      performReset();
    }
  } else {
    if (pressStart && !longPress && millis() - pressStart > 50) {
      handleButton();
    }
    pressStart = 0;
    longPress = false;
  }

  // ----- ROTATION -----
  int MSB = digitalRead(ENC_CLK);
  int LSB = digitalRead(ENC_DT);
  int encoded = (MSB << 1) | LSB;
  int sum = (lastEncoded << 2) | encoded;

  if (sum == 0b1101 || sum == 0b0100 || sum == 0b0010 || sum == 0b1011) {
    if (menuState == 1 && setTemp < MAX_SAFE_TEMP) setTemp++;
    if (menuState == 2) setTime += 30;
  }

  if (sum == 0b1110 || sum == 0b0111 || sum == 0b0001 || sum == 0b1000) {
    if (menuState == 1 && setTemp > 0) setTemp--;
    if (menuState == 2 && setTime > 30) setTime -= 30;
  }

  lastEncoded = encoded;
}

// ==================================================
void handleButton() {
  if (menuState == 0) {
    if (!isRunning) { menuState = 1; lcd.clear(); }
    else isPaused = !isPaused;
  }
  else if (menuState == 1) { menuState = 2; lcd.clear(); }
  else if (menuState == 2) {
    menuState = 0;
    startCycle();
  }
}

// ==================================================
void updateDisplay() {
  static unsigned long lastLCD = 0;
  if (millis() - lastLCD < 300) return;
  lastLCD = millis();

  if (menuState == 0) {
    lcd.setCursor(0,0); lcd.print("PV: "); lcd.print(currentTemp,1); lcd.print(" C   ");
    lcd.setCursor(0,1); lcd.print("SV: "); lcd.print(setTemp,0); lcd.print(" C   ");
    lcd.setCursor(0,2);
    lcd.print(isRunning ? (isPaused ? "PAUSED " : "RUNNING") : "IDLE   ");
    lcd.setCursor(0,3);
    lcd.print(elapsedTime); lcd.print("/"); lcd.print(setTime); lcd.print(" sec   ");
  }
  else if (menuState == 1) {
    lcd.setCursor(0,0); lcd.print("SET TEMPERATURE ");
    lcd.setCursor(0,1); lcd.print(setTemp); lcd.print(" C      ");
  }
  else if (menuState == 2) {
    lcd.setCursor(0,0); lcd.print("SET TIME        ");
    lcd.setCursor(0,1); lcd.print(setTime); lcd.print(" sec    ");
  }
}

// ==================================================
void startCycle() {
  isRunning = true;
  isPaused = false;
  elapsedTime = 0;

  preferences.putBool("running", true);
  preferences.putFloat("setTemp", setTemp);
  preferences.putULong("setTime", setTime);
}

// ==================================================
void finishCycle() {
  isRunning = false;
  digitalWrite(RELAY_PIN, LOW);
  preferences.putBool("running", false);

  lcd.clear();
  lcd.print("PROCESS DONE");

  for (int i = 0; i < 3; i++) {
    digitalWrite(BUZZER_PIN, HIGH); delay(200);
    digitalWrite(BUZZER_PIN, LOW);  delay(200);
  }
}

// ==================================================
void performReset() {
  isRunning = false;
  digitalWrite(RELAY_PIN, LOW);

  preferences.putBool("running", false);
  elapsedTime = 0;

  setTemp = 40;
  setTime = 60;
  menuState = 0;

  lcd.clear();
  lcd.print("RESET DONE");
  delay(1000);
}

// ==================================================
void recoverState() {
  setTemp = preferences.getFloat("setTemp", 40);
  setTime = preferences.getULong("setTime", 60);
  elapsedTime = preferences.getULong("elapsed", 0);

  if (elapsedTime < setTime) {
    isRunning = true;
    lcd.clear();
    lcd.print("POWER RESTORED");
    lcd.setCursor(0,1);
    lcd.print("RESUMING...");
    delay(2000);

    String restart_signal = "esp1/oven1/restart";
    String restart_payload = "{";
    restart_payload += "\"successful_restart\":" + String(isRunning ? "true" : "false");
    restart_payload += "}";

    client.publish(restart_signal.c_str(), restart_payload.c_str());

  } else {
    preferences.putBool("running", false);
  }
}
