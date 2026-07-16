// Auto typing
const cursor = document.querySelector(".type-writer");
const words = [
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'Python Developer',
    'C/C++ Programmer',
    'Data Analyst',
    'Problem Solver',
];
let wordIndex = 0, letterIndex = 0, typing = true;

function write() {
    typing ? letterIndex++ : letterIndex--;
    if (letterIndex === words[wordIndex].length) setTimeout(() => { typing = false; }, 1000);
    if (letterIndex === 0) { typing = true; wordIndex = (wordIndex + 1) % words.length; }
    cursor.textContent = words[wordIndex].slice(0, letterIndex);
}
setInterval(write, 200);

// Hire Me Butoon
document.getElementById('hireMe').addEventListener('click', () => {
    window.open('https://www.upwork.com/freelancers/~0188b9c397bdd0e6df', '_blank');
})


// Skills progress bar animation
const skills = document.querySelectorAll('.skill-info');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const skill = entry.target;
        const barFill = skill.querySelector('.skill-bar-fill');
        const skillPercent = skill.querySelector('.skill-percent');
        const targetValue = parseInt(barFill.dataset.width);

        if (entry.isIntersecting) {
            clearInterval(skill.intervalId);
            let currentValue = 0;
            skill.intervalId = setInterval(() => {
                if (currentValue >= targetValue) {
                    clearInterval(skill.intervalId);
                } else {
                    currentValue++;
                    barFill.style.width = currentValue + '%';
                    skillPercent.innerHTML = currentValue + '%';
                }
            }, 15);
        } else {
            clearInterval(skill.intervalId);
            barFill.style.width = '0%';
            skillPercent.textContent = '0%';
        }
    });
});
skills.forEach(skill => skillObserver.observe(skill));


// Hamburger menu
const hamburger = document.getElementById('hamburger');
const nav = document.querySelector('nav');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    nav.classList.toggle('open');
});

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        nav.classList.remove('open');
    });
});


// Active nav link on scroll
const allSections = document.querySelectorAll('section');
const navLinks    = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
    const headerHeight = document.querySelector('header').offsetHeight;
    allSections.forEach((section) => {
        const top    = section.getBoundingClientRect().top - headerHeight - 10;
        const bottom = section.getBoundingClientRect().bottom - headerHeight;
        if (top <= 0 && bottom > 0) {
            navLinks.forEach(link => link.classList.remove('active'));
            const active = document.querySelector(`nav a[href="#${section.id}"]`);
            if (active) active.classList.add('active');
        }
    });
});


// =============================================
// Project Section — GitHub বা Local থেকে Data নেওয়া
// =============================================
const URL = "https://raw.githubusercontent.com/NayemHasan2007/NayemHasan2007.github.io/main/projects/projects.json";

const projectsGrid = document.querySelector('.projects-grid');
const backdrop = document.getElementById('modalBackdrop');
const modalCard = document.getElementById('modalCard');


function resolveImageUrl(url) {
    if (!url) return '';
    return url;
}

// Loading Skeleton UI
function showLoading() {
    projectsGrid.innerHTML = `
        <div class="project-card skeleton">
            <div class="project-img skeleton-img"></div>
            <div class="project-info">
                <div class="skeleton-line" style="width:60%;height:16px;margin-bottom:10px;"></div>
                <div class="skeleton-line" style="width:100%;height:12px;margin-bottom:6px;"></div>
                <div class="skeleton-line" style="width:80%;height:12px;margin-bottom:16px;"></div>
                <div style="display:flex;gap:8px;">
                    <div class="skeleton-line" style="width:50px;height:22px;border-radius:99px;"></div>
                    <div class="skeleton-line" style="width:40px;height:22px;border-radius:99px;"></div>
                </div>
            </div>
        </div>
    `.repeat(3);
}
 
