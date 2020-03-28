# RocketTracker
Arduino based Transmitter and Receiver for GPS tracking and recovery of model rockets

## Introduction
I wanted a way to track my model rockets to aid in recovery, this project instead became an experiment in testing various 
microcontroller solutions and wireless mediums (Wifi, LoRa, ASK). This current iteration of the project utilises the cheaply available ISM band
(433.92Mhz) modules.

> I plan to massively update this project to support multiple configurations of Microcontrollers and wireless mediums, along with
the companion software. If you have any ideas or features you'd like to see please raise an issue or contact me via https://M0VTE.co.uk/blog

## Transmitter
The transmitter is designed to carried by the rocket as a payload and consists of a li-ion battery, Neo-6M GPS receiever,
ASK-433 transmitter module and an Arduino. The current iteration uses a ESP8266 NodeMCU as I have been experimenting using
the Wifi and Lora based modules however the firmware is easily transferrable with minimal change.
![Transmitter Circuit Diagram](https://github.com/AllanGallop/RocketTracker/blob/master/Screenshots/transmitter_circuit_diagram.png)

## Receiever
The receiver is based on an Arduino Nano v3, once again this can be subsituted for most of the Arduino family, and the companion
ASK-433 receiver.
![Receiver Circuit Diagram](https://github.com/AllanGallop/RocketTracker/blob/master/Screenshots/reciever_circuit_diagram.png)


## Tracker
![Tracker Screenshot](https://github.com/AllanGallop/RocketTracker/blob/master/Screenshots/tracker_screenshot.png)
The tracking software is a simple Python3/Flask application with browser based frontend for tracking the location of the rocket,
it uses LeafletJS for generating the map.

### Setup
1. Install Python3
2. Add the Flask and pySerial modules using PIP
  ```py -m pip install flask```
  ```py -m pip install pyserial```
3. Generate an API Key (http://mapbox.com) and enter it into the index.html file (near bottom of the page)
4. Run the app
  ```py -m groundcontrol.py```
5. Open web browser to http://localhost:5000
6. Enter the COM port of the Receiver arduino (defaults COM1) and hit 'Connect'

