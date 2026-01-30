/* Script.js */
document.addEventListener('DOMContentLoaded', () => {

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Fade in elements on scroll
    const fadeElements = document.querySelectorAll('.card, .section-title, .project-card, .timeline-item, .vision-box, .tag');
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add 'visible' class style purely via JS to avoid cluttering CSS if JS disabled
    // Or better, add a class in CSS
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);

    // Mobile Menu Toggle (Simple)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.right = '0';
                navLinks.style.background = '#0a0a0a';
                navLinks.style.width = '200px';
                navLinks.style.padding = '1rem';
                navLinks.style.border = '1px solid #333';
            }
        });
    }

    // Setup Reveal Links (Flip Effect)
    document.querySelectorAll('.reveal-link').forEach(link => {
        const text = link.textContent;
        link.textContent = ''; // Clear text

        // Container for initial text (Top Layer)
        const topLayer = document.createElement('div');
        topLayer.style.display = 'block';

        // Container for hover text (Bottom Layer - overlays via absolute in CSS logic usually, 
        // but here we can just put them side by side if using the transform trick)
        // Actually, easier mapping:
        // We need letter by letter structure.

        /* 
           Desired DOM for each letter 'A':
           <span style="position: relative; display: inline-block; overflow: hidden;">
             <span class="top" style="display:block">A</span>
             <span class="bottom" style="position: absolute; top: 0; left: 0; transform: translateY(100%)">A</span>
           </span>
           
           Wait, the React component uses:
           Wrapper (overflow hidden)
             Div 1 (Standard flow) -> Spans
             Div 2 (Absolute inset-0) -> Spans
        */

        const wrapper1 = document.createElement('div');
        const wrapper2 = document.createElement('div');

        wrapper2.style.position = 'absolute';
        wrapper2.style.top = '0';
        wrapper2.style.left = '0';
        wrapper2.style.width = '100%';
        wrapper2.style.height = '100%';

        // Stagger time
        const STAGGER = 0.025;

        text.split('').forEach((char, i) => {
            // Top Char
            const span1 = document.createElement('span');
            span1.textContent = char;
            span1.style.display = 'inline-block';
            span1.style.transition = `transform 0.25s ease-in-out ${i * STAGGER}s`;
            span1.className = 'top-char';
            if (char === ' ') span1.style.width = '0.3em'; // Preserve space
            wrapper1.appendChild(span1);

            // Bottom Char
            const span2 = document.createElement('span');
            span2.textContent = char;
            span2.style.display = 'inline-block';
            span2.style.transition = `transform 0.25s ease-in-out ${i * STAGGER}s`;
            span2.className = 'bottom-char';
            // Initial state handled in CSS or here
            // CSS: .bottom-char { transform: translateY(100%) }
            if (char === ' ') span2.style.width = '0.3em';
            wrapper2.appendChild(span2);
        });

        link.appendChild(wrapper1);
        link.appendChild(wrapper2);
    });

    // Hide Spline Logo (Aggressive)
    const splineViewer = document.querySelector('spline-viewer');
    if (splineViewer) {
        const removeLogo = () => {
            const shadowRoot = splineViewer.shadowRoot;
            if (shadowRoot) {
                const logo = shadowRoot.querySelector('#logo');
                if (logo) {
                    logo.remove();
                }
                // Also inject CSS just in case
                const style = document.createElement('style');
                style.textContent = '#logo { display: none !important; opacity: 0 !important; visibility: hidden !important; }';
                shadowRoot.appendChild(style);
            }
        };

        // Try immediately
        removeLogo();

        // Try on load
        splineViewer.addEventListener('load', removeLogo);

        // Try repeatedly for a few seconds to catch async rendering
        const intervalId = setInterval(removeLogo, 100);
        setTimeout(() => clearInterval(intervalId), 5000);
    }

});
