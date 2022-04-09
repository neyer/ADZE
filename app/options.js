(function() {

  const backendHook = {};

  function setup() {
    
   document.getElementById("btn-update-feed").addEventListener("click", updateFeed);


    document.getElementById("btn-upload-hub").addEventListener("click", uploadManifest);
    document.getElementById("btn-set-hub-credentials").addEventListener("click", setHubCredentials);

    document.getElementById("btn-add-peer").addEventListener("click", addPeerFromInputBox);
    //TODO: fetch the document and get the title
    // move that logic into background.js
    //document.getElementById("btn-add-link").addEventListener("click", addLinkFromInputBox);
    setupTabs();
    setActiveTab('setup');
    restoreManifest();
    restoreCredentials();
    updateFeed();

  }


  // on tab initialization
  function restoreManifest() {
    // Restore manifest to memory
    sendBackendMessage({adze: { getManifest: {}}}, (response) => {
      renderManifest(response);
    });
  }

  function restoreCredentials() {
    sendBackendMessage({adze: { getHubCredentials: {}}}, (response) => {
      renderHubCredentials(response);
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

//////////////////////////////////////////////////////////////////////
// HTML tools
//////////////////////////////////////////////////////////////////////
  function htmlToElem(html) {
    let temp = document.createElement('template');
    html = html.trim(); // Never return a space text node as a result
    temp.innerHTML = html;
    return temp.content.firstChild;
  }
  function setElementValueIfDefined(elementId, value)  {
      if (typeof value !== 'undefined') {
        document.getElementById(elementId).value = value;
      } else {
        document.getElementById(elementId).value = '';
      }
  }
//////////////////////////////////////////////////////////////////////
// Mutations Mutations Mutations Mutations 
//////////////////////////////////////////////////////////////////////


  // feed stuff
  function updateFeed() {
    sendBackendMessage({adze: { updateFeed: {} }}, (feedDocs) => {
      renderFeed(feedDocs);
      document.getElementById("text-feed-updated-timestamp").innerHTML = 
        "Last updated "+(new Date()).toLocaleString();
    });
  }


  // managing peers and links
  function removeAdzeLink(doc) {
    sendBackendMessage({adze: { removeDocument: doc}}, () => {
      restoreManifest();
    });
  }

  function removeAdzePeer(peer) {
    sendBackendMessage({adze: { removePeer: peer}}, () => {
      restoreManifest();
    });
  }

  ////////////////////////////////////////////////////////////
  // Render the feed
  ////////////////////////////////////////////////////////////

  // describes the provenance of a single recommended link
  // why is this in the feed, where it is?
  // for now, say who recommended this and their social distance
  function renderProvenanceSummaryHtml(provenance) {
     // who as adzed this lnk
     var adzeCountByOrder = [0,0,0,0,0];
     provenance.sharers.map((sharer) => {
        ++adzeCountByOrder[sharer.order];
     });
  
    let resultStrings = [ '<span class="btn-see-provenance">&#x1F50D</span>'," Shared by "];
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

  // TODO: this coudld use more work here.
  // Ideally, we could have more options, and show the provenance path
  // rather than just the order
  function renderProvenanceDetails(provenance) {
     // who as adzed this lnk
     provenance.sharers.sort(function(a,b) {
          return a.order - b.order;
     });
  
    let resultStrings = [ 'Shared by:<ul>' ];
    provenance.sharers.map ((sharer, index) => {
      if (sharer.order == 1) {
          // if they are already a peer, we don't add the link;
         resultStrings.push(["<li>", sharer.nickname, " (your peer)</li>"].join(''));
      } else {
       var thisPeerDescStrings = [
         "<li>", sharer.nickname,
          ", an order ", sharer.order.toString(), " peer.",
         "<a class=\"link-adze-remote-peer\" data-peer-meta='",
          JSON.stringify(sharer),
         "'> Adze Them.</a>", 
         "</li>"
       ];
       resultStrings.push(thisPeerDescStrings.join(''));
      }
    });
    resultStrings.push('</ul>');
    return resultStrings.join('');
  }


  function renderSingleFeedLink(doc) {
      var html =[
        '<li>',
        // upvote adze it to your own list of links
       // gives you the option of following the peer if you aren't already
        // downvote removes it from your feed, adze it to your list of 'no good'
       // links, and gives the option of removing that peer
        '<div class="columns">',
        '<div class="column is-two-fifths">',
        '<a href="', doc.url, '">', doc.title,
        "</a></div>",
        '<div class="column is-two-fifths area-provenance-details">'+renderProvenanceSummaryHtml(doc.provenance)+'</div>',
        '<div class="column">(feedback will go here)</div>',
        "</div></li>"
      ].join('');
      var thisDocElement = htmlToElem(html);
      var provenanceDetailsArea = thisDocElement.querySelector(".area-provenance-details");
      thisDocElement.querySelector('.btn-see-provenance').addEventListener('click', () => {
        provenanceDetailsArea.innerHTML = renderProvenanceDetails(doc.provenance);
        provenanceDetailsArea.querySelector('a.link-adze-remote-peer').addEventListener('click', (event) =>{ 
          var remotePeerDoc = JSON.parse(event.srcElement.attributes['data-peer-meta'].value);
          addPeer(remotePeerDoc).then((manifest) => {
            renderManifest(manifest);
          });
      });
     });
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
    let peerDesc = {
        url: peerAddress,
        nickname: '(name not fetched yet)'
    };
    await addPeer(peerDesc);
  }

  async function addPeer(peerDesc) {
    sendBackendMessage({adze: { addPeer: peerDesc } }, (manifest) => {
      renderManifest(manifest);
    });
  }

  async function addLinkFromInputBox() {
    // TODO
  }

  /////////////////////////////////////////////////////////////////////////////
  // credential management
  /////////////////////////////////////////////////////////////////////////////
  async function uploadManifest() {
    console.log('uploading');

    sendBackendMessage({adze: { uploadToHub: {} }}, (responseJson) => {
      console.log(responseJson);
      if (responseJson.result != 'success') {
        renderErrorMessage(responseJson.message);
        
      } else {
        shareUploadLink(responseJson.manifestUrl);
      }
    });
  }

  function shareUploadLink(uploadDestination) {
      var html =[
        "<span>Your recommendations have been uploaded to ",
        '<a href="', uploadDestination, '">', uploadDestination,
        "</a> Share them with your friends!",
        "</span>"
      ].join('');

      var messageDom = document.getElementById("upload-message");
      messageDom.innerHTML = '';
      messageDom.appendChild(htmlToElem(html));
  }

  function setHubCredentials() {
    const desiredCredentials = {
      hubAddress: document.getElementById("hub-address").value,
      username: document.getElementById("hub-username").value,
      email: document.getElementById("hub-email").value,
    };

    sendBackendMessage({adze: { setHubCredentials: desiredCredentials }}, (credentials) => {
      renderHubCredentials(credentials);
    });
  }
  
  function renderErrorMessage(message) {
        const innerHtml = ["<p class=\"help is-danger\">", message, "</p>"].join('');
        document.getElementById("hub-credentials-form-message").innerHTML = innerHtml;
  }


  function renderHubCredentials(credentials) {
    if (credentials == null || typeof credentials == 'undefined') {
      return;
    };
    if (credentials != null && (typeof credentials.errorMessage !== 'undefined'))  {
        renderErrorMessage(credentials.errorMessage);
    }

    setElementValueIfDefined("hub-address", credentials.hubAddress);
    setElementValueIfDefined("hub-username", credentials.username);
    setElementValueIfDefined("hub-email", credentials.email);

    if (credentials.manifestUrl && typeof credentials.manifestUrl != 'undefined') {
      shareUploadLink(credentials.manifestUrl);
    }
  }
  
  document.addEventListener('DOMContentLoaded', setup);
})();
  

