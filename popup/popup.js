document.addEventListener("DOMContentLoaded", () => {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    const tab = tabs[0];

    const url = new URL(tab.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const slug = pathParts[1] || null;
    if (!slug) {
      document.getElementById("popupContent").innerHTML = "<p>To track a problem, please visit a leetcode problem page</p>";
      return;
    }

    const container = document.getElementById("popupContent");

    browser.storage.local.get(slug).then((result) => {
      let data = result[slug];
      if (data) {
        renderCurrentProblem(data);
      } else {

        browser.runtime
          .sendMessage({ type: "GET_PROBLEM_DATA", slug })
          .then((data) => {
            if (data) {
              renderCurrentProblem(data);
            } else {
              container.innerHTML = "<p>To track a problem please visit a leetcode problem page</p>";
            }
          })
          .catch((err) => {
            container.innerHTML = "<p>Unable to read this page.</p>";
            console.error(err);
          });
      }
    });

    function renderCurrentProblem(data) {
      container.innerHTML = "";
      const titleEl = document.createElement("h3");
      titleEl.textContent = `Problem: ${data.title}`;
      const diffEl = document.createElement("p");
      diffEl.textContent = `Difficulty: ${data.difficulty} `;
      const statusEl = document.createElement("p");
      statusEl.id = "status";
      const strongEl = document.createElement("strong");
      strongEl.textContent = data.status || "Unsolved";
      statusEl.appendChild(strongEl);
      container.appendChild(titleEl);
      container.appendChild(diffEl);
      container.appendChild(statusEl);

      // Listen for problem solved message
      browser.runtime.onMessage.addListener((msg) => {
        if (msg.type === "PROBLEM_SOLVED" && msg.slug === data.slug) {
          const statusEl = document.getElementById("status");
          if (statusEl) statusEl.textContent = "Solved ✅";
        }
      });
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  browser.storage.local.get(null).then((allData) => {
    // Filter out invalid/undefined problems before displaying
    const problems = Object.values(allData).filter(
      (p) =>
        p &&
        typeof p.title === "string" &&
        p.title !== "Unknown Title" &&
        typeof p.slug === "string" &&
        p.slug !== "unknown-problem" &&
        typeof p.difficulty === "string" &&
        p.difficulty !== "Unknown Difficulty" &&
        p.status === "Solved"
    );

    problems.sort((a, b) => (b.solvedAt || 0) - (a.solvedAt || 0));

    const tagSet = new Set();
    problems.forEach((p) => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach((tag) => tagSet.add(tag));
      }
    });
    const tags = Array.from(tagSet);

    // Populate tag filter dropdown
    const tagFilter = document.getElementById("tagFilter");
    if (tagFilter) {
      // Remove old options except 'All'
      tagFilter.innerHTML = '<option value="all">All</option>';
      if (tags.length > 0) {
        tags.forEach((tag) => {
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

    function renderProblems() {
      const list = document.getElementById("solvedList");
      list.innerHTML = "";
      let filtered = problems;
      const selectedTag = tagFilter ? tagFilter.value : "all";
      if (selectedTag && selectedTag !== "all" && selectedTag !== "none") {
        filtered = problems.filter(
          (p) => Array.isArray(p.tags) && p.tags.includes(selectedTag)
        );
      }
      const toShow = filtered.slice(0, 5);
      if (toShow.length === 0) {
        list.innerHTML = "<p>No solved problems yet</p>";
      }
      toShow.forEach((problem) => {
        const item = document.createElement("div");
        item.className = "problem-item";
        const difficultyClass = problem.difficulty
          ? problem.difficulty.toLowerCase()
          : "";

        const link = document.createElement("a");
        link.href = problem.url;
        link.target = "_blank";
        link.textContent = problem.title;

        const diffSpan = document.createElement("span");
        diffSpan.className = `difficulty ${difficultyClass}`;
        diffSpan.textContent = problem.difficulty;

        const tagsSpan = document.createElement("span");
        tagsSpan.style.fontSize = "0.85em";
        tagsSpan.style.color =
          problem.tags && problem.tags.length > 0 ? "#666" : "#bbb";
        tagsSpan.style.marginLeft = "8px";
        tagsSpan.textContent =
          problem.tags && problem.tags.length > 0
            ? `[${problem.tags.join(", ")}]`
            : "[No tags]";

        item.appendChild(link);
        item.appendChild(diffSpan);
        item.appendChild(tagsSpan);
        list.appendChild(item);
      });
    }

    if (tagFilter) {
      tagFilter.addEventListener("change", renderProblems);
    }
    renderProblems();
  });

  const viewAllLink = document.getElementById("viewAllLink");
  if (viewAllLink) {
    viewAllLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (browser.runtime?.openOptionsPage) {
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
      if (browser.runtime?.openOptionsPage) {
        browser.runtime.openOptionsPage();
      } else {
        window.open("../options/options.html", "_blank");
      }
    });
  }
});
