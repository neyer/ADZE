chrome.action.onClicked.addListener((tab) => {
  console.log('here, about to execute the script!');
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Got a message!");
  console.log(request);
  
  if (request.adze && request.adze.addDocument) {
    addDocToList(request.adze.addDocument);
  }

});

function addDocToList(doc) {
  manifestStorage.get( manifest => {
    console.log('adding to manifest');
    console.log(manifest);
    manifest.content.sites.push(doc);
    manifestStorage.set(manifest);
  });

}

const manifestStorage = {
  get: (cb) => {
    chrome.storage.local.get(['manifest'], (result) => {
      storedValue = result.manifest;
      if (typeof storedValue === 'undefined') {
        cb(makeNewManifest());
      } else {
        console.log('loaded value from storage');
        console.log(storedValue);
        return cb(JSON.parse(storedValue));
      }
    });
  },
  set: (value) => {
    console.log('setting manifest');
    console.log(value);
    chrome.storage.local.set({manifest: JSON.stringify(value)});
  }
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
