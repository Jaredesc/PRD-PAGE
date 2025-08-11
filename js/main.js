// VERSIÓN CON AUTOPLAY FORZADO EN DESKTOP
console.log('🎬 PRD iniciando con autoplay forzado...');

// Variables globales seguras
let isMenuOpen = false;
let isMobile = false;
let isInitialized = false;
let videoPlayAttempts = 0;
let maxVideoAttempts = 10;

// DETECTAR MÓVIL DE FORMA MUY SEGURA
function detectMobile() {
    try {
        if (typeof window === 'undefined') return true;
        
        const userAgent = navigator.userAgent || '';
        const isMobileUA = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const isSmallScreen = window.innerWidth <= 768;
        
        return isMobileUA || isSmallScreen;
    } catch (e) {
        console.log('⚠️ Error detectando móvil, asumiendo móvil:', e);
        return true;
    }
}

// FORZAR REPRODUCCIÓN DE VIDEO - DESKTOP ONLY
function forceVideoPlay(video, videoName = 'video') {
    if (isMobile || !video) return;
    
    try {
        console.log(`🎬 Intentando reproducir ${videoName}...`);
        
        // Configurar propiedades esenciales
        video.muted = true;
        video.loop = true;
        video.autoplay = true;
        video.playsInline = true;
        
        // Intentar reproducir
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log(`✅ ${videoName} reproduciéndose automáticamente`);
                    video.style.display = 'block';
                    
                    // Ocultar fondo de respaldo
                    const backup = document.querySelector('.backup-background');
                    if (backup && videoName === 'video principal') {
                        backup.style.display = 'none';
                    }
                })
                .catch(error => {
                    console.log(`⚠️ Autoplay bloqueado para ${videoName}:`, error.message);
                    
                    // Si falla, seguir intentando cada segundo
                    if (videoPlayAttempts < maxVideoAttempts) {
                        videoPlayAttempts++;
                        setTimeout(() => {
                            console.log(`🔄 Reintentando ${videoName} (intento ${videoPlayAttempts}/${maxVideoAttempts})`);
                            forceVideoPlay(video, videoName);
                        }, 1000);
                    } else {
                        console.log(`❌ No se pudo reproducir ${videoName} después de ${maxVideoAttempts} intentos`);
                        setupClickToPlay(video, videoName);
                    }
                });
        }
    } catch (error) {
        console.log(`⚠️ Error configurando ${videoName}:`, error);
    }
}

// CONFIGURAR CLICK PARA REPRODUCIR (FALLBACK)
function setupClickToPlay(video, videoName) {
    if (isMobile) return;
    
    console.log(`🖱️ Configurando click-to-play para ${videoName}`);
    
    // Mostrar indicador visual
    showVideoClickIndicator();
    
    const playOnClick = () => {
        try {
            video.play().then(() => {
                console.log(`✅ ${videoName} reproducido por click del usuario`);
                hideVideoClickIndicator();
                
                // Ocultar fondo de respaldo
                const backup = document.querySelector('.backup-background');
                if (backup && videoName === 'video principal') {
                    backup.style.display = 'none';
                }
                
                // Remover listener después del primer click exitoso
                document.removeEventListener('click', playOnClick);
                document.removeEventListener('keydown', playOnKeyDown);
                document.removeEventListener('touchstart', playOnClick);
            });
        } catch (e) {
            console.log(`Error reproduciendo ${videoName} por click:`, e);
        }
    };
    
    const playOnKeyDown = (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
            playOnClick();
        }
    };
    
    // Múltiples eventos para asegurar reproducción
    document.addEventListener('click', playOnClick, { once: true });
    document.addEventListener('keydown', playOnKeyDown, { once: true });
    document.addEventListener('touchstart', playOnClick, { once: true });
}

