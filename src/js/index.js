import '../scss/styles.scss';
import lottie from 'lottie-web-light';
/**
 * These three small packages are written by me,
 * specifically for this project
 */
import TinyCarousel from './tiny-carousel';
import ScrollSniffer from "scroll-sniffer";
import Vidya from './vidya';
/** ------------------------------------ */

const contentSection = document.querySelector('#content');
let portrait, portraitBackground, carousels, vidyas;

const isTouchDevice = () => 'ontouchstart' in window;

const navs = document.querySelectorAll('.navigate');

const highlightNav = () => {
  const page = window.location.pathname.split('/')[1];
  navs.forEach(n => {
    const {href} = n.dataset;
    n.classList.remove('text-gold');
    if (href && href === page) {
      n.classList.add('text-gold');
    }
  });
};

function init() {

  portrait = document.querySelector('#js-portrait');
  portraitBackground = document.querySelector('#js-portrait-background');

  /**
   * Tiny Carousel
   * */

  carousels = [...document.querySelectorAll('.image-carousel')].map(carousel => new TinyCarousel(carousel));
  vidyas = [...document.querySelectorAll('.vidya')].map(vid => new Vidya(vid));

  /**
   * ScrollSniffer
   */
  const listener = new ScrollSniffer(".listen");
  listener.listen();

  highlightNav();

  /**
   * Toggle device text
   */

   const mobileText = document.querySelectorAll('.mobile');
   const desktopText = document.querySelectorAll('.desktop');

   if (isTouchDevice()) {
      mobileText.forEach(el => {
        el.classList.remove('hidden');
    });
   } else {
    desktopText.forEach(el => {
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

const calculateCenterAngle = (x, y) => {
  const client = document.body.getBoundingClientRect();
  const centerX = client.width / 2;
  const centerY = client.height / 2;
  const angleX = Math.floor(100 - (x / centerX * 100));
  const angleY = Math.floor(100 - (y / centerY * 100));
  return {
    angleX,
    angleY
  };
};

const portraitParallax = (x, y) => {
  const angleTension = 80;
  const {
    angleX,
    angleY
  } = calculateCenterAngle(x, y);
  portrait.style.backgroundPosition = `${50 - ((angleX / (angleTension / 2)) * -1)}%`;
  portrait.style.transform = `translateY(${(angleY / (angleTension / 4)) * -1}px) scale(1.01)`;
  portraitBackground.style.cssText =
  `transform: perspective(400px)
    rotateX(${angleY / (angleTension * 3)}deg)
    rotateY(${(angleX / (angleTension * 3)) * -1}deg)
    scale(1.02);`;
};

window.addEventListener('mousemove',
  ({
    clientX,
    clientY
  }) => {
    if (portrait && portraitBackground && !isTouchDevice()) {
      portraitParallax(clientX, clientY);
    }
  });


/**
 * Mail
 */

const contactContainer = document.querySelector('#js-contact');
const toggleContactButton = document.querySelector('#js-toggle-contact');
const closeContact = document.querySelector('#js-close-contact');
const mailButton = document.querySelector('#js-send-mail');

const toggleContactContainer = () => {
  contactContainer.classList.toggle('off-canvas');
}

mailButton.addEventListener('click', (e) => sendMail(e));

toggleContactButton.addEventListener('click', (e) => {
  e.preventDefault();
  toggleContactContainer();
});

closeContact.addEventListener('click', (e) => {
  e.preventDefault();
  toggleContactContainer();
})

 const fields = {
   fname: document.querySelector('#fname'),
   femail: document.querySelector('#femail'),
   fmessage: document.querySelector('#fmessage')
 }

for (const [key, field] of Object.entries(fields)) {
  field.addEventListener('click', () => {
    // Remove any error classes when it's highlighted
    field.classList.remove('error');
  });
}

const updateFormState = (state = '', revert = false) => {

  const clear = () => {
    mailButton.classList.remove('sent');
    mailButton.classList.remove('sending');
    mailButton.classList.remove('failed');
  }
  clear();

switch(state) {
    case 'sending' :
      mailButton.classList.add('sending');
    break;
    case 'sent' :
      mailButton.classList.add('sent');
    break;
    case 'failed' :
      mailButton.classList.add('failed');
    break;
    case 'server-error' :
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
     field.value = '';
    }
  }, 1000);
}

const highlightBadFields = ({errors}) => {
  errors.forEach(error => {
    const {param} = error;
    fields[param].classList.add('error');
  });
} 

const sendMail = (e) => {
  e.preventDefault();

  updateFormState('sending');

  const formData = new FormData();
  formData.append('fname', fields.fname.value);
  formData.append('femail', fields.femail.value);
  formData.append('fmessage', fields.fmessage.value);

  const object = {};
  formData.forEach((value, key) => {
    object[key] = value
  });
  const json = JSON.stringify(object);

  fetch('send-mail', {
      "method": "post",
      "mode": "cors",
      headers: {
        "Content-Type": "application/json",
      },
      "body": json
    })
    .then(res => {
      if (res.ok) {
        mailSuccess();
      } else if (res.status === 503)  {
        updateFormState('server-error', false);
      }
      else {
        updateFormState('failed', true);
      }
     return res;
    })
    .then(res => res.json())
    .then(res => {
      if (res.errors.length) {
        highlightBadFields(res);
      }
    })
    .catch(console.error);
  }

/**
 * Page Transitions
 */

const animatedPanel = document.querySelector('#js-animated-panel');
const animations = ['fill', 'blob', 'stripes'];
const animSpeed = 1000;
let cycle = 0;

const tracks = animations.map((anim, i) => {
  const trackPanel = document.querySelector(`#anim-${i}`);
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
      path: `/assets/${anim}.json`
    })
  };
});

const playAnimation = () => {

  tracks.forEach(track => track.panel.classList.add('hidden'));

  tracks[cycle].panel.classList.remove('hidden');
  tracks[cycle].animation.goToAndPlay(0, true);
  cycle = cycle < tracks.length - 1 ? cycle + 1 : 0;
};


/**
 * Routing
 */

 const cleanPaths = path => path.split('/').filter(p => p !== '').join('/');


const invokePage = (href, pushState, fireEvents = true) => {

  if (fireEvents) document.dispatchEvent(new Event('PageInvokeStart'));
  const delay = fireEvents ? animSpeed : 0;

  setTimeout(() => {
    fetch(`/invoke/${href || 'home'}`)
      .then((res) => res.text())
      .then(html => {
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

document.addEventListener('click', e => {
  if (e.target && e.target.classList.contains('navigate')) {
    e.preventDefault();
    const href = cleanPaths(e.target.dataset.href);  
    invokePage(href, true);
  }
});

const contentOnLoad = (target, fireEvents) => {
  const {
    pathname
  } = target.location;
  const href = cleanPaths(pathname);
  invokePage(href, false, fireEvents);
};


window.addEventListener('popstate', ({
  target
}) => contentOnLoad(target, true));
window.addEventListener('load', ({
  target
}) => contentOnLoad(target, false));

document.addEventListener('PageInvokeStart', () => {
  animatedPanel.classList.add('loading');
  playAnimation();
  setTimeout(() => {
    contentSection.classList.remove('loaded');
  }, animSpeed - 100);
});

document.addEventListener('PageInvokeEnd', () => {
  // Delay for animation
  setTimeout(() => {
    animatedPanel.classList.remove('loading');
    contentSection.classList.add('loaded');
  }, 10);
});