// ==========================================
// 🌐 PRODUCTION API
// ==========================================

const API_URL =
    "https://one5-august.onrender.com/api/auth/login";


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
// 🔐 LOGIN
// ==========================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const username =
                usernameInput.value.trim();


            const password =
                passwordInput.value;


            // ==================================
            // VALIDATION
            // ==================================

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


                // ==================================
                // LOGIN API
                // ==================================

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


                // ==================================
                // LOGIN FAILED
                // ==================================

                if (
                    !response.ok ||
                    !result.success
                ) {

                    loginStatus.textContent =
                        "❌ " +
                        (
                            result.message ||
                            "Invalid username or password."
                        );

                    return;

                }


                // ==================================
                // SAVE JWT TOKEN
                // ==================================

                localStorage.setItem(
                    "adminToken",
                    result.token
                );


                loginStatus.textContent =
                    "✅ Login successful!";


                // ==================================
                // REDIRECT ADMIN DASHBOARD
                // ==================================

                setTimeout(
                    () => {

                        window.location.href =
                            "admin.html";

                    },
                    500
                );

            }


            catch (error) {

                console.error(
                    "Login Error:",
                    error
                );


                loginStatus.textContent =
                    "❌ Backend server se connection nahi ho raha.";

            }


            finally {

                loginBtn.disabled = false;

                loginBtn.textContent =
                    "🔐 Login";

            }

        }
    );

}