#include <WiFi.h>
#include <WiFiClient.h>
#include "esp_camera.h"

// Replace with your Wi-Fi credentials
const char* ssid = "realme 8";
const char* password = "12345678";

// Backend URL
const char* serverUrl = "192.168.248.91"; // IP only
const int serverPort = 3000;
const char* serverPath = "/api/upload"; // API endpoint

// Camera pin configuration for ESP32-CAM
#define PWDN_GPIO_NUM  32
#define RESET_GPIO_NUM -1
#define XCLK_GPIO_NUM  0
#define SIOD_GPIO_NUM  26
#define SIOC_GPIO_NUM  27

#define Y9_GPIO_NUM    35
#define Y8_GPIO_NUM    34
#define Y7_GPIO_NUM    39
#define Y6_GPIO_NUM    36
#define Y5_GPIO_NUM    21
#define Y4_GPIO_NUM    19
#define Y3_GPIO_NUM    18
#define Y2_GPIO_NUM    5
#define VSYNC_GPIO_NUM 25
#define HREF_GPIO_NUM  23
#define PCLK_GPIO_NUM  22

void setup() {
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi connected");

  // Initialize the camera
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;

  // Check PSRAM and set camera configurations
  if (psramFound()) {
    Serial.println("PSRAM found. Using high-quality settings.");
    config.frame_size = FRAMESIZE_UXGA;
    config.jpeg_quality = 10;
    config.fb_count = 2;
  } else {
    Serial.println("PSRAM not found. Using low-quality settings.");
    config.frame_size = FRAMESIZE_SVGA;
    config.jpeg_quality = 12;
    config.fb_count = 1;
  }

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x\n", err);
    return;
  }

  Serial.println("Camera initialized successfully");
}

void loop() {
  Serial.println("Attempting to capture an image...");

  // Capture a frame
  camera_fb_t *fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("Camera capture failed. Retrying in 10 seconds.");
    delay(10000);
    return;
  }

  WiFiClient client;

  if (!client.connect(serverUrl, serverPort)) {
    Serial.println("Connection to server failed.");
    esp_camera_fb_return(fb);
    delay(10000);
    return;
  }

  // Construct the multipart request
  String boundary = "----ESP32Boundary";
  String bodyStart = "--" + boundary + "\r\n";
  bodyStart += "Content-Disposition: form-data; name=\"image\"; filename=\"capture.jpg\"\r\n";
  bodyStart += "Content-Type: image/jpeg\r\n\r\n";

  String bodyEnd = "\r\n--" + boundary + "--\r\n";

  // Send HTTP request headers
  client.printf("POST %s HTTP/1.1\r\n", serverPath);
  client.printf("Host: %s:%d\r\n", serverUrl, serverPort);
  client.printf("Content-Type: multipart/form-data; boundary=%s\r\n", boundary.c_str());
  client.printf("Content-Length: %d\r\n\r\n", bodyStart.length() + fb->len + bodyEnd.length());

  // Send HTTP request body
  client.print(bodyStart);       // Start boundary and headers
  client.write(fb->buf, fb->len); // Image binary data
  client.print(bodyEnd);         // End boundary

  // Wait for the response
  while (client.connected() || client.available()) {
    if (client.available()) {
      String line = client.readStringUntil('\n');
      Serial.println(line);
    }
  }

  client.stop();

  // Return the frame buffer
  esp_camera_fb_return(fb);

  // Delay before the next capture
  Serial.println("Capture completed. Waiting 10 seconds before next attempt.");
  delay(10000);
}
