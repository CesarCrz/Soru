// ===== CONFIGURACIÓN GLOBAL =====
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar todas las funcionalidades
  initializeCarousel()
  initializeScrollEffects()
  initializeMobileMenu()
  initializeLazyLoading()
  initializeFloatingSocial() // Nueva funcionalidad
  initializeMapsModal() // Nueva funcionalidad
  initializeWhatsAppButton() // Nueva funcionalidad
  initializeBranchStatus() // NUEVA: Estado de sucursales

  console.log("🍣 Sushi Soru - Landing Page cargada correctamente")
})

// ===== NUEVA FUNCIONALIDAD: ESTADO DE SUCURSALES =====
function initializeBranchStatus() {
  // Actualizar estado inmediatamente
  updateBranchStatus()

  // Actualizar cada minuto
  setInterval(updateBranchStatus, 60000)

  console.log("✅ Sistema de estado de sucursales inicializado")
}

function updateBranchStatus() {
  // Obtener hora actual de México (GMT-6)
  const now = new Date()
  const mexicoTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Mexico_City" }))
  const currentHour = mexicoTime.getHours()
  const currentDay = mexicoTime.getDay() // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

  // Verificar si es martes (día 2) - cerrado
  const isTuesday = currentDay === 2

  // Horario: 14:00 (2 PM) a 22:00 (10 PM)
  const isOpen = !isTuesday && currentHour >= 14 && currentHour < 22

  // Actualizar ambas sucursales
  updateBranchStatusDisplay("iteso", isOpen, isTuesday, mexicoTime)
  updateBranchStatusDisplay("tesoro", isOpen, isTuesday, mexicoTime)

  console.log(
    `🕐 Estado actualizado: ${isOpen ? "ABIERTO" : "CERRADO"} - Hora México: ${mexicoTime.toLocaleTimeString("es-MX")}`,
  )
}

function updateBranchStatusDisplay(branchId, isOpen, isTuesday, mexicoTime) {
  const statusElement = document.getElementById(`status-${branchId}`)
  if (!statusElement) return

  const indicator = statusElement.querySelector(".status-indicator")
  const text = statusElement.querySelector(".status-text")

  if (isTuesday) {
    // Cerrado por ser martes
    indicator.className = "status-indicator closed"
    text.textContent = "CERRADO - Martes"
    text.title = "Cerramos todos los martes"
  } else if (isOpen) {
    // Abierto
    indicator.className = "status-indicator open"
    text.textContent = "ABIERTO"
    text.title = `Abierto hasta las 10:00 PM - Hora actual: ${mexicoTime.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}`
  } else {
    // Cerrado por horario
    const currentHour = mexicoTime.getHours()
    let nextOpenTime = ""

    if (currentHour < 14) {
      nextOpenTime = "Abre a las 2:00 PM"
    } else {
      nextOpenTime = "Abre mañana a las 2:00 PM"
    }

    indicator.className = "status-indicator closed"
    text.textContent = "CERRADO"
    text.title = `${nextOpenTime} - Hora actual: ${mexicoTime.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}`
  }
}

// ===== BOTONES FLOTANTES DE REDES SOCIALES =====
function initializeFloatingSocial() {
  const floatingSocial = document.getElementById("floatingSocial")
  const socialMediaSection = document.getElementById("contacto")

  if (!floatingSocial || !socialMediaSection) return

  // Mostrar botones flotantes al hacer scroll
  window.addEventListener(
    "scroll",
    throttle(() => {
      const scrollY = window.scrollY
      const socialMediaTop = socialMediaSection.offsetTop
      const socialMediaBottom = socialMediaTop + socialMediaSection.offsetHeight
      const windowHeight = window.innerHeight

      // Mostrar después de 200px de scroll
      if (scrollY > 200) {
        // Ocultar cuando esté en la sección de redes sociales
        if (scrollY + windowHeight > socialMediaTop && scrollY < socialMediaBottom) {
          floatingSocial.classList.remove("visible")
          floatingSocial.classList.add("hidden")
        } else {
          floatingSocial.classList.add("visible")
          floatingSocial.classList.remove("hidden")
        }
      } else {
        floatingSocial.classList.remove("visible")
        floatingSocial.classList.add("hidden")
      }
    }, 16),
  )

  console.log("✅ Botones flotantes inicializados")
}

