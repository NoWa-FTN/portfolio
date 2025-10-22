(function(){
	'use strict';

	const canvas = document.getElementById('bg-canvas');
	if(!canvas) return;
	const ctx = canvas.getContext('2d');

	// Read CSS variables for colors with a fallback
	const rootStyles = getComputedStyle(document.documentElement);
	const ACCENT = rootStyles.getPropertyValue('--accent').trim() || '#00f0ff';
	const ACCENT2 = rootStyles.getPropertyValue('--accent-2').trim() || '#ff4dd2';
	const BG = rootStyles.getPropertyValue('--bg-900').trim() || '#05060a';

	// Config
	const cfg = {
		particleCount: Math.min(250, Math.round((window.innerWidth * window.innerHeight) / 12000)), // density scaled by viewport
		maxFPS: 60,
		matrixLines: Math.round(window.innerWidth / 24),
		speedMultiplier: 1.0,
		glowAlpha: 0.12
	};

	let width = 0, height = 0, DPR = Math.max(1, window.devicePixelRatio || 1);

	function resize(){
		DPR = Math.max(1, window.devicePixelRatio || 1);
		width = Math.max(300, window.innerWidth);
		height = Math.max(300, window.innerHeight);
		canvas.width = Math.round(width * DPR);
		canvas.height = Math.round(height * DPR);
		canvas.style.width = width + 'px';
		canvas.style.height = height + 'px';
		ctx.setTransform(DPR,0,0,DPR,0,0);

		// Recompute some density-based values
		cfg.particleCount = Math.min(350, Math.round((width * height) / 12000));
		cfg.matrixLines = Math.round(width / 24);
	}

	// Particle system
	const particles = [];
	function createParticles(){
		particles.length = 0;
		for(let i=0;i<cfg.particleCount;i++){
			particles.push({
				x: Math.random()*width,
				y: Math.random()*height,
				r: 0.4 + Math.random()*1.6,
				vx: (Math.random()-0.5)*0.2*cfg.speedMultiplier,
				vy: -0.05 - Math.random()*0.25*cfg.speedMultiplier,
				hueMix: Math.random()
			});
		}
	}

	// Matrix-like vertical streams
	const streams = [];
	function createStreams(){
		streams.length = 0;
		for(let i=0;i<cfg.matrixLines;i++){
			const x = (i + Math.random()*0.6) * (width / cfg.matrixLines);
			streams.push({
				x: x,
				y: Math.random()*-height,
				speed: 20 + Math.random()*80,
				length: 20 + Math.random()*80,
				hue: Math.random()
			});
		}
	}

	function mixColors(a, b, t){
		// a/b are hex like #rrggbb
		const pa = parseInt(a.replace('#',''),16);
		const pb = parseInt(b.replace('#',''),16);
		const ar = (pa>>16)&255, ag=(pa>>8)&255, ab=pa&255;
		const br = (pb>>16)&255, bg=(pb>>8)&255, bb=pb&255;
		const rr = Math.round(ar + (br-ar)*t);
		const rg = Math.round(ag + (bg-ag)*t);
		const rb = Math.round(ab + (bb-ab)*t);
		return `rgb(${rr},${rg},${rb})`;
	}

	let then = 0;

	function draw(now){
		// cap FPS
		if(!then) then = now;
		const elapsed = now - then;
		const minFrame = 1000 / cfg.maxFPS;
		if(elapsed < minFrame){
			requestAnimationFrame(draw);
			return;
		}
		then = now;

		// clear with subtle BG fill so underlying gradient shows through
		ctx.clearRect(0,0,width,height);
		ctx.fillStyle = BG || '#05060a';
		ctx.globalAlpha = 1;
		ctx.fillRect(0,0,width,height);

		// draw faint scanlines
		ctx.save();
		ctx.globalAlpha = 0.03;
		ctx.fillStyle = '#ffffff';
		const lineH = 24;
		for(let y=lineH*0.5; y<height; y+=lineH){
			ctx.fillRect(0, y, width, 1);
		}
		ctx.restore();

		// draw particles
		for(let p of particles){
			p.x += p.vx * (elapsed/16);
			p.y += p.vy * (elapsed/16);
			if(p.y < -10 || p.x < -20 || p.x > width+20){
				p.x = Math.random()*width;
				p.y = height + 10 + Math.random()*40;
			}

			const col = mixColors(ACCENT || '#00f0ff', ACCENT2 || '#ff4dd2', p.hueMix);
			ctx.beginPath();
			ctx.fillStyle = col;
			ctx.globalAlpha = 0.6 * Math.min(1, p.r/2);
			ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
			ctx.fill();
		}

		// glow blobs (large, soft)
		for(let i=0;i<3;i++){
			const gx = (i/3.0)*width + (Math.sin((now/8000)+(i*1.2))*120);
			const gy = height*0.18 + Math.cos((now/6000)+(i*0.9))*80;
			const grad = ctx.createRadialGradient(gx,gy,10,gx,gy,Math.max(width,height)*0.8);
			grad.addColorStop(0, mixColors(ACCENT, ACCENT2, i/3));
			grad.addColorStop(1, 'transparent');
			ctx.globalAlpha = cfg.glowAlpha * (0.6 + 0.4*Math.sin(now/1700 + i));
			ctx.fillStyle = grad;
			ctx.fillRect(0,0,width,height);
		}

		// matrix streams
		ctx.save();
		for(let s of streams){
			s.y += (s.speed * cfg.speedMultiplier) * (elapsed/1000);
			if(s.y - s.length > height) s.y = -Math.random()*height*0.5;

			// draw stream as soft vertical gradient line
			const grad = ctx.createLinearGradient(s.x, s.y - s.length, s.x, s.y + 6);
			const color = mixColors(ACCENT2, ACCENT, s.hue);
			grad.addColorStop(0, 'transparent');
			grad.addColorStop(0.6, color);
			grad.addColorStop(1, 'transparent');
			ctx.globalAlpha = 0.65;
			ctx.fillStyle = grad;
			ctx.fillRect(s.x - 1.5, s.y - s.length, 3, s.length + 12);
		}
		ctx.restore();

		// subtle vignette / top-left radial darkness
		ctx.save();
		const vgrad = ctx.createRadialGradient(width*0.1, height*0.1, 0, width*0.5, height*0.5, Math.max(width,height));
		vgrad.addColorStop(0, 'rgba(0,0,0,0)');
		vgrad.addColorStop(1, 'rgba(0,0,0,0.55)');
		ctx.globalCompositeOperation = 'multiply';
		ctx.globalAlpha = 0.6;
		ctx.fillStyle = vgrad;
		ctx.fillRect(0,0,width,height);
		ctx.restore();

		requestAnimationFrame(draw);
	}

	// initialize
	function init(){
		resize();
		createParticles();
		createStreams();
		window.addEventListener('resize', () => {
			// debounce resize
			clearTimeout(window._bgResize);
			window._bgResize = setTimeout(()=>{
				resize();
				createParticles();
				createStreams();
			}, 120);
		});

		// start loop
		requestAnimationFrame(draw);
	}

	// expose minimal API for runtime tweaking
	window.__bgCyber = {
		init,
		cfg,
		restart: () => { createParticles(); createStreams(); }
	};

	// auto-init when DOM ready
	if(document.readyState === 'loading'){
		document.addEventListener('DOMContentLoaded', init);
	} else init();

})();

