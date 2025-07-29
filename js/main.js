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

// Variables para móvil y YouTube
let isMobileView = false;
let mobilePlayBtn = null;
let youtubeContainer = null;
let youtubeWrapper = null;
let youtubeCloseBtn = null;
let isYoutubeOpen = false;

// ID del video de YouTube
const YOUTUBE_VIDEO_ID = '2YhaGWompwU';

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 PRD Digital Zacatecas iniciando...');
    
    // Detectar dispositivo primero
    isMobileView = checkMobileView();
    
    // Inicializar componentes
    setupHamburgerMenu();
    setupNavigation();
    setupScrollEffects();
    setupMobileOptimizations();
    
    // Configurar según dispositivo
    if (isMobileView) {
        console.log('📱 Móvil detectado - configurando miniatura estática + YouTube pequeño');
        setupMobileMode();
    } else {
        console.log('🖥️ Desktop detectado - configurando videos de fondo');
        setupDesktopMode();
    }
    
    console.log('✅ Todos los componentes inicializados');
});

// Detectar si estamos en móvil
function checkMobileView() {
    isMobileView = window.innerWidth <= 768;
    console.log('📏 Pantalla:', window.innerWidth + 'px', isMobileView ? '(Móvil)' : '(Desktop)');
    return isMobileView;
}

// MODO MÓVIL: Solo miniatura estática + YouTube pequeño
function setupMobileMode() {
    console.log('📱 Configurando modo móvil...');
    
    // 1. DETENER COMPLETAMENTE todos los videos de fondo
    stopAllBackgroundVideos();
    
    // 2. Ocultar loading y backup inmediatamente
    hideLoadingAndBackup();
    
    // 3. Configurar funcionalidad de YouTube pequeño
    setupMobileYouTubeFeatures();
    
    console.log('✅ Modo móvil configurado - Solo miniatura estática');
}

// MODO DESKTOP: Videos de fondo normales
function setupDesktopMode() {
    console.log('🖥️ Configurando modo desktop...');
    
    // 1. Configurar video principal
    setupVideo();
    
    // 2. Configurar video de historia
    setupHistoryVideo();
    
    console.log('✅ Modo desktop configurado - Videos de fondo activos');
}

// Detener TODOS los videos de fondo en móvil
function stopAllBackgroundVideos() {
    console.log('🛑 Deteniendo videos de fondo en móvil...');
    
    // Video principal - detener completamente
    if (video) {
        video.pause();
        video.currentTime = 0;
        video.style.display = 'none';
        video.muted = true;
        // Remover fuentes para evitar carga
        const sources = video.querySelectorAll('source');
        sources.forEach(source => source.removeAttribute('src'));
        console.log('🛑 Video principal detenido');
    }
    
    // Video de historia - mantener para todas las pantallas
    setupHistoryVideo();
}

// Ocultar loading y backup inmediatamente en móvil
function hideLoadingAndBackup() {
    if (loading) {
        loading.style.display = 'none';
        console.log('✅ Loading oculto');
    }
    
    if (backup) {
        backup.style.display = 'none';
        console.log('✅ Backup oculto');
    }
}

// Configurar funcionalidad móvil con YouTube pequeño
function setupMobileYouTubeFeatures() {
    console.log('📱 Configurando YouTube pequeño móvil...');
    
    // Encontrar elementos
    mobilePlayBtn = document.getElementById('mobilePlayBtn');
    youtubeContainer = document.getElementById('youtubeContainer');
    youtubeWrapper = document.getElementById('youtubeWrapper');
    youtubeCloseBtn = document.getElementById('youtubeCloseBtn');
    
    if (mobilePlayBtn) {
        mobilePlayBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🖱️ Botón play móvil clickeado - abriendo YouTube pequeño');
            openYoutubeVideoSmall();
        });
        console.log('✅ Botón play configurado');
    }
    
    if (youtubeCloseBtn) {
        youtubeCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('❌ Cerrando video de YouTube pequeño');
            closeYoutubeVideoSmall();
        });
        console.log('✅ Botón cerrar configurado');
    }
    
    // Click fuera del video para cerrarlo
    if (youtubeContainer) {
        youtubeContainer.addEventListener('click', function(e) {
            // Solo cerrar si se hace click en el backdrop, no en el video mismo
            if (e.target === youtubeContainer) {
                closeYoutubeVideoSmall();
            }
        });
    }
    
    // Escape key para cerrar video
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isYoutubeOpen) {
            closeYoutubeVideoSmall();
        }
    });
    
    console.log('✅ YouTube pequeño móvil configurado');
}

