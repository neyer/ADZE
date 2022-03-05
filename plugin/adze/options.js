
(function() {
  function setup() {
    document.querySelector("#adze-to-list-button").addEventListener("click", addSiteToList);
    restoreManifest();
  }

  const MANIFEST_KEY = 'manifest';

  const manifestStorage = {
    get: cb => {
      
      var storedValue = localStorage.getItem(MANIFEST_KEY);
      if (typeof storedValue === 'undefined') {
        cb(storedValue);
      } else {
        console.log('loaded value from storage')
        console.log(storedValue);
        cb(JSON.parse(storedValue));
      }
      /*
      chrome.storage.sync.get([MANIFEST_KEY], result => {

        console.log('loaded manifest');
        console.log(result);
        cb(result.manifest);
      });
      */
    },
    set: (value, cb) => {

      console.log('setting manifest');
      console.log(value);
      localStorage.setItem(MANIFEST_KEY, JSON.stringify(value));
     /*
      chrome.storage.sync.set(
        {
          manifest: value,
        },
        () => {
          cb();
        }
      );
      */
    },
  };

  function makeNewManifest() {
    console.log('making new manifest');
     return {
       "meta": {},
       "content" : {
          "sites": []
        }
     };
  }

  function isValidManfest() {
    // TODO: add checks here, log if the data is corrupted rather than absent
   return !(typeof manifest === 'undefined' || manifest === null || typeof manifest.meta === 'undefined');
  }

  // on tab initialization
  function restoreManifest() {
    // Restore manifest to memory
    manifestStorage.get(manifest => {
      if (!isValidManfest(manifest)) {
        console.log('need new manifest');
        console.log(manifest);

        // Set counter value as 0
        let newManifest = makeNewManifest();
        manifestStorage.set(newManifest, () => {
          setupManifest(newManifest);
        });
      } else {
        console.log('had manifest');
        setupManifest(manifest);
      }
    });
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
        manifestStorage.get(manifest => {
            console.log('adding to manifest');
            console.log(manifest);
            manifest.content.sites.push(docToAdd);
            manifestStorage.set(manifest);
            setupManifest(manifest);
        });
    }
  
    chrome.tabs.query(query, callback);
  }
  
  document.addEventListener('DOMContentLoaded', setup);
})();
  

