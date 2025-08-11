// VERSIÓN OPTIMIZADA PARA MÓVILES - SIN ERRORES
console.log('🎬 PRD iniciando (OPTIMIZADO MÓVIL)...');

// Variables principales
let isMenuOpen = false;
let isMobile = false;

// DETECTAR MÓVIL DE FORMA SEGURA
function detectMobile() {
    try {
        return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    } catch (e) {
        return window.innerWidth <= 768;
    }
}

// INICIALIZACIÓN SEGURA
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 DOM listo');
    
    try {
        // Detectar móvil
        isMobile = detectMobile();
        console.log('📱 Es móvil:', isMobile);
        
        // Configurar según dispositivo
        if (isMobile) {
            setupMobileOptimized();
        } else {
            setupDesktop();
        }
        
        // Configurar funciones básicas
        setupMenu();
        setupYouTubeButton();
        setupLogoClicks();
        
        console.log('✅ Configuración completada');
    } catch (error) {
        console.log('⚠️ Error en inicialización:', error);
        // Configuración mínima de emergencia
        setupBasicFunctionality();
    }
});

// SETUP MÓVIL OPTIMIZADO - SIN ERRORES
function setupMobileOptimized() {
    try {
        console.log('📱 Configurando móvil optimizado...');
        
        // Ocultar video principal pesado
        const video = document.getElementById('bgVideo');
        const loading = document.getElementById('loading');
        const backup = document.querySelector('.backup-background');
        
        if (video) {
            video.style.display = 'none';
            video.pause();
            console.log('📹 Video principal deshabilitado en móvil');
        }
        
        if (loading) loading.style.display = 'none';
        if (backup) backup.style.display = 'block';
        
        // NO configurar video de historia en móvil para evitar problemas
        console.log('✅ Móvil optimizado - Sin videos pesados');
        
    } catch (error) {
        console.log('⚠️ Error en setup móvil:', error);
    }
}

// SETUP DESKTOP - CON VIDEOS
function setupDesktop() {
    try {
        console.log('🖥️ Configurando desktop con videos...');
        
        // Video principal
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
        
        // Video de historia solo en desktop
        const historyVideo = document.getElementById('historyVideo');
        if (historyVideo) {
            historyVideo.muted = true;
            historyVideo.loop = true;
            historyVideo.play().catch(e => console.log('Video historia autoplay bloqueado'));
            console.log('🎬 Video de historia configurado');
        }
        
        console.log('✅ Desktop configurado con videos');
    } catch (error) {
        console.log('⚠️ Error en setup desktop:', error);
    }
}

// BOTÓN YOUTUBE SIMPLE Y SEGURO
function setupYouTubeButton() {
    try {
        const btn = document.getElementById('mobilePlayBtn');
        if (btn) {
            btn.onclick = function(e) {
                try {
                    e.preventDefault();
                    console.log('▶️ Abriendo YouTube...');
                    window.open('https://www.youtube.com/watch?v=2YhaGWompwU', '_blank');
                } catch (error) {
                    console.log('⚠️ Error abriendo YouTube:', error);
                }
            };
            console.log('✅ Botón YouTube configurado');
        }
    } catch (error) {
        console.log('⚠️ Error en YouTube:', error);
    }
}

// CONFIGURAR CLICKS EN LOGOS - SIN HASHES PROBLEMÁTICOS
function setupLogoClicks() {
    try {
        const logoDesktop = document.querySelector('.desktop-logo');
        const logoMobile = document.querySelector('.mobile-logo a');
        
        // Logo desktop
        if (logoDesktop) {
            logoDesktop.onclick = function(e) {
                e.preventDefault();
                scrollToTop();
            };
        }
        
        // Logo móvil
        if (logoMobile) {
            logoMobile.onclick = function(e) {
                e.preventDefault();
                scrollToTop();
            };
        }
        
        console.log('✅ Logos configurados');
    } catch (error) {
        console.log('⚠️ Error en logos:', error);
    }
}