// Error Message UI (ডাইনামিক মেসেজ সাপোর্ট সহ)
function showError(message = "Projects load করতে পারেনি") {
    projectsGrid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:40px 20px;color:var(--text-secondary);">
            <p style="font-size:15px;margin-bottom:8px;">${message}</p>
            <p style="font-size:13px;opacity:0.6;">GitHub repo চেক করো অথবা পরে আবার try করো</p>
        </div>
    `;
}
 
// Main Project Card Grid Create
function createCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
 
    const tagsHTML = (project.tech_stack || []).map(t => `<span>${t}</span>`).join('');
 
    card.innerHTML = `
        <div class="project-img">
            <img src="${resolveImageUrl(project.image_url)}" alt="${project.title || 'Project'}" loading="lazy"
                onerror="this.style.display='none';this.parentElement.classList.add('no-img')">
        </div>
        <div class="project-info">
            <h3>${project.title || ''}</h3>
            <p>${project.subtitle || ''}</p>
            <div class="project-tags">${tagsHTML}</div>
        </div>
    `;
 
    card.addEventListener('click', () => openModal(project));
    return card;
}

// Escape Key Handler
const handleEscapeKey = (e) => { if (e.key === 'Escape') closeModal(); };
 
// Dynamic Modal Open
function openModal(project) {
    const tagsHTML = (project.tech_stack || []).map(t => `<span>${t}</span>`).join('');
    const featuresHTML = (project.key_features || []).map(f => `<li>${f}</li>`).join('');
    
    let linksHTML = '';
    if (project.live_demo_url) linksHTML += `<a href="${project.live_demo_url}" target="_blank" class="modal-btn btn-live">↗ Live Demo</a>`;
    if (project.github_url)    linksHTML += `<a href="${project.github_url}"    target="_blank" class="modal-btn">{ } GitHub</a>`;

    modalCard.innerHTML = `
        <button class="modal-close-btn" id="modalClose" aria-label="Close">&times;</button>
        <div class="modal-img-wrap">
            <img src="${resolveImageUrl(project.image_url)}" alt="${project.title || 'Project'}" loading="lazy"
                onerror="this.style.display='none';this.parentElement.classList.add('no-img')">
        </div>
        
        <div class="modal-body">
            <h3>${project.title || ''}</h3>
            ${project.subtitle ? `<p id="modalSubtitle">${project.subtitle}</p>` : ''}
 
            ${project.tech_stack?.length ? `
            <div id="modalTagsBlock">
                <div class="modal-label">Tech Stack</div>
                <div class="modal-tags">${tagsHTML}</div>
            </div>` : ''}
 
            ${project.problem ? `
            <div id="modalProblemBlock">
                <hr class="modal-divider">
                <div class="modal-label">Problem</div>
                <p>${project.problem}</p>
            </div>` : ''}
 
            ${project.solution ? `
            <div id="modalSolutionBlock">
                <hr class="modal-divider">
                <div class="modal-label">Solution</div>
                <p>${project.solution}</p>
            </div>` : ''}
 
            ${project.key_features?.length ? `
            <div id="modalFeaturesBlock">
                <hr class="modal-divider">
                <div class="modal-label">Key Features</div>
                <ul class="modal-features">${featuresHTML}</ul>
            </div>` : ''}
 
            ${linksHTML ? `
            <hr class="modal-divider">
            <div class="modal-links">${linksHTML}</div>` : ''}
        </div>
    `;
 
    document.getElementById('modalClose').addEventListener('click', closeModal);
 
    backdrop.classList.add('show');
    modalCard.classList.add('show');
    document.body.style.overflow = 'hidden';
    document.getElementById('modalClose').focus();
    document.addEventListener('keydown', handleEscapeKey);
}
 
function closeModal() {
    backdrop.classList.remove('show');
    modalCard.classList.remove('show');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleEscapeKey);
    
    // মেমোরি সেফটি এবং ক্লিনআপের জন্য ইভেন্ট লিসেনার রিমুভ করা
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.removeEventListener('click', closeModal);
    }
}
 
backdrop.addEventListener('click', closeModal);
 
// Fetch Projects Data
async function loadProjects() {
    showLoading();
    try {
        const res = await fetch(URL);
        if (!res.ok) throw new Error(`Fetch failed with status: ${res.status}`);
        
        // সরাসরি JSON পার্স করা (যেহেতু RAW লিংকে কোনো Base64 বা .content থাকে না)
        const parsed = await res.json();
 
        const projects = parsed.projects || [];   
        if (projects.length === 0) {
            return showError('কোনো প্রজেক্ট পাওয়া যায়নি');
        }
 
        // DOM ম্যানিপুলেশন এবং কার্ড রেন্ডারিং
        projectsGrid.innerHTML = '';
        const fragment = document.createDocumentFragment();
        projects.forEach(p => fragment.appendChild(createCard(p)));
        projectsGrid.appendChild(fragment);
 
    } catch (err) {
        console.error('Projects load error:', err.message || err);
        showError();
    }
}
 
loadProjects();
