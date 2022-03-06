chrome.action.onClicked.addListener((tab) => {
  console.log('here, about to execute the script!');
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request);
  if (typeof request.adze === 'undefined') {
    return;
  }
  if (request.adze.addDocument) {
    addDocToList(request.adze.addDocument);
    return;
  }
  if (request.adze.removeDocument) {
    removeDocFromList(request.adze.removeDocument);
    return;
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

function makeManifestWithoutDoc(oldManifest, toRemove) {
  var newManifest = makeNewManifest();
  
  for(let index in oldManifest.content.sites){
    var thisDoc = oldManifest.content.sites[index];
    if (thisDoc.url != toRemove.url) {
      newManifest.content.sites.push(thisDoc);
    }
  }
  return newManifest;
}


function removeDocFromList(doc, cb) {
  manifestStorage.get( manifest => {
    manifestStorage.set(makeManifestWithoutDoc(manifest, doc, cb));
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
  set: (value, cb) => {
    console.log('setting manifest');
    console.log(value);
    chrome.storage.local.set({manifest: JSON.stringify(value)}, cb);
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
