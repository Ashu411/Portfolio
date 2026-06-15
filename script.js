/* ─────────────────────────────────────────────────
   PORTFOLIO SCRIPT — Ashutosh Kumar
───────────────────────────────────────────────── */

/* ── Custom Cursor ───────────────────────────── */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

let mx = -100, my = -100;
let fx = -100, fy = -100;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function animFollower() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  requestAnimationFrame(animFollower);
})();

document.querySelectorAll('a, button, .cert-header, .pill, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
    follower.classList.add('hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
    follower.classList.remove('hover');
  });
});

/* ── Navbar scroll behaviour ─────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── Hamburger menu ──────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── Scroll reveal ───────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseFloat(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.dataset.delay = (i % 4) * 80;
  revealObserver.observe(el);
});

/* ── Progress bars animation ─────────────────── */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bar-fill').forEach(bar => {
        const w = bar.dataset.w;
        setTimeout(() => { bar.style.width = w + '%'; }, 200);
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const barsSection = document.querySelector('.proficiency-bars');
if (barsSection) barObserver.observe(barsSection);

/* ── Certificates accordion ──────────────────── */
document.querySelectorAll('.cert-item').forEach(item => {
  const header = item.querySelector('.cert-header');
  header.addEventListener('click', () => {
    const isOpen = item.dataset.open === 'true';
    // Close all
    document.querySelectorAll('.cert-item').forEach(c => c.dataset.open = 'false');
    // Toggle clicked
    item.dataset.open = isOpen ? 'false' : 'true';
  });
});

/* ── Contact form validation ─────────────────── */
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

function showErr(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}
function clearErrs() {
  ['nameErr','emailErr','subjectErr','messageErr'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
  ['name','email','subject','message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('error');
  });
}
function markError(fieldId, errId, msg) {
  const field = document.getElementById(fieldId);
  if (field) field.classList.add('error');
  showErr(errId, msg);
}

form && form.addEventListener('submit', e => {
  e.preventDefault();
  clearErrs();
  formSuccess.classList.remove('show');

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  let valid = true;

  if (!name) {
    markError('name','nameErr','Name is required.');
    valid = false;
  } else if (name.length < 2) {
    markError('name','nameErr','Name must be at least 2 characters.');
    valid = false;
  }

  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    markError('email','emailErr','Email is required.');
    valid = false;
  } else if (!emailReg.test(email)) {
    markError('email','emailErr','Please enter a valid email.');
    valid = false;
  }

  if (!subject) {
    markError('subject','subjectErr','Subject is required.');
    valid = false;
  }

  if (!message) {
    markError('message','messageErr','Message cannot be empty.');
    valid = false;
  } else if (message.length < 10) {
    markError('message','messageErr','Message should be at least 10 characters.');
    valid = false;
  }

  if (!valid) return;

  /* Simulate submission */
  const btn = form.querySelector('.btn-submit');

btn.textContent = 'Sending...';
btn.disabled = true;

emailjs.send(
  "service_q964hbg",
  "template_9fdjrkq",
  {
    name: name,
    email: email,
    subject: subject,
    message: message
  }
)
.then(() => {

  form.reset();

  btn.innerHTML =
  '<span class="btn-text">Send Message</span><span class="btn-arrow">→</span>';

  btn.disabled = false;

  formSuccess.innerHTML =
  '<span>✓</span> Message sent successfully!';

  formSuccess.classList.add('show');

  setTimeout(() => {
    formSuccess.classList.remove('show');
  }, 5000);

})
.catch((error) => {

  console.error(error);

  btn.innerHTML =
  '<span class="btn-text">Send Message</span><span class="btn-arrow">→</span>';

  btn.disabled = false;

  formSuccess.innerHTML =
  '<span>✕</span> Failed to send message.';

  formSuccess.classList.add('show');

});
});

/* ── Active nav link on scroll ───────────────── */
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navAs.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--gold)' : '';
  });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });

/* ── Ring animation speed on hover ───────────── */
const avatarRing = document.querySelector('.ring-svg');
if (avatarRing) {
  avatarRing.parentElement.addEventListener('mouseenter', () => {
    avatarRing.style.animationDuration = '4s';
  });
  avatarRing.parentElement.addEventListener('mouseleave', () => {
    avatarRing.style.animationDuration = '20s';
  });
}

/* ── Subtle parallax on hero ─────────────────── */
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-grid-overlay');
  if (hero) {
    hero.style.transform = `translateY(${window.scrollY * 0.2}px)`;
  }
}, { passive: true });


/* ── Certificate Modal ───────────────── */

const certificateModal =
document.getElementById("certificateModal");

const certificateModalImage =
document.getElementById("certificateModalImage");

const closeCertificateModal =
document.getElementById("closeCertificateModal");

document.querySelectorAll(".certificate-card img")
.forEach(img => {

  img.addEventListener("click", () => {

    certificateModalImage.src = img.src;

    certificateModal.classList.add("show");

    document.body.style.overflow = "hidden";
  });

});

function closeModal(){

  certificateModal.classList.remove("show");

  document.body.style.overflow = "";

}

closeCertificateModal.addEventListener(
"click",
closeModal
);

certificateModal.addEventListener(
"click",
e => {

  if(
    e.target.classList.contains(
      "certificate-modal-overlay"
    )
  ){
    closeModal();
  }

});

document.addEventListener(
"keydown",
e => {

  if(
    e.key === "Escape" &&
    certificateModal.classList.contains("show")
  ){
    closeModal();
  }

});