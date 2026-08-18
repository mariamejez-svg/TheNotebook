const searchOverlay = document.getElementById("searchOverlay");
const searchInput = document.getElementById("searchInput");

function openSearch() {
    searchOverlay.style.display = "flex";
    searchInput.focus();
}

function closeSearch() {
    searchOverlay.style.display = "none";
    searchInput.value = "";
}

searchInput.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeSearch();
    }
});