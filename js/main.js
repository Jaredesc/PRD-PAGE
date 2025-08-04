// VERSIÓN OPTIMIZADA PARA MÓVIL
console.log('🎬 PRD iniciando (OPTIMIZADO MÓVIL)...');

let isMenuOpen = false;

// DETECTAR MÓVIL
function isMobile() {
    return window.innerWidth <= 768;
}

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 DOM listo');
    
    const mobile = isMobile();
    console.log('📱 Es móvil:', mobile);
    
    if (mobile) {
        setupMobileOptimized();
    } else {
        setupDesktop();
    }
    
    // Configurar funciones básicas
    setupMenu();
    setupYouTubeButton();
    
    console.log('✅ Configuración optimizada completada');
});

// SETUP MÓVIL OPTIMIZADO - SIN VIDEO PESADO
function setupMobileOptimized() {
    console.log('📱 Configurando móvil optimizado...');
    
    try {
        // OCULTAR VIDEO PRINCIPAL PESADO
        const video = document.getElementById('bgVideo');
        const loading = document.getElementById('loading');
        const backup = document.querySelector('.backup-background');
        
        if (video) {
            video.style.display = 'none';
            video.pause();
            console.log('📹 Video principal deshabilitado en móvil');
        }
        
        if (loading) loading.style.display = 'none';
        if (backup) backup.style.display = 'none';
        
        // NO CARGAR VIDEO DE HISTORIA - USAR IMAGEN
        // La imagen ya está en el HTML, no necesita configuración especial
        console.log('🖼️ Usando imagen estática en lugar de video en móvil');
        
        console.log('✅ Móvil optimizado - Sin videos pesados');
    } catch (error) {
        console.log('Error en setup móvil:', error);
    }
}

// SETUP DESKTOP - CON VIDEOS
function setupDesktop() {
    console.log('🖥️ Configurando desktop con videos...');
    
    try {
        // VIDEO PRINCIPAL
        const video = document.getElementById('bgVideo');
        const loading = document.getElementById('loading');
        const backup = document.querySelector('.backup-background');
        
        if (video) {
            video.muted = true;
            video.loop = true;
            
            video.addEventListener('canplay', function() {
                console.log('📹 Video principal listo');
                video.style.display = 'block';
                if (backup) backup.style.display = 'none';
                if (loading) loading.style.display = 'none';
                video.play().catch(e => console.log('Autoplay bloqueado'));
            });
            
            video.load();
        }
        
        // VIDEO DE HISTORIA
        const historyVideo = document.getElementById('historyVideo');
        if (historyVideo) {
            historyVideo.muted = true;
            historyVideo.loop = true;
            historyVideo.play().catch(e => console.log('Video historia autoplay bloqueado'));
            console.log('🎬 Video de historia configurado');
        }
        
        console.log('✅ Desktop configurado con videos');
    } catch (error) {
        console.log('Error en setup desktop:', error);
    }
}

// BOTÓN YOUTUBE SIMPLE
function setupYouTubeButton() {
    try {
        const btn = document.getElementById('mobilePlayBtn');
        if (btn) {
            btn.onclick = function() {
                console.log('▶️ Abriendo YouTube...');
                window.open('https://www.youtube.com/watch?v=2YhaGWompwU', '_blank');
            };
            console.log('✅ Botón YouTube configurado');
        }
    } catch (error) {
        console.log('Error en YouTube:', error);
    }
}

// MENÚ SIMPLE
function setupMenu() {
    try {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        if (!hamburger || !navMenu) return;
        
        // Toggle menú
        hamburger.onclick = function() {
            isMenuOpen = !isMenuOpen;
            
            if (isMenuOpen) {
                hamburger.classList.add('active');
                navMenu.classList.add('active');
                console.log('🍔 Menú abierto');
            } else {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                console.log('🍔 Menú cerrado');
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
                        console.log('🍔 Menú cerrado por navegación');
                    }
                }, 100);
            };
        });
        
        console.log('✅ Menú configurado');
    } catch (error) {
        console.log('Error en menú:', error);
    }
}

// ACTIVAR VIDEOS EN DESKTOP con click del usuario
document.addEventListener('click', function() {
    if (!isMobile()) {
        try {
            const video = document.getElementById('bgVideo');
            const historyVideo = document.getElementById('historyVideo');
            
            if (video && video.paused) {
                video.play().catch(e => console.log('No se pudo reproducir video principal'));
            }
            if (historyVideo && historyVideo.paused) {
                historyVideo.play().catch(e => console.log('No se pudo reproducir video historia'));
            }
        } catch (error) {
            console.log('Error activando videos:', error);
        }
    }
}, { once: true });

console.log('🚀 PRD cargado - OPTIMIZADO PARA MÓVIL');