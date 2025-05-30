// options.js
// Handles navigation and basic filtering for the options page

document.addEventListener('DOMContentLoaded', () => {
    // Sidebar navigation
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const sectionId = 'section-' + item.dataset.section;
            sections.forEach(sec => sec.classList.remove('active'));
            const activeSection = document.getElementById(sectionId);
            if (activeSection) activeSection.classList.add('active');
        });
    });

    // All Problems: load and render problems
    const problemsList = document.getElementById('problemsList');
    const searchInput = document.getElementById('searchInput');
    const tagFilter = document.getElementById('tagFilter');

    function renderProblems(problems, filterTag, searchTerm) {
        problemsList.innerHTML = '';
        let filtered = problems;
        if (filterTag && filterTag !== 'all') {
            filtered = filtered.filter(p => Array.isArray(p.tags) && p.tags.includes(filterTag));
        }
        if (searchTerm) {
            filtered = filtered.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (filtered.length === 0) {
            problemsList.innerHTML = '<p>No problems found.</p>';
        }
        filtered.forEach(problem => {
            const item = document.createElement('div');
            item.className = 'problem-item';
            const difficultyClass = problem.difficulty ? problem.difficulty.toLowerCase() : '';
            // Use DOM methods instead of innerHTML for safety
            const link = document.createElement('a');
            link.href = problem.url;
            link.target = '_blank';
            link.textContent = problem.title;

            const diffSpan = document.createElement('span');
            diffSpan.className = `difficulty ${difficultyClass}`;
            diffSpan.textContent = problem.difficulty;

            const tagsSpan = document.createElement('span');
            tagsSpan.style.fontSize = '0.85em';
            tagsSpan.style.color = problem.tags && problem.tags.length > 0 ? '#666' : '#bbb';
            tagsSpan.style.marginLeft = '8px';
            tagsSpan.textContent = problem.tags && problem.tags.length > 0
                ? `[${problem.tags.join(', ')}]`
                : '[No tags]';

            item.appendChild(link);
            item.appendChild(diffSpan);
            item.appendChild(tagsSpan);
            problemsList.appendChild(item);
        });
    }

    // Load problems from storage
    browser.storage.local.get(null).then((allData) => {
        const problems = Object.values(allData).filter(p =>
            p &&
            typeof p.title === 'string' && p.title !== 'Unknown Title' &&
            typeof p.slug === 'string' && p.slug !== 'unknown-problem' &&
            typeof p.difficulty === 'string' && p.difficulty !== 'Unknown Difficulty'
        );
        problems.sort((a, b) => (b.solvedAt || 0) - (a.solvedAt || 0));
        // Populate tag filter
        const tagSet = new Set();
        problems.forEach(p => {
            if (Array.isArray(p.tags)) {
                p.tags.forEach(tag => tagSet.add(tag));
            }
        });
        tagFilter.innerHTML = '<option value="all">All Tags</option>';
        Array.from(tagSet).forEach(tag => {
            const opt = document.createElement('option');
            opt.value = tag;
            opt.textContent = tag;
            tagFilter.appendChild(opt);
        });
        // Initial render
        renderProblems(problems, tagFilter.value, searchInput.value);
        // Event listeners
        tagFilter.addEventListener('change', () => {
            renderProblems(problems, tagFilter.value, searchInput.value);
        });
        searchInput.addEventListener('input', () => {
            renderProblems(problems, tagFilter.value, searchInput.value);
        });
    });
});
