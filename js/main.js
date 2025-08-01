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
let lastScrollY = window.scrollY;
let isMobileView = false;

// ===== ANTI-SCROLL AGRESIVO =====
function forceScrollToTop() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Matar cualquier hash
    if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname);
    }
}

// OVERRIDE SCROLL RESTORATION INMEDIATAMENTE
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// FORZAR SCROLL MÚLTIPLES VECES
forceScrollToTop();

// PREVENIR NAVEGACIÓN AUTOMÁTICA
window.addEventListener('beforeunload', forceScrollToTop);
window.addEventListener('pagehide', forceScrollToTop);
window.addEventListener('unload', forceScrollToTop);

// INICIALIZACIÓN SÚPER AGRESIVA
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 PRD iniciando (MODO ANTI-SCROLL)...');
    
    // FORZAR SCROLL INMEDIATO
    forceScrollToTop();
    
    // Detectar móvil
    isMobileView = window.innerWidth <= 768;
    
    if (isMobileView) {
        // MÓVIL: Configuración simple
        setupMobile();
    } else {
        // DESKTOP: Videos normales
        setupDesktop();
    }
    
    // Configurar todo
    setupMenu();
    setupScroll();
    setupLogoClicks();
    setupYouTubeButton();
    setupCustomNavigation();
    
    // FORZAR SCROLL DESPUÉS DE TODO
    setTimeout(forceScrollToTop, 100);
    setTimeout(forceScrollToTop, 500);
    setTimeout(forceScrollToTop, 1000);
});

// NAVEGACIÓN PERSONALIZADA SIN HASHES
function setupCustomNavigation() {
    const menuLinks = document.querySelectorAll('[data-target]');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const target = this.getAttribute('data-target');
            const targetElement = document.getElementById(target);
            
            if (targetElement) {
                // Cerrar menú primero
                if (isMenuOpen) {
                    toggleMenu();
                }
                
                // Scroll suave a la sección
                setTimeout(() => {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 300);
            }
        });
    });
}

// CONFIGURAR CLICKS EN LOGOS
function setupLogoClicks() {
    const logoDesktop = document.getElementById('logoDesktop');
    const logoMobile = document.getElementById('logoMobile');
    
    // Logo desktop
    if (logoDesktop) {
        logoDesktop.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            scrollToTop();
        });
    }
    
    // Logo móvil
    if (logoMobile) {
        logoMobile.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            scrollToTop();
        });
    }
}

// FUNCIÓN PARA SCROLL SUAVE AL INICIO
function scrollToTop() {
    // Cerrar menú si está abierto
    if (isMenuOpen) {
        toggleMenu();
    }
    
    // Scroll suave al inicio
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Forzar después del smooth scroll
    setTimeout(forceScrollToTop, 100);
}

// CONFIGURAR BOTÓN YOUTUBE
function setupYouTubeButton() {
    setTimeout(() => {
        const btn = document.getElementById('mobilePlayBtn');
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                window.open('https://www.youtube.com/watch?v=2YhaGWompwU', '_blank');
            });
        }
    }, 500);
}

// CONFIGURACIÓN MÓVIL SIMPLE
function setupMobile() {
    console.log('📱 Configurando móvil (ANTI-SCROLL)...');
    
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
    
    // FORZAR SCROLL EN MÓVIL
    forceScrollToTop();
    
    console.log('✅ Móvil configurado - SIN SCROLL AUTOMÁTICO');
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
        e.stopPropagation();
        toggleMenu();
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
    const wasMobile = isMobileView;
    isMobileView = window.innerWidth <= 768;
    
    if (wasMobile !== isMobileView) {
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

// ESCAPE PARA CERRAR MENÚ
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isMenuOpen) {
        toggleMenu();
    }
});

// ANTI-HASH AGRESIVO
window.addEventListener('hashchange', function(e) {
    e.preventDefault();
    e.stopPropagation();
    forceScrollToTop();
});

// ANTI-SCROLL AL CARGAR
window.addEventListener('load', function() {
    forceScrollToTop();
    setTimeout(forceScrollToTop, 100);
    setTimeout(forceScrollToTop, 500);
});

// ANTI-POPSTATE
window.addEventListener('popstate', function(e) {
    e.preventDefault();
    forceScrollToTop();
});

// API PÚBLICA SIMPLE
window.PRD = {
    toggleMenu: toggleMenu,
    scrollToTop: scrollToTop,
    forceScrollToTop: forceScrollToTop,
    get isMobile() { return isMobileView; },
    get isMenuOpen() { return isMenuOpen; }
};

console.log('✅ PRD Zacatecas cargado (MODO ANTI-SCROLL)');
console.log('📱 Es móvil:', isMobileView);
console.log('🚫 SCROLL AUTOMÁTICO DESHABILITADO');
console.log('🏠 Logo clickeable para ir al inicio');