// MOSTRAR INDICADOR DE VIDEO
function showVideoClickIndicator() {
    // Crear indicador visual si no existe
    let indicator = document.getElementById('videoClickIndicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'videoClickIndicator';
        indicator.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 1rem 2rem;
                border-radius: 50px;
                font-family: 'Inter', sans-serif;
                font-size: 1rem;
                z-index: 10000;
                border: 2px solid #f1c232;
                backdrop-filter: blur(10px);
                animation: pulse 2s infinite;
            ">
                🎬 Haz click para activar videos
            </div>
            <style>
                @keyframes pulse {
                    0%, 100% { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
                    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
                }
            </style>
        `;
        document.body.appendChild(indicator);
    }
}

// OCULTAR INDICADOR DE VIDEO
function hideVideoClickIndicator() {
    const indicator = document.getElementById('videoClickIndicator');
    if (indicator) {
        indicator.style.opacity = '0';
        indicator.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 500);
    }
}

// CONFIGURACIÓN DESKTOP CON AUTOPLAY AGRESIVO
function setupDesktopWithAutoplay() {
    try {
        console.log('🖥️ Configurando desktop con AUTOPLAY FORZADO...');
        
        // Video principal con autoplay inmediato
        const video = document.getElementById('bgVideo');
        if (video) {
            console.log('📹 Configurando video principal...');
            
            // Event listeners para carga
            video.addEventListener('loadeddata', () => {
                console.log('📹 Video principal cargado, iniciando autoplay...');
                forceVideoPlay(video, 'video principal');
            });
            
            video.addEventListener('canplay', () => {
                console.log('📹 Video principal listo para reproducir');
                forceVideoPlay(video, 'video principal');
            });
            
            video.addEventListener('error', (e) => {
                console.log('❌ Error cargando video principal:', e);
                const backup = document.querySelector('.backup-background');
                if (backup) backup.style.display = 'block';
            });
            
            // Configurar y cargar
            video.muted = true;
            video.loop = true;
            video.autoplay = true;
            video.playsInline = true;
            video.preload = 'auto';
            
            // Si ya está cargado, reproducir inmediatamente
            if (video.readyState >= 3) {
                forceVideoPlay(video, 'video principal');
            } else {
                video.load();
            }
        }
        
        // Video de historia con autoplay
        const historyVideo = document.getElementById('historyVideo');
        if (historyVideo) {
            console.log('🎬 Configurando video de historia...');
            
            historyVideo.muted = true;
            historyVideo.loop = true;
            historyVideo.autoplay = true;
            historyVideo.playsInline = true;
            historyVideo.preload = 'metadata';
            
            // Intentar reproducir cuando sea visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        forceVideoPlay(historyVideo, 'video historia');
                        observer.unobserve(historyVideo);
                    }
                });
            });
            
            observer.observe(historyVideo);
        }
        
        // Autoplay inmediato en carga de página
        setTimeout(() => {
            if (video && video.paused) {
                console.log('🔄 Video pausado después de timeout, reintentando...');
                forceVideoPlay(video, 'video principal');
            }
        }, 1000);
        
        console.log('✅ Desktop configurado con autoplay agresivo');
        
    } catch (error) {
        console.log('⚠️ Error en configuración desktop:', error);
    }
}

// INICIALIZACIÓN SUPER SEGURA
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 DOM listo - iniciando configuración...');
    
    if (isInitialized) {
        console.log('Ya inicializado, saltando...');
        return;
    }
    
    try {
        // Detectar tipo de dispositivo
        isMobile = detectMobile();
        console.log('📱 Dispositivo detectado:', isMobile ? 'MÓVIL' : 'DESKTOP');
        
        // Configuración básica SIEMPRE
        setupBasicSafety();
        
        // Configuración específica por dispositivo
        if (isMobile) {
            setupMobileSafe();
        } else {
            setupDesktopWithAutoplay(); // NUEVA FUNCIÓN CON AUTOPLAY
        }
        
        // Funciones básicas
        setupMenuSafe();
        setupYouTubeButtonSafe();
        setupNavigationSafe();
        
        isInitialized = true;
        console.log('✅ Inicialización completada exitosamente');
        
    } catch (error) {
        console.log('⚠️ Error en inicialización principal:', error);
        setupEmergencyMode();
    }
});

// CONFIGURACIÓN BÁSICA DE SEGURIDAD
function setupBasicSafety() {
    try {
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'none';
        
        const backup = document.querySelector('.backup-background');
        if (backup) backup.style.display = 'block';
        
        const allLinks = document.querySelectorAll('a[href="#"]');
        allLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
            });
        });
        
        console.log('🛡️ Configuración básica de seguridad aplicada');
    } catch (e) {
        console.log('⚠️ Error en configuración básica:', e);
    }
}

// CONFIGURACIÓN MÓVIL ULTRA SEGURA
function setupMobileSafe() {
    try {
        console.log('📱 Configurando móvil - SIN VIDEOS PESADOS');
        
        const allVideos = document.querySelectorAll('video');
        allVideos.forEach(video => {
            try {
                video.pause();
                video.remove();
            } catch (e) {
                console.log('Video ya removido o no existe');
            }
        });
        
        const backup = document.querySelector('.backup-background');
        if (backup) {
            backup.style.display = 'block';
            backup.style.zIndex = '1';
        }
        
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.loading = 'lazy';
        });
        
        console.log('✅ Móvil configurado');
        
    } catch (error) {
        console.log('⚠️ Error en configuración móvil:', error);
    }
}

// BOTÓN YOUTUBE ULTRA SEGURO
function setupYouTubeButtonSafe() {
    try {
        const btn = document.getElementById('mobilePlayBtn');
        if (!btn) return;
        
        btn.onclick = null;
        
        btn.addEventListener('click', function(e) {
            try {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('▶️ Abriendo YouTube...');
                
                const youtubeUrl = 'https://www.youtube.com/watch?v=2YhaGWompwU';
                
                if (window.open) {
                    window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
                } else {
                    location.href = youtubeUrl;
                }
                
            } catch (error) {
                console.log('⚠️ Error abriendo YouTube:', error);
                try {
                    location.href = 'https://www.youtube.com/watch?v=2YhaGWompwU';
                } catch (e) {
                    console.log('Error total en YouTube');
                }
            }
        });
        
        console.log('✅ Botón YouTube configurado');
        
    } catch (error) {
        console.log('⚠️ Error configurando botón YouTube:', error);
    }
}

// NAVEGACIÓN SEGURA
function setupNavigationSafe() {
    try {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                try {
                    e.preventDefault();
                    
                    const href = this.getAttribute('href');
                    if (!href || href === '#') {
                        scrollToTopSafe();
                        return;
                    }
                    
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        if (isMenuOpen) toggleMenuSafe();
                        
                        setTimeout(() => {
                            try {
                                targetElement.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                });
                            } catch (e) {
                                targetElement.scrollIntoView();
                            }
                        }, 300);
                    }
                    
                } catch (error) {
                    console.log('Error en navegación:', error);
                }
            });
        });
        
        const logos = document.querySelectorAll('.logo, .mobile-logo a');
        logos.forEach(logo => {
            logo.addEventListener('click', function(e) {
                e.preventDefault();
                scrollToTopSafe();
            });
        });
        
        console.log('✅ Navegación segura configurada');
        
    } catch (error) {
        console.log('⚠️ Error en navegación:', error);
    }
}

// SCROLL TO TOP ULTRA SEGURO
function scrollToTopSafe() {
    try {
        if (isMenuOpen) toggleMenuSafe();
        
        setTimeout(() => {
            try {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } catch (e) {
                try {
                    window.scrollTo(0, 0);
                } catch (e2) {
                    document.documentElement.scrollTop = 0;
                }
            }
        }, 100);
        
        console.log('🏠 Scroll al inicio');
        
    } catch (error) {
        console.log('⚠️ Error en scroll:', error);
    }
}

// MENÚ ULTRA SEGURO
function setupMenuSafe() {
    try {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        if (!hamburger || !navMenu) {
            console.log('Elementos del menú no encontrados');
            return;
        }
        
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenuSafe();
        });
        
        document.addEventListener('click', function(e) {
            if (isMenuOpen && 
                !hamburger.contains(e.target) && 
                !navMenu.contains(e.target)) {
                toggleMenuSafe();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isMenuOpen) {
                toggleMenuSafe();
            }
        });
        
        console.log('✅ Menú configurado');
        
    } catch (error) {
        console.log('⚠️ Error configurando menú:', error);
    }
}

// TOGGLE MENÚ ULTRA SEGURO
function toggleMenuSafe() {
    try {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        if (!hamburger || !navMenu) return;
        
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            hamburger.classList.add('active');
            navMenu.classList.add('active');
            
            if (isMobile) {
                try {
                    document.body.style.overflow = 'hidden';
                } catch (e) {
                    console.log('Error bloqueando scroll');
                }
            }
            
            console.log('🍔 Menú abierto');
        } else {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            if (isMobile) {
                try {
                    document.body.style.overflow = '';
                } catch (e) {
                    console.log('Error restaurando scroll');
                }
            }
            
            console.log('🍔 Menú cerrado');
        }
        
    } catch (error) {
        console.log('⚠️ Error en toggle menú:', error);
    }
}

// MODO DE EMERGENCIA
function setupEmergencyMode() {
    try {
        console.log('🆘 MODO DE EMERGENCIA ACTIVADO');
        
        const btn = document.getElementById('mobilePlayBtn');
        if (btn) {
            btn.onclick = function() {
                try {
                    window.open('https://www.youtube.com/watch?v=2YhaGWompwU', '_blank');
                } catch (e) {
                    location.href = 'https://www.youtube.com/watch?v=2YhaGWompwU';
                }
            };
        }
        
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        if (hamburger && navMenu) {
            hamburger.onclick = function() {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            };
        }
        
        console.log('🆘 Modo emergencia configurado');
        
    } catch (error) {
        console.log('⚠️ Error crítico en modo emergencia:', error);
    }
}

// REDIMENSIONAR VENTANA SEGURO
window.addEventListener('resize', function() {
    try {
        clearTimeout(window.resizeTimeout);
        window.resizeTimeout = setTimeout(function() {
            const wasMobile = isMobile;
            isMobile = detectMobile();
            
            if (wasMobile !== isMobile) {
                console.log('📱 Cambio de dispositivo detectado');
                
                setTimeout(() => {
                    try {
                        if (isMobile) {
                            setupMobileSafe();
                        } else {
                            setupDesktopWithAutoplay();
                        }
                    } catch (e) {
                        console.log('Error en reconfiguración:', e);
                    }
                }, 200);
            }
        }, 250);
        
    } catch (error) {
        console.log('⚠️ Error en resize:', error);
    }
});

// VIGILAR VIDEOS Y REACTIVAR SI SE PAUSAN (DESKTOP ONLY)
if (!isMobile) {
    setInterval(() => {
        try {
            const video = document.getElementById('bgVideo');
            const historyVideo = document.getElementById('historyVideo');
            
            if (video && video.paused && !isMobile) {
                console.log('🔄 Video principal pausado, reactivando...');
                forceVideoPlay(video, 'video principal');
            }
            
            if (historyVideo && historyVideo.paused && !isMobile) {
                console.log('🔄 Video historia pausado, reactivando...');
                forceVideoPlay(historyVideo, 'video historia');
            }
        } catch (e) {
            // Silencioso para no llenar console
        }
    }, 5000); // Verificar cada 5 segundos
}

// API PÚBLICA SEGURA
window.PRD = {
    toggleMenu: function() {
        try {
            toggleMenuSafe();
        } catch (e) {
            console.log('Error en API toggleMenu:', e);
        }
    },
    scrollToTop: function() {
        try {
            scrollToTopSafe();
        } catch (e) {
            console.log('Error en API scrollToTop:', e);
        }
    },
    forcePlayVideos: function() {
        if (!isMobile) {
            try {
                const video = document.getElementById('bgVideo');
                const historyVideo = document.getElementById('historyVideo');
                
                if (video) forceVideoPlay(video, 'video principal');
                if (historyVideo) forceVideoPlay(historyVideo, 'video historia');
            } catch (e) {
                console.log('Error forzando reproducción:', e);
            }
        }
    },
    get isMobile() { return isMobile; },
    get isMenuOpen() { return isMenuOpen; },
    get isInitialized() { return isInitialized; }
};

// FUNCIÓN GLOBAL PARA HTML
window.scrollToTop = scrollToTopSafe;

console.log('🚀 PRD cargado (VERSIÓN CON AUTOPLAY FORZADO)');
console.log('📱 Dispositivo:', isMobile ? 'MÓVIL' : 'DESKTOP');
console.log('🎬 Autoplay agresivo activado para desktop');