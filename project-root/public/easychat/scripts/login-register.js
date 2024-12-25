function showRegistration() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'flex';
}

function showLogin() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'flex';
}

function login() {
    // Hide login form and show chat window
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('main').style.display = 'block';
}
