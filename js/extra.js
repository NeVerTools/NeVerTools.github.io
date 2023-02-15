var toggler = document.getElementsByClassName("treeview");
var i;

for (i = 0; i < toggler.length; i++) {
  toggler[i].addEventListener("click", function() {
    this.parentElement.querySelector(".tw-nested").classList.toggle("active");
    this.classList.toggle("treeview-down");
  });
}
