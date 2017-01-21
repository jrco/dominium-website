angular.
  module('Dominium')
  .animation('.game', function gameAnimationFactory() {
    return {
      addClass: animateIn,
      removeClass: animateOut
    };

    function animateIn(element, className, done) {
      if (className !== 'selected') return;

      element.
        css({
          display: 'block',
          position: 'absolute',
          top: 500,
          left: 0
        }).
        animate({
          top: 0
        }, done);

      return function animateInEnd(wasCanceled) {
        if (wasCanceled) element.stop();
      };
    }

    function animateOut(element, className, done) {
      if (className !== 'selected') return;

      element.
        css({
          position: 'absolute',
          top: 0,
          left: 0
        }).
        animate({
          top: -500
        }, done);

      return function animateOutEnd(wasCanceled) {
        if (wasCanceled) element.stop();
      };
    }
  });

  $('a[href*="#"]:not([href="#"])').click(function() {
  if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
    var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
    if (target.length) {
      $('html, body').animate({
        scrollTop: target.offset().top
      }, 1000);
      return false;
    }
  }
});