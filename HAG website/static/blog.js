// get all blog posts
fetch('/blog/all').then(response => response.json()).then(data => {
    // debug - see test log for what was being tested
    console.log(data)
    
    // remove the loading text
    document.querySelector('.loading').style.display = 'none'

    // iterate through each blog post assembling the structure
    let posts = data['all_posts']
    let post_json = {}
    for (i = 0; i < posts.length; i++) {
        post_json = posts[i]
        
    }
})