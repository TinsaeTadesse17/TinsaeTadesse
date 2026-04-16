/* ═══════════════════════════════════════════
   MAIN.JS — All logic in one clean file
   ═══════════════════════════════════════════ */

(function(){
'use strict';

/* ── State ── */
let mode = null;
let loreOpen = false;

/* ── DOM ── */
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const landing   = $('#landing');
const portfolio = $('#portfolio');
const loreEl    = $('#lore');

/* ── Init ── */
function init(){
    const saved = localStorage.getItem('tinsae-mode');
    if(saved){
        setMode(saved, true);
    }
    bind();
    startGreetings();
}

/* ── Greetings ── */
function startGreetings(){
    const helloEl = $('#hello-text');
    if(!helloEl) return;
    
    const greetings = [
        "Hello,", "ሰላም,", "你好,", "こんにちは,", 
        "Hola,", "Bonjour,", "Ciao,", "مرحباً,", 
        "Hallo,", "Olá,", "नमस्ते,"
    ];
    let idx = 0;
    
    helloEl.style.transition = 'opacity 0.5s ease';
    
    setInterval(() => {
        helloEl.style.opacity = '0';
        setTimeout(() => {
            idx = (idx + 1) % greetings.length;
            helloEl.textContent = greetings[idx];
            helloEl.style.opacity = '1';
        }, 500);
    }, 2500);
}

/* ── Set Mode ── */
function setMode(m, instant){
    mode = m;
    localStorage.setItem('tinsae-mode', m);
    document.body.classList.remove('aesthetic','minimalist');
    document.body.classList.add(m);

    // Update switch button text
    const sw = $('#mode-switch');
    if(sw) sw.textContent = m === 'aesthetic' ? '◐' : '⚡';

    if(instant){
        landing.classList.add('gone');
        portfolio.style.display = '';
        setTimeout(triggerReveals, 200);
    } else {
        // Start full page peel animation
        landing.classList.add('peeling');
        const rip = document.getElementById('landing-rip');
        if (rip) rip.style.display = 'block';
        
        // Expose portfolio underneath instantly so it unravels
        portfolio.style.display = '';
        setTimeout(triggerReveals, 50);
            
        // Clean up when animation finishes pushing off-screen
        setTimeout(() => {
            landing.classList.add('gone');
            landing.classList.remove('peeling');
            if (rip) rip.style.display = 'none';
        }, 2200);
    }
}

/* ── Switch mode ── */
function switchMode(){
    const next = mode === 'aesthetic' ? 'minimalist' : 'aesthetic';
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity .35s';
    setTimeout(() => {
        document.body.classList.remove('aesthetic','minimalist');
        document.body.classList.add(next);
        mode = next;
        localStorage.setItem('tinsae-mode', next);
        const sw = $('#mode-switch');
        if(sw) sw.textContent = next === 'aesthetic' ? '◐' : '⚡';
        document.body.style.opacity = '1';
    }, 350);
}

/* ── Scroll reveals ── */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if(e.isIntersecting){
            e.target.classList.add('in');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

function triggerReveals(){
    $$('.reveal').forEach(el => observer.observe(el));
}

/* ── Nav scroll ── */
function onScroll(){
    const nav = $('#nav');
    if(nav) nav.classList.toggle('scrolled', window.scrollY > 60);
}

/* ── Smooth scroll ── */
function scrollTo(hash){
    const el = $(hash);
    if(!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top:y, behavior:'smooth' });
}

/* ── Lore ── */
function openLore(){
    loreOpen = true;
    loreEl.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeLore(){
    loreOpen = false;
    loreEl.classList.remove('open');
    document.body.style.overflow = '';
}

/* ── Bind ── */
function bind(){
    // Landing choices
    const chooseStart = $('#choose-start');
    if(chooseStart) {
        chooseStart.addEventListener('click', () => {
            // Defaulting exclusively to light (minimalist) mode per the design choice
            setMode('minimalist');
        });
    }

    // Mode switch
    const sw = $('#mode-switch');
    if(sw) sw.addEventListener('click', switchMode);

    // Nav links
    $$('.nav__link').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            scrollTo(a.getAttribute('href'));
        });
    });

    // CTA buttons
    $$('.btn-primary, .btn-ghost').forEach(a => {
        if(a.getAttribute('href') && a.getAttribute('href').startsWith('#')){
            a.addEventListener('click', e => {
                e.preventDefault();
                scrollTo(a.getAttribute('href'));
            });
        }
    });

    // Lore triggers
    const navName = $('#nav-name');
    const heroName = $('#hero-name');
    if(navName) navName.addEventListener('click', openLore);
    if(heroName) heroName.addEventListener('click', openLore);
    heroName && (heroName.style.cursor = 'pointer');

    const loreClose = $('#lore-close');
    if(loreClose) loreClose.addEventListener('click', closeLore);
    loreEl.addEventListener('click', e => { if(e.target === loreEl) closeLore(); });

    // Escape
    document.addEventListener('keydown', e => {
        if(e.key === 'Escape' && loreOpen) closeLore();
    });

    // Scroll
    window.addEventListener('scroll', onScroll, { passive:true });

    // Re-observe on portfolio visibility change
    const mo = new MutationObserver(() => {
        if(portfolio.style.display !== 'none'){
            setTimeout(triggerReveals, 50);
        }
    });
    mo.observe(portfolio, { attributes:true, attributeFilter:['style'] });
}

document.addEventListener('DOMContentLoaded', init);

})();
