class DifficultyDropdown {
    constructor(container, difficulties, onChange) {
        this.container = container;
        this.difficulties = difficulties;
        this.onChange = onChange;
        this.selectedDifficulty = 'all';
        this.filteredDifficulties = ['all', ...difficulties];
    }
}