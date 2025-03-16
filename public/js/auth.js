document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const API_BASE_URL = 'http://localhost:3000';


    function checkAuthStatus() {
        const user = JSON.parse(localStorage.getItem('user'));


        const authBtn = document.querySelector('.right-content .nav-btn');
        const mobileAuthBtn = document.querySelector('#mobile-menu a[href="log.html"]');

        if (user && authBtn) {

            authBtn.textContent = 'History';
            authBtn.href = 'history.html';
            authBtn.id = 'history-btn';


            let logoutBtn = document.getElementById('logout-btn');


            if (!logoutBtn) {
                logoutBtn = document.createElement('a');
                logoutBtn.textContent = 'Logout';
                logoutBtn.href = '#';
                logoutBtn.className = 'nav-btn';
                logoutBtn.id = 'logout-btn';


                authBtn.parentElement.appendChild(logoutBtn);


                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    localStorage.removeItem('user');
                    window.location.href = 'about.html';
                });
            }
        }


        if (user && mobileAuthBtn) {
            mobileAuthBtn.textContent = 'History';
            mobileAuthBtn.href = 'history.html';


            let mobileLogoutBtn = document.getElementById('mobile-logout');


            if (!mobileLogoutBtn) {
                const mobileMenu = document.querySelector('#mobile-menu ul');
                if (mobileMenu) {
                    const mobileLi = document.createElement('li');
                    mobileLogoutBtn = document.createElement('a');
                    mobileLogoutBtn.textContent = 'Logout';
                    mobileLogoutBtn.href = '#';
                    mobileLogoutBtn.id = 'mobile-logout';
                    mobileLi.appendChild(mobileLogoutBtn);
                    mobileMenu.appendChild(mobileLi);


                    mobileLogoutBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        localStorage.removeItem('user');
                        window.location.href = 'about.html';
                    });
                }
            }
        }
    }


    checkAuthStatus();


    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });

                const result = await response.json();

                if (response.ok) {

                    localStorage.setItem("user", JSON.stringify({ username: result.username }));
                    alert("Login successful!");
                    window.location.href = "about.html";
                } else {
                    alert(result.error || "Login failed");
                }
            } catch (error) {
                console.error("Login failed:", error);
                alert("Could not connect to the server. Please try again later.");
            }
        });
    }


    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm-password").value;


            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password }),
                });

                const result = await response.json();

                if (response.ok) {
                    alert("Registration successful! Please log in.");
                    window.location.href = "log.html";
                } else {
                    alert(result.error || "Registration failed");
                }
            } catch (error) {
                console.error("Registration failed:", error);
                alert("Could not connect to the server. Please try again later.");
            }
        });
    }
});