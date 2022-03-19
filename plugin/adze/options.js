(function() {

  function setup() {
    
   document.getElementById("btn-update-feed").addEventListener("click", updateFeed);


    document.getElementById("btn-upload-github").addEventListener("click", uploadManifestToGithub);

    document.getElementById("btn-add-peer").addEventListener("click", addPeerFromInputBox);
    //TODO: fetch the document and get the title
    // move that logic into background.js
    //document.getElementById("btn-add-link").addEventListener("click", addLinkFromInputBox);
    setupTabs();
    setActiveTab('feed');
    restoreManifest();
    restoreCredentials();
    updateFeed();

  }


  // on tab initialization
  function restoreManifest() {
    // Restore manifest to memory
    chrome.runtime.sendMessage({adze: { getManifest: {}}}, (response) => {
      renderManifest(response);
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

  // feed stuff
  function updateFeed() {
    chrome.runtime.sendMessage({adze: { updateFeed: {} }}, (feedDocs) => {
      renderFeed(feedDocs);
      document.getElementById("text-feed-updated-timestamp").innerHTML = 
        "Last updated "+(new Date()).toLocaleString();
    });
  }


  // managing peers and links
  function removeAdzeLink(doc) {
    chrome.runtime.sendMessage({adze: { removeDocument: doc}}, () => {
      restoreManifest();
    });
  }

  function removeAdzePeer(peer) {
    chrome.runtime.sendMessage({adze: { removePeer: peer}}, () => {
      restoreManifest();
    });
  }

  ////////////////////////////////////////////////////////////
  // Render the feed
  ////////////////////////////////////////////////////////////

  // describes the provenance of a single recommended link
  // why is this in the feed, where it is?
  // for now, say who recommended this and their social distance
  function renderProvenanceHtml(provenance) {
     // who as adzed this lnk
     var adzeCountByOrder = [0,0,0,0,0];
     provenance.sharers.map((sharer) => {
        ++adzeCountByOrder[sharer.order];
     });
  
    let resultStrings = [ "Shared by "];
    let hasAddedSharers = false;
    for (var peerOrder = 0; peerOrder < 4; ++ peerOrder) {
       var sharesByPeersOfThisOrder = adzeCountByOrder[peerOrder];
       if (sharesByPeersOfThisOrder > 0)  {
          if (hasAddedSharers) {
            resultStrings.push(", ");
          }
          var thisDesc = sharesByPeersOfThisOrder.toString() + " order "  + 
              peerOrder.toString() + " peer";
          if (peerOrder == 1){ 
              thisDesc =  sharesByPeersOfThisOrder.toString() + " of your peers";
          } else if  (sharesByPeersOfThisOrder > 1) {
            thisDesc += 's';
          }
          
          resultStrings.push(thisDesc);
          hasAddedSharers = true;
       }
    }
    return resultStrings.join('');
  }


  function renderSingleFeedLink(doc) {
      var html =[
        '<li>',
       //"<span>&#x274C  </span>",//todo; add upvote/downvote buttons here
        // upvote adze it to your own list of links
       // gives you the option of following the peer if you aren't already
        // downvote removes it from your feed, adze it to your list of 'no good'
       // links, and gives the option of removing that peer
        '<div class="columns">',
        '<div class="column is-half">',
        '<a href="', doc.url, '">', doc.title,
        "</a></div>",
        '<div class="column is-one-third">'+renderProvenanceHtml(doc.provenance)+'</div>',
        '<div class="column">(feedback will go here)</div>',
        "</div></li>"
      ].join('');
      var thisDocElement = htmlToElem(html);
    return thisDocElement;
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
        '<a href="', peer.url, '">', peer.nickname,
        "</a></li>"
      ].join('');
      var thisDocElement = htmlToElem(html);
      thisDocElement.children[0].addEventListener('click', () => {
         removeAdzePeer(peer);
      });
    return thisDocElement;
  }

  function renderFeed(feedDocsList) {
    // render links
    let linkListDom = document.getElementById("adze-feed-list");
    linkListDom.innerHTML = '';
    feedDocsList.map(doc => {
      linkListDom.appendChild(renderSingleFeedLink(doc));
    });
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
  
  // Peers

  async function addPeerFromInputBox() {
    let peerAddress = document.getElementById("input-peer-url").value;
    chrome.runtime.sendMessage({adze: { addPeer: {
        url: peerAddress,
        nickname: '(name not fetched yet)'
      }}}, (manifest) => {
      renderManifest(manifest);
    });
  }

  async function addLinkFromInputBox() {
    let peerAddress = document.getElementById("input-link-url").value;
    chrome.runtime.sendMessage({adze: { addPeer: {
        url: peerAddress,
        nickname: '(name not fetched yet)'
      }}}, (manifest) => {
      renderManifest(manifest);
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
  

