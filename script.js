
document.addEventListener("DOMContentLoaded", () => {

  const navLinks = document.querySelectorAll('.navbar a');
  const currentPagePath = window.location.pathname.split('/').pop();

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');

    if (
      linkPath === currentPagePath ||
      (currentPagePath === '' && linkPath === 'index.html')
    ) {
      link.classList.add('active');
    }
  });

});

function searchRecipe() {
    const input = document
        .getElementById("ingredientSearch")
        .value
        .toLowerCase();

    const recipes = document.querySelectorAll(".recipe-card");

    recipes.forEach(recipe => {
        const ingredients = recipe.getAttribute("data-ingredients");

        if (ingredients.includes(input)) {
            recipe.style.display = "block";
        } else {
            recipe.style.display = "none";
        }
    });
}



