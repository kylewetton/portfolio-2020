/* eslint-disable no-underscore-dangle */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Vidya = /** @class */ (function () {
        function Vidya(el) {
            this.el = el;
            this.videoEl = null;
            this.mount();
        }
        Vidya.prototype.mount = function () {
            var _this = this;
            var file = this.el.dataset.file;
            this.el.innerHTML = "\n        <video class=\"listen\" loop muted playsinline width=\"250\">\n        <source src=\"/assets/projects/" + file + ".mp4\"\n                type=\"video/mp4\">\n            Sorry, your browser doesn't support embedded videos.\n        </video>      \n        ";
            this.videoEl = this.el.querySelector('video');
            window.addEventListener('resize', function () { return _this._setSize(); });
            this.videoEl.addEventListener('Scroll:allIn', function () { return _this.play(); });
            this.videoEl.addEventListener('Scroll:out', function () { return _this.pause(); });
            this.videoEl.addEventListener('Scroll:in', function () { return _this._setSize(); });
        };
        Vidya.prototype.play = function () {
            this.videoEl && this.videoEl.play();
            this._setSize();
        };
        Vidya.prototype.pause = function () {
            this.videoEl && this.videoEl.pause();
            this._setSize();
        };
        Vidya.prototype._setSize = function () {
            var width = this.el.getBoundingClientRect().width;
            if (this.videoEl) {
                this.videoEl.width = width;
            }
            ;
        };
        return Vidya;
    }());
    exports.default = Vidya;
});