// ===== MODAL DE MAPAS =====
function initializeMapsModal() {
  const mapsBtn = document.getElementById("mapsBtn")
  const mapsModal = document.getElementById("mapsModal")
  const mapsModalClose = document.getElementById("mapsModalClose")
  const mapsTabs = document.querySelectorAll(".maps-tab")
  const mapContents = document.querySelectorAll(".map-content")

  if (!mapsBtn || !mapsModal || !mapsModalClose) return

  // Abrir modal
  mapsBtn.addEventListener("click", (e) => {
    e.preventDefault()
    mapsModal.classList.add("active")
    document.body.style.overflow = "hidden"
    trackUserInteraction("open", "maps-modal")
  })

  // Cerrar modal
  mapsModalClose.addEventListener("click", () => {
    mapsModal.classList.remove("active")
    document.body.style.overflow = ""
  })

  // Cerrar modal al hacer click fuera
  mapsModal.addEventListener("click", (e) => {
    if (e.target === mapsModal) {
      mapsModal.classList.remove("active")
      document.body.style.overflow = ""
    }
  })

  // Cerrar modal con tecla Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mapsModal.classList.contains("active")) {
      mapsModal.classList.remove("active")
      document.body.style.overflow = ""
    }
  })

  // Cambiar entre sucursales
  mapsTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const location = tab.dataset.location

      // Actualizar tabs activos
      mapsTabs.forEach((t) => t.classList.remove("active"))
      tab.classList.add("active")

      // Mostrar contenido correspondiente
      mapContents.forEach((content) => {
        content.classList.remove("active")
        if (content.id === `map-${location}`) {
          content.classList.add("active")
        }
      })

      trackUserInteraction("select", `sucursal-${location}`)
    })
  })

  // Inicializar sistema de valoración con estrellas
  initializeStarRating()

  console.log("✅ Modal de mapas con valoración inicializado")
}

// ===== BOTÓN WHATSAPP MEJORADO =====
function initializeWhatsAppButton() {
  const whatsappBtn = document.querySelector(".whatsapp-btn")
  const whatsappText = document.querySelector(".whatsapp-text")

  if (!whatsappBtn || !whatsappText) return

  console.log("✅ Botón WhatsApp mejorado inicializado")
}

