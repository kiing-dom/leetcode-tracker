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
        this.list.className = 'difficulty-dropdown-list'
        this.list.style.display = 'none'

        this.searchInput = document.createElement('input');
        this.searchInput.type = 'text';
        this.searchInput.className = 'difficulty-dropdown-search';
        this.searchInput.placeholder = 'Search Difficulties...';
        this.searchInput.addEventListener('input', () => this.filterDifficulties());
        this.list.appendChild(this.searchInput);

        this.optionsContainer = document.createElement('div');
        this.optionsContainer.className = 'difficulty-dropdown-options';
        this.list.appendChild(this.optionsContainer);

        this.dropdown.appendChild(this.list);
        this.container.appendChild(this.dropdown);

        this.renderOptions();
        document.addEventListener('click', (e) => {
            if (!this.dropdown.contains(e.target)) this.closeList();
        });
    }

    renderOptions() {
        this.optionsContainer.innerHTML = '';
        this.filteredDifficulties.forEach(difficulty => {
            const opt = document.createElement('div');
            opt.className = 'difficulty-dropdown-option';
            opt.textContent = difficulty === 'all' ? 'All Difficulties' : difficulty;
            if (difficulty === this.selectedDifficulty) opt.classList.add('selected');
            opt.addEventListener('click', () => this.selectDifficulty(difficulty));
            this.optionsContainer.appendChild(opt);
        });
    }

    filterDifficulties() {
        const val = this.searchInput.value.toLowerCase();
        this.filteredDifficulties = ['all', ...this.difficulties
            .filter(difficulty => difficulty
                .toLowerCase()
                .includes(val)
            )];
        this.renderOptions();
    }

    selectDifficulty(difficulty) {
        this.selectedDifficulty = difficulty;
        
        const textSpan = this.selected.querySelector('.difficulty-dropdown-selected-text');
        if (textSpan) textSpan.textContent = difficulty === 'all' ? 'All Difficulties' : difficulty;
        this.closeList();
    }
    
    toggleList() {
        
    }

    closeList() {

    }

    selectDifficulty() {

    }

}
window.DifficultyDropdown = DifficultyDropdown;
