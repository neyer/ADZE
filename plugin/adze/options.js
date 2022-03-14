(function() {

  function setup() {
    
    document.getElementById("github-upload-button").addEventListener("click", uploadManifestToGithub);
    restoreManifest();
    restoreCredentials();
    setupTabs();
    setActiveTab('setup');

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


  // tab navigation
  function setupTabs() {
    const allTabs = ["feed", "links", "peers", "setup"]

    allTabs.forEach( (tab) => {
      document.getElementById("btn-select-tab-"+tab).addEventListener("click", () => {
         setActiveTab(tab);
      });
    });
  }

  function setActiveTab(tabName) {
    const allTabs = ["feed", "links", "peers", "setup"]

    allTabs.forEach( (tab) => {
      document.getElementById("btn-select-tab-"+tab).classList.remove('is-active');
      document.getElementById("section-"+tab).style="height:0px; padding:0px";
      document.getElementById("section-"+tab).classList.add("is-invisible");
    });

    document.getElementById("btn-select-tab-"+tabName).classList.add('is-active');
      document.getElementById("section-"+tabName).classList.remove("is-invisible");
    document.getElementById("section-"+tabName).style = "";
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

  function renderSingleAdzePeer(peer) {
      var html =[
        '<li>',
       "<span>&#x274C  </span>",
        '<a href="', peer.url, '">', peer.title,
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
    // render links
    let linkListDom = document.getElementById("adze-link-list");
    linkListDom.innerHTML = '';
    manifest.content.sites.map(doc => {
      linkListDom.appendChild(renderSingleAdzeLink(doc));
    });
     // render peers 
    let peerListDom = document.getElementById("adze-peer-list");
    peerListDom.innerHTML = '';
    manifest.content.peers.map(peer => {
      peerListDom.appendChild(renderSingleAdzePeer(peer));
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
    document.getElementById("github-auth-token").value = credentials.authToken;
    document.getElementById("github-user-name").value = credentials.userName;

    if (credentials.url && credentials.url.startsWith('http')) {
      shareUploadLink(credentials.url);
    }
  }
  
  document.addEventListener('DOMContentLoaded', setup);
})();
  

