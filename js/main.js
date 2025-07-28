// Variables principales
const video = document.getElementById('bgVideo');
const historyVideo = document.getElementById('historyVideo');
const backup = document.querySelector('.backup-background');
const loading = document.getElementById('loading');

// Variables para el menú hamburger
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// Flags para evitar múltiples inicializaciones
let videoInitialized = false;
let historyVideoInitialized = false;
let hamburgerInitialized = false;

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (!videoInitialized) initializeVideo();
    if (!historyVideoInitialized) initializeHistoryVideo();
    initializeNavigation();
    if (!hamburgerInitialized) initializeHamburgerMenu();
    console.log('🎬 PRD Digital Zacatecas cargado');
});

// Inicializar video de fondo principal
function initializeVideo() {
    if (!video || videoInitialized) return;
    videoInitialized = true;

    console.log('🎥 Inicializando video principal...');

    // Evento de carga exitosa
    video.onloadeddata = function() {
        console.log('✅ Video principal cargado');
        video.style.display = 'block';
        if (backup) backup.style.display = 'none';
        if (loading) loading.style.display = 'none';
        
        // Intentar reproducir
        video.play().catch(e => {
            console.log('⚠️ Autoplay falló, se necesita interacción del usuario');
        });
    };

    // Evento de error
    video.onerror = function() {
        console.log('❌ Error cargando video principal');
        if (loading) {
            loading.innerHTML = '⚠️ Usando fondo animado';
            setTimeout(() => loading.style.display = 'none', 2000);
        }
    };

    // Asegurar loop
    video.onended = function() {
        video.currentTime = 0;
        video.play().catch(e => console.log('Error en loop:', e));
    };
}

// Inicializar video de historia
function initializeHistoryVideo() {
    if (!historyVideo || historyVideoInitialized) return;
    historyVideoInitialized = true;

    console.log('🌤️ Inicializando video de historia...');

    // Configurar propiedades anti-controles
    historyVideo.controls = false;
    historyVideo.disablePictureInPicture = true;
    historyVideo.setAttribute('controlslist', 'nodownload nofullscreen noremoteplayback');

    // Evento de carga exitosa
    historyVideo.onloadeddata = function() {
        console.log('✅ Video de historia cargado');
        historyVideo.play().catch(e => {
            console.log('⚠️ Autoplay historia falló');
        });
    };

    // Evento de error
    historyVideo.onerror = function() {
        console.log('❌ Error cargando video de historia');
    };

    // Asegurar loop
    historyVideo.onended = function() {
        historyVideo.currentTime = 0;
        historyVideo.play().catch(e => console.log('Error en loop historia:', e));
    };

    // Prevenir menú contextual
    historyVideo.oncontextmenu = function(e) {
        e.preventDefault();
        return false;
    };
}

// Inicializar navegación
function initializeNavigation() {
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.onclick = function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Cerrar menú móvil si está abierto
                if (navMenu && navMenu.classList.contains('active')) {
                    toggleHamburgerMenu();
                }
            }
        };
    });

    // Efecto de cambio de fondo del header al hacer scroll
    let ticking = false;
    window.onscroll = function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                const header = document.querySelector('.header');
                if (header) {
                    if (window.scrollY > 50) {
                        header.style.background = 'rgba(0, 0, 0, 0.98)';
                    } else {
                        header.style.background = 'rgba(0, 0, 0, 0.85)';
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    };
}

// Inicializar menú hamburger
function initializeHamburgerMenu() {
    if (!hamburger || !navMenu || hamburgerInitialized) return;
    hamburgerInitialized = true;

    console.log('🍔 Inicializando menú hamburger...');
    
    // Clic en hamburger
    hamburger.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleHamburgerMenu();
    };
    
    // Cerrar menú al hacer clic en enlaces
    navMenu.querySelectorAll('a').forEach(link => {
        link.onclick = function() {
            if (navMenu.classList.contains('active')) {
                toggleHamburgerMenu();
            }
        };
    });
    
    // Cerrar menú al hacer clic fuera
    document.onclick = function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            if (navMenu.classList.contains('active')) {
                toggleHamburgerMenu();
            }
        }
    };
    
    // Cerrar menú al redimensionar ventana
    window.onresize = function() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            toggleHamburgerMenu();
        }
    };
    
    console.log('✅ Menú hamburger inicializado');
}

// Toggle del menú hamburger
function toggleHamburgerMenu() {
    if (!hamburger || !navMenu) return;
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Controlar scroll del body
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
        console.log('📱 Menú abierto');
    } else {
        document.body.style.overflow = 'auto';
        console.log('📱 Menú cerrado');
    }
}

// Forzar reproducción con interacción del usuario (UNA SOLA VEZ)
let userInteracted = false;
function forcePlayVideos() {
    if (userInteracted) return;
    userInteracted = true;

    console.log('👆 Interacción del usuario detectada');
    
    // Video principal
    if (video && video.paused) {
        video.play().then(() => {
            console.log('✅ Video principal iniciado por usuario');
        }).catch(e => {
            console.log('❌ Error reproduciendo video principal:', e);
        });
    }
    
    // Video de historia
    if (historyVideo && historyVideo.paused) {
        historyVideo.play().then(() => {
            console.log('✅ Video historia iniciado por usuario');
        }).catch(e => {
            console.log('❌ Error reproduciendo video historia:', e);
        });
    }
}

// Event listeners para interacción del usuario (UNA SOLA VEZ)
document.addEventListener('click', forcePlayVideos, { once: true });
document.addEventListener('touchstart', forcePlayVideos, { once: true });

// Funciones para cuando agregues más contenido
function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Función para debug
function checkVideoStatus() {
    if (video) {
        console.log('📹 Video principal:', {
            pausado: video.paused,
            duracion: video.duration,
            tiempo: video.currentTime
        });
    }
    
    if (historyVideo) {
        console.log('🌤️ Video historia:', {
            pausado: historyVideo.paused,
            duracion: historyVideo.duration,
            tiempo: historyVideo.currentTime
        });
    }
}

// Exponer funciones útiles globalmente
window.PRD = {
    showSection,
    checkVideoStatus,
    forcePlayVideos,
    toggleHamburgerMenu
};