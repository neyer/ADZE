
(function() {
  function setup() {
    document.querySelector("#adze-to-list-button").addEventListener("click", addSiteToList);
    restoreManifest();
  }

  // on tab initialization
  function restoreManifest() {
    // Restore manifest to memory
    // here is the manifest
  }

  function setupManifest(manifest) {
    document.getElementById("message").innerHTML = JSON.stringify(manifest);
  }

  function  addSiteToList() {
    var query = {active:true, currentWindow:true};
  
    // First, get the active tab
    function callback(tabs) {
        var currentTab = tabs[0];
        console.log(currentTab);
  
        var title = currentTab.title;
        var url = currentTab.url;
        var faviconUrl = currentTab.favIconUrl;
  
        var docToAdd = {
          title: currentTab.title,
          url: currentTab.url,
          favIconUrl: currentTab.favIconUrl,
          timestamp_ms:  Date.now()
        };
        // Once you have the active tab, add it to the manifest
        console.log(docToAdd);
      chrome.runtime.sendMessage({adze: { addDocument: docToAdd}});
    }
  
    chrome.tabs.query(query, callback);
  }
  
  document.addEventListener('DOMContentLoaded', setup);
})();
  

