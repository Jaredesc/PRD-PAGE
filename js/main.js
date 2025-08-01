// VERSIÓN CON ARREGLO DE SCROLL SIMPLE
console.log('🎬 PRD iniciando...');

// Variables básicas
let isMenuOpen = false;
let isMobile = false;

// ARREGLO SIMPLE DEL SCROLL INICIAL
function fixInitialScroll() {
    // Solo al cargar, ir al inicio
    window.scrollTo(0, 0);
    
    // Limpiar cualquier hash problemático
    if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname);
    }
}

// DETECTAR SI ES MÓVIL
function detectMobile() {
    return window.innerWidth <= 768;
}

// ARREGLO INMEDIATO DEL SCROLL
fixInitialScroll();

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 DOM listo');
    
    // ARREGLAR SCROLL OTRA VEZ
    fixInitialScroll();
    
    // Detectar móvil
    isMobile = detectMobile();
    console.log('📱 Es móvil:', isMobile);
    
    // Configurar según dispositivo
    if (isMobile) {
        setupMobile();
    } else {
        setupDesktop();
    }
    
    // Configurar menú y YouTube
    setupMenu();
    setupYouTube();
    
    // ARREGLO FINAL después de todo
    setTimeout(() => {
        fixInitialScroll();
    }, 100);
    
    console.log('✅ Configuración completada');
});

// CONFIGURACIÓN MÓVIL - SÚPER SIMPLE
function setupMobile() {
    try {
        console.log('📱 Configurando móvil...');
        
        // Ocultar video principal y loading
        const video = document.getElementById('bgVideo');
        const loading = document.getElementById('loading');
        const backup = document.querySelector('.backup-background');
        
        if (video) {
            video.style.display = 'none';
            video.pause();
        }
        
        if (loading) loading.style.display = 'none';
        if (backup) backup.style.display = 'none';
        
        // Solo video de historia
        const historyVideo = document.getElementById('historyVideo');
        if (historyVideo) {
            historyVideo.muted = true;
            historyVideo.loop = true;
            historyVideo.play().catch(e => console.log('Video historia no reproduce'));
        }
        
        console.log('✅ Móvil configurado');
    } catch (error) {
        console.log('Error en móvil:', error);
    }
}

// CONFIGURACIÓN DESKTOP - CON VIDEOS
function setupDesktop() {
    try {
        console.log('🖥️ Configurando desktop...');
        
        const video = document.getElementById('bgVideo');
        const historyVideo = document.getElementById('historyVideo');
        const backup = document.querySelector('.backup-background');
        const loading = document.getElementById('loading');
        
        // VIDEO PRINCIPAL
        if (video) {
            video.muted = true;
            video.loop = true;
            
            // Cuando el video esté listo
            video.addEventListener('canplay', function() {
                console.log('📹 Video principal listo');
                video.style.display = 'block';
                if (backup) backup.style.display = 'none';
                if (loading) loading.style.display = 'none';
                
                // Reproducir
                video.play().catch(e => console.log('Autoplay bloqueado'));
            });
            
            // Cargar video
            video.load();
        }
        
        // VIDEO DE HISTORIA
        if (historyVideo) {
            historyVideo.muted = true;
            historyVideo.loop = true;
            historyVideo.play().catch(e => console.log('Video historia autoplay bloqueado'));
        }
        
        console.log('✅ Desktop configurado');
    } catch (error) {
        console.log('Error en desktop:', error);
    }
}

// FUNCIÓN YOUTUBE SIMPLE
function setupYouTube() {
    try {
        const btn = document.getElementById('mobilePlayBtn');
        if (btn) {
            btn.onclick = function() {
                window.open('https://www.youtube.com/watch?v=2YhaGWompwU', '_blank');
            };
            console.log('✅ Botón YouTube configurado');
        }
    } catch (error) {
        console.log('Error en YouTube:', error);
    }
}

// FUNCIÓN MENÚ SIMPLE
function setupMenu() {
    try {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        if (hamburger && navMenu) {
            hamburger.onclick = function() {
                toggleMenu();
            };
            console.log('✅ Menú configurado');
        }
    } catch (error) {
        console.log('Error en menú:', error);
    }
}

// TOGGLE MENÚ
function toggleMenu() {
    try {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        if (!hamburger || !navMenu) return;
        
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            hamburger.classList.add('active');
            navMenu.classList.add('active');
            
            // Bloquear scroll del body en móvil
            if (isMobile) {
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
                document.body.style.top = `-${window.scrollY}px`;
            }
        } else {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Restaurar scroll del body
            if (isMobile) {
                const scrollY = document.body.style.top;
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
                document.body.style.top = '';
                if (scrollY) {
                    window.scrollTo(0, parseInt(scrollY || '0') * -1);
                }
            }
        }
        
        console.log('🍔 Menú:', isMenuOpen ? 'abierto' : 'cerrado');
    } catch (error) {
        console.log('Error en toggle:', error);
    }
}

// CERRAR MENÚ AL HACER CLICK
document.addEventListener('click', function(e) {
    try {
        // Si es un enlace del menú, cerrar menú
        if (e.target.tagName === 'A' && e.target.closest('.nav-menu')) {
            setTimeout(function() {
                if (isMenuOpen) {
                    toggleMenu();
                }
            }, 100);
        }
        
        // Si click fuera del menú, cerrar
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        if (isMenuOpen && hamburger && navMenu) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                toggleMenu();
            }
        }
    } catch (error) {
        console.log('Error en click:', error);
    }
});

// REDIMENSIONAR VENTANA (simple)
window.addEventListener('resize', function() {
    try {
        const wasMobile = isMobile;
        isMobile = detectMobile();
        
        // Solo reconfigurar si cambió el tipo de dispositivo
        if (wasMobile !== isMobile) {
            console.log('📱 Cambió a:', isMobile ? 'móvil' : 'desktop');
            
            if (isMobile) {
                setupMobile();
            } else {
                setupDesktop();
            }
        }
    } catch (error) {
        console.log('Error en resize:', error);
    }
});

// ACTIVAR VIDEOS EN DESKTOP con click del usuario
document.addEventListener('click', function() {
    if (!isMobile) {
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

// EVENTO FINAL AL CARGAR TODO
window.addEventListener('load', function() {
    // Un último arreglo del scroll
    setTimeout(() => {
        fixInitialScroll();
        console.log('🏠 Scroll final arreglado');
    }, 50);
});

console.log('🚀 PRD cargado (CON ARREGLO DE SCROLL)');