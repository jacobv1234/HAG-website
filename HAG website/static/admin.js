// get current contact email
function get_contact_email() {
    fetch('/admin/email').then(response => response.json()).then(data => {
        document.querySelector('.current-email').innerHTML = 'Currently ' + data['email']
    })
}

// this function is directly from MDN Web Docs, and is free to use for sha-256 hashing strings

async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""); // convert bytes to hex string
    return hashHex;
}



// check password, if correct reveal everything else
function checkpass() {
    let password = document.querySelector('.pword_entry').value
    digestMessage(password).then(hash => {
        console.log(hash)

        let body = {
            hash: hash
        }

        // send to /passcheck
        fetch('/passcheck', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(body)
        })
        .then(response => response.json())
        
        // handle response
        .then(data => {
            if (data['message'] == 'Correct password') {
                console.log(data)
                // hide the password entry
                document.querySelector('.password').style.display = 'none'
                // show everything else
                document.querySelector('.main').style.display = 'inline'
            }
        })
    })
}


// update the password
function changepass() {
    document.querySelector('.response').innerHTML = 'Please wait...'
    let password1 = document.querySelector('.new_pword_entry1').value
    let password2 = document.querySelector('.new_pword_entry2').value
    if (password1 == password2) {
        digestMessage(password1).then(hash => {
            console.log(hash)

            let body = {
                hash: hash
            }

            // send to /admin/password
            fetch('/admin/password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(body)
            })
            .then(response => response.json())
            
            // handle response
            .then(data => {
                document.querySelector('.response').innerHTML = data['message']
                document.querySelector('.new_pword_entry1').value = ''
                document.querySelector('.new_pword_entry2').value = ''
            })
        })
    } else {
        document.querySelector('.response').innerHTML = 'Passwords do not match.'
    } 
}


// change destination email for contact
function changeemail() {
    document.querySelector('.response').innerHTML = 'Please wait...'
    let email = document.querySelector('.email').value
    // validation - '@' present, only one '@', at least one '.' after the '@'
    valid_email = (email.indexOf('@') > -1) && (email.split('@').length == 2) && (email.split('@').pop().indexOf('.') > -1)
    if  (valid_email) {
        // send POST request
        let body = {
            email: email
        }

        // send to /admin/email
        fetch('/admin/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(body)
        })
        .then(response => response.json())
        
        // handle response
        .then(data => {
            document.querySelector('.response').innerHTML = data['message']
            document.querySelector('.email').value = ''
            get_contact_email()
        })
    } else {
        document.querySelector('.response').innerHTML = 'Please enter a valid email'
    }
}

// upload blog post to backend
function createpost() {

}


// run automatically
get_contact_email()