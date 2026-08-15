// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

const token =
    localStorage.getItem("adminToken");

// Login नहीं है तो login page पर भेजो
if (!token) {

    window.location.href =
        "admin-login.html";

    throw new Error(
        "Admin authentication required"
    );
}


// ==========================================
// API URLS
// ==========================================

const API_URL =
    "http://localhost:5000/api/messages";

const STATS_URL =
    "http://localhost:5000/api/stats";


// ==========================================
// DOM ELEMENTS
// ==========================================

const visitorCount =
    document.getElementById(
        "visitorCount"
    );

const fireworkCount =
    document.getElementById(
        "fireworkCount"
    );

const messageCount =
    document.getElementById(
        "messageCount"
    );

const adminMessages =
    document.getElementById(
        "adminMessages"
    );

const refreshBtn =
    document.getElementById(
        "refreshBtn"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


// ==========================================
// LOGOUT
// ==========================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "adminToken"
            );

            window.location.href =
                "admin-login.html";

        }
    );

}


// ==========================================
// LOAD STATS
// ==========================================

async function loadStats() {

    try {

        const response =
            await fetch(
                STATS_URL,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        // Token expired
        if (response.status === 401) {

            logout();

            return;
        }


        const result =
            await response.json();


        if (!result.success) {

            console.error(
                "Unable to load stats:",
                result.message
            );

            return;
        }


        // Update stats

        if (visitorCount) {

            visitorCount.textContent =
                result.data.visitors ?? 0;

        }


        if (fireworkCount) {

            fireworkCount.textContent =
                result.data.fireworks ?? 0;

        }


        if (messageCount) {

            messageCount.textContent =
                result.data.messages ?? 0;

        }


    } catch (error) {

        console.error(
            "Stats error:",
            error
        );

    }

}


// ==========================================
// LOAD MESSAGES
// ==========================================

async function loadMessages() {

    try {

        adminMessages.innerHTML =
            "⏳ Loading messages...";


        const response =
            await fetch(
                API_URL
            );


        const result =
            await response.json();


        if (!result.success) {

            adminMessages.innerHTML =
                "❌ Unable to load messages.";

            return;
        }


        // No messages

        if (
            !result.data ||
            result.data.length === 0
        ) {

            adminMessages.innerHTML =
                `
                <div class="empty-message">
                    🇮🇳 No messages yet.
                    <br>
                    Be the first to send one!
                </div>
                `;

            if (messageCount) {
                messageCount.textContent = 0;
            }

            return;
        }


        // Clear container

        adminMessages.innerHTML =
            "";


        // Update message count

        if (messageCount) {

            messageCount.textContent =
                result.data.length;

        }


        // Create cards

        result.data.forEach(
            (item) => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "admin-message";


                const date =
                    item.createdAt
                        ? new Date(
                            item.createdAt
                        ).toLocaleString()
                        : "Unknown date";


                card.innerHTML = `

                    <div class="message-top">

                        <div class="message-name">

                            🇮🇳
                            ${escapeHTML(
                                item.name
                            )}

                        </div>


                        <div class="message-date">

                            ${date}

                        </div>

                    </div>


                    <div class="message-text">

                        ${escapeHTML(
                            item.message
                        )}

                    </div>


                    <button
                        class="delete-btn"
                        data-id="${item._id}"
                    >

                        🗑️ Delete

                    </button>

                `;


                adminMessages.appendChild(
                    card
                );

            }
        );


        // ==================================
        // DELETE BUTTON EVENTS
        // ==================================

        document
            .querySelectorAll(
                ".delete-btn"
            )
            .forEach(
                (button) => {

                    button.addEventListener(
                        "click",
                        () => {

                            deleteMessage(
                                button.dataset.id
                            );

                        }
                    );

                }
            );


    } catch (error) {

        console.error(
            "Messages error:",
            error
        );


        adminMessages.innerHTML =
            `
            <div class="error-message">
                ❌ Backend server is not running.
            </div>
            `;

    }

}


// ==========================================
// DELETE MESSAGE
// ==========================================

async function deleteMessage(id) {

    const confirmDelete =
        confirm(
            "⚠️ Are you sure you want to delete this message?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {

                    method: "DELETE",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        // ==================================
        // TOKEN EXPIRED
        // ==================================

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            logout();

            return;

        }


        const result =
            await response.json();


        // ==================================
        // DELETE FAILED
        // ==================================

        if (!result.success) {

            alert(
                "❌ " +
                (
                    result.message ||
                    "Unable to delete message."
                )
            );

            return;

        }


        // ==================================
        // DELETE SUCCESS
        // ==================================

        alert(
            "✅ Message deleted successfully!"
        );


        await loadMessages();

        await loadStats();


    } catch (error) {

        console.error(
            "Delete error:",
            error
        );


        alert(
            "❌ Unable to connect to backend."
        );

    }

}


// ==========================================
// LOGOUT FUNCTION
// ==========================================

function logout() {

    localStorage.removeItem(
        "adminToken"
    );

    window.location.href =
        "admin-login.html";

}


// ==========================================
// SECURITY
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text ?? "";


    return div.innerHTML;

}


// ==========================================
// REFRESH BUTTON
// ==========================================

if (refreshBtn) {

    refreshBtn.addEventListener(
        "click",
        async () => {

            refreshBtn.disabled =
                true;

            refreshBtn.textContent =
                "⏳ Loading...";


            await loadStats();

            await loadMessages();


            refreshBtn.disabled =
                false;

            refreshBtn.textContent =
                "🔄 Refresh";

        }
    );

}


// ==========================================
// INITIAL LOAD
// ==========================================

loadStats();

loadMessages();