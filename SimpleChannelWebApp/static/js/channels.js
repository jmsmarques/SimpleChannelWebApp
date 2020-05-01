document.addEventListener('DOMContentLoaded', () => {
    
     // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('channel created', data => {
        const a = document.createElement("a");
        a.setAttribute("class", "channel list-group-item list-group-item-action");
        a.setAttribute("href", "#");
        a.innerHTML = data["channel"];

        document.querySelector("#channel-list").append(a);
    });


    socket.on('channel creation failed', data => {
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

    // Renders contents of new page in main view.
    function load_page(name) {
        const request = new XMLHttpRequest();
        request.open('GET', `/${name}`);
        request.send();
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

            addChannelDiv = true;
        }
        else {
            let channelDiv = document.querySelector('#add-channel-div');
            channelDiv.parentNode.removeChild(channelDiv);
            addChannelDiv = false; 
        }
    };
});