// VERSIÓN MÍNIMA EXTREMA - SIN NADA QUE PUEDA CAUSAR PROBLEMAS
console.log('🎬 PRD iniciando (MÍNIMO)...');

let isMenuOpen = false;

// SOLO cuando esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 DOM listo');
    
    // Detectar si es móvil
    const isMobile = window.innerWidth <= 768;
    console.log('📱 Es móvil:', isMobile);
    
    // CONFIGURAR VIDEOS SOLO EN DESKTOP
    if (!isMobile) {
        setupDesktopVideos();
    } else {
        setupMobile();
    }
    
    // CONFIGURAR BOTÓN YOUTUBE
    setupYouTubeButton();
    
    // CONFIGURAR MENÚ
    setupSimpleMenu();
    
    console.log('✅ Configuración mínima completada');
});

// SETUP DESKTOP VIDEOS
function setupDesktopVideos() {
    const video = document.getElementById('bgVideo');
    const loading = document.getElementById('loading');
    const backup = document.querySelector('.backup-background');
    
    if (video) {
        video.muted = true;
        video.loop = true;
        
        video.addEventListener('canplay', function() {
            video.style.display = 'block';
            if (backup) backup.style.display = 'none';
            if (loading) loading.style.display = 'none';
            video.play().catch(e => console.log('Autoplay bloqueado'));
        });
        
        video.load();
    }
    
    // Video de historia
    const historyVideo = document.getElementById('historyVideo');
    if (historyVideo) {
        historyVideo.muted = true;
        historyVideo.loop = true;
        historyVideo.play().catch(e => console.log('Video historia no reproduce'));
    }
}

// SETUP MÓVIL
function setupMobile() {
    const video = document.getElementById('bgVideo');
    const loading = document.getElementById('loading');
    const backup = document.querySelector('.backup-background');
    
    if (video) {
        video.style.display = 'none';
        video.pause();
    }
    if (loading) loading.style.display = 'none';
    if (backup) backup.style.display = 'none';
    
    // Video de historia
    const historyVideo = document.getElementById('historyVideo');
    if (historyVideo) {
        historyVideo.muted = true;
        historyVideo.loop = true;
        historyVideo.play().catch(e => console.log('Video historia no reproduce'));
    }
}

// BOTÓN YOUTUBE
function setupYouTubeButton() {
    const btn = document.getElementById('mobilePlayBtn');
    if (btn) {
        btn.onclick = function() {
            window.open('https://www.youtube.com/watch?v=2YhaGWompwU', '_blank');
        };
    }
}

// MENÚ SÚPER SIMPLE
function setupSimpleMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (!hamburger || !navMenu) return;
    
    // Toggle menú
    hamburger.onclick = function() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            hamburger.classList.add('active');
            navMenu.classList.add('active');
        } else {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    };
    
    // Cerrar menú al hacer click en enlaces
    const links = navMenu.querySelectorAll('a');
    links.forEach(link => {
        link.onclick = function() {
            setTimeout(() => {
                if (isMenuOpen) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    isMenuOpen = false;
                }
            }, 100);
        };
    });
}

console.log('🚀 PRD cargado (VERSIÓN MÍNIMA)');