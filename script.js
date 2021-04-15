//fancybox settings
$('[data-fancybox="images"]').fancybox({
	// What buttons should appear in the top right corner.
	// Buttons will be created using templates from `btnTpl` option
	// and they will be placed into toolbar (class="fancybox-toolbar"` element)
	buttons: [
	  'close'
	],

	// Open/close animation type
	// Possible values:
	//   false            - disable
	//   "zoom"           - zoom images from/to thumbnail
	//   "fade"
	//   "zoom-in-out"
	animationEffect: "zoom-in-out",

	// Should display navigation arrows at the screen edges
	arrows: false,

	// Should display counter at the top left corner
	infobar: false,


});

//alert onclick hector
window.onload = function() {
      document.getElementById("hector").onclick = function() {
        // Do your stuff here
		alert("Hector: ...\nAchievement #1!");
      };
   };