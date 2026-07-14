(function() {
    'use strict';

    // =========================================
    // 1. CONTADOR REGRESIVO (07/03/2027 19:00)
    // =========================================
    function initCountdown() {
        const countDownDate = new Date('Mar 7, 2027 19:00:00').getTime();
        const countdownEl = document.getElementById('countdown');

        const update = setInterval(function() {
            const now = new Date().getTime();
            const distance = countDownDate - now;

            if (distance < 0) {
                clearInterval(update);
                countdownEl.innerHTML = '<p class="hero-date">¡Ya nos casamos! 🥂</p>';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        }, 1000);
    }

    // =========================================
    // 2. ANIMACIONES AL SCROLL (incluye imágenes)
    // =========================================
    function initScrollAnimations() {
        // Seleccionamos tanto las tarjetas de detalles como las imágenes del mensaje
        const items = document.querySelectorAll('.detail-card, .message-image-item');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        items.forEach(item => observer.observe(item));
    }

    // =========================================
    // 3. CORAZONES FLOTANTES (detrás de las imágenes)
    // =========================================
    function initHearts() {
        const messageSection = document.getElementById('message');
        const heartsContainer = document.querySelector('.hearts-container');
        if (!messageSection || !heartsContainer) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heartsContainer.classList.add('active');
                } else {
                    heartsContainer.classList.remove('active');
                }
            });
        }, { threshold: 0.2 });

        observer.observe(messageSection);
    }

    // =========================================
    // 4. CONFETI DORADO ELEGANTE (30 segundos)
    // =========================================
    function initPetals() {
        const container = document.getElementById('petals-container');
        container.innerHTML = '';

        const colors = ['#D4AF37', '#F0D080', '#FFF8E7', '#E8D5F5', '#C9A0DC', '#FFD700'];
        const numElements = 40;
        const duration = 30;

        for (let i = 0; i < numElements; i++) {
            const el = document.createElement('div');
            el.className = 'confeti';

            const size = 6 + Math.random() * 8;
            el.style.width = size + 'px';
            el.style.height = size + 'px';
            el.style.background = colors[Math.floor(Math.random() * colors.length)];
            el.style.left = Math.random() * 100 + '%';
            el.style.animationDelay = (Math.random() * 2) + 's';
            const fallDuration = 3 + Math.random() * 3;
            el.style.animationDuration = fallDuration + 's';
            el.style.transform = `rotate(${Math.random() * 360}deg)`;
            el.style.opacity = 0.6 + Math.random() * 0.4;

            container.appendChild(el);
        }

        setTimeout(() => {
            container.style.transition = 'opacity 1.5s ease';
            container.style.opacity = '0';
            setTimeout(() => {
                container.innerHTML = '';
                container.style.opacity = '1';
            }, 1500);
        }, duration * 1000);
    }

    // =========================================
    // 5. RSVP - ENVÍO A GOOGLE SHEETS
    // =========================================
   function initRSVP() {
    const form = document.getElementById('rsvp-form');
    const successDiv = document.getElementById('rsvp-success');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {
            nombre: formData.get('nombre'),
            cantidad: formData.get('cantidad'),  // ✅ CAMBIADO
            ninos: formData.get('ninos')
        };

        fetch(form.action, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'text/plain'   // ✅ CLAVE para CORS
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                form.classList.add('hidden');
                successDiv.classList.remove('hidden');
                form.reset();
            } else {
                alert('Hubo un problema al enviar tu confirmación.');
            }
        })
        .catch(error => {
            alert('Error de conexión.');
        });
    });
}

    // =========================================
    // 6. COMPARTIR POR WHATSAPP
    // =========================================
    function initWhatsAppShare() {
        const btn = document.getElementById('whatsapp-share');
        if (!btn) return;

        btn.addEventListener('click', function() {
            const url = window.location.href;
            const message = encodeURIComponent(
                '¡Hola! Te invito a nuestra boda 💜\n\n' +
                'Camila & Mauro\n' +
                '07 de marzo de 2027 · Zaita Eventos, Cipolletti\n\n' +
                'Confirmá tu asistencia aquí:\n' +
                url
            );
            window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
        });
    }

    // =========================================
    // 7. CONTROL DEL AUDIO
    // =========================================
    // =========================================
// CONTROL DEL AUDIO (autoplay al primer clic)
// =========================================
function initAudio() {
    const audio = document.getElementById('bg-audio');
    const toggleBtn = document.getElementById('audio-toggle');
    let isPlaying = false;

    if (!audio || !toggleBtn) return;

    function playAudio() {
        audio.play().then(() => {
            isPlaying = true;
            toggleBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }).catch(() => {
            toggleBtn.innerHTML = '<i class="fas fa-play"></i>';
        });
    }

    function pauseAudio() {
        audio.pause();
        isPlaying = false;
        toggleBtn.innerHTML = '<i class="fas fa-play"></i>';
    }

    // Control manual con el botón
    toggleBtn.addEventListener('click', function() {
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    });

    // ⭐ AUTOPLAY: se reproduce al primer clic en cualquier parte de la página ⭐
    document.addEventListener('click', function playOnFirstClick() {
        if (!isPlaying) {
            playAudio();
        }
        document.removeEventListener('click', playOnFirstClick);
    }, { once: true });

    // Cuando el audio termina, se detiene y el botón vuelve a play
    audio.addEventListener('ended', function() {
        isPlaying = false;
        toggleBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
}
// =========================================
// AVISO DE AUDIO (desaparece en 30 segundos)
// =========================================
function initAudioNotification() {
    const notification = document.getElementById('audio-notification');
    if (!notification) return;

    // Ocultar automáticamente después de 30 segundos
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 30000); // 30 segundos

    // Opcional: ocultar también si el usuario hace clic en el botón de audio
    const toggleBtn = document.getElementById('audio-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            notification.classList.add('hidden');
        });
    }

    // Opcional: ocultar si el usuario hace clic en cualquier parte (autoplay)
    document.addEventListener('click', function() {
        notification.classList.add('hidden');
    }, { once: true });
}
    // =========================================
    // 8. INICIALIZAR TODO
    // =========================================
    document.addEventListener('DOMContentLoaded', function() {
        initCountdown();
        initScrollAnimations();
        initHearts();      // Corazones flotantes
        initPetals();      // Confeti dorado
        initRSVP();
        initWhatsAppShare();
        initAudio();
        initAudioNotification();
    });

})();