// FUNCIÓN SCROLL SEGURA
function scrollToTop() {
    try {
        // Cerrar menú si está abierto
        if (isMenuOpen) {
            toggleMenu();
        }
        
        // Scroll suave al inicio
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        console.log('🏠 Scroll al inicio');
    } catch (error) {
        // Fallback si smooth scroll falla
        window.scrollTo(0, 0);
    }
}

// MENÚ SIMPLE Y ROBUSTO
function setupMenu() {
    try {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        if (!hamburger || !navMenu) return;
        
        // Toggle menú
        hamburger.onclick = function(e) {
            e.preventDefault();
            toggleMenu();
        };
        
        // Cerrar menú al hacer click en enlaces
        const links = navMenu.querySelectorAll('a');
        links.forEach(link => {
            link.onclick = function(e) {
                // Si es un enlace interno, manejar navegación
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        // Cerrar menú primero
                        if (isMenuOpen) toggleMenu();
                        
                        // Navegar a la sección
                        setTimeout(() => {
                            targetElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }, 300);
                    }
                } else {
                    // Para otros enlaces, cerrar menú
                    setTimeout(() => {
                        if (isMenuOpen) toggleMenu();
                    }, 100);
                }
            };
        });
        
        // Click fuera del menú
        document.addEventListener('click', function(e) {
            if (isMenuOpen && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                toggleMenu();
            }
        });
        
        console.log('✅ Menú configurado');
    } catch (error) {
        console.log('⚠️ Error en menú:', error);
    }
}

// TOGGLE MENÚ OPTIMIZADO
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
            
            console.log('🍔 Menú abierto');
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
            
            console.log('🍔 Menú cerrado');
        }
    } catch (error) {
        console.log('⚠️ Error en toggle menu:', error);
    }
}

// CONFIGURACIÓN BÁSICA DE EMERGENCIA
function setupBasicFunctionality() {
    try {
        console.log('🆘 Configuración básica de emergencia');
        
        // Solo funcionalidad mínima
        const btn = document.getElementById('mobilePlayBtn');
        if (btn) {
            btn.onclick = () => window.open('https://www.youtube.com/watch?v=2YhaGWompwU', '_blank');
        }
        
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        if (hamburger && navMenu) {
            hamburger.onclick = () => {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            };
        }
        
    } catch (error) {
        console.log('⚠️ Error en configuración básica:', error);
    }
}

// REDIMENSIONAR VENTANA SEGURO
window.addEventListener('resize', function() {
    try {
        const wasMobile = isMobile;
        isMobile = detectMobile();
        
        // Solo reconfigurar si cambió el tipo de dispositivo
        if (wasMobile !== isMobile) {
            console.log('📱 Cambió a:', isMobile ? 'móvil' : 'desktop');
            
            setTimeout(() => {
                if (isMobile) {
                    setupMobileOptimized();
                } else {
                    setupDesktop();
                }
            }, 100);
        }
    } catch (error) {
        console.log('⚠️ Error en resize:', error);
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
            console.log('⚠️ Error activando videos:', error);
        }
    }
}, { once: true });

// ESCAPE PARA CERRAR MENÚ
document.addEventListener('keydown', function(e) {
    try {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMenu();
        }
    } catch (error) {
        console.log('⚠️ Error en escape:', error);
    }
});

// API PÚBLICA SEGURA
window.PRD = {
    toggleMenu: function() {
        try {
            toggleMenu();
        } catch (e) {
            console.log('Error en API toggleMenu:', e);
        }
    },
    scrollToTop: function() {
        try {
            scrollToTop();
        } catch (e) {
            console.log('Error en API scrollToTop:', e);
        }
    },
    get isMobile() { return isMobile; },
    get isMenuOpen() { return isMenuOpen; }
};

console.log('🚀 PRD cargado (VERSIÓN MÓVIL OPTIMIZADA Y SEGURA)');
console.log('📱 Es móvil:', isMobile);