// ===== CARRUSEL AUTOMÁTICO DE PLATILLOS CON SCROLL =====
function initializeCarousel() {
  const carouselTrack = document.getElementById("carouselTrack")
  const carouselItems = document.querySelectorAll(".carousel-item")
  const indicatorsContainer = document.getElementById("carouselIndicators")
  const carouselContainer = document.querySelector(".carousel-container")

  if (!carouselTrack || carouselItems.length === 0) return

  let currentIndex = 0
  let isPlaying = true
  let carouselInterval
  let scrollAccumulator = 0
  let isScrolling = false
  let scrollTimeout

  // Configuración responsive del carrusel
  let itemsPerView = getItemsPerView()
  const totalItems = carouselItems.length
  let maxIndex = Math.max(0, totalItems - itemsPerView)

  // Crear indicadores dinámicamente
  createCarouselIndicators()

  // Iniciar carrusel automático
  startCarousel()

  // Event listeners para pausar/reanudar
  carouselContainer.addEventListener("mouseenter", pauseCarousel)
  carouselContainer.addEventListener("mouseleave", resumeCarousel)

  // Event listeners para indicadores
  const indicators = document.querySelectorAll(".carousel-indicator")
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => goToSlide(index))
  })

  // ===== NUEVA FUNCIONALIDAD: CONTROL POR SCROLL =====
  carouselContainer.addEventListener("wheel", handleScrollNavigation, { passive: false })

  // Para dispositivos táctiles
  let touchStartY = 0
  let touchStartX = 0

  carouselContainer.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.touches[0].clientY
      touchStartX = e.touches[0].clientX
    },
    { passive: true },
  )

  carouselContainer.addEventListener(
    "touchmove",
    (e) => {
      if (!touchStartY || !touchStartX) return

      const touchEndY = e.touches[0].clientY
      const touchEndX = e.touches[0].clientX
      const diffY = touchStartY - touchEndY
      const diffX = touchStartX - touchEndX

      // Solo procesar si el movimiento es más horizontal que vertical
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        e.preventDefault()

        if (diffX > 0) {
          // Swipe izquierda - siguiente
          handleScrollDirection(1)
        } else {
          // Swipe derecha - anterior
          handleScrollDirection(-1)
        }

        touchStartY = 0
        touchStartX = 0
      }
    },
    { passive: false },
  )

  // Funciones del carrusel
  function getItemsPerView() {
    const screenWidth = window.innerWidth
    if (screenWidth <= 480) return 1
    if (screenWidth <= 768) return 2
    if (screenWidth <= 1024) return 3
    return 4
  }

  function createCarouselIndicators() {
    indicatorsContainer.innerHTML = ""
    const indicatorCount = Math.ceil(totalItems / itemsPerView)

    for (let i = 0; i < indicatorCount; i++) {
      const indicator = document.createElement("div")
      indicator.className = `carousel-indicator ${i === 0 ? "active" : ""}`
      indicator.setAttribute("data-index", i)
      indicatorsContainer.appendChild(indicator)
    }
  }

  function updateCarousel() {
    const itemWidth = carouselItems[0].offsetWidth + 32 // 32px = gap
    const translateX = -currentIndex * itemWidth

    carouselTrack.style.transform = `translateX(${translateX}px)`

    // Actualizar indicadores
    const indicators = document.querySelectorAll(".carousel-indicator")
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === Math.floor(currentIndex / itemsPerView))
    })
  }

  function nextSlide() {
    currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1
    updateCarousel()
    trackUserInteraction("carousel", "next-slide")
  }

  function prevSlide() {
    currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1
    updateCarousel()
    trackUserInteraction("carousel", "prev-slide")
  }

  function goToSlide(index) {
    currentIndex = Math.min(index * itemsPerView, maxIndex)
    updateCarousel()
    trackUserInteraction("carousel", `goto-slide-${index}`)
  }

  function startCarousel() {
    if (totalItems <= itemsPerView) return // No iniciar si hay pocos elementos

    carouselInterval = setInterval(() => {
      if (isPlaying && !isScrolling) {
        nextSlide()
      }
    }, 5000) // Cambiar cada 5 segundos
  }

  function pauseCarousel() {
    isPlaying = false
  }

  function resumeCarousel() {
    isPlaying = true
  }

  // ===== FUNCIONES DE CONTROL POR SCROLL =====
  function handleScrollNavigation(e) {
    e.preventDefault()

    const delta = e.deltaY || e.deltaX
    handleScrollDirection(delta > 0 ? 1 : -1)
  }

  function handleScrollDirection(direction) {
    // Pausar carrusel automático temporalmente durante scroll
    isScrolling = true
    clearTimeout(scrollTimeout)

    // Acumular scroll para evitar sensibilidad excesiva
    scrollAccumulator += direction

    //identificar si el usuario està en dispotivos moviles (android o apple)

    const isMobile = /Mobi|Android|iPhone|iPad|iPod|/i.test(navigator.userAgent)

    // y ajustar dependiendo el dispositivo donde se encuentre el usuario (si el usuario esta en dispositivos moviles su umbral de scroll serà 2, caso contrario serà 3)
    const scrollThreshold = isMobile ? 1 : 3

    // Umbral para cambiar slide (ajustable para sensibilidad). USAR SI SE QUIERE PONER EN GENERAL
    //const scrollThreshold = 3

    if (Math.abs(scrollAccumulator) >= scrollThreshold) {
      if (scrollAccumulator > 0) {
        nextSlide()
      } else {
        prevSlide()
      }

      // Resetear acumulador
      scrollAccumulator = 0

      // Agregar feedback visual temporal
      carouselContainer.style.transform = "scale(0.98)"
      setTimeout(() => {
        carouselContainer.style.transform = "scale(1)"
      }, 150)
    }

    // Reanudar carrusel automático después de un tiempo sin scroll
    scrollTimeout = setTimeout(() => {
      isScrolling = false
      scrollAccumulator = 0
    }, 1500) // 1.5 segundos sin scroll para reanudar
  }

  // Responsive: Recalcular en resize
  window.addEventListener(
    "resize",
    debounce(() => {
      const newItemsPerView = getItemsPerView()
      if (newItemsPerView !== itemsPerView) {
        itemsPerView = newItemsPerView
        maxIndex = Math.max(0, totalItems - itemsPerView)
        currentIndex = Math.min(currentIndex, maxIndex)
        createCarouselIndicators()
        updateCarousel()
      }
    }, 250),
  )

  console.log("✅ Carrusel con control por scroll inicializado")
}

