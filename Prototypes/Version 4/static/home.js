function goNow() {
    console.log('http://' + location.hostname + '/weather')
    if (location.hostname == 'localhost') {
        window.location.href = 'http://localhost:' + location.port + '/weather'
    } else {
        window.location.href = 'http://' + location.hostname + '/weather'
    }
}