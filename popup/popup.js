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
        const problems = Object.values(allData).filter(p => p.status === "Solved");
        const list = document.getElementById("solvedList");

        if (problems.length === 0) {
            list.innerHTML = "<p>No solved problems yet</p>"
        }

        problems.forEach(problem => {
            const item = document.createElement("div");
            item.className = "problem-item";
            // Add difficulty as a class for color styling
            const difficultyClass = problem.difficulty ? problem.difficulty.toLowerCase() : "";
            item.innerHTML = `
                <a href="${problem.url}" target="_blank">${problem.title}</a>
                <span class="difficulty ${difficultyClass}">${problem.difficulty}</span>
            `;
            list.appendChild(item);
        })
    })
})

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
