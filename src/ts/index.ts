import '../scss/styles.scss';
import lottie from 'lottie-web-light';
/**
 * These four small packages are written by me,
 * specifically for this project
 */
import ScrollSniffer from 'scroll-sniffer';
import {SlinkyCursor, TinyCarousel, Vidya} from './libs';
import {calculateCenterAngle, highlightNav} from "./utils";
/** ------------------------------------ */

const contentSection = document.querySelector('#content') as HTMLElement;
let portrait: HTMLElement;
let portraitBackground: HTMLElement;
let carousels: TinyCarousel[];
let vidyas: Vidya[];

const isTouchDevice = () => 'ontouchstart' in window;

if (!isTouchDevice()) {
    const slinky = new SlinkyCursor({
        size: 31,
        growSize: 31 * 2.5,
        laziness: 5,
        stiffness: 2.5,
      });
    slinky.init();
    document.body.classList.add('hide-cursor');
}

const navs: NodeListOf<HTMLElement> = document.querySelectorAll('.navigate');


function init() {
    portrait = document.querySelector('#js-portrait') as HTMLElement;
    portraitBackground = document.querySelector('#js-portrait-background') as HTMLElement;

    /**
     * Tiny Carousel
     * */

    const carouselNodes: NodeListOf<HTMLElement> = document.querySelectorAll('.image-carousel');
    const vidyasNodes: NodeListOf<HTMLElement> = document.querySelectorAll('.vidya');

    carousels = Array.from(carouselNodes).map((carousel) => new TinyCarousel(carousel));
    vidyas = Array.from(vidyasNodes).map((vid) => new Vidya(vid));

    /**
     * ScrollSniffer
     */
    const listener = new ScrollSniffer('.listen');
    listener.listen();

    highlightNav(navs);

    /**
     * Toggle device text
     */

    const mobileText = document.querySelectorAll('.mobile');
    const desktopText = document.querySelectorAll('.desktop');

    if (isTouchDevice()) {
        mobileText.forEach((el) => {
            el.classList.remove('hidden');
        });
    } else {
        desktopText.forEach((el) => {
            el.classList.remove('hidden');
        });
    }

    /**
      * Fade logos in
      */

    const brandLogos = document.querySelectorAll('.brand-logo');

    if (brandLogos.length) {
        brandLogos.forEach((logo, index) => {
            logo.addEventListener('load', () => {
                const i = index + 1;
                setTimeout(() => {
                    logo.classList.remove('opacity-0');
                }, i * 100);
            });
        });
    }
} // End init

/**
 * Portrait Parallaxing effect
 */


const portraitParallax = ({x, y} : Point) => {
    const angleTension = 80;
    const {
        x: angleX,
        y: angleY,
    } = calculateCenterAngle({x, y});
    portrait.style.backgroundPosition = `${50 - ((angleX / (angleTension / 2)) * -1)}%`;
    portrait.style.transform = `translateY(${(angleY / (angleTension / 4)) * -1}px) scale(1.01)`;
    portraitBackground.style.cssText = `transform: perspective(400px)
    rotateX(${angleY / (angleTension * 3)}deg)
    rotateY(${(angleX / (angleTension * 3)) * -1}deg)
    scale(1.02);`;
};

window.addEventListener('mousemove',
    ({
        clientX,
        clientY,
    }) => {
        if (portrait && portraitBackground && !isTouchDevice()) {
            portraitParallax({x: clientX, y: clientY});
        }
    });

/**
 * Mail
 */

const contactContainer = document.querySelector('#js-contact') as HTMLElement;
const toggleContactButton = document.querySelector('#js-toggle-contact') as HTMLElement;
const closeContact = document.querySelector('#js-close-contact') as HTMLElement;
const mailButton = document.querySelector('#js-send-mail') as HTMLElement;

const toggleContactContainer = () => {
        contactContainer.classList.toggle('off-canvas');
};


mailButton.addEventListener('click', (e) => sendMail(e));

    toggleContactButton.addEventListener('click', (e) => {
        e.preventDefault();
        toggleContactContainer();
    });

    closeContact.addEventListener('click', (e) => {
        e.preventDefault();
        toggleContactContainer();
    });

const fields: FormFields = {
    fname: document.querySelector('#fname') as HTMLInputElement,
    femail: document.querySelector('#femail') as HTMLInputElement,
    fmessage: document.querySelector('#fmessage') as HTMLInputElement,
    
};

for (const [key, field] of Object.entries(fields)) {
    if (field) {
        field.addEventListener('click', () => {
            field.classList.remove('error');
        });
    }
}

