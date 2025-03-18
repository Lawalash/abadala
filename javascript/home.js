    // Sidebar toggle
    const navToggle = document.getElementById('navToggle');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const overlay = document.getElementById('overlay');

    navToggle.addEventListener('click', () => {
      sidebar.classList.add('active');
      overlay.classList.add('active');
    });

    closeSidebar.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });

    // Função para alternar a exibição dos benefícios
document.addEventListener('DOMContentLoaded', function() {
  // Seleciona todos os toggles de benefícios
  const toggles = document.querySelectorAll('.benefits-toggle');
  
  // Adiciona event listener para cada toggle
  toggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.stopPropagation(); // Impede que o clique seja propagado para o card
      
      // Alterna a classe 'active' no toggle
      this.classList.toggle('active');
      
      // Encontra a lista de benefícios correspondente (próximo elemento irmão)
      const benefitsList = this.nextElementSibling;
      
      // Alterna a classe 'active' na lista de benefícios
      benefitsList.classList.toggle('active');
    });
  });
  
  // Impede que o clique nos botões se propague para o card
  const buttons = document.querySelectorAll('.plan-card .btn');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.espacos-slider');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const indicators = document.querySelector('.carrossel-indicators');
  const cards = document.querySelectorAll('.espaco-card');
  
  let currentIndex = 0;
  let cardWidth = cards[0].offsetWidth + 40; // card width + margin
  
  // Criar indicadores
  cards.forEach((_, index) => {
    const indicator = document.createElement('span');
    if (index === 0) indicator.classList.add('active');
    indicators.appendChild(indicator);
    
    indicator.addEventListener('click', () => {
      goToSlide(index);
    });
  });
  
  const allIndicators = indicators.querySelectorAll('span');
  
  function updateIndicators() {
    allIndicators.forEach((ind, index) => {
      if (index === currentIndex) {
        ind.classList.add('active');
      } else {
        ind.classList.remove('active');
      }
    });
  }
  
  function goToSlide(index) {
    currentIndex = index;
    slider.scrollTo({
      left: cardWidth * currentIndex,
      behavior: 'smooth'
    });
    updateIndicators();
  }
  
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    } else {
      goToSlide(cards.length - 1);
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (currentIndex < cards.length - 1) {
      goToSlide(currentIndex + 1);
    } else {
      goToSlide(0);
    }
  });
  
  // Atualizar largura dos cards quando a janela for redimensionada
  window.addEventListener('resize', () => {
    cardWidth = cards[0].offsetWidth + 40;
    goToSlide(currentIndex);
  });
  
  // Detectar quando o slider é rolado manualmente
  slider.addEventListener('scroll', () => {
    const scrollPosition = slider.scrollLeft;
    const newIndex = Math.round(scrollPosition / cardWidth);
    
    if (newIndex !== currentIndex) {
      currentIndex = newIndex;
      updateIndicators();
    }
  });
  
  // Auto-scroll a cada 5 segundos
  setInterval(() => {
    if (currentIndex < cards.length - 1) {
      goToSlide(currentIndex + 1);
    } else {
      goToSlide(0);
    }
  }, 5000);
});

document.addEventListener('DOMContentLoaded', function() {
  const videoWrapper = document.querySelector('.video-wrapper');
  const video = document.getElementById('gym-video');
  const playBtn = document.querySelector('.play-btn');
  
  playBtn.addEventListener('click', function() {
    if (video.paused) {
      video.play();
      videoWrapper.classList.add('video-playing');
    } else {
      video.pause();
      videoWrapper.classList.remove('video-playing');
    }
  });
  
  // Também permite clicar no vídeo para pausar/reproduzir
  video.addEventListener('click', function() {
    if (video.paused) {
      video.play();
      videoWrapper.classList.add('video-playing');
    } else {
      video.pause();
      videoWrapper.classList.remove('video-playing');
    }
  });
  
  // Remove overlay quando o vídeo estiver reproduzindo
  video.addEventListener('play', function() {
    videoWrapper.classList.add('video-playing');
  });
  
  video.addEventListener('pause', function() {
    videoWrapper.classList.remove('video-playing');
  });
});