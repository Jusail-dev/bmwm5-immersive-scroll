// Configurations
const FRAME_COUNT = 80;
const IMAGE_PATH_PREFIX = '/assets/bmw seq 2/nznvwry4v1rmt0cwn2d8gj8cvw_result__';
const IMAGE_EXTENSION = '.jpg';

// State
let images = [];
let loadedImages = 0;
const sequenceState = { frame: 0 };

// DOM Elements
const canvas = document.getElementById('sequence-canvas');
const ctx = canvas.getContext('2d');
const progressBar = document.getElementById('progress-bar');
const heroTitle = document.querySelector('.hero-title');
const gsapCards = document.querySelectorAll('.gsap-card');

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Resize handler
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderFrame(Math.round(sequenceState.frame));
}

window.addEventListener('resize', resizeCanvas);

// Preload Images
function preloadImages() {
    for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        const paddedIndex = i.toString().padStart(3, '0');
        img.src = `${IMAGE_PATH_PREFIX}${paddedIndex}${IMAGE_EXTENSION}`;
        img.onload = () => {
            loadedImages++;
            if (loadedImages === FRAME_COUNT) {
                init();
            }
        };
        img.onerror = () => {
            loadedImages++;
            if (loadedImages === FRAME_COUNT) init();
        }
        images.push(img);
    }
}

// Render a specific frame to canvas
function renderFrame(index) {
    if (!images[index] || !images[index].complete || images[index].naturalWidth === 0) return;

    const img = images[index];

    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
    } else {
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

// Setup GSAP Animations
function setupAnimations() {
    // 1. Progress Bar Scrub
    gsap.to(progressBar, {
        width: "100%",
        ease: "none",
        scrollTrigger: {
            trigger: "#scroll-spacer",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.1
        }
    });

    // 2. Canvas Opacity Fade In (0 -> 15%)
    gsap.to(canvas, {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
            trigger: "#scroll-spacer",
            start: "top top",
            end: "15% top",
            scrub: true
        }
    });

    // 3. Hero Title Fade Out (5 -> 25%)
    gsap.set(heroTitle, { opacity: 1, y: 0 }); // Intial set
    gsap.to(heroTitle, {
        opacity: 0,
        y: -30,
        ease: "power1.inOut",
        scrollTrigger: {
            trigger: "#scroll-spacer",
            start: "5% top",
            end: "25% top",
            scrub: true
        }
    });

    // 4. Image Sequence Scrub (Continuous 0 -> 100%)
    gsap.to(sequenceState, {
        frame: FRAME_COUNT - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
            trigger: "#scroll-spacer",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5 // Smoothing
        },
        onUpdate: () => renderFrame(Math.round(sequenceState.frame))
    });

    // 5. Build GSAP ScrollTriggers for each Card
    gsapCards.forEach(card => {
        const rangeStr = card.getAttribute('data-range');
        if (!rangeStr) return;

        const [startPc, endPc] = rangeStr.split('-');
        const midPc = (parseInt(startPc) + parseInt(endPc)) / 2;

        // Card Entry/Exit logic triggered by scroll bounds
        gsap.to(card, {
            opacity: 1,
            x: 0, // Slides in from either 30px or -30px defined in CSS
            autoAlpha: 1, // Handles both opacity and visibility
            ease: "power2.out",
            scrollTrigger: {
                trigger: "#scroll-spacer",
                // Dynamically build scroll trigger boundaries based on percentages
                start: `${startPc}% top`,
                end: `${endPc}% top`,
                toggleActions: "play reverse play reverse",
                // play when entering, reverse past end, play entering back, reverse leaving back to top
            }
        });

        // Click to Snap Scroll Location
        card.addEventListener('click', () => {
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            const targetScrollY = maxScroll * (midPc / 100);

            gsap.to(window, {
                scrollTo: targetScrollY,
                duration: 1.5,
                ease: "power3.inOut"
            });
        });
    });

    // 6. Footer Reveal Animation
    const footerInner = document.querySelector('.footer-inner');
    if (footerInner) {
        gsap.to(footerInner, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: "#site-footer",
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });
    }

    // 7. Back to Top Button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            gsap.to(window, {
                scrollTo: 0,
                duration: 2,
                ease: "power3.inOut"
            });
        });
    }
}

// Initialization
function init() {
    resizeCanvas();
    setupAnimations();
    renderFrame(0);
}

// Start preload process
preloadImages();