// ===== EFECTOS DE SCROLL =====
function initializeScrollEffects() {
  const header = document.querySelector(".header")
  let lastScrollY = window.scrollY

  // Efecto de header al hacer scroll
  window.addEventListener(
    "scroll",
    throttle(() => {
      const currentScrollY = window.scrollY

      // Cambiar opacidad del header
      if (currentScrollY > 100) {
        header.style.background = "rgba(29, 18, 18, 0.98)"
      } else {
        header.style.background = "rgba(29, 18, 18, 0.95)"
      }

      // Ocultar/mostrar header en scroll
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        header.style.transform = "translateY(-100%)"
      } else {
        header.style.transform = "translateY(0)"
      }

      lastScrollY = currentScrollY
    }, 16),
  ) // ~60fps

  // Animaciones de entrada para elementos
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observar elementos para animaciones
  const animatedElements = document.querySelectorAll(".about-content, .dish-card, .gallery-item, .social-btn")
  animatedElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })

  console.log("✅ Efectos de scroll inicializados")
}

// ===== MENÚ MÓVIL =====
function initializeMobileMenu() {
  const hamburger = document.getElementById("hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (!hamburger || !navMenu) return

  hamburger.addEventListener("click", (e) => {
    e.stopPropagation()
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")

    // Prevenir scroll del body cuando el menú está abierto
    if (hamburger.classList.contains("active")) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  })

  // Cerrar menú al hacer click en un enlace
  const navLinks = document.querySelectorAll(".nav-menu a")
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
      document.body.style.overflow = ""
    })
  })

  // Cerrar menú al hacer click en el overlay (área del menú pero no en los enlaces)
  navMenu.addEventListener("click", (e) => {
    if (e.target === navMenu) {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
      document.body.style.overflow = ""
    }
  })

  // Cerrar menú con tecla Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("active")) {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
      document.body.style.overflow = ""
    }
  })

  console.log("✅ Menú móvil inicializado")
}

// ===== LAZY LOADING MEJORADO =====
function initializeLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]')

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target

          // Crear una nueva imagen para precargar
          const newImg = new Image()
          newImg.onload = () => {
            img.src = newImg.src
            img.classList.add("loaded")
          }
          newImg.src = img.dataset.src || img.src

          imageObserver.unobserve(img)
        }
      })
    })

    images.forEach((img) => imageObserver.observe(img))
  }

  console.log("✅ Lazy loading inicializado")
}

// ===== SISTEMA DE VALORACIÓN CON ESTRELLAS - OPTIMIZADO PARA MÓVILES =====
function initializeStarRating() {
  const starRatings = document.querySelectorAll(".star-rating")

  // URLs de valoración para cada sucursal
  const reviewUrls = {
    iteso: "https://search.google.com/local/writereview?placeid=ChIJuyCj3uSsKIQRh4qbtLpZxgI",
    tesoro: "https://search.google.com/local/writereview?placeid=ChIJLygLDN2tKIQRlegYv8dOXLo",
  }

  starRatings.forEach((rating) => {
    const stars = rating.querySelectorAll(".star")
    const location = rating.dataset.location

    // Detectar si es dispositivo móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    // Efecto hover para dispositivos de escritorio
    if (!isMobile) {
      stars.forEach((star, index) => {
        star.addEventListener("mouseenter", () => {
          highlightStars(stars, index + 1)
        })
      })

      // Resetear estrellas cuando el mouse sale del contenedor
      rating.addEventListener("mouseleave", () => {
        resetStars(stars)
      })
    }

    // Event listeners para todos los dispositivos (click/touch)
    stars.forEach((star, index) => {
      // Hacer las estrellas focusables para accesibilidad
      star.setAttribute("tabindex", "0")
      star.setAttribute("role", "button")
      star.setAttribute("aria-label", `Calificar con ${index + 1} estrella${index > 0 ? "s" : ""}`)

      // Click/Touch handler
      star.addEventListener("click", (e) => {
        e.preventDefault()
        handleStarClick(star, stars, location, index)
      })

      // Touch events para móviles
      if (isMobile) {
        star.addEventListener(
          "touchstart",
          (e) => {
            e.preventDefault()
            highlightStars(stars, index + 1)
          },
          { passive: false },
        )

        star.addEventListener(
          "touchend",
          (e) => {
            e.preventDefault()
            handleStarClick(star, stars, location, index)
          },
          { passive: false },
        )
      }

      // Keyboard navigation
      star.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleStarClick(star, stars, location, index)
        }
      })

      // Focus events para accesibilidad
      star.addEventListener("focus", () => {
        highlightStars(stars, index + 1)
      })

      star.addEventListener("blur", () => {
        if (!isMobile) {
          resetStars(stars)
        }
      })
    })
  })

  function handleStarClick(star, stars, location, index) {
    // Efecto visual de clic
    star.style.transform = "scale(0.8)"
    setTimeout(() => {
      star.style.transform = "scale(1.15)"
    }, 100)

    // Feedback háptico en dispositivos compatibles
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }

    // Abrir enlace de Google Reviews
    setTimeout(() => {
      window.open(reviewUrls[location], "_blank", "noopener,noreferrer")
      trackUserInteraction("rating-click", `${location}-${index + 1}-stars`)
    }, 200)

    // Resetear transformación después de la animación
    setTimeout(() => {
      star.style.transform = ""
    }, 400)
  }

  function highlightStars(stars, count) {
    stars.forEach((star, index) => {
      if (index < count) {
        star.classList.add("hovered")
      } else {
        star.classList.remove("hovered")
      }
    })
  }

  function resetStars(stars) {
    stars.forEach((star) => {
      star.classList.remove("hovered")
    })
  }

  console.log("✅ Sistema de valoración con estrellas optimizado para todos los dispositivos inicializado")
}

