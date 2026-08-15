// ==================================================
// 🇮🇳 15 AUGUST INDEPENDENCE DAY
// COMPLETE FRONTEND SCRIPT
// ==================================================


// ==================================================
// API CONFIG
// ==================================================

// 🚀 DEPLOYED BACKEND URL
const API_BASE_URL = "https://one5-august.onrender.com";

const MESSAGE_API =
    `${API_BASE_URL}/api/messages`;

const STATS_API =
    `${API_BASE_URL}/api/stats`;

const PUBLIC_STATS_API =
    `${STATS_API}/public`;


// ==================================================
// CANVAS
// ==================================================

const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

let particles = [];


// ==================================================
// RESIZE CANVAS
// ==================================================

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);


// ==================================================
// PARTICLE
// ==================================================

class Particle {

    constructor(x, y, angle, speed, color) {

        this.x = x;
        this.y = y;

        this.angle = angle;
        this.speed = speed;

        this.friction = 0.96;
        this.gravity = 0.06;

        this.alpha = 1;

        this.decay =
            Math.random() * 0.015 + 0.01;

        this.color = color;

        this.size =
            Math.random() * 2 + 1;
    }

    update() {

        this.speed *= this.friction;

        this.x +=
            Math.cos(this.angle) *
            this.speed;

        this.y +=
            Math.sin(this.angle) *
            this.speed;

        this.y += this.gravity;

        this.alpha -= this.decay;
    }

    draw() {

        ctx.save();

        ctx.globalAlpha =
            Math.max(this.alpha, 0);

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = this.color;

        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;

        ctx.fill();

        ctx.restore();
    }
}


// ==================================================
// 🇮🇳 COLORS
// ==================================================

const colors = [
    "#ff9933",
    "#ffffff",
    "#138808",
    "#ff9933",
    "#ffffff"
];


// ==================================================
// CREATE FIREWORK
// ==================================================

function createFirework(x, y) {

    const color =
        colors[
            Math.floor(
                Math.random() * colors.length
            )
        ];

    const particleCount = 80;

    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const angle =
            Math.PI * 2 * i / particleCount;

        const speed =
            Math.random() * 5 + 3;

        particles.push(
            new Particle(
                x,
                y,
                angle,
                speed,
                color
            )
        );
    }
}


// ==================================================
// RANDOM FIREWORK
// ==================================================

function randomFirework() {

    const x =
        Math.random() * canvas.width;

    const y =
        Math.random() *
        canvas.height *
        0.55;

    createFirework(x, y);
}


// ==================================================
// FIREWORK ANIMATION
// ==================================================

function animate() {

    requestAnimationFrame(animate);

    ctx.fillStyle =
        "rgba(2, 4, 10, 0.18)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    particles.forEach(
        (particle, index) => {

            particle.update();
            particle.draw();

            if (particle.alpha <= 0) {

                particles.splice(index, 1);
            }
        }
    );
}

animate();


// ==================================================
// AUTO FIREWORKS
// ==================================================

setInterval(() => {

    randomFirework();

}, 1800);


// ==================================================
// DOM ELEMENTS
// ==================================================

const fireworkBtn =
    document.getElementById("fireworkBtn");

const visitorCount =
    document.getElementById("visitorCount");

const fireworkCount =
    document.getElementById("fireworkCount");

const messageCount =
    document.getElementById("messageCount");


// ==================================================
// 👥 REGISTER VISITOR
// ==================================================

async function registerVisitor() {

    try {

        const response =
            await fetch(
                `${STATS_API}/visitor`,
                {
                    method: "POST"
                }
            );

        const result =
            await response.json();

        if (
            !response.ok ||
            !result.success
        ) {

            console.error(
                "Visitor error:",
                result.message
            );

            return;
        }

        if (visitorCount) {

            visitorCount.textContent =
                result.visitors;
        }

    } catch (error) {

        console.error(
            "Visitor API Error:",
            error
        );
    }
}


// ==================================================
// 🎆 REGISTER FIREWORK
// ==================================================

async function registerFirework() {

    try {

        const response =
            await fetch(
                `${STATS_API}/firework`,
                {
                    method: "POST"
                }
            );

        const result =
            await response.json();

        if (
            !response.ok ||
            !result.success
        ) {

            console.error(
                "Firework error:",
                result.message
            );

            return;
        }

        if (fireworkCount) {

            fireworkCount.textContent =
                result.fireworks;
        }

    } catch (error) {

        console.error(
            "Firework API Error:",
            error
        );
    }
}


// ==================================================
// 📊 LOAD PUBLIC STATS
// ==================================================

