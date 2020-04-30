import os

from flask import Flask, session, request, jsonify, render_template
from flask_session import Session
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

created_channels = {"Channel 1": [], "Channel 2": []}

@app.route("/")
def index():
    try: 
        if session['user'] != None:
            return render_template("index.html")
        else:
            return channels()
    except Exception:
        return render_template("index.html")

@app.route("/login", methods=["POST"])
def login():
    username = request.form.get("displayName")
    session['user'] = username
    return channels()

@app.route("/channels")
def channels():
    return render_template("channels.html", user=session['user'], channels=created_channels.keys())

@app.route("/channels/<string:channel>")
def channel():

    selected_channel = created_channels.get(channel)
    return "TODO"

@app.route("/create-channel")
def create_channel():

    return "TODO"

@socketio.on("send message")
def send_message(data):
    message = data['message']
    sender = data['sender']
    channel = data['channel']
    emit("receive message", {'message': message, 'sender': sender, 'channel': channel}, broadcast=True)
