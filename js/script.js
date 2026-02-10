
// =========================
// HERO VIDEOS (NETFLIX STYLE)
// =========================

// Lista de videos
const videos = [
  "video/hero/01.mp4",
  "video/hero/02.mp4",
  "video/hero/03.mp4",
  "video/hero/04.mp4",
  "video/hero/05.mp4",
  "video/hero/06.mp4",
  "video/hero/07.mp4",
  "video/hero/08.mp4",
  "video/hero/09.mp4",
  "video/hero/10.mp4",
  "video/hero/11.mp4",
  "video/hero/12.mp4",
  "video/hero/13.MOV",
  "video/hero/14.MOV",
  "video/hero/15.mp4",
  "video/hero/16.mp4",
  "video/hero/17.mp4",
  "video/hero/18.mp4",
  "video/hero/19.mp4",
  "video/hero/20.mp4",
  "video/hero/21.mp4",
  "video/hero/22.mp4",
  "video/hero/23.mp4",
  "video/hero/24.mp4",
  "video/hero/25.mp4",
  "video/hero/26.mp4",
  "video/hero/27.mp4",
  "video/hero/28.mp4",
  "video/hero/29.mp4",
  "video/hero/30.mp4"
];

let currentVideoIndex = 0;

// ELEMENTOS
const videoElement = document.getElementById("heroVideo");
const heroText = document.querySelector(".hero-text");
const videoRow = document.getElementById("videoRow");
const arrowLeft = document.querySelector(".carousel-arrow.left");
const arrowRight = document.querySelector(".carousel-arrow.right");

// =========================
// CREAR MINIATURAS
// =========================
videos.forEach((videoSrc, index) => {
  const thumb = document.createElement("div");
  thumb.className = "video-thumb";
  thumb.dataset.index = index;

  const miniVideo = document.createElement("video");
  miniVideo.src = videoSrc;
  miniVideo.muted = true;
  miniVideo.playsInline = true;

  thumb.appendChild(miniVideo);
  videoRow.appendChild(thumb);

  thumb.addEventListener("click", (e) => {
    e.stopPropagation();
    currentVideoIndex = index;
    loadVideo(index);
  });
});

// =========================
// CARGAR VIDEO PRINCIPAL
// =========================
function loadVideo(index) {
  videoElement.classList.add("fade-out");

  // Reinicia animación del texto
  heroText.style.animation = "none";
  heroText.offsetHeight;
  heroText.style.animation = null;

  setTimeout(() => {
    videoElement.src = videos[index];
    videoElement.load();
    videoElement.play();

    videoElement.classList.remove("fade-out");
    updateActiveThumbnail();
    centerActiveThumbnail();
  }, 350);
}

// =========================
// MINIATURA ACTIVA
// =========================
function updateActiveThumbnail() {
  document
    .querySelectorAll(".video-thumb")
    .forEach(t => t.classList.remove("active"));

  const active = document.querySelector(
    `.video-thumb[data-index="${currentVideoIndex}"]`
  );

  if (active) active.classList.add("active");
}

// =========================
// CENTRAR MINIATURA ACTIVA (NETFLIX REAL)
// =========================
function centerActiveThumbnail() {
  const active = document.querySelector(
    `.video-thumb[data-index="${currentVideoIndex}"]`
  );

  if (!active) return;

  const rowWidth = videoRow.offsetWidth;
  const thumbCenter =
    active.offsetLeft + active.offsetWidth / 2;

  const scrollPosition =
    thumbCenter - rowWidth / 2;

  videoRow.scrollTo({
    left: scrollPosition,
    behavior: "smooth"
  });
}

// =========================
// SCROLL DEL CARRUSEL (FLECHAS)
// =========================
function scrollCarousel(direction) {
  const scrollAmount = videoRow.offsetWidth * 0.8;

  videoRow.scrollBy({
    left: direction * scrollAmount,
    behavior: "smooth"
  });
}

arrowLeft.addEventListener("click", (e) => {
  e.stopPropagation();
  scrollCarousel(-1);
});

arrowRight.addEventListener("click", (e) => {
  e.stopPropagation();
  scrollCarousel(1);
});

// =========================
// SCROLL CON RUEDA (HORIZONTAL)
// =========================
videoRow.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    videoRow.scrollBy({
      left: e.deltaY,
      behavior: "smooth"
    });
  },
  { passive: false }
);

// =========================
// VIDEO AUTOMÁTICO
// =========================
loadVideo(currentVideoIndex);

