// redirect to the view page with the timestamp in the URL so it can be used on the other side
function goToPage(timestamp) {
    let local_url = '/blog/view/' + timestamp
    window.location.href = local_url
}


// function to create a blog post preview object given its json and index
const posts_div = document.querySelector('.posts')
function create_post(json, index) {
    let post_div = document.createElement('div')
    let classname = 'post' + index
    post_div.setAttribute('class', classname)
    let distance = (index * 400) + 150
    post_div.style.top = distance + 'px'
    posts_div.appendChild(post_div)
    
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

    let preview = document.createElement('p')
    classname = 'prev' + index
    preview.setAttribute('class', classname)
    preview.innerHTML = json['preview']
    post_div.appendChild(preview)

    let button = document.createElement('button')
    classname = 'button' + index
    button.setAttribute('class', classname)
    let command = 'goToPage(' + json['timestamp'] + ')'
    button.setAttribute('onclick', command)
    button.innerHTML = 'View <img src="static\\site\\go-arrow.png">'
    post_div.appendChild(button)
}


// get all blog posts
fetch('/blog/all').then(response => response.json()).then(data => {
    // debug - see test log for what was being tested
    console.log(data)
    
    // remove the loading text
    document.querySelector('.loading').style.display = 'none'

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