// Configurar video principal (SOLO DESKTOP)
function setupVideo() {
    if (!video) {
        console.log('❌ Video principal no encontrado');
        return;
    }

    console.log('🎥 Configurando video principal para desktop...');

    // Configurar atributos del video
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('playsinline', 'true');
    video.muted = true;
    video.loop = true;
    video.preload = 'auto';

    // Cuando el video se puede reproducir
    video.addEventListener('canplay', function() {
        console.log('✅ Video principal listo para reproducir');
        video.style.display = 'block';
        
        if (backup) {
            backup.style.opacity = '0';
            setTimeout(() => {
                backup.style.display = 'none';
            }, 1000);
        }
        
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.style.display = 'none';
            }, 500);
        }
        
        // Reproducir inmediatamente en desktop
        setTimeout(() => {
            playVideoSafely(video);
        }, 500);
    });

    // Cuando el video se carga completamente
    video.addEventListener('loadeddata', function() {
        console.log('✅ Video principal cargado completamente');
        playVideoSafely(video);
    });

    // Si hay error en el video
    video.addEventListener('error', function(e) {
        console.log('❌ Error en video principal:', e);
        handleVideoError('principal');
    });

    // Mantener en loop
    video.addEventListener('ended', function() {
        video.currentTime = 0;
        playVideoSafely(video);
    });

    // Escuchar cambios de estado del video
    video.addEventListener('play', function() {
        isVideoPlaying = true;
        console.log('▶️ Video principal reproduciéndose');
    });

    video.addEventListener('pause', function() {
        isVideoPlaying = false;
        console.log('⏸️ Video principal pausado');
    });

    // Forzar carga inicial
    video.load();
}

// Configurar video de historia (TODAS LAS PANTALLAS)
function setupHistoryVideo() {
    if (!historyVideo) {
        console.log('❌ Video de historia no encontrado');
        return;
    }

    console.log('🌤️ Configurando video de historia...');

    // Configurar atributos del video
    historyVideo.setAttribute('webkit-playsinline', 'true');
    historyVideo.setAttribute('playsinline', 'true');
    historyVideo.muted = true;
    historyVideo.loop = true;
    historyVideo.controls = false;
    historyVideo.disablePictureInPicture = true;
    historyVideo.preload = 'auto';
    
    // Cuando el video se puede reproducir
    historyVideo.addEventListener('canplay', function() {
        console.log('✅ Video de historia listo');
        playVideoSafely(historyVideo);
    });

    // Cuando se carga
    historyVideo.addEventListener('loadeddata', function() {
        console.log('✅ Video de historia cargado');
        playVideoSafely(historyVideo);
    });

    // Si hay error
    historyVideo.addEventListener('error', function(e) {
        console.log('❌ Error en video de historia:', e);
        handleVideoError('historia');
    });

    // Mantener en loop
    historyVideo.addEventListener('ended', function() {
        historyVideo.currentTime = 0;
        playVideoSafely(historyVideo);
    });

    // Prevenir menú contextual y controles
    historyVideo.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Forzar carga
    historyVideo.load();
}

// Reproducir video de manera segura
function playVideoSafely(videoElement) {
    if (!videoElement) return;
    
    const playPromise = videoElement.play();
    
    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log(`▶️ Video ${videoElement.id} reproduciéndose`);
                if (videoElement === video) {
                    isVideoPlaying = true;
                }
            })
            .catch(error => {
                console.log(`⚠️ Autoplay bloqueado para ${videoElement.id}:`, error);
                if (videoElement === video) {
                    isVideoPlaying = false;
                }
            });
    }
}

// Manejar errores de video
function handleVideoError(videoType) {
    console.log(`❌ Error en video ${videoType}`);
    
    if (loading && videoType === 'principal') {
        loading.innerHTML = `
            <div class="spinner"></div>
            ⚠️ Usando fondo dorado
        `;
        
        setTimeout(() => {
            if (loading) {
                loading.style.opacity = '0';
                setTimeout(() => {
                    loading.style.display = 'none';
                }, 500);
            }
        }, 3000);
        
        // Mostrar backup solo en desktop
        if (backup && !isMobileView) {
            backup.style.display = 'block';
            backup.style.opacity = '1';
        }
    }
}

