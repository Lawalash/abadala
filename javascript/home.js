document.addEventListener('DOMContentLoaded', (event) => {
    var modal = document.getElementById("videoModal");
    var btn = document.getElementById("openModal");
    var span = document.getElementsByClassName("close")[0];
    var video = document.getElementById("videoFrame");

    btn.onclick = function() {
        modal.style.display = "block";
        video.play();
    }

    span.onclick = function() {
        modal.style.display = "none";
        video.pause();
        video.currentTime = 0; // Reiniciar o vídeo
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            video.pause();
            video.currentTime = 0; // Reiniciar o vídeo
        }
    }
});