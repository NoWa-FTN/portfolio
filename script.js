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

// Fonction pour générer des caractères aléatoires
function createCharacter() {
    const charElement = document.createElement('div');
    charElement.classList.add('hacking-char');

    // Caractères aléatoires (lettres, chiffres, ou symboles)
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*";
    const randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
    charElement.textContent = randomChar;

    // Position aléatoire horizontale
    charElement.style.left = `${Math.random() * window.innerWidth}px`;

    // Ajout de l'élément au conteneur de fond
    background.appendChild(charElement);

    // Supprime le caractère après l'animation
    setTimeout(() => {
        charElement.remove();
    }, 4000);
}

// Générer des caractères en boucle
setInterval(createCharacter, 100);


document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.fade-in');

    elements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('visible');
        }, index * 175);
    });
});
