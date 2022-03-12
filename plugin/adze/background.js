chrome.action.onClicked.addListener((tab) => {
  console.log('here, about to execute the script!');
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('got message');
  console.log(request);

  if (typeof request.adze === 'undefined') {
    return true;
  }
  else if (request.adze.addDocument) {
    addDocToList(request.adze.addDocument);
  } else if (request.adze.removeDocument) {
    removeDocFromList(request.adze.removeDocument);
  } else if (request.adze.getPastebinCredentials) {
    // Asynchronously fetch all data from storage.sync.
    getPastebinCredentials(request.adze.getPastebinCredentials).then(
          (result)  => {
           sendResponse(result);
   });
    // This tells the runtime, 'yes we will return a response'.
    // if you dont' do this here, the runtime will drop the connection
    // and you won't be able to send the response.
    return true;
  } else if (request.adze.uploadToPastebin) {
    // Asynchronously fetch all data from storage.sync.
    uploadManifestToPastebin().then(
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

// todo: replace this with just the async version
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


// Pastebin logins
async function requestUserKey(devKey, userName, password) {
  const url = "https://pastebin.com/api/api_login.php";
  const response = await fetch(url, {
    method: "POST",
    body: new URLSearchParams({
      api_dev_key: devKey,
      api_user_name: userName,
      api_user_password: password,
    }),
  });
  return response.text();
}

function isValidCredentialRequest(credentialRequest) {
  return !(typeof credentialRequest.devKey === 'undefined' ||
           typeof credentialRequest.userName === 'undefined' ||
           typeof credentialRequest.password === 'undefined')
}


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
      console.log('loaded existing credentials!');
      console.log(result.credentials);
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
      console.log('Saved credentials!');
      console.log(credentials);
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      // Pass the data retrieved from storage down the promise chain.
      resolve();
    });
  });
}
async function getPastebinCredentials(credentialRequest) {
    storedValue = await getStoredCredentials();
    if (!(typeof storedValue === 'undefined' ||
          typeof storedValue.pastebin === 'undefined' ||
          typeof storedValue.pastebin.devKey === 'undefined' ||
           typeof storedValue.pastebin.userKey === 'undefined')) {
       console.log('alerady had a  user key!');
        return {hasUserKey:true, url:storedValue.pastebin.manifestUrl};
    } else if (isValidCredentialRequest(credentialRequest)) {
       console.log('trying new credential request');
       const userKey = await getNewPastebinUserKey(credentialRequest);
       const credentials = { pastebin: {
            userKey: userKey, 
            devKey: credentialRequest.devKey,
            manifestUrl: '(none)' }}
         console.log("storing user key here "+userKey);
      await saveCredentials(credentials);
      return {hasUserKey:true}
       
   } else {
     // no user key was found, not a valid request
     console.log('need credentials!');
     return {hasUserKey:false};
   }
}


async function getNewPastebinUserKey(credentialRequest) {
  console.log('getting pastebin credentials');
  console.log(credentialRequest);
  const devKey = credentialRequest.devKey;
  const userName = credentialRequest.userName;
  const password = credentialRequest.password;
  const userKey = await requestUserKey(devKey, userName, password);
  return userKey;
}
 


async function uploadManifestToPastebin() {
  const url = "https://pastebin.com/api/api_post.php";
  const storedManifest = await getStoredManifest();
  const credentials = await getStoredCredentials();
  const response = await fetch(url, {
    method: "POST",
    body: new URLSearchParams({
      api_dev_key: credentials.pastebin.devKey,
      api_user_key: credentials.pastebin.userKey,
      api_option:  'paste',
      api_paste_name: 'adze-manifest.json',
      api_paste_format: 'json',
      api_paste_code: JSON.stringify(storedManifest),
    }),
  });
  console.log('sent API requqest');
  return response.text();
}

