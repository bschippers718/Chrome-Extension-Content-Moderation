chrome.storage.local.get("blockedKeywords", (data) => {
    const blockedKeywords = (data.blockedKeywords || ["trump", "elon_musk", "musk", "elon musk", 'Elon Musk']).map(keyword => keyword.toLowerCase());
    
    function moderateContent() {
      console.log("Running content moderation...");
      document.querySelectorAll("article").forEach(article => {
        const textContent = article.innerText.toLowerCase();
        if (blockedKeywords.some(keyword => textContent.includes(keyword))) {
          console.log("Blocking tweet: ", textContent);
          article.style.display = "none";
        }
      });
    }
  
    function initializeModeration() {
      // Run moderation when the page is idle
      function runWhenIdle() {
        requestIdleCallback(() => {
          moderateContent();
          const observer = new MutationObserver(() => {
            console.log("Mutation observed, running content moderation...");
            moderateContent();
          });
          observer.observe(document.body, { childList: true, subtree: true });
          console.log("Content Moderator script is running...");
        });
      }
  
      // Retry mechanism to ensure tweets are loaded
      let retryCount = 0;
      function retryModeration() {
        if (retryCount < 5) { // Retry up to 5 times
          setTimeout(() => {
            console.log(`Retry #${retryCount + 1}`);
            moderateContent();
            retryCount++;
            if (document.querySelectorAll("article").length === 0) {
              retryModeration();
            } else {
              runWhenIdle();
            }
          }, 2000); // Wait 2 seconds between retries
        } else {
          console.log("Max retries reached, setting up observer.");
          runWhenIdle();
        }
      }
  
      // Initial moderate content attempt and retries
      moderateContent();
      retryModeration();
    }
  
    window.addEventListener("load", initializeModeration);
  });
