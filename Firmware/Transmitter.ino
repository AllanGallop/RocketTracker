#include <SPI.h>
#include <SoftwareSerial.h>
#include <TinyGPS++.h>
#include <RH_ASK.h>

RH_ASK rfdriver(2000,10,14); //Baud,RXpin,TXpin 
TinyGPSPlus gps;
SoftwareSerial serialGPS(13, 15); //TXpin, RXpin

//Mission Playload 
struct payloadStruct{
  float longitude =0.0;
  float latitude  =0.0;
  float altitude  =0.0;
  int   sats      =0;
}Payload;

//Transmitter Buffer
byte txBuffer[sizeof(Payload)] = {0}; 

void setup() {
  Serial.begin(9600);
  Serial.println("Starting...");
  serialGPS.begin(9600);
  if(!rfdriver.init()){
    Serial.println("RF Failed to init!");
  }
}

void loop() {
  while (serialGPS.available() > 0){
    gps.encode(serialGPS.read());
    if (gps.location.isUpdated()){
      Payload.longitude = gps.location.lng();
      Payload.latitude  = gps.location.lat();
      Payload.altitude  = gps.altitude.meters();
      Payload.sats      = gps.satellites.value();  
      sendPayload();
    }
  }
}

void sendPayload(){
  memcpy(txBuffer,&Payload,sizeof(Payload)); //Copy payload to buffer
  byte pSize=sizeof(Payload);                //Get sizeof payload
  rfdriver.send((uint8_t *)txBuffer, pSize); //Transmit buffer
  rfdriver.waitPacketSent();                 //Wait for packet to send
  delay(200);
}
