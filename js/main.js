// Variables principales
const video = document.getElementById('bgVideo');
const historyVideo = document.getElementById('historyVideo');
const backup = document.querySelector('.backup-background');
const loading = document.getElementById('loading');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const header = document.querySelector('.header');

// Variables de estado
let userHasInteracted = false;
let isMenuOpen = false;
let isVideoPlaying = false;
let lastScrollY = window.scrollY;
let isMobileView = false;
let isYoutubeOpen = false;

// ID del video de YouTube
const YOUTUBE_VIDEO_ID = '2YhaGWompwU';

// INICIALIZACIÓN SIMPLE
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 PRD iniciando...');
    
    // Detectar móvil
    isMobileView = window.innerWidth <= 768;
    
    if (isMobileView) {
        // MÓVIL: Solo configurar YouTube
        setupMobile();
    } else {
        // DESKTOP: Videos normales
        setupDesktop();
    }
    
    // Configurar menú
    setupMenu();
    setupScroll();
});

// CONFIGURACIÓN MÓVIL SÚPER SIMPLE
function setupMobile() {
    console.log('📱 Configurando móvil...');
    
    // Ocultar videos de fondo
    if (video) {
        video.style.display = 'none';
        video.pause();
    }
    
    if (loading) loading.style.display = 'none';
    if (backup) backup.style.display = 'none';
    
    // Configurar video de historia
    if (historyVideo) {
        historyVideo.muted = true;
        historyVideo.loop = true;
        historyVideo.play().catch(e => console.log('Video historia no se puede reproducir'));
    }
    
    // CONFIGURAR BOTÓN DE YOUTUBE - MUY SIMPLE
    setTimeout(() => {
        const playBtn = document.getElementById('mobilePlayBtn');
        const container = document.getElementById('youtubeContainer');
        const wrapper = document.getElementById('youtubeWrapper');
        const closeBtn = document.getElementById('youtubeCloseBtn');
        
        console.log('🔍 Elementos encontrados:', {
            playBtn: !!playBtn,
            container: !!container,
            wrapper: !!wrapper,
            closeBtn: !!closeBtn
        });
        
        if (playBtn && container && wrapper) {
            // LIMPIAR CUALQUIER EVENTO ANTERIOR
            playBtn.replaceWith(playBtn.cloneNode(true));
            const newPlayBtn = document.getElementById('mobilePlayBtn');
            
            // EVENTO CLICK SIMPLE
            newPlayBtn.addEventListener('click', function() {
                console.log('🖱️ ¡BOTÓN CLICKEADO!');
                abrirYoutube();
            });
            
            // TAMBIÉN PARA TOUCH
            newPlayBtn.addEventListener('touchstart', function() {
                console.log('👆 ¡BOTÓN TOCADO!');
                abrirYoutube();
            });
            
            console.log('✅ Botón configurado');
        } else {
            console.log('❌ No se encontraron elementos');
        }
        
        // Configurar botón cerrar
        if (closeBtn) {
            closeBtn.addEventListener('click', cerrarYoutube);
            closeBtn.addEventListener('touchstart', cerrarYoutube);
        }
        
        // Click fuera para cerrar
        if (container) {
            container.addEventListener('click', function(e) {
                if (e.target === container) {
                    cerrarYoutube();
                }
            });
        }
        
    }, 500);
}

