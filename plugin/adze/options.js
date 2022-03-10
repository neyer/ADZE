
(function() {


  function setup() {
    restoreManifest();

    document.getElementById("upload-button").addEventListener("click", uploadManifest);
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

  function htmlToElem(html) {
    let temp = document.createElement('template');
    html = html.trim(); // Never return a space text node as a result
    temp.innerHTML = html;
    return temp.content.firstChild;
  }

  function removeAdzeLink(doc) {
    console.log('removing');
    console.log(doc);
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

  function uploadManifest() {
    console.log('uploadin!');
    const request = new Request(
      "https://pastebin.com/api/api_post.php",
  );
    const url = request.url;
    const method = request.method;
    const credentials = request.credentials;
    }
  
  document.addEventListener('DOMContentLoaded', setup);
})();
  

