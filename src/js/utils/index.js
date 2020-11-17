define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.highlightNav = exports.calculateCenterAngle = void 0;
    exports.calculateCenterAngle = function (_a) {
        var x = _a.x, y = _a.y;
        var client = document.body.getBoundingClientRect();
        var centerX = client.width / 2;
        var centerY = client.height / 2;
        var angleX = Math.floor(100 - (x / centerX * 100));
        var angleY = Math.floor(100 - (y / centerY * 100));
        return {
            x: angleX,
            y: angleY,
        };
    };
    exports.highlightNav = function (navs) {
        var page = window.location.pathname.split('/')[1];
        navs.forEach(function (n) {
            var href = n.dataset.href;
            n.classList.remove('text-gold');
            if (href && href === page) {
                n.classList.add('text-gold');
            }
        });
    };
});
