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
            }
        })
    })
}


// update the password
function changepass() {
    let password = document.querySelector('.new_pword_entry').value
    digestMessage(password).then(hash => {
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
        })
    })
}