(function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('.cinema-player'));

  players.forEach(function (player) {
    var video = player.querySelector('video');
    var layer = player.querySelector('.player-layer');
    var button = player.querySelector('.player-start');
    var stream = player.getAttribute('data-stream');
    var isReady = false;
    var hls = null;

    function attachStream() {
      if (!video || !stream || isReady) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        isReady = true;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(stream);
        hls.attachMedia(video);
        isReady = true;
        return;
      }

      video.src = stream;
      isReady = true;
    }

    function startPlayback() {
      attachStream();

      if (layer) {
        layer.classList.add('is-hidden');
      }

      if (video) {
        video.controls = true;
        var attempt = video.play();

        if (attempt && typeof attempt.catch === 'function') {
          attempt.catch(function () {});
        }
      }
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        startPlayback();
      });
    }

    if (layer) {
      layer.addEventListener('click', function () {
        startPlayback();
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        if (!isReady || video.paused) {
          startPlayback();
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  });
})();
