// Variables globales
let isMenuOpen = false;
let isMobile = false;
let isInitialized = false;
let videoPlayAttempts = 0;
let maxVideoAttempts = 10;

// Detectar si el usuario está en móvil
function detectMobile() {
    try {
        if (typeof window === 'undefined') return true;
        
        const userAgent = navigator.userAgent || '';
        const isMobileUA = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const isSmallScreen = window.innerWidth <= 768;
        
        return isMobileUA || isSmallScreen;
    } catch (e) {
        console.log('Error detectando dispositivo, asumiendo movil:', e);
        return true;
    }
}

// Intentar reproducir el video, solo en desktop
function forceVideoPlay(video, videoName = 'video') {
    if (isMobile || !video) return;
    
    try {
        video.muted = true;
        video.loop = true;
        video.autoplay = true;
        video.playsInline = true;
        
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    video.style.display = 'block';
                    
                    const backup = document.querySelector('.backup-background');
                    if (backup && videoName === 'video principal') {
                        backup.style.display = 'none';
                    }
                })
                .catch(error => {
                    console.log('Autoplay bloqueado para ' + videoName + ':', error.message);
                    
                    if (videoPlayAttempts < maxVideoAttempts) {
                        videoPlayAttempts++;
                        setTimeout(() => {
                            forceVideoPlay(video, videoName);
                        }, 1000);
                    } else {
                        setupClickToPlay(video, videoName);
                    }
                });
        }
    } catch (error) {
        console.log('Error configurando video:', error);
    }
}

// Fallback: reproducir al hacer click
function setupClickToPlay(video, videoName) {
    if (isMobile) return;
    
    showVideoClickIndicator();
    
    const playOnClick = () => {
        try {
            video.play().then(() => {
                hideVideoClickIndicator();
                
                const backup = document.querySelector('.backup-background');
                if (backup && videoName === 'video principal') {
                    backup.style.display = 'none';
                }
                
                document.removeEventListener('click', playOnClick);
                document.removeEventListener('keydown', playOnKeyDown);
                document.removeEventListener('touchstart', playOnClick);
            });
        } catch (e) {
            console.log('Error reproduciendo video por click:', e);
        }
    };
    
    const playOnKeyDown = (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
            playOnClick();
        }
    };
    
    document.addEventListener('click', playOnClick, { once: true });
    document.addEventListener('keydown', playOnKeyDown, { once: true });
    document.addEventListener('touchstart', playOnClick, { once: true });
}