videoElement.addEventListener("ended", () => {
  currentVideoIndex = (currentVideoIndex + 1) % videos.length;
  loadVideo(currentVideoIndex);
});

// =========================
// AUDIO HERO (BOTÓN VIVO)
// =========================
const audio = document.getElementById("heroAudio");
const audioBtn = document.getElementById("audioToggle");

let isPlaying = false;

audioBtn.addEventListener("click", () => {

  // 🛑 detener canciones si alguna está sonando
  if (window.songsAudio && !window.songsAudio.paused) {
    window.songsAudio.pause();
    window.songsAudio.currentTime = 0;
  }

  // 🔥 animación de pulso
  audioBtn.classList.remove("pulse");
  void audioBtn.offsetWidth;
  audioBtn.classList.add("pulse");

  if (!isPlaying) {
    audio.play();

    audioBtn.classList.add("active");
    audioBtn.textContent = "🔈 Sonido activado";
    isPlaying = true;
  } else {
    audio.pause();

    audioBtn.classList.remove("active");
    audioBtn.textContent = "🔊 Activar sonido";
    isPlaying = false;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const galleryModal = document.getElementById("galleryModal");
  const modalContent = document.querySelector(".gallery-modal-content");
  const modalImg = document.querySelector(".gallery-modal-img");
  const modalClose = document.querySelector(".gallery-modal-close");

  const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
  const galleryImages = galleryItems.map(item => item.querySelector("img"));

  const arrowLeft = document.querySelector(".modal-arrow.left");
  const arrowRight = document.querySelector(".modal-arrow.right");
  const heart = document.querySelector(".modal-heart");
  const modalLikeBtn = document.querySelector(".modal-like-btn");

  let currentIndex = 0;
  let startX = 0;

  // ❤️ likes en memoria (hasta refrescar)
  const likedImages = new Set();

  if (!galleryImages.length || !galleryModal || !modalImg || !modalContent) {
    console.error("❌ Galería o modal incompletos en el DOM");
    return;
  }

  /* =========================
     UTILIDADES
  ========================= */
  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  function showImage(index) {
    if (index < 0) index = galleryImages.length - 1;
    if (index >= galleryImages.length) index = 0;

    currentIndex = index;
    modalImg.src = galleryImages[currentIndex].src;

    syncLikeState();
  }

  function syncLikeState() {
    const liked = likedImages.has(currentIndex);

    // botón modal
    if (modalLikeBtn) {
      modalLikeBtn.textContent = liked ? "❤️" : "♡";
      modalLikeBtn.classList.toggle("liked", liked);
    }

    // galería
    galleryItems[currentIndex]?.classList.toggle("liked", liked);
  }

  function toggleLike() {
    if (likedImages.has(currentIndex)) {
      likedImages.delete(currentIndex);
    } else {
      likedImages.add(currentIndex);
      triggerHeart();
    }
    syncLikeState();
  }

  function triggerHeart() {
    if (!heart) return;

    heart.classList.add("show");
    setTimeout(() => heart.classList.remove("show"), 700);
  }

  /* =========================
     ABRIR MODAL
  ========================= */
  galleryImages.forEach((img, index) => {
    if (!img) return;

    img.addEventListener("click", () => {
      const rect = img.getBoundingClientRect();

      modalContent.style.transformOrigin =
        `${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`;

      showImage(index);

      const scrollbarWidth = getScrollbarWidth();
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      galleryModal.classList.add("active");
    });
  });

  /* =========================
     CERRAR MODAL
  ========================= */
  function closeModal() {
    galleryModal.classList.remove("active");

    setTimeout(() => {
      modalImg.src = "";
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }, 350);
  }

  modalClose?.addEventListener("click", closeModal);

  galleryModal.addEventListener("click", e => {
    if (e.target === galleryModal) closeModal();
  });

  /* =========================
     FLECHAS
  ========================= */
  if (arrowLeft && arrowRight) {
    arrowLeft.addEventListener("click", e => {
      e.stopPropagation();
      showImage(currentIndex - 1);
    });

    arrowRight.addEventListener("click", e => {
      e.stopPropagation();
      showImage(currentIndex + 1);
    });
  }

  /* =========================
     TECLADO
  ========================= */
  document.addEventListener("keydown", e => {
    if (!galleryModal.classList.contains("active")) return;

    if (e.key === "ArrowLeft") showImage(currentIndex - 1);
    if (e.key === "ArrowRight") showImage(currentIndex + 1);
    if (e.key === "Escape") closeModal();
  });

  /* =========================
     SWIPE MÓVIL
  ========================= */
  modalImg.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  modalImg.addEventListener("touchend", e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0
        ? showImage(currentIndex + 1)
        : showImage(currentIndex - 1);
    }
  });

  /* =========================
     DOBLE CLICK ❤️
  ========================= */
  modalImg.addEventListener("dblclick", toggleLike);

  /* =========================
     BOTÓN LIKE ESQUINA
  ========================= */
  modalLikeBtn?.addEventListener("click", e => {
    e.stopPropagation();
    toggleLike();
  });
});

