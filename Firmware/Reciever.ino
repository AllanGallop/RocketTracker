#include <RH_ASK.h>
#include <SPI.h>

//Mission Playload 
struct payloadStruct{
  float longitude =0.0;
  float latitude  =0.0;
  float altitude  =0.0;
  int   sats      =0;
}Payload;

RH_ASK rfdriver(2000,5,10);
int ledStatus = 13;

void setup() {
    pinMode(ledStatus, OUTPUT);
    Serial.begin(9600);  // Debugging only
    if (!rfdriver.init())
         Serial.println("init failed");
    Serial.println("Ground Control\r\nVersion 1.0\r\nAllan Gallop M0VTE 2020\r\nWaiting for Major Tom...");
}

void loop() {
    digitalWrite(ledStatus,LOW);
    
    uint8_t buf[RH_ASK_MAX_MESSAGE_LEN];
    uint8_t buflen = sizeof(buf);

    if (rfdriver.recv(buf, &buflen)) // Non-blocking
    {
        memcpy(&Payload, buf, sizeof(Payload));
        Serial.print(Payload.latitude);
        Serial.print(",");
        Serial.print(Payload.longitude);
        Serial.print(",");
        Serial.print(Payload.altitude);
        Serial.print(",");
        Serial.print(Payload.sats);
        Serial.print("\r\n");
    }
}
