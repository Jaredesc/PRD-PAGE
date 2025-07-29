// Variables principales
const video = document.getElementById('bgVideo');
const historyVideo = document.getElementById('historyVideo');
const backup = document.querySelector('.backup-background');
const loading = document.getElementById('loading');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const header = document.querySelector('.header');
const playButton = document.getElementById('playButton');

// Variables de estado
let userHasInteracted = false;
let isMenuOpen = false;
let isVideoPlaying = false;
let lastScrollY = window.scrollY;

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 PRD Digital Zacatecas - Estilo Oficial iniciando...');
    
    // Inicializar componentes
    setupVideo();
    setupHistoryVideo();
    setupHamburgerMenu();
    setupNavigation();
    setupScrollEffects();
    setupPlayButton();
    setupMobileOptimizations();
    
    console.log('✅ Todos los componentes inicializados');
});

// Configurar video principal
function setupVideo() {
    if (!video) {
        console.log('❌ Video principal no encontrado');
        return;
    }

    console.log('🎥 Configurando video principal...');

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
        
        // Ocultar backup
        if (backup) {
            backup.style.opacity = '0';
            setTimeout(() => {
                backup.style.display = 'none';
            }, 1000);
        }
        
        // Ocultar loading
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.style.display = 'none';
            }, 500);
        }
        
        // Intentar reproducir automáticamente
        playVideoSafely(video);
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
        updatePlayButton();
    });

    video.addEventListener('pause', function() {
        isVideoPlaying = false;
        updatePlayButton();
    });

    // Forzar carga inicial
    video.load();
}

// Configurar video de historia
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
    
    // Eventos del video de historia
    historyVideo.addEventListener('canplay', function() {
        console.log('✅ Video de historia listo');
        playVideoSafely(historyVideo);
    });

    historyVideo.addEventListener('loadeddata', function() {
        console.log('✅ Video de historia cargado');
        playVideoSafely(historyVideo);
    });

    historyVideo.addEventListener('error', function(e) {
        console.log('❌ Error en video de historia:', e);
        handleVideoError('historia');
    });

    historyVideo.addEventListener('ended', function() {
        historyVideo.currentTime = 0;
        playVideoSafely(historyVideo);
    });

    // Prevenir menú contextual
    historyVideo.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Forzar carga
    historyVideo.load();
}

// Configurar botón de reproducción
function setupPlayButton() {
    if (!playButton) {
        console.log('❌ Botón de play no encontrado');
        return;
    }

    console.log('▶️ Configurando botón de play...');

    // Click en botón de reproducción
    playButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('🖱️ Botón de play clickeado');
        
        if (video) {
            if (video.paused) {
                // Reproducir video
                playVideoSafely(video);
                // Efecto visual del botón
                playButton.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    playButton.style.transform = '';
                }, 150);
            } else {
                // Pausar video
                video.pause();
            }
        }
        
        // Asegurar interacción del usuario
        if (!userHasInteracted) {
            forceVideoPlay();
        }
    });

    // Hover effects en desktop
    if (window.innerWidth > 768) {
        playButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });

        playButton.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    }

    console.log('✅ Botón de play configurado');
}

// Actualizar estado visual del botón de play
function updatePlayButton() {
    if (!playButton) return;

    if (isVideoPlaying) {
        // Cambiar a icono de pausa
        playButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 4H10V20H6V4ZM14 4H18V20H14V4Z" fill="currentColor"/>
            </svg>
        `;
        playButton.style.background = 'rgba(255, 255, 255, 0.9)';
    } else {
        // Cambiar a icono de play
        playButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
            </svg>
        `;
        playButton.style.background = 'rgba(255, 255, 255, 0.9)';
    }
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
                    updatePlayButton();
                }
            })
            .catch(error => {
                console.log(`⚠️ Autoplay bloqueado para ${videoElement.id}:`, error);
                if (videoElement === video) {
                    isVideoPlaying = false;
                    updatePlayButton();
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
        
        // Mostrar backup
        if (backup) {
            backup.style.display = 'block';
            backup.style.opacity = '1';
        }
    }
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
        if (e.key === 'Escape' && isMenuOpen) {
            console.log('⌨️ Escape presionado, cerrando menú');
            toggleMenu();
        }
    });

    // Redimensionar ventana
    window.addEventListener('resize', debounce(function() {
        if (window.innerWidth > 768 && isMenuOpen) {
            console.log('📏 Ventana redimensionada a desktop, cerrando menú');
            toggleMenu();
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
        if (!ticking && !isMenuOpen) {
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
                header.style.background = 'rgba(255, 255, 255, 0.25)';
                header.style.backdropFilter = 'blur(20px)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.1)';
                header.style.backdropFilter = 'blur(10px)';
                header.style.boxShadow = 'none';
            }
            
            // Auto-hide header en móvil al hacer scroll down
            if (window.innerWidth <= 768) {
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
            const criticalImages = document.querySelectorAll('img[src*="PORTADA"]');
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

// Forzar reproducción con interacción del usuario
function forceVideoPlay() {
    if (userHasInteracted) return;
    
    userHasInteracted = true;
    console.log('👆 Usuario interactuó, forzando reproducción de videos...');
    
    // Video principal
    if (video && video.paused) {
        playVideoSafely(video);
    }
    
    // Video de historia
    if (historyVideo && historyVideo.paused) {
        playVideoSafely(historyVideo);
    }
}

// Escuchar primera interacción del usuario
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
    console.log('📊 Estado detallado de los videos:');
    
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
            isPlaying: isVideoPlaying
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
        videoPlaying: isVideoPlaying
    });
}

function forceMenuClose() {
    if (isMenuOpen) {
        toggleMenu();
    }
}

function restartVideos() {
    console.log('🔄 Reiniciando videos...');
    
    if (video) {
        video.currentTime = 0;
        playVideoSafely(video);
    }
    
    if (historyVideo) {
        historyVideo.currentTime = 0;
        playVideoSafely(historyVideo);
    }
}

function toggleVideoPlayback() {
    if (video) {
        if (video.paused) {
            playVideoSafely(video);
        } else {
            video.pause();
        }
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
    if (video) video.pause();
    if (historyVideo) historyVideo.pause();
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
    
    // Estado
    get isMenuOpen() { return isMenuOpen; },
    get userHasInteracted() { return userHasInteracted; },
    get isVideoPlaying() { return isVideoPlaying; },
    
    // Utilidades
    debounce: debounce
};

// Información de debug
console.log('📚 API PRD disponible en window.PRD');
console.log('🔧 Funciones disponibles:', Object.keys(window.PRD));
console.log('🎮 Comandos útiles:');
console.log('  - PRD.checkVideoStatus() - Ver estado de videos');
console.log('  - PRD.restartVideos() - Reiniciar videos');
console.log('  - PRD.toggleVideoPlayback() - Play/Pause video');
console.log('  - PRD.forceMenuClose() - Cerrar menú forzado');

// Easter egg
console.log('🌟 PRD Digital Zacatecas - Estilo Oficial');
console.log('🚀 ¡El futuro de la política digital está aquí!');