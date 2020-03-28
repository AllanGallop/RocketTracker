from flask import Flask, render_template, request, send_file, send_from_directory
from flask_socketio import SocketIO 
from flask_cors import CORS 
from threading import Thread
import sys, os, serial

app = Flask(__name__, static_url_path='/')
app.config['SECRET_KEY'] = 'abc123'
socketio = SocketIO(app)
cors = CORS(app,resources={r"/*":{"origins":"*"}})
thread = None

port = 'COM1'
ser = {}

def background_thread():
    socketio.emit('locationUpdate', "Starting up")
    while True:

        data = ser.readline()
        data = data.decode('utf-8').strip()
        socketio.emit('locationUpdate', data)
    ser.close()

@app.route('/www/<path:path>')
def send_media(path):
    return send_from_directory('www', path)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('start')
def startup(port):
    global thread, ser
    if(ser == {}):
        ser = serial.Serial(port)
        ser.flushInput()
        if thread is None:
            thread = Thread(target=background_thread)
            thread.start()
    socketio.emit('ready',broadcast=True,include_self=True)

socketio.run(app, debug=False, host='localhost')
