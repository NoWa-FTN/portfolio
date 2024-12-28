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
