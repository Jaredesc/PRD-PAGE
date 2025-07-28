// Variables principales
const video = document.getElementById('bgVideo');
const historyVideo = document.getElementById('historyVideo');
const backup = document.querySelector('.backup-background');
const loading = document.getElementById('loading');

// Variables para el menú hamburger
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeVideo();
    initializeHistoryVideo();
    initializeNavigation();
    initializeHamburgerMenu();
    console.log('🎬 PRD Digital Zacatecas cargado');
});

// Inicializar video de fondo principal
function initializeVideo() {
    if (!video) {
        console.log('❌ Video principal no encontrado');
        return;
    }

    video.addEventListener('loadeddata', function() {
        console.log('✅ Video de fondo principal cargado');
        video.style.display = 'block';
        backup.style.display = 'none';
        loading.style.display = 'none';
        
        // Forzar reproducción
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('✅ Video principal reproduciéndose');
            }).catch(error => {
                console.log('⚠️ Autoplay falló, necesita interacción:', error);
            });
        }
    });

    video.addEventListener('error', function(e) {
        console.log('❌ Error en video principal:', e);
        console.log('🖱️ Usando fondo dorado de respaldo');
        loading.innerHTML = '⚠️ Usando fondo animado';
        setTimeout(() => loading.style.display = 'none', 2000);
    });

    // Asegurar que el video se mantenga en loop
    video.addEventListener('ended', function() {
        video.currentTime = 0;
        video.play();
    });

    // Forzar carga del video
    video.load();
}

// Inicializar video de fondo de la sección Historia
function initializeHistoryVideo() {
    if (!historyVideo) {
        console.log('❌ Video de historia no encontrado');
        return;
    }

    historyVideo.addEventListener('loadeddata', function() {
        console.log('✅ Video de historia (nubes) cargado');
        
        // Forzar reproducción
        const playPromise = historyVideo.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('✅ Video de historia reproduciéndose');
            }).catch(error => {
                console.log('⚠️ Autoplay de historia falló:', error);
            });
        }
    });

    historyVideo.addEventListener('error', function(e) {
        console.log('❌ Error en video de historia:', e);
        // Fallback: mantener el overlay con fondo oscuro
        const overlay = document.querySelector('.history-video-overlay');
        if (overlay) {
            overlay.style.background = 'rgba(51, 51, 51, 0.9)';
        }
    });

    // Asegurar que el video se mantenga en loop
    historyVideo.addEventListener('ended', function() {
        historyVideo.currentTime = 0;
        historyVideo.play();
    });

    // Desactivar completamente los controles
    historyVideo.controls = false;
    historyVideo.disablePictureInPicture = true;
    historyVideo.setAttribute('controlslist', 'nodownload nofullscreen noremoteplayback');
    
    // Prevenir click derecho en el video
    historyVideo.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Forzar carga del video
    historyVideo.load();
}

// Inicializar navegación
function initializeNavigation() {
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
        });
    });

    // Efecto de cambio de fondo del header al hacer scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.background = 'rgba(0, 0, 0, 0.98)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.85)';
        }
    });
}

// Inicializar menú hamburger
function initializeHamburgerMenu() {
    console.log('🔍 Buscando elementos del menú hamburger...');
    console.log('Hamburger element:', hamburger);
    console.log('NavMenu element:', navMenu);

    if (hamburger && navMenu) {
        console.log('✅ Elementos encontrados, configurando eventos...');
        
        // Clic en hamburger
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ Click en hamburger detectado');
            toggleHamburgerMenu();
        });
        
        // Cerrar menú al hacer clic en enlaces
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                if (navMenu.classList.contains('active')) {
                    console.log('🔗 Enlace clickeado, cerrando menú');
                    toggleHamburgerMenu();
                }
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                if (navMenu.classList.contains('active')) {
                    console.log('🖱️ Click fuera del menú, cerrando...');
                    toggleHamburgerMenu();
                }
            }
        });
        
        // Cerrar menú al redimensionar ventana
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                console.log('📏 Ventana redimensionada, cerrando menú...');
                toggleHamburgerMenu();
            }
        });
        
        console.log('🍔 Menú hamburger inicializado correctamente');
    } else {
        console.error('❌ No se pudieron encontrar los elementos del menú hamburger');
        console.log('Verificar que existan elementos con ID: hamburger y navMenu');
    }
}

// Toggle del menú hamburger
function toggleHamburgerMenu() {
    console.log('🍔 Toggle menú hamburger activado');
    
    if (hamburger && navMenu) {
        // Toggle clases
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Log para debug
        console.log('Hamburger active:', hamburger.classList.contains('active'));
        console.log('NavMenu active:', navMenu.classList.contains('active'));
        
        // Prevenir scroll del body cuando el menú está abierto
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            console.log('📱 Menú móvil ABIERTO');
        } else {
            document.body.style.overflow = 'auto';
            console.log('📱 Menú móvil CERRADO');
        }
    } else {
        console.error('❌ Elementos hamburger o navMenu no encontrados en toggle');
    }
}

// Forzar reproducción de ambos videos con interacción del usuario
function forcePlayVideos() {
    // Video principal
    if (video && video.paused) {
        video.play().then(() => {
            console.log('✅ Video principal iniciado por interacción del usuario');
        }).catch(e => {
            console.log('❌ No se pudo reproducir el video principal:', e);
        });
    }
    
    // Video de historia
    if (historyVideo && historyVideo.paused) {
        historyVideo.play().then(() => {
            console.log('✅ Video de historia iniciado por interacción del usuario');
        }).catch(e => {
            console.log('❌ No se pudo reproducir el video de historia:', e);
        });
    }
}

// Event listeners para interacción del usuario
document.addEventListener('click', forcePlayVideos, { once: true });
document.addEventListener('touchstart', forcePlayVideos, { once: true });
document.addEventListener('keydown', forcePlayVideos, { once: true });

// Funciones para cuando agregues más contenido
function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Función para debug - puedes eliminarla después
function checkVideoStatus() {
    if (video) {
        console.log('📹 Estado del video principal:');
        console.log('- Pausado:', video.paused);
        console.log('- Duración:', video.duration);
        console.log('- Tiempo actual:', video.currentTime);
        console.log('- Volumen:', video.volume);
        console.log('- Muted:', video.muted);
    }
    
    if (historyVideo) {
        console.log('🌤️ Estado del video de historia:');
        console.log('- Pausado:', historyVideo.paused);
        console.log('- Duración:', historyVideo.duration);
        console.log('- Tiempo actual:', historyVideo.currentTime);
        console.log('- Volumen:', historyVideo.volume);
        console.log('- Muted:', historyVideo.muted);
    }
}

// Función para pausar/reproducir video de historia cuando sea visible
function handleHistoryVideoVisibility() {
    if (!historyVideo) return;
    
    const historySection = document.getElementById('historia');
    if (!historySection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // La sección está visible, reproducir video
                historyVideo.play().catch(e => {
                    console.log('No se pudo reproducir video de historia automáticamente');
                });
            } else {
                // La sección no está visible, pausar video para ahorrar recursos
                historyVideo.pause();
            }
        });
    }, {
        threshold: 0.1 // Activar cuando al menos 10% de la sección esté visible
    });
    
    observer.observe(historySection);
}

// Inicializar observador de visibilidad cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Esperar un poco para que todos los elementos estén listos
    setTimeout(handleHistoryVideoVisibility, 1000);
});

// Exponer funciones útiles globalmente
window.PRD = {
    showSection,
    checkVideoStatus,
    forcePlayVideos,
    toggleHamburgerMenu
};