document.addEventListener('DOMContentLoaded', () => {
    
     // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('channel created', data => {
        const a = document.createElement("a");
        a.setAttribute("class", "channel list-group-item list-group-item-action");
        a.setAttribute("href", "#");
        a.innerHTML = data["channel"];
        a.href = "/channels/" + encodeURIComponent((a.innerHTML).trim());

        document.querySelector("#channel-list").append(a);
        removePopup();
    });

    socket.on('channel creation failed', data => {
        if((alert = document.querySelector(".alert")) != null)
            alert.parentNode.removeChild(alert);

        const fail = document.createElement("div");
        fail.setAttribute("class", "alert alert-danger");
        fail.setAttribute("role", "alert");
        fail.innerHTML = data["message"];

        document.querySelector("#new-channel-name").after(fail);
    });


    function createChannel() {
        newChannel = document.querySelector("#new-channel-name").value;
        socket.emit('create channel', {"channel": newChannel});
    }

    history.pushState(null, "channels", "channels");

    let addChannelDiv = false; //variable to see if the popup is created

    document.querySelectorAll('.channel').forEach( a => {
        a.href = "/channels/" + encodeURIComponent((a.innerHTML).trim());
    });

    document.querySelector('#create-channel').onclick = () => {
        if(!addChannelDiv) {
            const htmlString = `                
                    <form action = "javascript:void(0);" method='post'>
                        <div class="form-group">
                            <label for="new-channel-name">Channel Name:</label>
                            <input type="text" class="form-control" id="new-channel-name" name="new-channel-name" placeholder="Channel name">
                        </div>
                        <button type="button" id="create-new-btn" class="btn btn-outline-primary">Create</button>
                    </form>
            `;

            const div = document.createElement('div');
            div.setAttribute('id', 'add-channel-div');
            div.innerHTML = htmlString;
            document.querySelector('#main-body').append(div)

            document.querySelector("#create-new-btn").addEventListener("click", createChannel);
            //disable send button while the contents are empty
            document.querySelector("#create-new-btn").disabled = true;
            document.querySelector("#new-channel-name").onkeyup = () => {
                if (document.querySelector("#new-channel-name").value.length > 0)
                    document.querySelector("#create-new-btn").disabled = false;
                else
                    document.querySelector('#create-new-btn').disabled = true;
            };
            //end disable send button

            addChannelDiv = true; //mark the popup as oppened
        }
        else {
            removePopup();
        }
    };

    function removePopup() { //function to remove the popup to create the channel
        let channelDiv = document.querySelector('#add-channel-div');
        channelDiv.parentNode.removeChild(channelDiv);
        addChannelDiv = false; 
    }
});