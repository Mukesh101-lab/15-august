const API_URL =
    "http://localhost:5000/api/auth/login";


const loginForm =
    document.getElementById(
        "loginForm"
    );


const usernameInput =
    document.getElementById(
        "username"
    );


const passwordInput =
    document.getElementById(
        "password"
    );


const loginBtn =
    document.getElementById(
        "loginBtn"
    );


const loginStatus =
    document.getElementById(
        "loginStatus"
    );


// ==========================================
// LOGIN
// ==========================================

loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const username =
            usernameInput.value.trim();


        const password =
            passwordInput.value;


        if (!username || !password) {

            loginStatus.textContent =
                "⚠️ Enter username and password.";

            return;

        }


        try {

            loginBtn.disabled = true;

            loginBtn.textContent =
                "⏳ Logging in...";


            loginStatus.textContent =
                "";


            const response =
                await fetch(
                    API_URL,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({
                                username,
                                password
                            })

                    }
                );


            const result =
                await response.json();


            if (!result.success) {

                loginStatus.textContent =
                    "❌ " +
                    result.message;

                return;

            }


            // Save JWT token

            localStorage.setItem(
                "adminToken",
                result.token
            );


            loginStatus.textContent =
                "✅ Login successful!";


            // Open dashboard

            setTimeout(
                () => {

                    window.location.href =
                        "admin.html";

                },
                500
            );


        } catch (error) {

            console.error(error);


            loginStatus.textContent =
                "❌ Backend server se connection nahi ho raha.";

        } finally {

            loginBtn.disabled = false;

            loginBtn.textContent =
                "🔐 Login";

        }

    }
);