async function getProblemData() {
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const problemSlug = pathParts[1] || "unknown-problem";
    if (!problemSlug || problemSlug === "unknown-problem") {
        return null;
    }
    let apiData = null;
    try {
        apiData = await fetchLeetCodeProblemData(problemSlug);
    } catch (e) {
        apiData = null;
        console.log(e.message);
    }
    if (!apiData?.title || !apiData?.difficulty) {
        return null;
    }
    const problemData = {
        title: apiData.title,
        difficulty: apiData.difficulty,
        slug: problemSlug,
        url: window.location.href,
        timestamp: Date.now(),
        tags: apiData.tags,
    };
    console.log("LC Problem Detected (API):", problemData);
    return problemData;
}

// Wait for content and store problem data (with tags)
function waitForContentAndStore() {
    const observer = new MutationObserver(async () => {
        const titleEl = document.querySelector("div");
        if (titleEl?.textContent.trim()) {
            observer.disconnect();
            const data = await getProblemData();
            if (!data) return; // Don't store invalid/undefined problems
            // Only update non-status fields, always preserve status/solvedAt
            browser.storage.local.get(data.slug).then((existing) => {
                const prev = existing[data.slug] || {};
                // Always preserve status and solvedAt if they exist
                if (prev.status) data.status = prev.status;
                if (prev.solvedAt) data.solvedAt = prev.solvedAt;
                browser.storage.local.set({ [data.slug]: data }).then(() => {
                    console.log("Saved to storage (non-status fields updated):", data);
                }).catch((err) => {
                    console.error("Storage error:", err);
                });
                // Start watching for submission result after we have the slug
                waitForSubmissionResult(data.slug);
            });
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function waitForSubmissionResult(slug) {
    const observer = new MutationObserver(() => {
        const resultEl = document.querySelector('span[data-e2e-locator="submission-result"]');
        if (resultEl?.textContent.includes("Accepted")) {
            console.log("✅ Accepted detected via submission result!");

            browser.storage.local.get(slug).then((existing) => {
                const data = existing[slug] || {};
                data.status = "Solved";
                data.solvedAt = Date.now();
                browser.storage.local.set({ [slug]: data })

                browser.runtime.sendMessage({ type: 'PROBLEM_SOLVED', slug});
                observer.disconnect();
            });
        }
    });

    observer.observe(document.body, {childList: true, subtree: true});
}

// Fix: browser.runtime.onMessage must handle async getProblemData
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_PROBLEM_DATA') {
        getProblemData().then((data) => {
            sendResponse(data);
        });
        return true; // Indicate async response
    }
});

waitForContentAndStore();
