document.addEventListener('DOMContentLoaded', () => {
    
    history.pushState(null, "channels", "channels");

    document.querySelectorAll('.channel').forEach( a => {
        a.onclick = () => {
            alert("clicked");
        }
    });

    document.querySelector('#create-channel').onclick = () => {
            
            const htmlString = `                
                    <form action = "{{ url_for('login')}}" method='post'>
                        <div class="form-group">
                            <label for="new-channel-name">Display Name:</label>
                            <input type="text" class="form-control" id="new-channel-name" name="new-channel-name" placeholder="Channel name">
                        </div>
                        <button type="submit" class="btn btn-primary">Create</button>
                    </form>
            `;

            const div = document.createElement('div');
            div.innerHTML = htmlString;
            document.querySelector('#main-body').append(div)
    };
});