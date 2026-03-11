// Calculate years in business dynamically
function updateYears() {
    const foundingEl = document.querySelector("[data-founding]");
    const foundingYear = foundingEl ? parseInt(foundingEl.dataset.founding, 10) : 2020;
    const currentYear = new Date().getFullYear();
    const yearsInBusiness = currentYear - foundingYear;
    const yearsEl = document.getElementById("years-in-business");
    const yearsExpEl = document.getElementById("years-experience");
    if (yearsEl) yearsEl.textContent = yearsInBusiness;
    if (yearsExpEl) yearsExpEl.textContent = yearsInBusiness;
}
updateYears();

// ─── Testimonial Carousel ────────────────────────────────────────────────────
class TestimonialCarousel {
    constructor() {
        this.track = document.getElementById("testimonialTrack");
        if (!this.track) return;
        this.slides = this.track.querySelectorAll(".testimonial-slide");
        this.prevBtn = document.getElementById("prevBtn");
        this.nextBtn = document.getElementById("nextBtn");
        this.indicatorsContainer = document.getElementById("indicators");
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = null;
        this.init();
    }

    init() {
        this.createIndicators();
        this.prevBtn.addEventListener("click", () => this.goToPrevious());
        this.nextBtn.addEventListener("click", () => this.goToNext());
        this.startAutoPlay();
        this.track.addEventListener("mouseenter", () => this.stopAutoPlay());
        this.track.addEventListener("mouseleave", () => this.startAutoPlay());
    }

    createIndicators() {
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement("div");
            dot.classList.add("indicator-dot");
            if (i === 0) dot.classList.add("active");
            dot.addEventListener("click", () => this.goToSlide(i));
            this.indicatorsContainer.appendChild(dot);
        }
    }

    updateIndicators() {
        const dots = this.indicatorsContainer.querySelectorAll(".indicator-dot");
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === this.currentIndex);
        });
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.track.style.transform = `translateX(${-this.currentIndex * 100}%)`;
        this.updateIndicators();
    }

    goToNext() {
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.goToSlide(this.currentIndex);
    }

    goToPrevious() {
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(this.currentIndex);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.goToNext(), 5000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// ─── Service Card Before/After Hover ─────────────────────────────────────────
function initServiceImageHover() {
    const serviceImages = document.querySelectorAll(".service-image");
    serviceImages.forEach((img) => {
        const afterImage = img.getAttribute("data-after");
        const beforeImage = img.getAttribute("data-before");
        if (afterImage && beforeImage) {
            const card = img.closest(".service-card");
            card.addEventListener("mouseenter", () => { img.src = afterImage; });
            card.addEventListener("mouseleave", () => { img.src = beforeImage; });
        }
    });
}

// ─── Mobile tap-to-toggle before/after ───────────────────────────────────────
function initMobileImageToggle() {
    if (window.innerWidth > 768) return;
    document.querySelectorAll(".service-card").forEach((card) => {
        const img = card.querySelector(".service-image");
        if (!img) return;
        const after = img.getAttribute("data-after");
        const before = img.getAttribute("data-before");
        if (after && before) {
            let showingAfter = false;
            card.addEventListener("click", () => {
                showingAfter = !showingAfter;
                img.src = showingAfter ? after : before;
            });
        }
    });
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    new TestimonialCarousel();
    initServiceImageHover();
    initMobileImageToggle();
});
