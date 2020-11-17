var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "lottie-web-light", "scroll-sniffer", "./libs", "./utils", "../scss/styles.scss"], function (require, exports, lottie_web_light_1, scroll_sniffer_1, libs_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    lottie_web_light_1 = __importDefault(lottie_web_light_1);
    scroll_sniffer_1 = __importDefault(scroll_sniffer_1);
    /** ------------------------------------ */
    var contentSection = document.querySelector('#content');
    var portrait;
    var portraitBackground;
    var carousels;
    var vidyas;
    var isTouchDevice = function () { return 'ontouchstart' in window; };
    if (!isTouchDevice()) {
        var slinky = new libs_1.SlinkyCursor({
            size: 31,
            growSize: 31 * 2.5,
            laziness: 5,
            stiffness: 2.5,
        });
        slinky.init();
        document.body.classList.add('hide-cursor');
    }
    var navs = document.querySelectorAll('.navigate');
    function init() {
        portrait = document.querySelector('#js-portrait');
        portraitBackground = document.querySelector('#js-portrait-background');
        /**
         * Tiny Carousel
         * */
        var carouselNodes = document.querySelectorAll('.image-carousel');
        var vidyasNodes = document.querySelectorAll('.vidya');
        carousels = Array.from(carouselNodes).map(function (carousel) { return new libs_1.TinyCarousel(carousel); });
        vidyas = Array.from(vidyasNodes).map(function (vid) { return new libs_1.Vidya(vid); });
        /**
         * ScrollSniffer
         */
        var listener = new scroll_sniffer_1.default('.listen');
        listener.listen();
        utils_1.highlightNav(navs);
        /**
         * Toggle device text
         */
        var mobileText = document.querySelectorAll('.mobile');
        var desktopText = document.querySelectorAll('.desktop');
        if (isTouchDevice()) {
            mobileText.forEach(function (el) {
                el.classList.remove('hidden');
            });
        }
        else {
            desktopText.forEach(function (el) {
                el.classList.remove('hidden');
            });
        }
        /**
          * Fade logos in
          */
        var brandLogos = document.querySelectorAll('.brand-logo');
        if (brandLogos.length) {
            brandLogos.forEach(function (logo, index) {
                logo.addEventListener('load', function () {
                    var i = index + 1;
                    setTimeout(function () {
                        logo.classList.remove('opacity-0');
                    }, i * 100);
                });
            });
        }
    } // End init
    /**
     * Portrait Parallaxing effect
     */
    var portraitParallax = function (_a) {
        var x = _a.x, y = _a.y;
        var angleTension = 80;
        var _b = utils_1.calculateCenterAngle({ x: x, y: y }), angleX = _b.x, angleY = _b.y;
        portrait.style.backgroundPosition = 50 - ((angleX / (angleTension / 2)) * -1) + "%";
        portrait.style.transform = "translateY(" + (angleY / (angleTension / 4)) * -1 + "px) scale(1.01)";
        portraitBackground.style.cssText = "transform: perspective(400px)\n    rotateX(" + angleY / (angleTension * 3) + "deg)\n    rotateY(" + (angleX / (angleTension * 3)) * -1 + "deg)\n    scale(1.02);";
    };
    window.addEventListener('mousemove', function (_a) {
        var clientX = _a.clientX, clientY = _a.clientY;
        if (portrait && portraitBackground && !isTouchDevice()) {
            portraitParallax({ x: clientX, y: clientY });
        }
    });
    /**
     * Mail
     */
    var contactContainer = document.querySelector('#js-contact');
    var toggleContactButton = document.querySelector('#js-toggle-contact');
    var closeContact = document.querySelector('#js-close-contact');
    var mailButton = document.querySelector('#js-send-mail');
    var toggleContactContainer = function () {
        contactContainer.classList.toggle('off-canvas');
    };
    mailButton.addEventListener('click', function (e) { return sendMail(e); });
    toggleContactButton.addEventListener('click', function (e) {
        e.preventDefault();
        toggleContactContainer();
    });
    closeContact.addEventListener('click', function (e) {
        e.preventDefault();
        toggleContactContainer();
    });
    var fields = {
        fname: document.querySelector('#fname'),
        femail: document.querySelector('#femail'),
        fmessage: document.querySelector('#fmessage'),
    };
    var _loop_1 = function (key, field) {
        if (field) {
            field.addEventListener('click', function () {
                field.classList.remove('error');
            });
        }
    };
    for (var _i = 0, _a = Object.entries(fields); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], field = _b[1];
        _loop_1(key, field);
    }
    var updateFormState = function (state, revert) {
        if (state === void 0) { state = ''; }
        if (revert === void 0) { revert = false; }
        var clear = function () {
            mailButton.classList.remove('sent');
            mailButton.classList.remove('sending');
            mailButton.classList.remove('failed');
        };
        clear();
        switch (state) {
            case 'sending':
                mailButton.classList.add('sending');
                break;
            case 'sent':
                mailButton.classList.add('sent');
                break;
            case 'failed':
                mailButton.classList.add('failed');
                break;
            case 'server-error':
                mailButton.classList.add('server-error');
                break;
            default:
                clear();
        }
        if (revert) {
            /**
             * Revert back to default state after 2 seconds
             */
            setTimeout(function () { return updateFormState(); }, 2000);
        }
    };
    var mailSuccess = function () {
        updateFormState('sent', true);
        setTimeout(function () {
            toggleContactContainer();
            for (var _i = 0, _a = Object.entries(fields); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], field = _b[1];
                if (field) {
                    field.value = '';
                }
            }
        }, 1000);
    };
    var highlightBadFields = function (_a) {
        var errors = _a.errors;
        errors.forEach(function (error) {
            console.log(error);
            var param = error.param;
            fields[param].classList.add('error');
        });
    };
    var sendMail = function (e) {
        e.preventDefault();
        updateFormState('sending');
        var formData = new FormData();
        fields.fname && formData.append('fname', fields.fname.value);
        fields.femail && formData.append('femail', fields.femail.value);
        fields.fmessage && formData.append('fmessage', fields.fmessage.value);
        var object = {
            fname: '',
            femail: '',
            fmessage: '',
        };
        formData.forEach(function (value, key) {
            object[key] = value;
        });
        var json = JSON.stringify(object);
        fetch('send-mail', {
            method: 'post',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: json,
        })
            .then(function (res) {
            if (res.ok) {
                mailSuccess();
            }
            else if (res.status === 503) {
                updateFormState('server-error', false);
            }
            else {
                updateFormState('failed', true);
            }
            return res;
        })
            .then(function (res) { return res.json(); })
            .then(function (res) {
            if (res.hasOwnProperty('errors') && res.errors.length) {
                highlightBadFields(res);
            }
        })
            .catch(console.error);
    };
    /**
     * Page Transitions
     */
    var animatedPanel = document.querySelector('#js-animated-panel');
    var animations = ['fill', 'blob', 'stripes'];
    var animSpeed = 1000;
    var cycle = 0;
    var tracks = animations.map(function (anim, i) {
        var trackPanel = document.querySelector("#anim-" + i);
        return {
            panel: trackPanel,
            animation: lottie_web_light_1.default.loadAnimation({
                container: trackPanel,
                renderer: 'svg',
                rendererSettings: {
                    preserveAspectRatio: 'xMidYMid slice',
                },
                autoplay: false,
                loop: false,
                path: "/assets/" + anim + ".json",
            }),
        };
    });
    var playAnimation = function (tracks) {
        if (!tracks.length)
            return;
        tracks.forEach(function (track) { return track.panel.classList.add('hidden'); });
        tracks[cycle].panel.classList.remove('hidden');
        tracks[cycle].animation.goToAndPlay(0, true);
        cycle = cycle < tracks.length - 1 ? cycle + 1 : 0;
    };
    /**
     * Routing
     */
    var cleanPaths = function (path) { return path.split('/').filter(function (p) { return p !== ''; }).join('/'); };
    var invokePage = function (href, pushState, fireEvents) {
        if (fireEvents === void 0) { fireEvents = true; }
        if (fireEvents)
            document.dispatchEvent(new Event('PageInvokeStart'));
        var delay = fireEvents ? animSpeed : 0;
        setTimeout(function () {
            fetch("/invoke/" + (href || 'home'))
                .then(function (res) { return res.text(); })
                .then(function (html) {
                contentSection.innerHTML = html;
                if (pushState) {
                    window.history.pushState({}, href, window.location.origin + "/" + (href && href !== 'home' ? href : ''));
                }
            })
                .then(function () {
                window.scrollTo(0, 0);
                init();
                if (fireEvents)
                    document.dispatchEvent(new Event('PageInvokeEnd'));
            });
        }, delay);
    };
    document.addEventListener('click', function (e) {
        var target = e.target;
        if (target && target.classList.contains('navigate')) {
            e.preventDefault();
            var href = target.dataset.href && cleanPaths(target.dataset.href);
            if (typeof href === 'string') {
                invokePage(href, true);
            }
        }
    });
    var contentOnLoad = function (target, fireEvents) {
        var pathname = target.location.pathname;
        var href = cleanPaths(pathname);
        invokePage(href, false, fireEvents);
    };
    window.addEventListener('popstate', function (_a) {
        var target = _a.target;
        return contentOnLoad(target, true);
    });
    window.addEventListener('load', function (_a) {
        var target = _a.target;
        return contentOnLoad(target, false);
    });
    document.addEventListener('PageInvokeStart', function () {
        animatedPanel && animatedPanel.classList.add('loading');
        playAnimation(tracks);
        setTimeout(function () {
            contentSection.classList.remove('loaded');
        }, animSpeed - 100);
    });
    document.addEventListener('PageInvokeEnd', function () {
        // Delay for animation
        setTimeout(function () {
            animatedPanel && animatedPanel.classList.remove('loading');
            contentSection.classList.add('loaded');
        }, 10);
    });
});
