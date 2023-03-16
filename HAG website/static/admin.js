// check password, if correct reveal everything else
function checkpass() {
    let password = document.querySelector('.pword_entry').value
    window.crypto.subtle.digest('SHA-256', password)
}