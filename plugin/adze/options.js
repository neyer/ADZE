(function() {

  function setup() {
    

    document.getElementById("github-upload-button").addEventListener("click", uploadManifestToGithub);
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
    chrome.runtime.sendMessage({adze: { getGithubCredentials: {}}}, (response) => {
      if (response.hasAuthToken) {
        setGithubCredentials(response);
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
  async function uploadManifestToGithub() {
    console.log('uploading');

    const authToken = document.getElementById("github-auth-token").value;
    const userName = document.getElementById("github-user-name").value;
    chrome.runtime.sendMessage({adze: { uploadToGithub: {
        authToken: authToken,
        userName: userName,
      }}}, (uploadDestination) => {
      shareUploadLink(uploadDestination);
    });
  }

  function shareUploadLink(uploadDestination) {
      var html =[
        "<span>ADZE list uploaded to ",
        '<a href="', uploadDestination, '">', uploadDestination,
        "</a> Share it with your friends!",
        "</span>"
      ].join('');

      var messageDom = document.getElementById("upload-message");
      messageDom.innerHTML = '';
      messageDom.appendChild(htmlToElem(html));
  }

  function setGithubCredentials(credentials) {
    document.getElementById("github-upload-form").style.visibility = "visible";
    document.getElementById("github-auth-token").value = credentials.authToken;
    document.getElementById("github-user-name").value = credentials.userName;

    if (credentials.url && credentials.url.startsWith('http')) {
      shareUploadLink(credentials.url);
    }
  }
  
  document.addEventListener('DOMContentLoaded', setup);
})();
  

