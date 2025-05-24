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
  
  waitForContentAndStore();

  