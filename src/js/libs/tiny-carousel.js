define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /* eslint-disable no-underscore-dangle */
    var TinyCarousel = /** @class */ (function () {
        function TinyCarousel(el, speed) {
            if (speed === void 0) { speed = 2000; }
            this.el = el;
            this.slides = el.querySelectorAll('img');
            this.interval = null;
            this.cycle = 1;
            this.speed = speed;
            this.animEl = null;
            this.mount();
        }
        TinyCarousel.prototype.mount = function () {
            var _this = this;
            this.el.addEventListener('mouseenter', function () {
                _this.play();
            });
            this.el.addEventListener('mouseleave', function () {
                _this.stop();
            });
            this._addLoadingAnimation();
        };
        TinyCarousel.prototype.play = function () {
            var _this = this;
            this.animEl && this.animEl.classList.add('slide-load');
            this.interval = window.setInterval(function () {
                _this._toNextSlide();
            }, this.speed);
        };
        TinyCarousel.prototype.stop = function () {
            this.animEl && this.animEl.classList.remove('slide-load');
            clearInterval(this.interval);
        };
        TinyCarousel.prototype._toNextSlide = function () {
            this.slides.forEach(function (slide) { return slide.classList.remove('active'); });
            this.slides[this.cycle].classList.add('active');
            this.cycle = this.cycle < this.slides.length - 1 ? this.cycle + 1 : 0;
        };
        TinyCarousel.prototype._addLoadingAnimation = function () {
            this.animEl = document.createElement('div');
            this.animEl.style.cssText = "\n            height: 5px;\n            position: absolute;\n            bottom: 0;\n            width: 0%;\n            background: #B6AA68;\n            z-index: 100;\n        ";
            this.el.appendChild(this.animEl);
        };
        return TinyCarousel;
    }());
    exports.default = TinyCarousel;
});
