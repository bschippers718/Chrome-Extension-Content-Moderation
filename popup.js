document.getElementById("save").addEventListener("click", () => {
    const keywords = document.getElementById("keywords").value;
    chrome.storage.local.set({ blockedKeywords: keywords.split(",") }, () => {
      alert("Keywords saved!");
    });
  });
