const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const attachButton = document.getElementById('attach-button');
const fileInput = document.getElementById('file-input');

let currentUser = 'Alice';
const isNativeApp = Boolean(window.Capacitor?.isNativePlatform?.());
const remoteChatBaseUrl = (window.LENS_CONFIG?.chatApiBaseUrl || '').replace(/\/$/, '');
const useDeviceStorage = isNativeApp && !remoteChatBaseUrl;
const MESSAGES_STORAGE_PREFIX = 'lens.messages.';

const chatApiUrl = path => `${remoteChatBaseUrl}${path}`;

function getStoredMessages(user) {
    return JSON.parse(localStorage.getItem(`${MESSAGES_STORAGE_PREFIX}${user}`) || '[]');
}

function saveStoredMessages(user, messages) {
    localStorage.setItem(`${MESSAGES_STORAGE_PREFIX}${user}`, JSON.stringify(messages));
}

async function loadMessages(user) {
    const messages = useDeviceStorage
        ? getStoredMessages(user)
        : await fetch(chatApiUrl(`/messages/${user}`)).then(response => response.json());
    messagesDiv.innerHTML = '';
    messages.forEach(msg => {
        displayMessage(msg);
    });
}

function displayMessage(msg) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    if (msg.sender === 'me') {
        msgDiv.classList.add('sent');
    } else {
        msgDiv.classList.add('received');
    }
    let content = '';
    if (msg.text) {
        content += `<div>${msg.text}</div>`;
    }
    if (msg.media) {
        if (msg.media.type.startsWith('image/')) {
            content += `<img src="${msg.media.data}" style="max-width:100%; border-radius:5px;">`;
        } else if (msg.media.type.startsWith('video/')) {
            content += `<video controls style="max-width:100%; border-radius:5px;"><source src="${msg.media.data}" type="${msg.media.type}"></video>`;
        }
    }
    if (msg.sender === 'me') {
        const statusClass = msg.read ? 'read' : 'delivered';
        content += `<div class="timestamp">${new Date(msg.timestamp).toLocaleTimeString()} <span class="status ${statusClass}">✔✔</span></div>`;
    } else {
        content += `<div class="timestamp">${new Date(msg.timestamp).toLocaleTimeString()}</div>`;
    }
    msgDiv.innerHTML = content;
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function sendMessage() {
    const text = messageInput.value.trim();
    const file = fileInput.files[0];
    if (file && currentUser) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const msg = { media: { type: file.type, data: e.target.result }, sender: 'me', timestamp: Date.now(), read: true };
            saveAndDisplay(msg);
        };
        reader.readAsDataURL(file);
        fileInput.value = '';
    } else if (text && currentUser) {
        const msg = { text, sender: 'me', timestamp: Date.now(), read: true };
        saveAndDisplay(msg);
        messageInput.value = '';
    }
}

async function saveAndDisplay(msg) {
    if (useDeviceStorage) {
        const messages = getStoredMessages(currentUser);
        messages.push(msg);
        saveStoredMessages(currentUser, messages);
    } else {
        await fetch(chatApiUrl(`/messages/${currentUser}`), {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(msg)
        });
    }
    displayMessage(msg);
}

sendButton.addEventListener('click', sendMessage);

attachButton.addEventListener('click', () => fileInput.click());

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

currentUser = 'Alice';
loadMessages(currentUser);

document.querySelectorAll('.resource-list li, .channels-list li').forEach(item => {
    item.addEventListener('click', () => {
        item.classList.remove('click-pulse');
        void item.offsetWidth;
        item.classList.add('click-pulse');
        setTimeout(() => item.classList.remove('click-pulse'), 220);
    });
});

// News filter functionality
function initNewsFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const newsTags = document.querySelectorAll('.news-tag');
    const newsItems = document.querySelectorAll('.news-item');

    function filterByCategory(category) {
        newsItems.forEach(item => {
            if (category === 'all') {
                item.classList.remove('hidden');
            } else {
                if (item.classList.contains(category)) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            }
        });

        filterBtns.forEach(btn => {
            if (btn.dataset.filter === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.filter;
            filterByCategory(category);
        });
    });

    newsTags.forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            const category = tag.textContent.toLowerCase();
            filterByCategory(category);
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNewsFilters);
} else {
    initNewsFilters();
}
