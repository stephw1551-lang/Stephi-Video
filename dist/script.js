document.documentElement.classList.add("js");

const videos = [...document.querySelectorAll("[data-project-video]")];

function pauseOtherVideos(activeVideo) {
  videos.filter((video) => video !== activeVideo).forEach((video) => video.pause());
}

videos.forEach((video) => {
  video.addEventListener("play", () => pauseOtherVideos(video));
});

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = [...document.querySelectorAll("[data-reveal]")];

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  revealItems.forEach((item) => observer.observe(item));
}