// Typewriter effect Hero
const subtitle = "Pentester | Exploits | Sécurité";
let i = 0;
function typeWriter() {
    const el = document.getElementById('hero-subtitle');
    if (i < subtitle.length) {
        el.textContent += subtitle.charAt(i);
        i++;
        setTimeout(typeWriter, 80);
    }
}
document.addEventListener('DOMContentLoaded', typeWriter);

// Canvas interaction on project hover
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

const projects = document.querySelectorAll('.project[data-hover]');
projects.forEach(project => {
    project.addEventListener('mouseenter', () => {
        // Example: trigger glow effect on canvas
        ctx.globalAlpha = 0.3;
    });
    project.addEventListener('mouseleave', () => {
        ctx.globalAlpha = 1;
    });
});

// Typewriter effect pour About Hero
const aboutSubtitle = "Pentester | Exploits | Sécurité | Passion Cyber";
let j = 0;
function typeWriterAbout() {
    const el = document.getElementById('about-subtitle');
    if (j < aboutSubtitle.length) {
        el.textContent += aboutSubtitle.charAt(j);
        j++;
        setTimeout(typeWriterAbout, 80);
    }
}
document.addEventListener('DOMContentLoaded', typeWriterAbout);


// Timeline appear on scroll
function timelineScrollAnimation() {
    const items = document.querySelectorAll('.timeline-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 }); // 15% visible triggers animation

    items.forEach(item => observer.observe(item));
}

// Initialise l’animation après chargement du DOM
document.addEventListener('DOMContentLoaded', timelineScrollAnimation);
