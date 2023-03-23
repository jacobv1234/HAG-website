// function for sending request to send email
function Submit() {
    document.querySelector('.Message').innerHTML = 'Please wait'

    // get values of input fields
    let reply_email = document.querySelector('.reply_email').value
    let name = document.querySelector('.name').value
    let subject = document.querySelector('.subject').value
    let body = document.querySelector('.email_body').value

    // piece together json
    let request_body = {
        reply_email: reply_email,
        name: name,
        subject: subject,
        body: body
    }

    // send to /contact/send
    fetch('/contact/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(request_body)
    })
    .then(response => response.json()).then(data => {

        document.querySelector('.Message').innerHTML = data['message']

    })
}