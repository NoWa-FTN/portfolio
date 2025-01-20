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
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*OCEANE<3";
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

document.addEventListener('DOMContentLoaded', () => {

    const competencesContainer = document.querySelector('.competences');
    competences.forEach(comp => {
        const competenceDiv = document.createElement('div');
        competenceDiv.classList.add('competence');
        
        const name = document.createElement('p');
        name.classList.add('competence-name');
        name.textContent = comp.name;
        
        const progressBarContainer = document.createElement('div');
        progressBarContainer.classList.add('progress-bar-container');
        
        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar');
        progressBar.style.width = comp.level + '%';

        progressBarContainer.appendChild(progressBar);
        competenceDiv.appendChild(name);
        competenceDiv.appendChild(progressBarContainer);

        competencesContainer.appendChild(competenceDiv);
    });
});
