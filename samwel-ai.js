document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('samwel-toggle');
    const panel = document.getElementById('samwel-panel');
    const close = document.getElementById('samwel-close');
    const frame = document.getElementById('samwel-frame');
    const openLink = document.getElementById('samwel-open');
    const samwelUrl = window.LENS_CONFIG?.samwelAppUrl || 'https://samwel-ai.lovable.app';

    frame.src = samwelUrl;
    openLink.href = samwelUrl;

    const setOpen = open => {
        panel.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.addEventListener('click', () => setOpen(panel.hidden));
    close.addEventListener('click', () => setOpen(false));
});