// ABRIR YOUTUBE - VERSIÓN SÚPER SIMPLE
function abrirYoutube() {
    console.log('🎬 Abriendo YouTube...');
    
    const container = document.getElementById('youtubeContainer');
    const wrapper = document.getElementById('youtubeWrapper');
    
    if (!container || !wrapper) {
        console.log('❌ No hay elementos');
        // FALLBACK: abrir en nueva ventana
        window.open(`https://www.youtube.com/watch?v=${YOUTUBE_VIDEO_ID}`, '_blank');
        return;
    }
    
    // CREAR IFRAME SIMPLE
    wrapper.innerHTML = `
        <iframe 
            src="https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&controls=1"
            width="100%" 
            height="100%" 
            frameborder="0" 
            allow="autoplay; encrypted-media" 
            allowfullscreen
            style="border-radius: 12px;">
        </iframe>
    `;
    
    // MOSTRAR
    container.style.display = 'block';
    container.classList.add('active');
    isYoutubeOpen = true;
    
    // ANIMACIÓN
    container.style.opacity = '0';
    container.style.transform = 'translate(-50%, -50%) scale(0.8)';
    
    setTimeout(() => {
        container.style.transition = 'all 0.3s ease';
        container.style.opacity = '1';
        container.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
    
    console.log('✅ YouTube abierto');
}

// CERRAR YOUTUBE
function cerrarYoutube() {
    console.log('❌ Cerrando YouTube...');
    
    const container = document.getElementById('youtubeContainer');
    const wrapper = document.getElementById('youtubeWrapper');
    
    if (container) {
        container.style.opacity = '0';
        container.style.transform = 'translate(-50%, -50%) scale(0.8)';
        
        setTimeout(() => {
            container.style.display = 'none';
            container.classList.remove('active');
            if (wrapper) wrapper.innerHTML = '';
            isYoutubeOpen = false;
            container.style.transition = '';
        }, 300);
    }
}

// CONFIGURACIÓN DESKTOP
function setupDesktop() {
    console.log('🖥️ Configurando desktop...');
    
    // Video principal
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
    if (historyVideo) {
        historyVideo.muted = true;
        historyVideo.loop = true;
        historyVideo.play().catch(e => console.log('Video historia autoplay bloqueado'));
    }
}

// CONFIGURAR MENÚ
function setupMenu() {
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        toggleMenu();
    });
    
    // Enlaces del menú
    const links = navMenu.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            setTimeout(() => {
                if (isMenuOpen) toggleMenu();
            }, 200);
        });
    });
    
    // Click fuera del menú
    document.addEventListener('click', function(e) {
        if (isMenuOpen && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            toggleMenu();
        }
    });
}

// TOGGLE MENÚ
function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    if (isMenuOpen) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = `-${window.scrollY}px`;
    } else {
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

// EFECTOS DE SCROLL
function setupScroll() {
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (header) {
            if (currentScrollY > 50) {
                if (window.innerWidth <= 768) {
                    header.style.background = 'rgba(255, 255, 255, 0.2)';
                } else {
                    header.style.background = 'rgba(0, 0, 0, 0.95)';
                }
            } else {
                if (window.innerWidth <= 768) {
                    header.style.background = 'rgba(255, 255, 255, 0.1)';
                } else {
                    header.style.background = 'rgba(0, 0, 0, 0.85)';
                }
            }
        }
        
        lastScrollY = currentScrollY;
    });
}

// REDIMENSIONAR VENTANA
window.addEventListener('resize', function() {
    const wassMobile = isMobileView;
    isMobileView = window.innerWidth <= 768;
    
    if (wassMobile !== isMobileView) {
        if (isMobileView) {
            setupMobile();
        } else {
            setupDesktop();
        }
    }
});

// INTERACCIÓN USUARIO PARA DESKTOP
document.addEventListener('click', function() {
    if (!userHasInteracted && !isMobileView) {
        userHasInteracted = true;
        if (video && video.paused) {
            video.play().catch(e => console.log('No se pudo reproducir video'));
        }
        if (historyVideo && historyVideo.paused) {
            historyVideo.play().catch(e => console.log('No se pudo reproducir video historia'));
        }
    }
}, { once: true });

// ESCAPE PARA CERRAR
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (isYoutubeOpen) cerrarYoutube();
        if (isMenuOpen) toggleMenu();
    }
});

// API PÚBLICA SIMPLE
window.PRD = {
    abrirYoutube: abrirYoutube,
    cerrarYoutube: cerrarYoutube,
    toggleMenu: toggleMenu,
    get isMobile() { return isMobileView; },
    get isYoutubeOpen() { return isYoutubeOpen; },
    get isMenuOpen() { return isMenuOpen; }
};

console.log('✅ PRD Zacatecas cargado');
console.log('📱 Es móvil:', isMobileView);
console.log('🎮 Usa PRD.abrirYoutube() para probar');