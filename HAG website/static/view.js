//get the timestamp from the URL
const timestamp = (window.location.pathname).split('/').pop()
console.log(timestamp)

// get the blog contents
fetch_url = '/getblog/' + timestamp
fetch(fetch_url).then(response => response.json()).then(data => {
    console.log(data)
    // show the HTML from the response
    document.querySelector('.Content').innerHTML = data['html']
})