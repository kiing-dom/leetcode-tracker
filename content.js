function getProblemData() {
    const titleEl = document.querySelector('div[class*="text-title-large"]');
    const title = titleEl ? titleEl.textContent.trim() : "Unknown Title";
  
    const difficultyEl = Array.from(document.querySelectorAll('div[class*="text-difficulty"]')).find((el) =>
      el.textContent?.match(/Easy|Medium|Hard/)
    );
    const difficulty = difficultyEl
      ? difficultyEl.textContent.trim()
      : "Unknown Difficulty";
  
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const problemSlug = pathParts[1] || "unknown-problem";
  
    const problemData = {
      title,
      difficulty,
      slug: problemSlug,
      url: window.location.href,
      timestamp: Date.now(),
    };
  
    console.log("LC Problem Detected:", problemData);
    return problemData;
  }
  
  function waitForContentAndStore() {
    const observer = new MutationObserver(() => {
      const titleEl = document.querySelector("div");
      if (titleEl && titleEl.textContent.trim()) {
        observer.disconnect();
        const data = getProblemData();
        browser.storage.local.set({ [data.slug]: data }).then(() => {
          console.log("Saved to storage:", data);
        }).catch((err) => {
          console.error("Storage error:", err);
        });
      }
    });
  
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function waitForSubmissionResult(slug) {
    const observer = new MutationObserver(() => {
        const resultEl = document.querySelector('span[data-e2e-locator="submission-result"]');
        if (resultEl && resultEl.textContent.includes("Accepted")) {
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
  
  waitForContentAndStore();
 
  const { slug } = getProblemData();
  waitForSubmissionResult(slug);

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_PROBLEM_DATA') {
        const data = getProblemData();
        sendResponse(data);
    }
  });
  