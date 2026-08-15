// ==========================================
// 🇮🇳 15 AUGUST - ADMIN DASHBOARD
// ==========================================


// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

const token = localStorage.getItem("adminToken");

// Login nahi hai to login page par bhejo
if (!token) {
    window.location.href = "admin-login.html";

    throw new Error(
        "Admin authentication required"
    );
}


// ==========================================
// 🌐 PRODUCTION API URL
// ==========================================

const API_BASE_URL =
    "https://one5-august.onrender.com";

const API_URL =
    `${API_BASE_URL}/api/messages`;

const STATS_URL =
    `${API_BASE_URL}/api/stats`;


// ==========================================
// DOM ELEMENTS
// ==========================================

const visitorCount =
    document.getElementById("visitorCount");

const fireworkCount =
    document.getElementById("fireworkCount");

const messageCount =
    document.getElementById("messageCount");

const adminMessages =
    document.getElementById("adminMessages");

const refreshBtn =
    document.getElementById("refreshBtn");

const logoutBtn =
    document.getElementById("logoutBtn");


// ==========================================
// 🚪 LOGOUT
// ==========================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            logout();

        }
    );

}


// ==========================================
// 📊 LOAD STATS
// ==========================================

async function loadStats() {

    try {

        const response =
            await fetch(
                STATS_URL,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        // Token expired / unauthorized
        if (
            response.status === 401 ||
            response.status === 403
        ) {

            logout();

            return;
        }


        const result =
            await response.json();


        if (
            !response.ok ||
            !result.success
        ) {

            console.error(
                "Unable to load stats:",
                result.message
            );

            return;
        }


        const data =
            result.data || {};


        // Visitors
        if (visitorCount) {

            visitorCount.textContent =
                data.visitors ?? 0;

        }


        // Fireworks
        if (fireworkCount) {

            fireworkCount.textContent =
                data.fireworks ?? 0;

        }


        // Messages
        if (messageCount) {

            messageCount.textContent =
                data.messages ?? 0;

        }

    }

    catch (error) {

        console.error(
            "Stats error:",
            error
        );

    }

}


// ==========================================
// 💬 LOAD MESSAGES
// ==========================================

async function loadMessages() {

    if (!adminMessages) {
        return;
    }


    try {

        adminMessages.innerHTML =
            "⏳ Loading messages...";


        const response =
            await fetch(
                API_URL,
                {
                    method: "GET"
                }
            );


        const result =
            await response.json();


        if (
            !response.ok ||
            !result.success
        ) {

            adminMessages.innerHTML =
                "❌ Unable to load messages.";

            return;
        }


        // ==================================
        // NO MESSAGES
        // ==================================

        if (
            !result.data ||
            result.data.length === 0
        ) {

            adminMessages.innerHTML = `
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


        // ==================================
        // CLEAR CONTAINER
        // ==================================

        adminMessages.innerHTML = "";


        // ==================================
        // MESSAGE COUNT
        // ==================================

        if (messageCount) {

            messageCount.textContent =
                result.data.length;

        }


        // ==================================
        // CREATE MESSAGE CARDS
        // ==================================

        result.data.forEach(
            (item) => {

                const card =
                    document.createElement("div");


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

                            ${escapeHTML(date)}

                        </div>

                    </div>


                    <div class="message-text">

                        ${escapeHTML(
                            item.message
                        )}

                    </div>


                    <button
                        class="delete-btn"
                        data-id="${escapeHTML(item._id)}"
                    >

                        🗑️ Delete

                    </button>

                `;


                adminMessages.appendChild(card);

            }
        );


        // ==================================
        // DELETE BUTTON EVENTS
        // ==================================

        document
            .querySelectorAll(".delete-btn")
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

    }

    catch (error) {

        console.error(
            "Messages error:",
            error
        );


        adminMessages.innerHTML = `
            <div class="error-message">
                ❌ Backend server se connection nahi ho raha.
            </div>
        `;

    }

}


// ==========================================
// 🗑️ DELETE MESSAGE
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
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
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

        if (
            !response.ok ||
            !result.success
        ) {

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

    }

    catch (error) {

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
// 🚪 LOGOUT FUNCTION
// ==========================================

function logout() {

    localStorage.removeItem(
        "adminToken"
    );


    window.location.href =
        "admin-login.html";

}


// ==========================================
// 🛡️ SECURITY
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        String(text ?? "");


    return div.innerHTML;

}


// ==========================================
// 🔄 REFRESH BUTTON
// ==========================================

if (refreshBtn) {

    refreshBtn.addEventListener(
        "click",
        async () => {

            refreshBtn.disabled = true;

            const oldText =
                refreshBtn.textContent;

            refreshBtn.textContent =
                "⏳ Loading...";


            await loadStats();

            await loadMessages();


            refreshBtn.disabled = false;

            refreshBtn.textContent =
                oldText || "🔄 Refresh";

        }
    );

}


// ==========================================
// 🚀 INITIAL LOAD
// ==========================================

loadStats();

loadMessages();


// ==========================================
// 🔄 AUTO REFRESH
// ==========================================

setInterval(
    () => {

        loadStats();
        loadMessages();

    },
    10000
);