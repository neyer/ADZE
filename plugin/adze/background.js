chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (typeof request.adze === 'undefined') {
    return true;
  }
  else if (request.adze.addDocument) {
    addDocToList(request.adze.addDocument);
  } else if (request.adze.removeDocument) {
    removeDocFromList(request.adze.removeDocument);
  } else if (request.adze.getGithubCredentials) {
    // Asynchronously fetch all data from storage.sync.
    getGithubCredentials(request.adze.getGithubCredentials).then(
          (result)  => {
           sendResponse(result);
   });
    // This tells the runtime, 'yes we will return a response'.
    // if you dont' do this here, the runtime will drop the connection
    // and you won't be able to send the response.
    return true;
  } else if (request.adze.uploadToGithub) {
    // Asynchronously fetch all data from storage.sync.
    uploadManifestToGithub(request.adze.uploadToGithub).then(
          (result)  => {
           sendResponse(result);
   });
    // This tells the runtime, 'yes we will return a response'.
    // if you dont' do this here, the runtime will drop the connection
    // and you won't be able to send the response.
    return true;
  }
});

function addDocToList(doc) {
  manifestStorage.get( manifest => {
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
        return cb(JSON.parse(storedValue));
      }
    });
  },
  set: (value, cb) => {
    chrome.storage.local.set({manifest: JSON.stringify(value)}, cb);
  }
};


function makeNewManifest() {
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


// Github logins
function getStoredManifest() {
  // Immediately return a promise and start asynchronous work
  return new Promise((resolve, reject) => {
    // Asynchronously fetch all data from storage.sync.
    manifestStorage.get( (result) => {
      // Pass any observed errors down the promise chain.
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      // Pass the data retrieved from storage down the promise chain.
      resolve(result);
    });
  });
}

function getStoredCredentials() {
  // Immediately return a promise and start asynchronous work
  return new Promise((resolve, reject) => {
    // Asynchronously fetch all data from storage.sync.
    chrome.storage.local.get(['credentials'], (result) => {
      // Pass any observed errors down the promise chain.
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      // Pass the data retrieved from storage down the promise chain.
      resolve(result.credentials);
    });
  });
}

function saveCredentials(credentials) {
  // Immediately return a promise and start asynchronous work
  return new Promise((resolve, reject) => {
    // Asynchronously fetch all data from storage.sync.
    chrome.storage.local.set({credentials:credentials}, (result) => {
      // Pass any observed errors down the promise chain.
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      // Pass the data retrieved from storage down the promise chain.
      resolve();
    });
  });
}
async function getGithubCredentials(credentialRequest) {
    const storedValue = await getStoredCredentials();
    if (!(typeof storedValue === 'undefined' ||
          typeof storedValue.github === 'undefined')) {
        return {hasAuthToken:true, 
                authToken: storedValue.github.authToken,
                userName: storedValue.github.userName,
                url:storedValue.github.manifestUrl};
   } else {
     // no user key was found, not a valid request
     return {hasAuthToken: false};
   }
}


async function uploadManifestToGithub(uploadRequest) {
  // we might end up 
  let url = "https://api.github.com/gists";
  const storedManifest = await getStoredManifest();
  const storedCredentials = await getStoredCredentials();
  const manifestFileName = 'adze-manifest.json';
  // prepare the parameters to the API call
  let filesDict = {}
  filesDict[manifestFileName] = { content: JSON.stringify(storedManifest) };
  const paramsDict = {
    descripton: 'adze manifest',
    files:  filesDict,
    public: true 
  };
  // if we are patching an existing gist we use the PATCH method
  // and add the id of the existing gist
  if (storedCredentials.github && 
      typeof storedCredentials.github.gistId !== 'undefined') {
    var method = "PATCH";
    url = url + "/" + storedCredentials.github.gistId;
  } else {
    var method = "POST";
  }

  // use basic authentication
  const username = uploadRequest.userName;
  const password = uploadRequest.authToken;
  let headers = new Headers();
  headers.append(
    'Authorization', 'Basic '+btoa(username + ":" + password));
  const response = await fetch(url, {
    body: JSON.stringify(paramsDict),
    method: method,
    headers:headers
  });
  var responseBody = await response.text();
  response_json = JSON.parse(responseBody);
  const uploadUrl = response_json.files[manifestFileName].raw_url;
  const credentialsToSave = { github: {
    userName: uploadRequest.userName,
    authToken: uploadRequest.authToken,
    manifestUrl: uploadUrl,
    gistId: response_json.id
  } }
  await saveCredentials(credentialsToSave);
  return uploadUrl;
}