//SECCION GLOBAL PARA DETENER CANCIONES

function stopSongsAudio() {
  if (window.songsAudio && !window.songsAudio.paused) {
    window.songsAudio.pause();
    window.songsAudio.currentTime = 0;
  }

  document.querySelectorAll(".song-card").forEach(card => {
    card.classList.remove("active");
    const btn = card.querySelector(".song-play");
    const bar = card.querySelector(".song-progress-bar");

    if (btn) {
      btn.textContent = "▶️";
      btn.classList.remove("playing");
    }
    if (bar) bar.style.width = "0%";
  });
}

// =========================
// SECCIÓN CANCIONES (PLAYER + CARRUSEL)
// =========================
document.addEventListener("DOMContentLoaded", () => {

  const songCards = Array.from(document.querySelectorAll(".song-card"));
  const songsRow = document.querySelector(".songs-row");
  const arrowLeft = document.querySelector(".songs-arrow.left");
  const arrowRight = document.querySelector(".songs-arrow.right");
  const heroAudio = document.getElementById("heroAudio");

  // 🎵 Audio único (playlist real)
  window.songsAudio = new Audio();
  const audio = window.songsAudio;
  audio.preload = "metadata";

  let currentSongIndex = -1;
  let isPlaying = false;

  if (!songCards.length) return;

  /* =========================
     UTILIDADES
  ========================= */
  function pauseHeroAudio() {
    if (heroAudio && !heroAudio.paused) {
      heroAudio.pause();
    }
  }

  function resetAllCards() {
    songCards.forEach(card => {
      card.classList.remove("active");
      card.querySelector(".song-play").textContent = "▶️";
      card.querySelector(".song-play").classList.remove("playing");
      card.querySelector(".song-progress-bar").style.width = "0%";
    });
  }

  function centerCard(index) {
    const card = songCards[index];
    const rowWidth = songsRow.offsetWidth;
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;

    songsRow.scrollTo({
      left: cardCenter - rowWidth / 2,
      behavior: "smooth"
    });
  }

  /* =========================
     PLAY CANCIÓN
  ========================= */
  function playSong(index) {
    if (index < 0) index = songCards.length - 1;
    if (index >= songCards.length) index = 0;

    const card = songCards[index];
    const src = card.dataset.audio;

    if (!src) return;

    // 🔥 detener todo
    resetAllCards();
    pauseHeroAudio();

    // 🔥 cargar y reproducir (CLAVE)
    audio.pause();
    audio.src = src;
    audio.load();
    audio.play().catch(err => console.error("Error audio:", err));

    currentSongIndex = index;
    isPlaying = true;

    card.classList.add("active");
    const btn = card.querySelector(".song-play");
    btn.textContent = "⏸";
    btn.classList.add("playing");

    centerCard(index);
  }

  function togglePlay(index) {
    if (currentSongIndex !== index) {
      playSong(index);
      return;
    }

    if (audio.paused) {
      audio.play();
      isPlaying = true;
    } else {
      audio.pause();
      isPlaying = false;
    }

    const btn = songCards[index].querySelector(".song-play");
    btn.textContent = isPlaying ? "⏸" : "▶️";
    btn.classList.toggle("playing", isPlaying);
  }

  /* =========================
     EVENTOS PLAY
  ========================= */
  songCards.forEach((card, index) => {
    const playBtn = card.querySelector(".song-play");
    const progress = card.querySelector(".song-progress");
    const bar = card.querySelector(".song-progress-bar");

    playBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePlay(index);
    });

    progress.addEventListener("click", (e) => {
      if (index !== currentSongIndex) return;
      const rect = progress.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audio.currentTime = percent * audio.duration;
    });
  });

  /* =========================
     PROGRESO
  ========================= */
  audio.addEventListener("timeupdate", () => {
    if (currentSongIndex < 0) return;
    const bar = songCards[currentSongIndex]
      .querySelector(".song-progress-bar");

    bar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
  });

  /* =========================
     AUTO SIGUIENTE
  ========================= */
  audio.addEventListener("ended", () => {
    playSong(currentSongIndex + 1);
  });

  /* =========================
     FLECHAS
  ========================= */
  arrowLeft.addEventListener("click", () => {
    playSong(currentSongIndex - 1);
  });

  arrowRight.addEventListener("click", () => {
    playSong(currentSongIndex + 1);
  });

  /* =========================
     TECLADO
  ========================= */
  document.addEventListener("keydown", (e) => {
    if (currentSongIndex < 0) return;

    if (e.key === "ArrowRight") playSong(currentSongIndex + 1);
    if (e.key === "ArrowLeft") playSong(currentSongIndex - 1);
    if (e.key === " ") {
      e.preventDefault();
      togglePlay(currentSongIndex);
    }
  });

});