async function loadStats() {

    try {

        const response =
            await fetch(
                PUBLIC_STATS_API
            );

        const result =
            await response.json();

        if (
            !response.ok ||
            !result.success
        ) {

            console.error(
                "Stats error:",
                result.message
            );

            return;
        }

        const data = result.data;


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

    } catch (error) {

        console.error(
            "Stats API Error:",
            error
        );
    }
}


// ==================================================
// 🎆 FIREWORK BUTTON
// ==================================================

if (fireworkBtn) {

    fireworkBtn.addEventListener(
        "click",
        async () => {

            await registerFirework();

            for (
                let i = 0;
                i < 5;
                i++
            ) {

                setTimeout(() => {

                    const x =
                        Math.random() *
                        canvas.width;

                    const y =
                        Math.random() *
                        canvas.height *
                        0.55;

                    createFirework(x, y);

                }, i * 250);
            }
        }
    );
}


// ==================================================
// 🖱️ CLICK ANYWHERE FIREWORK
// ==================================================

document.addEventListener(
    "click",
    (event) => {

        if (
            event.target === fireworkBtn
        ) {
            return;
        }

        createFirework(
            event.clientX,
            event.clientY
        );
    }
);


// ==================================================
// 💬 MESSAGE ELEMENTS
// ==================================================

const messageForm =
    document.getElementById("messageForm");

const nameInput =
    document.getElementById("name");

const messageInput =
    document.getElementById("message");

const messagesList =
    document.getElementById("messagesList");

const formStatus =
    document.getElementById("formStatus");


// ==================================================
// 💬 LOAD MESSAGES
// ==================================================

async function loadMessages() {

    if (!messagesList) {
        return;
    }

    try {

        messagesList.innerHTML =
            "⏳ Loading messages...";

        const response =
            await fetch(
                MESSAGE_API
            );

        const result =
            await response.json();

        if (
            !response.ok ||
            !result.success
        ) {

            messagesList.innerHTML =
                "❌ Unable to load messages.";

            return;
        }

        if (
            !result.data ||
            result.data.length === 0
        ) {

            messagesList.innerHTML =
                "<p>No messages yet. Be the first! 🇮🇳</p>";

            return;
        }

        messagesList.innerHTML = "";

        result.data.forEach(
            (item) => {

                const card =
                    document.createElement("div");

                card.className =
                    "message-card";

                const date =
                    new Date(
                        item.createdAt
                    ).toLocaleString();

                card.innerHTML = `

                    <div class="message-name">
                        🇮🇳 ${escapeHTML(item.name)}
                    </div>

                    <div class="message-text">
                        ${escapeHTML(item.message)}
                    </div>

                    <div class="message-time">
                        ${escapeHTML(date)}
                    </div>

                `;

                messagesList.appendChild(card);
            }
        );

    } catch (error) {

        console.error(
            "Message Load Error:",
            error
        );

        messagesList.innerHTML =
            "❌ Backend server se connection nahi ho raha.";
    }
}


// ==================================================
// ❤️ SUBMIT MESSAGE
// ==================================================

if (messageForm) {

    messageForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const name =
                nameInput.value.trim();

            const message =
                messageInput.value.trim();

            if (!name || !message) {

                formStatus.textContent =
                    "⚠️ Please fill all fields.";

                return;
            }

            if (name.length > 30) {

                formStatus.textContent =
                    "⚠️ Name must be under 30 characters.";

                return;
            }

            if (message.length > 200) {

                formStatus.textContent =
                    "⚠️ Message must be under 200 characters.";

                return;
            }

            try {

                formStatus.textContent =
                    "⏳ Sending message...";

                const response =
                    await fetch(
                        MESSAGE_API,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name,
                                message
                            })
                        }
                    );

                const result =
                    await response.json();

                if (
                    !response.ok ||
                    !result.success
                ) {

                    formStatus.textContent =
                        "❌ " +
                        (
                            result.message ||
                            "Unable to send message."
                        );

                    return;
                }

                formStatus.textContent =
                    "✅ Message posted successfully! 🇮🇳";

                messageForm.reset();

                await loadMessages();

                await loadStats();

                setTimeout(() => {

                    formStatus.textContent = "";

                }, 3000);

            } catch (error) {

                console.error(
                    "Message Submit Error:",
                    error
                );

                formStatus.textContent =
                    "❌ Backend server se connection nahi ho raha.";
            }
        }
    );
}


// ==================================================
// 🛡️ SECURITY
// ==================================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        String(text);

    return div.innerHTML;
}


// ==================================================
// 🚀 INITIALIZE APP
// ==================================================

async function initializeApp() {

    await loadStats();

    await registerVisitor();

    await loadMessages();

    await loadStats();
}

initializeApp();


// ==================================================
// 🔄 AUTO REFRESH STATS
// ==================================================

setInterval(() => {

    loadStats();

}, 10000);