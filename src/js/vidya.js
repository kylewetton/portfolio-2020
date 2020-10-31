class Vidya {
    constructor(el) {
        this.el = el;
        this.videoEl = null;
        this.mount();
    }
    
    mount() {
        const {file} = this.el.dataset;
        this.el.innerHTML = `
        <video class="listen" loop muted playsinline width="250">
        <source src="/assets/projects/${file}.mp4"
                type="video/mp4">
            Sorry, your browser doesn't support embedded videos.
        </video>      
        `
        this.videoEl = this.el.querySelector('video');
        window.addEventListener('resize', () => this._setSize());
        this.videoEl.addEventListener("Scroll:allIn", () => this.play());
        this.videoEl.addEventListener("Scroll:out", () => this.pause());
        this.videoEl.addEventListener("Scroll:in", () => this._setSize());
    }
    play() {
        this.videoEl.play();
        this._setSize();
    }
    pause() {
        this.videoEl.pause();
        this._setSize();
    }
    _setSize() {
        const width = this.el.getBoundingClientRect().width;
        this.videoEl.width = width;
    }
}

export default Vidya;