// ===== UTILIDADES DE RENDIMIENTO =====

// Throttle function para optimizar eventos de scroll
function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments

    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Debounce function para optimizar eventos de resize
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// ===== FUNCIONALIDADES ADICIONALES =====

// Smooth scroll para navegación interna
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      const headerHeight = document.querySelector(".header").offsetHeight
      const targetPosition = target.offsetTop - headerHeight

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
  })
})

// Preload de imágenes críticas
function preloadCriticalImages() {
  const criticalImages = [
    "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/db/a9/76/te-quedaras-con-ganas.jpg", // Hero background
    "https://restaurantmalespina.com/wp-content/uploads/2024/04/DSC8091.jpg", // About image
  ]

  criticalImages.forEach((src) => {
    const img = new Image()
    img.src = src
  })
}

// Ejecutar preload cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", preloadCriticalImages)
} else {
  preloadCriticalImages()
}

// ===== ANALYTICS Y TRACKING (Preparado para futuras implementaciones) =====
function trackUserInteraction(action, element) {
  // Placeholder para futuras implementaciones de analytics
  console.log(`📊 Interacción: ${action} en ${element}`)
}

// Event listeners para tracking
document.querySelectorAll(".whatsapp-btn, .social-btn, .floating-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const elementText = e.target.textContent?.trim() || e.target.title || "elemento-social"
    trackUserInteraction("click", elementText)
  })
})

// ===== MANEJO DE ERRORES =====
window.addEventListener("error", (e) => {
  console.error("❌ Error en Sushi Soru:", e.error)
})

// ===== OPTIMIZACIÓN DE RENDIMIENTO =====
// Usar requestAnimationFrame para animaciones suaves
function smoothAnimation(callback) {
  requestAnimationFrame(callback)
}

// Detectar soporte de WebP para optimización de imágenes
function supportsWebP() {
  return new Promise((resolve) => {
    const webP = new Image()
    webP.onload = webP.onerror = () => resolve(webP.height === 2)
    webP.src =
      "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA"
  })
}

// Aplicar optimizaciones basadas en capacidades del navegador
supportsWebP().then((hasWebP) => {
  if (hasWebP) {
    console.log("🚀 WebP soportado - Optimización de imágenes habilitada")
  }
})

// ===== SERVICE WORKER (Preparado para PWA futura) =====
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Placeholder para futuro service worker
    console.log("🔧 Service Worker listo para implementación PWA")
  })
}

// ===== FUNCIONES DE UTILIDAD ADICIONALES =====

// Detectar si el usuario está en dispositivo móvil
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// Optimizar rendimiento en dispositivos móviles
if (isMobileDevice()) {
  // Reducir la frecuencia de eventos de scroll en móviles
  const originalThrottle = throttle
  window.throttle = (func, limit) => originalThrottle(func, Math.max(limit, 32))

  console.log("📱 Optimizaciones móviles aplicadas")
}

console.log("🎉 Todas las funcionalidades de Sushi Soru inicializadas correctamente")
