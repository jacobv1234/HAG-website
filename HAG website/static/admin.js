// get current contact email
function get_contact_email() {
    fetch('/admin/email').then(response => response.json()).then(data => {
        document.querySelector('.current-email').innerHTML = 'Currently ' + data['email']
    })
}

// assemble a post object on the html
const post_space = document.querySelector('.existing-posts')
function create_post(json, index) {
    let post_div = document.createElement('div')
    let classname = 'post' + index
    post_div.setAttribute('class', classname)
    let distance = (index * 178) + 70
    post_div.style.top = distance + 'px'
    post_space.appendChild(post_div)

    let title = document.createElement('h3')
    classname = 'title' + index
    title.setAttribute('class', classname)
    title.innerHTML = json['title']
    post_div.appendChild(title)

    let image = document.createElement('img')
    classname = 'img' + index
    image.setAttribute('class', classname)
    image.setAttribute('src',json['image'])
    post_div.appendChild(image)

    let button = document.createElement('button')
    classname = 'button' + index
    button.setAttribute('class', classname)
    let command = 'UpdateMode(' + json['timestamp'] + ')'
    button.setAttribute('onclick', command)
    button.innerHTML = 'Update'
    post_div.appendChild(button)
}


// get all blog posts so they are ready to be chosen for update
function get_all_posts() {
    fetch('/blog/all').then(response => response.json()).then(data => {
    
        // iterate through each blog post assembling the structure
        // first declare a bunch of needed variables
        let posts = data['all_posts']
        let post_json = {}
        for (i = 0; i < posts.length; i++) {
            post_json = posts[i]
            // create the post
            create_post(post_json, i)
        }
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
function createpost(update) {
    document.querySelector('.response').innerHTML = 'Please wait...'
    // get values, cancel if empty
    let title = document.querySelector('.title').value
    if (title == '') {
        document.querySelector('.response').innerHTML = 'Please enter a title.'
        return
    }
    let image_url = document.querySelector('.image-url').value
    if (image_url == '') {
        document.querySelector('.response').innerHTML = 'Please enter an image URL.'
        return
    }
    let preview = document.querySelector('.preview').value
    if (preview == '') {
        document.querySelector('.response').innerHTML = 'Please enter some preview text'
        return
    }
    let html = document.querySelector('.post-body').value
    if (html == '') {
        document.querySelector('.response').innerHTML = 'Please enter the blog contents'
        return
    }

    let timestamp = 0

    // get the timestamp
    if (update == false) {
        timestamp = Date.now()
    } else {
        timestamp = update
    }

    // assemble into POST request body
    body = {
        title: title,
        image: image_url,
        preview: preview,
        html: html,
        timestamp: timestamp
    }

    // send request to /admin/create
    fetch('/admin/create', {
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
        get_all_posts()
    })
}


// swap to update mode
function UpdateMode(timestamp) {
    console.log(timestamp) //debug
    // get the blog details
    fetch_url = '/getblog/' + timestamp
    fetch(fetch_url).then(response => response.json()).then(data => {
        document.querySelector('.title').value = data['title']
        document.querySelector('.image-url').value = data['image']
        document.querySelector('.preview').value = data['preview']
        document.querySelector('.post-body').value = data['html']
    })

    // other changes
    document.querySelector('.blog-editor-title').innerHTML = 'Update this post'
    document.querySelector('.create-post').innerHTML = 'Update post'
    let command = 'createpost(' + timestamp + ')'
    document.querySelector('.create-post').setAttribute('onclick', command)
    document.querySelector('.clear-blog').innerHTML = 'Back to creation'
}

// clear the contents (or go back to creation mode)
function clearblog() {
    document.querySelector('.title').value = ''
    document.querySelector('.image-url').value = ''
    document.querySelector('.preview').value = ''
    document.querySelector('.post-body').value = ''

    document.querySelector('.blog-editor-title').innerHTML = 'Create a new blog post'
    document.querySelector('.create-post').innerHTML = 'Create post'
    document.querySelector('.create-post').setAttribute('onclick', 'createpost(false)')
    document.querySelector('.clear-blog').innerHTML = 'Clear'
}


// run automatically
get_contact_email()
get_all_posts()