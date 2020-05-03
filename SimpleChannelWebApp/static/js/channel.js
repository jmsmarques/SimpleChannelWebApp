document.addEventListener('DOMContentLoaded', () => {
    
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    const channel = localStorage.getItem('channel');
    const user = localStorage.getItem('user');

    socket.on('receive message', data => {
        if(data["channel"] == channel) {
            let user = localStorage.getItem('user');

            const msg = document.createElement("div");

            const sender = document.createElement("b");
            if(data["sender"] != user) {
                msg.setAttribute("class", "row line");
                sender.innerHTML = data["sender"] + " said: ";
            }
            else {
                msg.setAttribute("class", "row my-line");
                sender.innerHTML = "You said: ";
            }

            const timestamp = document.createElement("b");
            timestamp.innerHTML = " at " + data["timestamp"];

            msg.append(sender);
            msg.innerHTML += data["message"];
            msg.append(timestamp);

            document.querySelector("#chat-area").append(msg);
            // }
        }    
    });

    function sendMessage() {
        let msgContent = document.querySelector("#message-content");
        let message = msgContent.value;    
        let timestamp = new Date(Number(Date.now())).toString();
        timestamp = timestamp.split(' ').slice(1, 5).join(' ');

        socket.emit('send message', {"sender": user, "message": message, "channel": channel, "timestamp": timestamp});
        msgContent.value = "";

        // document.querySelector("#chat-area").append(content);
    }

    document.querySelector("#send-message").addEventListener("click", sendMessage);

    // const request = new XMLHttpRequest();
    // request.open('GET', '/get_messages/' + encodeURIComponent((channel).trim()));

    // request.onload = () => {
    //     const data = JSON.parse(request.responseText);
    //     alert(data);

    //     if(data.success) {
    //         alert(data);
    //     }
    //     else {
    //         alert("Failed");
    //     }
    // }

    // request.send();

});