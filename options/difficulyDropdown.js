class DifficultyDropdown {
    constructor(container, difficulties, onChange) {
        this.container = container;
        this.difficulties = difficulties;
        this.onChange = onChange;
        this.selectedDifficulty = 'all';
        this.filteredDifficulties = ['all', ...difficulties];
        this.createDropdown();
    }

    createDropdown() {
        this.container.innerHTML = '';
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'difficulty-dropdown';
        
        this.selected = document.createElement('div');
        this.selected.className = 'difficulty-dropdown-selected';
        this.selected.tabIndex = 0;

        const selectedText = document.createElement('span');
        selectedText.className = 'difficulty-dropdown-selected-text';
        selectedText.textContent = 'All Difficulties';
        this.selected.appendChild(selectedText);
        const chevron = document.createElement('i');
        chevron.className = 'ri-arrow-down-s-line difficulty-dropdown-chevron'
        this.selected.appendChild(chevron);
        this.selected.addEventListener('click', () => this.toggleList());
        this.selected.addEventListener('keydown', (e) => {
            if (e.key == 'Enter' || e.key == ' ') this.toggleList();
        });
        this.dropdown.appendChild(this.selected);
        
        this.list = document.createElement('div');
    }

    renderOptions() {
        // TODO: Finish function
    }

    filterDifficulties() {
        // TODO: Finish function
    }

    selectDifficulty(tag) {
        // TODO: Finish function
    }
    
    toggleList() {
        // TODO: Finish function
    }

    closeList() {

    }

    selectDifficulty() {

    }

}
window.DifficultyDropdown = DifficultyDropdown;