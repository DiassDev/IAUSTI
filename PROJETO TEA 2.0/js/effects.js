document.addEventListener("DOMContentLoaded", () => {
  const containers = document.querySelectorAll(".section-2 > div");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 }); 

  containers.forEach((container) => {
    observer.observe(container);
  });
});
