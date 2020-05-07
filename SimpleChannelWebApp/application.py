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
msg_id = 0

@app.route("/")
def index():
    logout = request.args.get('logout')
    try: 
        if logout: #logout request
            session['user'] = None
            session['channel'] = None
            return render_template("index.html")
        if session.get('user') != None:
            if(session.get('channel') != None):
                return channel(session['channel'])
            else:
                return channels()
        else:
            return render_template("index.html")
    except Exception as e:
        print(f"execption {e}")
        return render_template("index.html")

@app.route("/login", methods=["POST"])
def login():
    username = request.form.get("displayName")
    session['user'] = username
    return channels()

@app.route("/channels")
def channels():
    session['channel'] = None
    return render_template("channels.html", user=session['user'], channels=created_channels.keys())

@app.route("/channels/<string:channel>")
def channel(channel):
    session['channel'] = channel
    return render_template("channel.html", channel=channel, channel_content=created_channels[channel], user=session['user'])

@app.route("/get_messages/<string:channel>")
def get_messages(channel):
    print(jsonify(created_channels[channel]))
    return jsonify(created_channels[channel])

@socketio.on("create channel")
def create_channel(data):
    name = data["channel"]

    if name in created_channels:
        emit("channel creation failed", {"message": "Channel already exists!"})
    else:
        created_channels[name] = []
        emit("channel created", {"channel": name}, broadcast=True)

@socketio.on("send message")
def send_message(data):
    global msg_id
    message = data['message']
    sender = data['sender']
    channel = data['channel']
    timestamp = data['timestamp']

    created_channels[channel].append((msg_id, sender, message, timestamp))
    msg_id += 1

    while len(created_channels[channel]) > 100: #delete the older messages if there are more than 100
        created_channels[channel].pop(0)

    emit("receive message", {'msg_id': msg_id - 1, 'message': message, 'sender': sender, 'channel': channel, 'timestamp': timestamp}, broadcast=True)

@socketio.on("delete message")
def delete_message(data):
    msg_to_delete = int(data['msg_id'])
    channel = data['channel']
    #delete the message from memory
    for msg in created_channels[channel]:
        if msg[0] == msg_to_delete:
            print("fount it")
            created_channels[channel].remove(msg)
            break
    
    emit("delete message", {"msg_id": msg_to_delete, "channel": channel}, broadcast=True)
    
