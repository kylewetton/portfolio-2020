export const calculateCenterAngle = ({x, y} : Point) : Point => {
    const client = document.body.getBoundingClientRect();
    const centerX = client.width / 2;
    const centerY = client.height / 2;
    const angleX = Math.floor(100 - (x / centerX * 100));
    const angleY = Math.floor(100 - (y / centerY * 100));
    return {
        x: angleX,
        y: angleY,
    };
};

export const highlightNav = (navs: NodeListOf<HTMLElement>) => {
    const page = window.location.pathname.split('/')[1];
    navs.forEach((n) => {
        const { href } = n.dataset;
        n.classList.remove('text-gold');
        if (href && href === page) {
            n.classList.add('text-gold');
        }
    });
};