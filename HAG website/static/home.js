function goNow() {
    window.location.href = '/weather'
}

// redirect to the view page with the timestamp in the URL so it can be used on the other side
function goToPage(timestamp) {
    let local_url = '/blog/view/' + timestamp
    window.location.href = local_url
}


// get the last blog post to show in a featured article
fetch('/lastblog').then(response => response.json()).then(data => {
    console.log(data)
    document.querySelector('.title').innerHTML = data['title']
    document.querySelector('.image').setAttribute('src', data['image'])
    document.querySelector('.preview').innerHTML = data['preview']
    let command = 'goToPage(' + data['timestamp'] + ')'
    document.querySelector('.blog-button').setAttribute('onclick',command)
})