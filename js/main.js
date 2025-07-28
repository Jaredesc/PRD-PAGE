// NUEVO: Función mejorada para toggle del menú hamburger
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
        console.error('❌ Elementos hamburger o navMenu no encontrados');
        console.log('hamburger:', hamburger);
        console.log('navMenu:', navMenu);
    }
}

// NUEVO: Función mejorada para inicializar hamburger
function initializeHamburgerMenu() {
    console.log('🔍 Buscando elementos del menú...');
    console.log('hamburger element:', document.getElementById('hamburger'));
    console.log('navMenu element:', document.getElementById('navMenu'));
    
    if (hamburger && navMenu) {
        console.log('✅ Elementos encontrados, configurando eventos...');
        
        // Clic en hamburger
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ Click en hamburger detectado');
            toggleHamburgerMenu();
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