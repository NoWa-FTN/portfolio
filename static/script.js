document.addEventListener('DOMContentLoaded', () => {
    // Sélection des éléments
    const sidebar = document.getElementById('sidebar');
    const mainContainer = document.getElementById('main-container');
    const toggleButton = document.getElementById('toggleButton');

    // Vérifie que les éléments existent
    if (sidebar && toggleButton && mainContainer) {
        toggleButton.addEventListener('click', () => {
            // Basculer la visibilité de la sidebar
            sidebar.classList.toggle('hidden');

            // Ajuster le conteneur principal
            mainContainer.classList.toggle('full-width');
        });
    } else {
        console.error("L'un des éléments (sidebar, bouton, conteneur) n'a pas été trouvé.");
    }
});

const background = document.getElementById('background');

// Fonction pour générer des cercles
function createCircle() {
    const circle = document.createElement('div');
    circle.classList.add('circle');

    // Taille et position aléatoires
    const size = Math.random() * 100 + 50; // Entre 50px et 150px
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    circle.style.left = `${Math.random() * window.innerWidth}px`;
    circle.style.top = `${Math.random() * window.innerHeight}px`;

    // Durée et délai aléatoires
    circle.style.animationDuration = `${Math.random() * 5 + 5}s`;
    circle.style.animationDelay = `${Math.random() * 3}s`;

    background.appendChild(circle);

    // Supprime le cercle après l'animation
    setTimeout(() => {
        circle.remove();
    }, 10000);
}

// Crée des cercles en boucle
setInterval(createCircle, 500);
