/**
 * Rondas de Negocios CAME — main.js
 * Descripción: Lógica interactiva de la landing page.
 * Incluye: navegación con scroll, menú mobile, animaciones
 * de reveal, contador animado de estadísticas y lightbox
 * de inscripción a rondas.
 * Extraído del index.html monolítico — 2026-03-30
 */

'use strict';

document.addEventListener('DOMContentLoaded', function () {

  // ── Scroll nav shadow ──
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // ── Mobile menu ──
  function toggleMenu() {
    const burger = document.getElementById('burger');
    const menu = document.getElementById('mobileMenu');
    burger.classList.toggle('open');
    menu.classList.toggle('open');
  }

  // Exponer toggleMenu al scope global porque el HTML usa onclick="toggleMenu()"
  window.toggleMenu = toggleMenu;

  // ── Scroll reveal ──
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  // ── Counter animation ──
  function animateCount(el, target, prefix = '', suffix = '', duration = 1800) {
    const startTime = performance.now();
    const isFloat = target % 1 !== 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);

      // Format with thousands separator
      const formatted = current >= 1000
        ? current.toLocaleString('es-AR')
        : current;

      el.innerHTML = prefix + formatted + (suffix ? `<span>${suffix}</span>` : '');

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nums = entry.target.querySelectorAll('[data-target]');
        nums.forEach(el => {
          const target = parseInt(el.dataset.target);
          const prefix = el.dataset.prefix || '';
          const suffix = el.dataset.suffix || '';
          animateCount(el, target, prefix, suffix);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const statsStrip = document.querySelector('.stats-strip');
  if (statsStrip) statsObserver.observe(statsStrip);

  // ── Smooth anchor scroll with nav offset ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Lightbox data ──
  const rounds = {
    tech: {
      sectorClass: 'round-card__sector--tech',
      sectorLabel: 'Tecnología',
      title: 'Ronda de Negocios de Tecnología 2026',
      meta: [
        { icon: 'calendar', text: '8 de abril de 2026' },
        { icon: 'location', text: 'Ciudad de Buenos Aires' },
        { icon: 'clock', text: 'Inscripciones hasta el 2 de abril' },
      ],
      desc: 'Una jornada exclusiva para el sector tecnológico donde proveedores de hardware, software, servicios digitales e insumos se reúnen con compradores calificados. Reuniones cara a cara de 15-20 minutos con agenda personalizada.',
      deadline: 'Inscripción cierra el <strong>2 de abril de 2026</strong>',
      cta: 'mailto:rondas@came.org.ar?subject=Inscripción Ronda Tecnología 2026',
      flyerTitle: 'Ronda de Negocios\nTecnología 2026',
      flyerSub: '8 de abril · Ciudad de Buenos Aires',
      flyerColor: '#EEF2FF',
      flyerAccent: '#4338CA',
    },
    azul: {
      sectorClass: 'round-card__sector--multi',
      sectorLabel: 'Multisectorial',
      title: '2ª Ronda de Negocios Multisectorial Azul 2026',
      meta: [
        { icon: 'calendar', text: '10 de abril de 2026' },
        { icon: 'location', text: 'Av. Presidente Perón y Alberdi, Azul, Buenos Aires' },
        { icon: 'clock', text: 'Inscripciones hasta el 5 de abril' },
      ],
      desc: 'La segunda edición de la Ronda Multisectorial en Azul, organizada junto al Centro Empresario de Azul (CEDA). Abierta a todos los sectores productivos y comerciales de la región.',
      deadline: 'Inscripción cierra el <strong>5 de abril de 2026</strong>',
      cta: 'mailto:rondas@came.org.ar?subject=Inscripción Ronda Multisectorial Azul 2026',
      flyerTitle: 'Ronda Multisectorial\nAzul 2026',
      flyerSub: '10 de abril · Azul, Buenos Aires',
      flyerColor: '#F0FDF4',
      flyerAccent: '#166534',
    },
    ferretero: {
      sectorClass: 'round-card__sector--hardware',
      sectorLabel: 'Ferretería',
      title: 'Ronda de Negocios — Encuentro Ferretero 2026',
      meta: [
        { icon: 'calendar', text: '11 de abril de 2026' },
        { icon: 'location', text: 'NH Gran Hotel Provincial, Mar del Plata, Buenos Aires' },
        { icon: 'clock', text: 'Inscripciones hasta el 5 de abril' },
      ],
      desc: 'Organizado junto a la Cámara de Ferreteros de Mar del Plata. Dirigido a empresas del sector ferretero, construcción, eléctrico y pinturería. Una jornada para impulsar y fortalecer la cadena de valor del sector.',
      deadline: 'Inscripción cierra el <strong>5 de abril de 2026</strong>',
      cta: 'mailto:rondas@came.org.ar?subject=Inscripción Encuentro Ferretero 2026',
      flyerTitle: 'Encuentro Ferretero\n2026',
      flyerSub: '11 de abril · Mar del Plata',
      flyerColor: '#FEF3C7',
      flyerAccent: '#92400E',
    },
  };

  const svgIcons = {
    calendar: '<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
    location: '<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    clock:    '<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  };

  function openLightbox(id) {
    const r = rounds[id];
    if (!r) return;

    document.getElementById('lbSector').innerHTML =
      `<span class="round-card__sector ${r.sectorClass}" style="margin-bottom:0">${r.sectorLabel}</span>`;
    document.getElementById('lbTitle').textContent = r.title;
    document.getElementById('lbMeta').innerHTML = r.meta
      .map(m => `<div class="lightbox__meta-item">${svgIcons[m.icon]} ${m.text}</div>`).join('');
    document.getElementById('lbDesc').textContent = r.desc;
    document.getElementById('lbDeadline').innerHTML = r.deadline;
    document.getElementById('lbCta').href = r.cta;

    // Flyer placeholder
    document.getElementById('lbFlyerInner').style.background = r.flyerColor;
    document.getElementById('lbFlyerInner').innerHTML = `
      <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="${r.flyerAccent}" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <strong style="color:${r.flyerAccent};font-size:16px;white-space:pre-line">${r.flyerTitle}</strong>
      <span style="font-size:12px;color:#666">${r.flyerSub}</span>
      <span style="font-size:11px;color:#999;margin-top:8px">Flyer oficial disponible<br>al confirmar inscripción</span>
    `;

    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
  }

  function closeLightboxOutside(e) {
    if (e.target === document.getElementById('lightbox')) closeLightbox();
  }

  // Exponer funciones del lightbox al scope global (usadas en onclick del HTML)
  window.openLightbox = openLightbox;
  window.closeLightbox = closeLightbox;
  window.closeLightboxOutside = closeLightboxOutside;

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

});