const updateFormState = (state = '', revert = false) => {

    const clear = () => {
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
        setTimeout(() => updateFormState(), 2000);
    }
};

const mailSuccess = () => {
    updateFormState('sent', true);
    setTimeout(() => {
        toggleContactContainer();
        for (const [key, field] of Object.entries(fields)) {
            if (field) {
                field.value = '';
            }
        }
    }, 1000);
};

const highlightBadFields = ({ errors } : FormAuthResponse) => {
    errors.forEach((error) => {
        console.log(error);
        const { param } = error;
        fields[param].classList.add('error');
    });
};

const sendMail = (e: Event) => {
    e.preventDefault();

    updateFormState('sending');

    const formData = new FormData();
    fields.fname && formData.append('fname', fields.fname.value);
    fields.femail && formData.append('femail', fields.femail.value);
    fields.fmessage && formData.append('fmessage', fields.fmessage.value);

    const object: {
        [index: string]: FormDataEntryValue;
    } = {
        fname: '',
        femail: '',
        fmessage: '',
    };
    formData.forEach((value, key) => {
        object[key] = value;
    });
    const json = JSON.stringify(object);

    fetch('send-mail', {
        method: 'post',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: json,
    })
        .then((res) => {
            if (res.ok) {
                mailSuccess();
            } else if (res.status === 503) {
                updateFormState('server-error', false);
            } else {
                updateFormState('failed', true);
            }
            return res;
        })
        .then((res) => res.json())
        .then((res: FormAuthResponse) => {
            if (res.hasOwnProperty('errors') && res.errors.length) {
                highlightBadFields(res);
            }
        })
        .catch(console.error);
};

/**
 * Page Transitions
 */

const animatedPanel = document.querySelector('#js-animated-panel');
const animations = ['fill', 'blob', 'stripes'];
const animSpeed = 1000;
let cycle = 0;

const tracks = animations.map((anim, i) => {
    const trackPanel = document.querySelector(`#anim-${i}`)! as HTMLElement;
    return {
        panel: trackPanel,
        animation: lottie.loadAnimation({
            container: trackPanel,
            renderer: 'svg',
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice',
            },
            autoplay: false,
            loop: false,
            path: `/assets/${anim}.json`,
        }),
    };
});

const playAnimation = (tracks: AnimationTrack[]) => {
    if (!tracks.length) return;
    tracks.forEach((track) => track.panel.classList.add('hidden'));

    tracks[cycle].panel.classList.remove('hidden');
    tracks[cycle].animation.goToAndPlay(0, true);
    cycle = cycle < tracks.length - 1 ? cycle + 1 : 0;
};

/**
 * Routing
 */

const cleanPaths = (path: string) => path.split('/').filter((p) => p !== '').join('/');

const invokePage = (href: string, pushState: boolean, fireEvents = true) => {
    
    if (fireEvents) document.dispatchEvent(new Event('PageInvokeStart'));
    const delay = fireEvents ? animSpeed : 0;

    setTimeout(() => {
        fetch(`/invoke/${href || 'home'}`)
            .then((res) => res.text())
            .then((html) => {
                contentSection.innerHTML = html;
                if (pushState) {
                    window.history.pushState({}, href, `${window.location.origin}/${href && href !== 'home' ? href : ''}`);
                }
            })
            .then(() => {
                window.scrollTo(0, 0);
                init();
                if (fireEvents) document.dispatchEvent(new Event('PageInvokeEnd'));
            });
    }, delay);
};

document.addEventListener('click', (e: Event) => {
    const target: HTMLElement = e.target as HTMLElement; 
    if (target && target.classList.contains('navigate')) {
        e.preventDefault();
        const href = target.dataset.href && cleanPaths(target.dataset.href);
        if (typeof href === 'string') {
            invokePage(href, true);
        }
    }
});

const contentOnLoad = (target: Window, fireEvents: boolean) => {
    const {
        pathname,
    } = target.location;
    const href = cleanPaths(pathname);
    invokePage(href, false, fireEvents);
};

window.addEventListener('popstate', ({
    target,
}) => contentOnLoad(target as Window, true));
window.addEventListener('load', ({
    target,
}) => contentOnLoad(target as Window, false));

document.addEventListener('PageInvokeStart', () => {
    animatedPanel && animatedPanel.classList.add('loading');
    playAnimation(tracks);
    setTimeout(() => {
        contentSection.classList.remove('loaded');
    }, animSpeed - 100);
});

document.addEventListener('PageInvokeEnd', () => {
    // Delay for animation
    setTimeout(() => {
        animatedPanel && animatedPanel.classList.remove('loading');
        contentSection.classList.add('loaded');
    }, 10);
});
