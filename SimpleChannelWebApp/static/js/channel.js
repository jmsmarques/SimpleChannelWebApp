document.addEventListener('DOMContentLoaded', () => {
    
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    const channel = localStorage.getItem('channel');

    socket.on('receive message', data => {
        if(data["channel"] == channel) {
            let sender = data["sender"];
            let user = localStorage.getItem('user');

            // if(sender != user) {
                let message = data["message"];
                let content = sender + " said: " + message;

                document.querySelector("#chat-area").append(content);
            // }
        }    
    });

    function sendMessage() {
        let msgContent = document.querySelector("#message-content");
        let message = msgContent.value;
        let user = localStorage.getItem('user');
        let channel = channel;

        socket.emit('send message', {"sender": user, "message": message, "channel": channel, "timestamp": Date.now()});
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