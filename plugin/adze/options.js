(function() {

  function setup() {
    

    document.getElementById("pastebin-get-credentials-button").addEventListener("click", getPastebinCredentials);

    document.getElementById("pastebin-upload-button").addEventListener("click", uploadManifestToPastebin);
    restoreManifest();
    restoreCredentials();


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
  set: (value) => {
    console.log('setting manifest');
    console.log(value);
    chrome.storage.local.set({manifest: JSON.stringify(value)});
  }
};



  // on tab initialization
  function restoreManifest() {
    // Restore manifest to memory
    manifestStorage.get(manifest => {
       renderManifest(manifest);
    });
  }

  function restoreCredentials() {
    chrome.runtime.sendMessage({adze: { getPastebinCredentials: {}}}, (response) => {
      console.log("got response");
      console.log(response);
      if (response.hasUserKey) {
        setPastebinCredentials(response);
      }
    });
  }

  function htmlToElem(html) {
    let temp = document.createElement('template');
    html = html.trim(); // Never return a space text node as a result
    temp.innerHTML = html;
    return temp.content.firstChild;
  }

  function removeAdzeLink(doc) {
    console.log('removing a doc');
    chrome.runtime.sendMessage({adze: { removeDocument: doc}}, () => {
      restoreManifest();
    });

  }

  function renderSingleAdzeLink(doc) {
      var html =[
        '<li>',
       "<span>&#x274C  </span>",
        '<a href="', doc.url, '">', doc.title,
        "</a></li>"
      ].join('');
      var thisDocElement = htmlToElem(html);
      thisDocElement.children[0].addEventListener('click', () => {
         removeAdzeLink(doc);
      });
    return thisDocElement;
  }

  function renderManifest(manifest) {
    document.getElementById("message").innerHTML = JSON.stringify(manifest);
    var linkListDom = document.getElementById("adze-link-list");
    linkListDom.innerHTML = '';
    manifest.content.sites.map(doc => {
      linkListDom.appendChild(renderSingleAdzeLink(doc));
    });
  }

  // credential management

  async function getPastebinCredentials() {
    console.log('getting credentials!');
    const devKey = document.getElementById("pastebin-dev-key").value;
    const userName = document.getElementById("pastebin-username").value;
    const password = document.getElementById("pastebin-password").value;

    chrome.runtime.sendMessage({adze: { getPastebinCredentials: {
        devKey: devKey,
        userName: userName,
        password: password
      }}}, (credentials) => {
      setPastebinCredentials(credentials);
    });
  }

  async function uploadManifestToPastebin() {
    console.log('uploading');
    chrome.runtime.sendMessage({adze: { uploadToPastebin: {
        url: '(none here yet',
      }}}, (result) => {
        console.log('got result of upload');
        console.log(result);
    });
  }

  function setPastebinCredentials(credentials) {
    document.getElementById("pastebin-credentials-needed-form").style.visibility="hidden";
    document.getElementById("pastebin-upload-form").style.visibility = "visible";
    // todo: add the url to the upload button
  }
  
  document.addEventListener('DOMContentLoaded', setup);
})();
  

