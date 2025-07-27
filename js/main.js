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
    video.addEventListener('loadeddata', function() {
        console.log('✅ Video de fondo principal cargado');
        video.style.display = 'block';
        backup.style.display = 'none';
        loading.style.display = 'none';
        
        video.play().catch(e => {
            console.log('Autoplay falló:', e);
            console.log('🖱️ Se necesita interacción del usuario');
        });
    });

    video.addEventListener('error', function() {
        console.log('❌ Error en video principal, usando backup dorado');
        loading.innerHTML = '⚠️ Usando fondo animado';
        setTimeout(() => loading.style.display = 'none', 2000);
    });

    // Asegurar que el video se mantenga en loop
    video.addEventListener('ended', function() {
        video.currentTime = 0;
        video.play();
    });
}

// Inicializar video de fondo de la sección Historia
function initializeHistoryVideo() {
    if (historyVideo) {
        historyVideo.addEventListener('loadeddata', function() {
            console.log('✅ Video de historia (nubes) cargado');
            
            historyVideo.play().catch(e => {
                console.log('Autoplay del video de historia falló:', e);
                console.log('🖱️ Se necesita interacción del usuario para video de historia');
            });
        });

        historyVideo.addEventListener('error', function() {
            console.log('❌ Error en video de historia');
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
    }
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
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleHamburgerMenu);
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                if (navMenu.classList.contains('active')) {
                    toggleHamburgerMenu();
                }
            }
        });
        
        // Cerrar menú al redimensionar ventana
        window.addEventListener('resize', function() {
            if (window.innerWidth > 600 && navMenu.classList.contains('active')) {
                toggleHamburgerMenu();
            }
        });
    }
}

// Toggle del menú hamburger
function toggleHamburgerMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevenir scroll del body cuando el menú está abierto
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Forzar reproducción de ambos videos con interacción del usuario
function forcePlayVideos() {
    // Video principal
    if (video.paused) {
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
document.addEventListener('click', forcePlayVideos);
document.addEventListener('keydown', forcePlayVideos);

// Funciones para cuando agregues más contenido
function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Función para debug - puedes eliminarla después
function checkVideoStatus() {
    console.log('📹 Estado del video principal:');
    console.log('- Pausado:', video.paused);
    console.log('- Duración:', video.duration);
    console.log('- Tiempo actual:', video.currentTime);
    console.log('- Volumen:', video.volume);
    console.log('- Muted:', video.muted);
    
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