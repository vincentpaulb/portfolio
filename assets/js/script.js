    const projects = {
      p1: {
        num: 'Project 01',
        title: 'Local Multifunctional AI Chatbot',
        desc: 'An AI-powered chatbot built for local inference and document-aware support, combining web integration with practical automation features.',
        tags: ['Python', 'PHP', 'JavaScript', 'Ollama', 'FastAPI'],
        feats: ['Scalable AI chatbot using LLMs via Ollama for local inference','Retrieval-Augmented Generation (RAG) for file-based querying','Streaming responses with optimized latency for better UX','Backend APIs via FastAPI/PHP for real-time processing'],
        folder: 'images/Project 1'
      },
      p2: {
        num: 'Project 02',
        title: 'Internal Ticketing Service System',
        desc: 'A streamlined ticketing platform for internal IT requests and incident tracking across departments.',
        tags: ['PHP', 'JavaScript', 'MySQL', 'Bootstrap'],
        feats: ['Centralized ticketing workflow for all IT requests','Improved response and resolution time by 60%','Enhanced cross-team communication and tracking efficiency'],
        folder: 'images/Project 2'
      },
      p3: {
        num: 'Project 03',
        title: 'Project Tracking Hub System',
        desc: 'A centralized system for monitoring deadlines, deliverables, reporting, and team accountability.',
        tags: ['Laravel', 'PHP', 'JavaScript', 'MySQL'],
        feats: ['Structured tracking platform for full project visibility','Improved accountability across multiple teams','Real-time reporting and status tracking for better decisions'],
        folder: 'images/Project 3'
      },
      p4: {
        num: 'Project 04',
        title: 'Attendance & Event Management System',
        desc: 'A management solution for registration, attendance, participant tracking, and automated reporting.',
        tags: ['PHP', 'JavaScript', 'MySQL', 'Bootstrap'],
        feats: ['Unified attendance and event/training workflows','Simplified registration with automated report generation','Improved end-to-end event management efficiency'],
        folder: 'images/Project 4'
      }
    };

    let currentSlide = 0, totalSlides = 0;

    // Common image extensions to try
    const IMG_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

    function buildSlide(src) {
      const slide = document.createElement('div');
      slide.className = 'slide';
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      // Let the image size naturally; CSS handles the rest
      slide.appendChild(img);
      return slide;
    }

    function buildPlaceholder(index) {
      const slide = document.createElement('div');
      slide.className = 'slide';
      slide.innerHTML = `<div class="slide-placeholder"><div class="slide-ph-icon"><i class="fa-solid fa-image"></i></div><span class="slide-ph-label">Image ${index + 1}</span><span class="slide-ph-num">0${index + 1}</span></div>`;
      return slide;
    }

    async function discoverImages(folder) {
      const images = [];
      // Try numbered filenames: 1.jpg, 1.png, 2.jpg ... up to 20
      for (let i = 1; i <= 20; i++) {
        let found = false;
        for (const ext of IMG_EXTS) {
          const src = `${folder}/${i}.${ext}`;
          const ok = await imageExists(src);
          if (ok) { images.push(src); found = true; break; }
        }
        // Stop after 2 consecutive misses
        if (!found && i > 1 && images.length > 0) break;
      }
      return images;
    }

    function imageExists(src) {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = src;
      });
    }

    async function openModal(id) {
      const p = projects[id];
      currentSlide = 0;

      // Fill text content immediately
      document.getElementById('modalEyebrow').textContent = p.num;
      document.getElementById('modalTitle').textContent = p.title;
      document.getElementById('modalDesc').textContent = p.desc;
      document.getElementById('modalTags').innerHTML = p.tags.map(t => `<span class="tag">${t}</span>`).join('');
      document.getElementById('modalFeats').innerHTML = p.feats.map(f => `<div class="feat"><i class="fa-solid fa-chevron-right"></i> ${f}</div>`).join('');

      // Show modal right away with a loading state
      const slideshow = document.getElementById('modalSlideshow');
      slideshow.querySelectorAll('.slide').forEach(s => s.remove());
      document.getElementById('slideDots').innerHTML = '';

      const loadingSlide = document.createElement('div');
      loadingSlide.className = 'slide active';
      loadingSlide.innerHTML = `<div class="slide-placeholder"><div class="slide-ph-icon"><i class="fa-solid fa-spinner fa-spin"></i></div><span class="slide-ph-label">Loading images…</span></div>`;
      slideshow.insertBefore(loadingSlide, slideshow.querySelector('.slide-arrow'));

      document.getElementById('modalOverlay').classList.add('open');
      document.body.style.overflow = 'hidden';

      // Discover images
      const images = await discoverImages(p.folder);

      // Clear loading slide
      slideshow.querySelectorAll('.slide').forEach(s => s.remove());
      document.getElementById('slideDots').innerHTML = '';

      if (images.length === 0) {
        // No images found — show friendly message
        const ph = document.createElement('div');
        ph.className = 'slide active';
        ph.style.position = 'relative';
        ph.innerHTML = `
          <div class="slide-placeholder">
            <span style="font-size:0.95rem; color:var(--ink-4);">Sorry, no available images yet.</span>
          </div>`;
        slideshow.insertBefore(ph, slideshow.querySelector('.slide-arrow'));
        totalSlides = 1;
      } else {
        totalSlides = images.length;
        images.forEach((src, i) => {
          const slide = buildSlide(src);
          if (i === 0) {
            slide.classList.add('active');
            slide.style.position = 'relative';
          } else {
            slide.style.position = 'absolute';
          }
          slideshow.insertBefore(slide, slideshow.querySelector('.slide-arrow'));

          const dot = document.createElement('button');
          dot.className = 'dot' + (i === 0 ? ' active' : '');
          dot.onclick = () => goToSlide(i);
          document.getElementById('slideDots').appendChild(dot);
        });
      }
    }

    function closeModal() {
      document.getElementById('modalOverlay').classList.remove('open');
      document.body.style.overflow = '';
    }

    function handleOverlayClick(e) {
      if (e.target === document.getElementById('modalOverlay')) closeModal();
    }

    function goToSlide(n) {
      const slides = document.querySelectorAll('.modal-slideshow .slide');
      const dots = document.querySelectorAll('#slideDots .dot');
      // Outgoing: make absolute so it doesn't affect layout
      slides[currentSlide].classList.remove('active');
      slides[currentSlide].style.position = 'absolute';
      if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
      currentSlide = (n + totalSlides) % totalSlides;
      // Incoming: make relative so it drives slideshow height
      slides[currentSlide].style.position = 'relative';
      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });



    const scrollBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    });
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });