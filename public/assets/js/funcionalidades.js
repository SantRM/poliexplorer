function toggleDropdown() {
    document.getElementById("miDropdown").classList.toggle("show");
  }

  // Cierra el dropdown si haces clic fuera
  window.onclick = function(event) {
    if (!event.target.matches('.dropdown-button')) {
      var dropdowns = document.getElementsByClassName("dropdown");
      for (let i = 0; i < dropdowns.length; i++) {
        dropdowns[i].classList.remove("show");
      }
    }
  }