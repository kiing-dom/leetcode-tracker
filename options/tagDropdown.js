// Custom Tag Dropdown Component
// Usage: new TagDropdown(containerElement, tagsArray, onChange)

class TagDropdown {
    constructor(container, tags, onChange) {
        this.container = container;
        this.tags = tags;
        this.onChange = onChange;
        this.selectedTag = 'all';
        this.filteredTags = ['all', ...tags];
        this.createDropdown();
    }

    createDropdown() {
        this.container.innerHTML = '';
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'tag-dropdown';

        // Selected display
        this.selected = document.createElement('div');
        this.selected.className = 'tag-dropdown-selected';
        this.selected.tabIndex = 0;
        // Add text and chevron icon
        const selectedText = document.createElement('span');
        selectedText.className = 'tag-dropdown-selected-text';
        selectedText.textContent = 'All Tags';
        this.selected.appendChild(selectedText);
        const chevron = document.createElement('i');
        chevron.className = 'ri-arrow-down-s-line tag-dropdown-chevron';
        this.selected.appendChild(chevron);
        this.selected.addEventListener('click', () => this.toggleList());
        this.selected.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') this.toggleList();
        });
        this.dropdown.appendChild(this.selected);

        // Dropdown list
        this.list = document.createElement('div');
        this.list.className = 'tag-dropdown-list';
        this.list.style.display = 'none';

        // Search input
        this.searchInput = document.createElement('input');
        this.searchInput.type = 'text';
        this.searchInput.className = 'tag-dropdown-search';
        this.searchInput.placeholder = 'Search tags...';
        this.searchInput.addEventListener('input', () => this.filterTags());
        this.list.appendChild(this.searchInput);

        // Tag options
        this.optionsContainer = document.createElement('div');
        this.optionsContainer.className = 'tag-dropdown-options';
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
        this.filteredTags.forEach(tag => {
            const opt = document.createElement('div');
            opt.className = 'tag-dropdown-option';
            opt.textContent = tag === 'all' ? 'All Tags' : tag;
            if (tag === this.selectedTag) opt.classList.add('selected');
            opt.addEventListener('click', () => this.selectTag(tag));
            this.optionsContainer.appendChild(opt);
        });
    }

    filterTags() {
        const val = this.searchInput.value.toLowerCase();
        this.filteredTags = ['all', ...this.tags.filter(tag => tag.toLowerCase().includes(val))];
        this.renderOptions();
    }

    selectTag(tag) {
        this.selectedTag = tag;
        // Update only the text span
        const textSpan = this.selected.querySelector('.tag-dropdown-selected-text');
        if (textSpan) textSpan.textContent = tag === 'all' ? 'All Tags' : tag;
        this.closeList();
        if (this.onChange) this.onChange(tag);
    }

    toggleList() {
        this.list.style.display = this.list.style.display === 'none' ? 'block' : 'none';
        if (this.list.style.display === 'block') {
            this.searchInput.value = '';
            this.filterTags();
            this.searchInput.focus();
        }
    }

    closeList() {
        this.list.style.display = 'none';
    }

    setTags(tags) {
        this.tags = tags;
        this.filteredTags = ['all', ...tags];
        this.renderOptions();
    }
}

window.TagDropdown = TagDropdown;
