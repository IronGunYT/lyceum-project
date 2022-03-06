var scrolled_el = document.getElementsByClassName("menu")[0];

window.addEventListener('scroll', function(e) {
  scrolled_el.style.top = `${window.scrollY}px`;
});
