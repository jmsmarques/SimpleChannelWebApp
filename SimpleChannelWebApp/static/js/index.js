// document.addEventListener('DOMContentLoaded', () => {

//     socket.on('connect', () => {
//         // Get the button
//         document.querySelector('#sendMessage').onclick = () => {
//                 const message = "meh";
//                 socket.emit('send message', {"message": message, "sender": sender});
//         };
    
//     });
    
//     socket.on('receive message', data => {
//         if(channel = data.channel) {
//             const li = document.createElement('li');
//             li.innerHTML = '${data.sender} wrote: ${data.message}'
//             document.querySelector("#messages").append(li);
//         }
//     });

// });