function showVideoClickIndicator() {
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
                Haz click para activar videos
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

// Configurar videos de fondo en desktop
function setupDesktopWithAutoplay() {
    try {
        const video = document.getElementById('bgVideo');
        if (video) {
            video.addEventListener('loadeddata', () => {
                forceVideoPlay(video, 'video principal');
            });
            
            video.addEventListener('canplay', () => {
                forceVideoPlay(video, 'video principal');
            });
            
            video.addEventListener('error', (e) => {
                console.log('Error cargando video principal:', e);
                const backup = document.querySelector('.backup-background');
                if (backup) backup.style.display = 'block';
            });
            
            video.muted = true;
            video.loop = true;
            video.autoplay = true;
            video.playsInline = true;
            video.preload = 'auto';
            
            if (video.readyState >= 3) {
                forceVideoPlay(video, 'video principal');
            } else {
                video.load();
            }
        }
        
        const historyVideo = document.getElementById('historyVideo');
        if (historyVideo) {
            historyVideo.muted = true;
            historyVideo.loop = true;
            historyVideo.autoplay = true;
            historyVideo.playsInline = true;
            historyVideo.preload = 'metadata';
            
            // Solo reproducir cuando sea visible en pantalla
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
        
        // Si despues de un segundo sigue pausado, reintentar
        setTimeout(() => {
            if (video && video.paused) {
                forceVideoPlay(video, 'video principal');
            }
        }, 1000);
        
    } catch (error) {
        console.log('Error en configuracion desktop:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (isInitialized) return;
    
    try {
        isMobile = detectMobile();
        
        setupBasicSafety();
        
        if (isMobile) {
            setupMobileSafe();
        } else {
            setupDesktopWithAutoplay();
        }
        
        setupMenuSafe();
        setupYouTubeButtonSafe();
        setupNavigationSafe();
        
        isInitialized = true;
        
    } catch (error) {
        console.log('Error en inicializacion:', error);
        setupEmergencyMode();
    }
});

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
        
    } catch (e) {
        console.log('Error en configuracion basica:', e);
    }
}

// En movil quitamos los videos para no gastar datos ni CPU
function setupMobileSafe() {
    try {
        const allVideos = document.querySelectorAll('video');
        allVideos.forEach(video => {
            try {
                video.pause();
                video.remove();
            } catch (e) {
                // ya estaba removido
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
        
    } catch (error) {
        console.log('Error en configuracion movil:', error);
    }
}

function setupYouTubeButtonSafe() {
    try {
        const btn = document.getElementById('mobilePlayBtn');
        if (!btn) return;
        
        btn.onclick = null;
        
        btn.addEventListener('click', function(e) {
            try {
                e.preventDefault();
                e.stopPropagation();
                
                const youtubeUrl = 'https://www.youtube.com/watch?v=2YhaGWompwU';
                
                if (window.open) {
                    window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
                } else {
                    location.href = youtubeUrl;
                }
                
            } catch (error) {
                console.log('Error abriendo YouTube:', error);
                try {
                    location.href = 'https://www.youtube.com/watch?v=2YhaGWompwU';
                } catch (e) {
                    console.log('Error total en YouTube');
                }
            }
        });
        
    } catch (error) {
        console.log('Error configurando boton YouTube:', error);
    }
}

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
                    console.log('Error en navegacion:', error);
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
        
    } catch (error) {
        console.log('Error en navegacion:', error);
    }
}

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
        
    } catch (error) {
        console.log('Error en scroll:', error);
    }
}

function setupMenuSafe() {
    try {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        if (!hamburger || !navMenu) return;
        
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenuSafe();
        });
        
        // Cerrar menu al hacer click fuera
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
        
    } catch (error) {
        console.log('Error configurando menu:', error);
    }
}

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
                } catch (e) {}
            }
        } else {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            if (isMobile) {
                try {
                    document.body.style.overflow = '';
                } catch (e) {}
            }
        }
        
    } catch (error) {
        console.log('Error en toggle menu:', error);
    }
}

// Plan B si todo lo demas falla
function setupEmergencyMode() {
    try {
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
        
    } catch (error) {
        console.log('Error critico en modo emergencia:', error);
    }
}

window.addEventListener('resize', function() {
    try {
        clearTimeout(window.resizeTimeout);
        window.resizeTimeout = setTimeout(function() {
            const wasMobile = isMobile;
            isMobile = detectMobile();
            
            if (wasMobile !== isMobile) {
                setTimeout(() => {
                    try {
                        if (isMobile) {
                            setupMobileSafe();
                        } else {
                            setupDesktopWithAutoplay();
                        }
                    } catch (e) {
                        console.log('Error en reconfiguracion:', e);
                    }
                }, 200);
            }
        }, 250);
        
    } catch (error) {
        console.log('Error en resize:', error);
    }
});

// Revisar cada 5 segundos si los videos siguen corriendo
if (!isMobile) {
    setInterval(() => {
        try {
            const video = document.getElementById('bgVideo');
            const historyVideo = document.getElementById('historyVideo');
            
            if (video && video.paused && !isMobile) {
                forceVideoPlay(video, 'video principal');
            }
            
            if (historyVideo && historyVideo.paused && !isMobile) {
                forceVideoPlay(historyVideo, 'video historia');
            }
        } catch (e) {
            // silencioso
        }
    }, 5000);
}

// API publica
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
                console.log('Error forzando reproduccion:', e);
            }
        }
    },
    get isMobile() { return isMobile; },
    get isMenuOpen() { return isMenuOpen; },
    get isInitialized() { return isInitialized; }
};

window.scrollToTop = scrollToTopSafe;