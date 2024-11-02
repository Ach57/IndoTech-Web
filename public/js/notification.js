const socket = io();
// Listen for new summary notifications

socket.on('new-summary', (data)=>{
    document.getElementById('notification-message').textContent = `Door Type: ${data.doorType}, Door Category: ${data.doorCategory}, Part: ${data.part}, Type: ${data.type}, Length: ${data.length}, Quantity: ${data.quantity}, Project Number: ${data.projectNumber}, Estimated Time: ${data.estimatedTime}, Stock Data: ${data.stockData}`;
    document.getElementById('notification-box').style.display = 'block';

    document.getElementById('accept-button').onclick = () => handleAction('accept', data);
    document.getElementById('hold-button').onclick = () => handleAction('on-hold', data);
    document.getElementById('reject-button').onclick = () => handleAction('reject', data);

});

function handleAction(action, data){
    // Send the action to the server
    fetch('/handle-task-action', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, ...data }),
    }).then(response => response.text())
      .then(result => {
        console.log(result);
        document.getElementById('notification-box').style.display = 'none';
    }).catch(error => console.error('Error:', error));
}