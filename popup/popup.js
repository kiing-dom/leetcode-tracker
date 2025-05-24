document.addEventListener("DOMContentLoaded", () => {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    const tab = tabs[0];
    // Get the problem slug from the URL
    const url = new URL(tab.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const slug = pathParts[1] || null;
    if (!slug) {
      document.body.innerHTML = "<p>Not a leetcode problem page</p>";
      return;
    }
    // Ask background for the latest problem data
    browser.runtime.sendMessage({ type: "GET_PROBLEM_DATA", slug })
      .then((data) => {
        if (!data) {
          document.body.innerHTML = "<p>Not a leetcode problem page</p>";
          return;
        }
        const container = document.getElementById("popupContent");
        container.innerHTML = `
            <h3>Problem: ${data.title}</h3>
            <p>Difficulty: ${data.difficulty} </p>
            <p id="status"><strong>${data.status || "Unsolved"}</strong></p>
        `;

        // Listen for problem solved message
        browser.runtime.onMessage.addListener((msg) => {
            if (msg.type === "PROBLEM_SOLVED" && msg.slug === data.slug) {
                const statusEl = document.getElementById("status");
                if (statusEl) statusEl.textContent = "Solved ✅";
            }
        });
      })
      .catch((err) => {
        document.body.innerHTML = "<p>Unable to read this page</p>";
        console.error(err);
      });
  });
});

document.addEventListener("DOMContentLoaded", () => {
    browser.storage.local.get(null).then((allData) => {
        // Filter out invalid/undefined problems before displaying
        const problems = Object.values(allData).filter(p =>
            p &&
            typeof p.title === 'string' && p.title !== 'Unknown Title' &&
            typeof p.slug === 'string' && p.slug !== 'unknown-problem' &&
            typeof p.difficulty === 'string' && p.difficulty !== 'Unknown Difficulty' &&
            p.status === "Solved"
        );
        // Sort by solvedAt descending (most recent first)
        problems.sort((a, b) => (b.solvedAt || 0) - (a.solvedAt || 0));

        // Collect all unique tags (flattened)
        const tagSet = new Set();
        problems.forEach(p => {
            if (Array.isArray(p.tags)) {
                p.tags.forEach(tag => tagSet.add(tag));
            }
        });
        const tags = Array.from(tagSet);

        // Populate tag filter dropdown
        const tagFilter = document.getElementById("tagFilter");
        if (tagFilter) {
            // Remove old options except 'All'
            tagFilter.innerHTML = '<option value="all">All</option>';
            if (tags.length > 0) {
                tags.forEach(tag => {
                    const opt = document.createElement("option");
                    opt.value = tag;
                    opt.textContent = tag;
                    tagFilter.appendChild(opt);
                });
            } else {
                const opt = document.createElement("option");
                opt.value = "none";
                opt.textContent = "No tags";
                tagFilter.appendChild(opt);
            }
        }

        // Render problems (filtered and limited)
        function renderProblems() {
            const list = document.getElementById("solvedList");
            list.innerHTML = "";
            let filtered = problems;
            const selectedTag = tagFilter ? tagFilter.value : "all";
            if (selectedTag && selectedTag !== "all" && selectedTag !== "none") {
                filtered = problems.filter(p => Array.isArray(p.tags) && p.tags.includes(selectedTag));
            }
            const toShow = filtered.slice(0, 5);
            if (toShow.length === 0) {
                list.innerHTML = "<p>No solved problems yet</p>";
            }
            toShow.forEach(problem => {
                const item = document.createElement("div");
                item.className = "problem-item";
                const difficultyClass = problem.difficulty ? problem.difficulty.toLowerCase() : "";
                // Show tags if available
                const tagsHtml = Array.isArray(problem.tags) && problem.tags.length > 0
                    ? `<span style='font-size:0.85em; color:#666; margin-left:8px;'>[${problem.tags.join(", ")}]</span>`
                    : "<span style='font-size:0.85em; color:#bbb; margin-left:8px;'>[No tags]</span>";
                item.innerHTML = `
                    <a href="${problem.url}" target="_blank">${problem.title}</a>
                    <span class="difficulty ${difficultyClass}">${problem.difficulty}</span>
                    ${tagsHtml}
                `;
                list.appendChild(item);
            });
        }

        if (tagFilter) {
            tagFilter.addEventListener("change", renderProblems);
        }
        renderProblems();
    });

    // View All link opens options page
    const viewAllLink = document.getElementById("viewAllLink");
    if (viewAllLink) {
        viewAllLink.addEventListener("click", (e) => {
            e.preventDefault();
            if (browser.runtime && browser.runtime.openOptionsPage) {
                browser.runtime.openOptionsPage();
            } else {
                window.open("../options/options.html", "_blank");
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const optionsBtn = document.getElementById("optionsBtn");
    if (optionsBtn) {
        optionsBtn.addEventListener("click", () => {
            if (browser.runtime && browser.runtime.openOptionsPage) {
                browser.runtime.openOptionsPage();
            } else {
                // fallback for browsers that don't support openOptionsPage
                window.open("../options/options.html", "_blank");
            }
        });
    }
});