// Abrir video de YouTube en ventana pequeña
function openYoutubeVideoSmall() {
    if (!isMobileView || !youtubeContainer || !youtubeWrapper) {
        console.log('❌ No se puede abrir YouTube - no es móvil o faltan elementos');
        return;
    }
    
    console.log('🎬 Abriendo video de YouTube en ventana pequeña...');
    
    // Crear iframe de YouTube con autoplay
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&fs=1&controls=1`;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.style.borderRadius = '12px';
    
    // Limpiar contenedor y agregar iframe
    youtubeWrapper.innerHTML = '';
    youtubeWrapper.appendChild(iframe);
    
    // Mostrar contenedor con animación
    youtubeContainer.style.display = 'block';
    youtubeContainer.classList.add('active');
    isYoutubeOpen = true;
    
    // NO bloquear scroll - solo agregar una clase para el backdrop
    document.body.classList.add('youtube-open');
    
    // Animación de entrada
    setTimeout(() => {
        youtubeContainer.style.opacity = '1';
        youtubeContainer.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
    
    console.log('▶️ Video de YouTube pequeño abierto');
}

// Cerrar video de YouTube pequeño
function closeYoutubeVideoSmall() {
    if (!youtubeContainer) return;
    
    console.log('🔴 Cerrando video de YouTube pequeño...');
    
    // Animación de salida
    youtubeContainer.style.opacity = '0';
    youtubeContainer.style.transform = 'translate(-50%, -50%) scale(0.9)';
    
    setTimeout(() => {
        // Ocultar contenedor
        youtubeContainer.style.display = 'none';
        youtubeContainer.classList.remove('active');
        isYoutubeOpen = false;
        
        // Limpiar iframe
        if (youtubeWrapper) {
            youtubeWrapper.innerHTML = '';
        }
        
        // Restaurar estado del body
        document.body.classList.remove('youtube-open');
        
        // Reset de styles para próxima vez
        youtubeContainer.style.opacity = '';
        youtubeContainer.style.transform = '';
        
    }, 300);
    
    console.log('⏹️ Video de YouTube pequeño cerrado');
}

// Configurar menú hamburger
function setupHamburgerMenu() {
    if (!hamburger || !navMenu) {
        console.log('❌ Elementos del menú hamburger no encontrados');
        return;
    }

    console.log('🍔 Configurando menú hamburger...');

    // Click en hamburger
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🖱️ Hamburger clickeado');
        toggleMenu();
    });

    // Click en enlaces del menú
    const menuLinks = navMenu.querySelectorAll('a');
    menuLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            console.log('🔗 Enlace clickeado:', this.textContent);
            
            // Efecto de click
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Cerrar menú después de un delay
            setTimeout(() => {
                if (isMenuOpen) {
                    toggleMenu();
                }
            }, 200);
        });
    });

    // Click fuera del menú
    document.addEventListener('click', function(e) {
        if (isMenuOpen) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                console.log('🖱️ Click fuera del menú, cerrando...');
                toggleMenu();
            }
        }
    });

    // Escape key para cerrar menú
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen && !isYoutubeOpen) {
            console.log('⌨️ Escape presionado, cerrando menú');
            toggleMenu();
        }
    });

    // Redimensionar ventana
    window.addEventListener('resize', debounce(function() {
        const wassMobile = isMobileView;
        const isNowMobile = checkMobileView();
        
        if (window.innerWidth > 768 && isMenuOpen) {
            console.log('📏 Ventana redimensionada a desktop, cerrando menú');
            toggleMenu();
        }
        
        // Si cambió de móvil a desktop o viceversa
        if (wassMobile !== isNowMobile) {
            console.log('📱🖥️ Cambio de dispositivo detectado, reconfigurando...');
            if (isNowMobile) {
                setupMobileMode();
            } else {
                setupDesktopMode();
            }
        }
    }, 250));

    // Cambio de orientación
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            if (window.innerWidth > 768 && isMenuOpen) {
                toggleMenu();
            }
        }, 100);
    });

    console.log('✅ Menú hamburger configurado correctamente');
}

// Toggle del menú
function toggleMenu() {
    if (!hamburger || !navMenu) {
        console.log('❌ No se pueden encontrar elementos del menú');
        return;
    }

    isMenuOpen = !isMenuOpen;
    
    // Toggle clases principales
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    if (isMenuOpen) {
        // Abriendo menú
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = `-${window.scrollY}px`;
        
        console.log('📱 Menú abierto - scroll bloqueado');
    } else {
        // Cerrando menú
        const scrollY = document.body.style.top;
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        
        if (scrollY) {
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
        
        console.log('📱 Menú cerrado - scroll restaurado');
    }
    
    // Vibración haptic en dispositivos compatibles
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
}

// Configurar navegación suave
function setupNavigation() {
    console.log('🧭 Configurando navegación...');
    
    // Smooth scroll para enlaces internos
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Cerrar menú si está abierto
                if (isMenuOpen) {
                    toggleMenu();
                    // Esperar a que se cierre el menú
                    setTimeout(() => {
                        smoothScrollTo(targetElement);
                    }, 300);
                } else {
                    smoothScrollTo(targetElement);
                }
                
                console.log('🔗 Navegando a:', targetId);
            } else {
                console.log('❌ Elemento no encontrado:', targetId);
            }
        });
    });
    
    console.log('✅ Navegación configurada');
}

// Scroll suave personalizado
function smoothScrollTo(element) {
    const targetPosition = element.offsetTop - (header ? header.offsetHeight : 0);
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let start = null;
    
    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    requestAnimationFrame(animation);
}

// Easing function
function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
}

// Configurar efectos de scroll
function setupScrollEffects() {
    console.log('📜 Configurando efectos de scroll...');
    
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking && !isMenuOpen && !isYoutubeOpen) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });
    
    function updateScrollEffects() {
        const currentScrollY = window.scrollY;
        const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
        
        // Actualizar header
        if (header) {
            if (currentScrollY > 50) {
                if (window.innerWidth <= 768) {
                    // Móvil: header más oscuro
                    header.style.background = 'rgba(255, 255, 255, 0.2)';
                    header.style.backdropFilter = 'blur(20px)';
                } else {
                    // Desktop: efecto original
                    header.style.background = 'rgba(0, 0, 0, 0.95)';
                    header.style.backdropFilter = 'blur(15px)';
                }
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                if (window.innerWidth <= 768) {
                    // Móvil: header semi-transparente
                    header.style.background = 'rgba(255, 255, 255, 0.1)';
                    header.style.backdropFilter = 'blur(15px)';
                } else {
                    // Desktop: estilo original
                    header.style.background = 'rgba(0, 0, 0, 0.85)';
                    header.style.backdropFilter = 'blur(5px)';
                }
                header.style.boxShadow = 'none';
            }
            
            // Auto-hide header en móvil al hacer scroll down
            if (window.innerWidth <= 768 && !isYoutubeOpen) {
                if (scrollDirection === 'down' && currentScrollY > 200) {
                    header.style.transform = 'translateY(-100%)';
                } else if (scrollDirection === 'up' || currentScrollY < 200) {
                    header.style.transform = 'translateY(0)';
                }
            }
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
}

// Optimizaciones específicas para móvil
function setupMobileOptimizations() {
    console.log('📱 Configurando optimizaciones móviles...');
    
    // Detectar dispositivo móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
        console.log('📱 Dispositivo móvil detectado');
        
        // Optimizaciones para iOS
        if (isIOS) {
            document.body.classList.add('ios-device');
            
            // Fix para el viewport height en iOS
            const setVH = () => {
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            };
            
            setVH();
            window.addEventListener('resize', debounce(setVH, 250));
        }
    }
    
    // Performance optimizations
    if ('requestIdleCallback' in window) {
        requestIdleCallback(function() {
            // Preload crítico
            const criticalImages = document.querySelectorAll('img[src*="PORTADA"], img[src*="LOGO"]');
            criticalImages.forEach(img => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = img.src;
                document.head.appendChild(link);
            });
        });
    }
    
    console.log('✅ Optimizaciones móviles configuradas');
}

// Forzar reproducción con interacción del usuario (SOLO DESKTOP)
function forceVideoPlay() {
    if (userHasInteracted || isMobileView) return;
    
    userHasInteracted = true;
    console.log('👆 Usuario interactuó en desktop, forzando reproducción de videos...');
    
    // Video principal (solo en desktop)
    if (video && video.paused && !isMobileView) {
        playVideoSafely(video);
    }
    
    // Video de historia
    if (historyVideo && historyVideo.paused) {
        playVideoSafely(historyVideo);
    }
}

// Escuchar primera interacción del usuario (solo desktop)
const interactionEvents = ['click', 'touchstart', 'keydown', 'mousemove'];
interactionEvents.forEach(event => {
    document.addEventListener(event, forceVideoPlay, { once: true, passive: true });
});

// Funciones de utilidad
function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        if (isMenuOpen) {
            toggleMenu();
            setTimeout(() => {
                smoothScrollTo(section);
            }, 300);
        } else {
            smoothScrollTo(section);
        }
    }
}

function checkVideoStatus() {
    console.log('📊 Estado detallado del sistema:');
    
    if (video) {
        console.log('📹 Video principal:', {
            paused: video.paused,
            currentTime: video.currentTime.toFixed(2),
            duration: video.duration ? video.duration.toFixed(2) : 'N/A',
            readyState: video.readyState,
            networkState: video.networkState,
            visible: video.style.display !== 'none',
            muted: video.muted,
            loop: video.loop,
            isPlaying: isVideoPlaying,
            disabled: isMobileView ? 'SÍ (móvil)' : 'NO (desktop)'
        });
    } else {
        console.log('❌ Video principal no encontrado');
    }
    
    if (historyVideo) {
        console.log('🌤️ Video historia:', {
            paused: historyVideo.paused,
            currentTime: historyVideo.currentTime.toFixed(2),
            duration: historyVideo.duration ? historyVideo.duration.toFixed(2) : 'N/A',
            readyState: historyVideo.readyState,
            networkState: historyVideo.networkState,
            muted: historyVideo.muted,
            loop: historyVideo.loop
        });
    } else {
        console.log('❌ Video de historia no encontrado');
    }
    
    console.log('🎛️ Estado del sistema:', {
        menuOpen: isMenuOpen,
        userInteracted: userHasInteracted,
        videoPlaying: isVideoPlaying,
        screenWidth: window.innerWidth,
        isMobile: isMobileView,
        youtubeOpen: isYoutubeOpen,
        deviceMode: isMobileView ? 'MÓVIL (miniatura + YouTube pequeño)' : 'DESKTOP (video de fondo)'
    });
}

function forceMenuClose() {
    if (isMenuOpen) {
        toggleMenu();
    }
}

function restartVideos() {
    console.log('🔄 Reiniciando videos...');
    
    if (video && !isMobileView) {
        video.currentTime = 0;
        playVideoSafely(video);
    }
    
    if (historyVideo) {
        historyVideo.currentTime = 0;
        playVideoSafely(historyVideo);
    }
}

function toggleVideoPlayback() {
    if (video && !isMobileView) {
        if (video.paused) {
            playVideoSafely(video);
        } else {
            video.pause();
        }
    } else {
        console.log('⚠️ Video playback no disponible en móvil');
    }
}

// Utility function: debounce
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Manejo de errores globales
window.addEventListener('error', function(e) {
    console.log('❌ Error global capturado:', e.error);
});

// Cleanup al salir de la página
window.addEventListener('beforeunload', function() {
    if (video && !isMobileView) video.pause();
    if (historyVideo) historyVideo.pause();
    if (isYoutubeOpen) closeYoutubeVideoSmall();
});

// Exponer API pública
window.PRD = {
    // Funciones de video
    checkVideoStatus: checkVideoStatus,
    forceVideoPlay: forceVideoPlay,
    restartVideos: restartVideos,
    toggleVideoPlayback: toggleVideoPlayback,
    
    // Funciones de navegación
    showSection: showSection,
    toggleMenu: toggleMenu,
    forceMenuClose: forceMenuClose,
    
    // Funciones YouTube
    openYoutubeVideo: openYoutubeVideoSmall,
    closeYoutubeVideo: closeYoutubeVideoSmall,
    
    // Estado
    get isMenuOpen() { return isMenuOpen; },
    get userHasInteracted() { return userHasInteracted; },
    get isVideoPlaying() { return isVideoPlaying; },
    get isMobile() { return isMobileView; },
    get isYoutubeOpen() { return isYoutubeOpen; },
    
    // Utilidades
    debounce: debounce
};

// Información de debug
console.log('📚 API PRD disponible en window.PRD');
console.log('🔧 Funciones disponibles:', Object.keys(window.PRD));
console.log('🎮 Comandos útiles:');
console.log('  - PRD.checkVideoStatus() - Ver estado completo del sistema');
console.log('  - PRD.restartVideos() - Reiniciar videos (solo desktop)');
console.log('  - PRD.toggleVideoPlayback() - Play/Pause video (solo desktop)');
console.log('  - PRD.openYoutubeVideo() - Abrir YouTube pequeño (solo móvil)');
console.log('  - PRD.closeYoutubeVideo() - Cerrar YouTube pequeño');
console.log('  - PRD.forceMenuClose() - Cerrar menú forzado');

// Easter egg
console.log('🌟 PRD Digital Zacatecas - Sistema Dual Optimizado');
console.log('🖥️ Desktop: Video de fondo | 📱 Móvil: Miniatura + YouTube en ventana pequeña');
console.log('🚀 ¡Ahora con video pequeño como el PRI!');