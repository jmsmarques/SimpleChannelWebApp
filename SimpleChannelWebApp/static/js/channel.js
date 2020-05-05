document.addEventListener('DOMContentLoaded', () => {
    
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    const channel = localStorage.getItem('channel');
    const user = localStorage.getItem('user');

    socket.on('receive message', data => {
        let chatArea = document.querySelector("#chat-area");

        if(data["channel"] == channel) {
            let user = localStorage.getItem('user');

            const msg = document.createElement("div");

            const sender = document.createElement("b");
            if(data["sender"] != user) {
                msg.setAttribute("class", "line");
                sender.innerHTML = data["sender"] + " said: ";
            }
            else {
                msg.setAttribute("class", "my-line");
                sender.innerHTML = "You said: ";
            }

            const timestamp = document.createElement("b");
            timestamp.innerHTML = " at " + data["timestamp"];

            msg.append(sender);
            msg.innerHTML += data["message"];
            msg.append(timestamp);

            let maxScroll = chatArea.scrollTopMax; //get max scroll before appending the message

            chatArea.append(msg);
            
            //scroll user to bottom when he receives a message
            if(chatArea.scrollTop == maxScroll || msg.getAttribute("class").includes("my-line")) //check if the user is scrolled to bottom or if he wrote the message himself
                chatArea.scrollTop = chatArea.scrollTopMax;
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
    
    //disable send button while the contents are empty
    document.querySelector("#send-message").disabled = true;
    document.querySelector("#message-content").onkeyup = () => {
        if (document.querySelector("#message-content").value.length > 0)
            document.querySelector("#send-message").disabled = false;
        else
            document.querySelector('#send-message').disabled = true;
    
    };
    //end disable send button

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