document.addEventListener('DOMContentLoaded', () => {
    
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    const channel = localStorage.getItem('channel');
    const user = localStorage.getItem('user');

    socket.on('receive message', data => {
        let chatArea = document.querySelector("#chat-area");

        if(data["channel"] == channel) {
            let user = localStorage.getItem('user');
            let delete_icon = null; //icon delete to use on own messages
            const msg = document.createElement("div");
            msg.setAttribute("id", "msg-" + data["msg_id"]);

            const sender = document.createElement("b");
            if(data["sender"] != user) {
                msg.setAttribute("class", "line");
                sender.innerHTML = data["sender"] + " said: ";
            }
            else {
                msg.setAttribute("class", "my-line");
                sender.innerHTML = "You said: ";
                delete_icon = document.createElement("img");
                delete_icon.setAttribute("src", "/static/img/trash_can.svg");
                delete_icon.setAttribute("alt", "trash can");
                delete_icon.addEventListener("click", () => {
                    socket.emit('delete message', {"channel": channel, "msg_id": data["msg_id"]});
                }); 
            }

            const timestamp = document.createElement("b");
            timestamp.innerHTML = " " + data["timestamp"];

            msg.append(sender);
            msg.innerHTML += data["message"];
            msg.append(timestamp);

            if(delete_icon != null) //if there is a trash icon to add
                msg.append(delete_icon);

            let maxScroll = chatArea.scrollTopMax; //get max scroll before appending the message

            chatArea.append(msg);

            //scroll user to bottom when he receives a message
            if(chatArea.scrollTop == maxScroll || msg.getAttribute("class").includes("my-line")) //check if the user is scrolled to bottom or if he wrote the message himself
                chatArea.scrollTop = chatArea.scrollTopMax;
        }    
    });

    socket.on('delete message', data => {
        if(channel == data["channel"])
            document.querySelector("#msg-" + data["msg_id"]).parentNode.removeChild(document.querySelector("#msg-" + data["msg_id"]))
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
    
    //disable send button while the contents are empty
    document.querySelector("#send-message").disabled = true;
    document.querySelector("#message-content").onkeyup = () => {
        if (document.querySelector("#message-content").value.length > 0)
            document.querySelector("#send-message").disabled = false;
        else
            document.querySelector('#send-message').disabled = true;
    
    };

    //activate the delete button
    document.querySelectorAll(".my-line").forEach( div => {
        let msg_id = div.getAttribute("id").substr(div.getAttribute("id").length - 1);
        img = div.children.item(2);
        img.addEventListener("click", () => {
            socket.emit('delete message', {"channel": channel, "msg_id": msg_id});
        }); 
    });
});