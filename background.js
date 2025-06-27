
// Handles persistent messaging and storage for LeetCode Tracker
importScripts('browser-polyfill.js');

// Listen for messages from content scripts
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'PROBLEM_SOLVED' && message.slug) {
        // Update storage with solved status
        browser.storage.local.get(message.slug).then((existing) => {
            const data = existing[message.slug] || {};
            data.status = 'Solved';
            data.solvedAt = Date.now();
            browser.storage.local.set({ [message.slug]: data });
        });
    }
    // Optionally handle other message types here
});

// Listen for popup requests for problem data
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_PROBLEM_DATA' && message.slug) {
        browser.storage.local.get(message.slug).then((result) => {
            sendResponse(result[message.slug] || null);
        });
        // Return true to indicate async response
        return true;
    }
});