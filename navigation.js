// Navigation between Chat and Weather pages
document.addEventListener('DOMContentLoaded', () => {
    const app = document.querySelector('.app');
    const navButtons = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page-container');
    const weatherIframe = document.getElementById('weather-iframe');
    const tanzaniaClock = document.getElementById('tanzania-clock');
    const worldClock = document.getElementById('world-clock');
    const connectionStatus = document.getElementById('chat-connection');
    let weatherLoaded = false;

    requestAnimationFrame(() => app.classList.add('app-ready'));

    const updateClocks = () => {
        const now = new Date();
        tanzaniaClock.textContent = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Africa/Dar_es_Salaam', hour: '2-digit', minute: '2-digit'
        }).format(now);
        worldClock.textContent = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'UTC', hour: '2-digit', minute: '2-digit'
        }).format(now);
    };
    updateClocks();
    setInterval(updateClocks, 1000);

    const remoteChat = Boolean(window.LENS_CONFIG?.chatApiBaseUrl);
    connectionStatus.textContent = remoteChat ? 'Online messages enabled' : 'On-device chat';

    document.addEventListener('pointerdown', event => {
        const interactiveElement = event.target.closest('button, .section-link, .contact');
        if (!interactiveElement) return;

        interactiveElement.classList.remove('click-pulse');
        void interactiveElement.offsetWidth;
        interactiveElement.classList.add('click-pulse');
    });

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const pageName = btn.dataset.page;
            if (!pageName) return;

            // Remove active class from all buttons and pages
            navButtons.forEach(b => b.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));

            // Add active class to clicked button and corresponding page
            btn.classList.add('active');
            const pageContainer = document.getElementById(`${pageName}-page`);
            if (pageContainer) {
                pageContainer.classList.add('active');
                pageContainer.classList.remove('page-enter');
                void pageContainer.offsetWidth;
                pageContainer.classList.add('page-enter');
            }

            // Load weather iframe only when needed (lazy loading)
            if (pageName === 'weather' && !weatherLoaded) {
                if (weatherIframe) weatherIframe.style.display = 'block';
                weatherLoaded = true;
            } else if (pageName === 'weather') {
                if (weatherIframe) weatherIframe.style.display = 'block';
            } else if (weatherIframe) {
                weatherIframe.style.display = 'none';
            }
        });
    });
});