// =========================
// SECCIÓN NUESTRO FUTURO
// =========================
document.addEventListener("DOMContentLoaded", () => {

  const futureCards = Array.from(document.querySelectorAll(".future-card"));
  const arrowLeft = document.querySelector(".future-arrow.left");
  const arrowRight = document.querySelector(".future-arrow.right");

  let currentFutureIndex = 0;
  let startX = 0;

  if (!futureCards.length) return;

  /* =========================
     MOSTRAR META
  ========================= */
  function showFuture(index) {
    if (index < 0) index = futureCards.length - 1;
    if (index >= futureCards.length) index = 0;

    futureCards.forEach(card => card.classList.remove("active"));
    futureCards[index].classList.add("active");

    currentFutureIndex = index;
  }

  /* =========================
     INICIAL
  ========================= */
  showFuture(0);

  /* =========================
     FLECHAS
  ========================= */
  arrowLeft?.addEventListener("click", () => {
    showFuture(currentFutureIndex - 1);
  });

  arrowRight?.addEventListener("click", () => {
    showFuture(currentFutureIndex + 1);
  });

  /* =========================
     TECLADO
  ========================= */
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") showFuture(currentFutureIndex - 1);
    if (e.key === "ArrowRight") showFuture(currentFutureIndex + 1);
  });

  /* =========================
     SWIPE MÓVIL
  ========================= */
  const track = document.querySelector(".future-track");

  if (track) {
    track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    track.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        diff > 0
          ? showFuture(currentFutureIndex + 1)
          : showFuture(currentFutureIndex - 1);
      }
    });
  }

});

document.addEventListener("DOMContentLoaded", () => {
  const mailbox = document.querySelector(".mailbox");
  const mailboxContainer = document.querySelector(".mailbox-container");
  const letterSection = document.querySelector(".letter-section");
  const letter = document.querySelector(".letter-paper");

  if (!mailbox || !letter || !letterSection) return;

  mailbox.addEventListener("click", () => {

    /* =========================
       OCULTAR BUZÓN
    ========================= */
    mailboxContainer.style.transition =
      "opacity 0.6s ease, transform 0.6s ease";
    mailboxContainer.style.opacity = "0";
    mailboxContainer.style.transform =
      "translateY(-20px) scale(0.95)";

    /* =========================
       MOSTRAR CARTA + EXPANDIR SECCIÓN
    ========================= */
    setTimeout(() => {
      mailboxContainer.style.display = "none";

      // 🔑 activa todo el efecto CSS
      letterSection.classList.add("open");

      // scroll suave hacia la carta
      letter.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    }, 600);
  });
});


// =========================
// FLORES FLOTANTES (SECCIÓN CANCIONES)
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const songsSection = document.getElementById("canciones");

  if (!songsSection) return;

  const flowers = ["🌼", "🌻", "💛"];
  const maxFlowers = 12;

  function createFlower() {
    if (songsSection.querySelectorAll(".floating-flower").length > maxFlowers) {
      return;
    }

    const flower = document.createElement("div");
    flower.classList.add("floating-flower");

    // Emoji aleatorio
    flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];

    // Tamaño aleatorio
    const sizeType = Math.random();
    if (sizeType < 0.33) flower.classList.add("small");
    else if (sizeType > 0.66) flower.classList.add("large");

    // Posición horizontal aleatoria
    flower.style.left = Math.random() * 100 + "%";

    // Duración aleatoria
    const duration = 18 + Math.random() * 15;
    flower.style.animationDuration = `${duration}s`;

    songsSection.appendChild(flower);

    // Eliminar al terminar
    setTimeout(() => {
      flower.remove();
    }, duration * 1000);
  }

  // Generar flores de forma continua
  setInterval(createFlower, 2500);
});
