
export function makeNewManifest(addCreator) {
   var result = {
     "meta": { nickname: "uknown", timestamp: new Date().getTime() },
     "content" : {
        "sites": [
            { 
              url: "http://apxhard.com", 
              title:  "this is some link",
            },
         ],
        "peers": [
          
         ]
      }
   };

  if (addCreator) {
      result.content.peers.push( 
        {"url":"https://peers.adze.network/apxhard/",
        "nickname" : "axphard (adze creator)" });
  }
  return result;
}


// peers
export const getPeerManifest = async (url) => {
  var cleanUrl = cleanPeerUrl(url);
  const response = await fetch(cleanUrl, {
    method: 'GET'
  });
  var responseBody = await response.text();
  return JSON.parse(responseBody);
}


export const hasPeerAlready = (manifest, peer) => {
  for(var peerNum in manifest.content.peers) {  
    var thisPeer = manifest.content.peers[peerNum];
    if (thisPeer.url == peer.url) {
      return true;
    }
  }
  return false;
}

// amazon does dumb stuff with 302's if you are using a non-/-terminated url
// hence this delectable hack
export const cleanPeerUrl = (baseUrl) => {
  if (baseUrl.search("//peers.adze.network/") != -1 && !baseUrl.endsWith('/')) {
    return baseUrl+"/";
  }
  return baseUrl;
}

export function makePeerListWithoutPeer(oldPeers, toRemove) {
  // don't start with that default manifest in there.
  let newPeers = [];
  
  console.log("removing "+toRemove);
  for(let index in oldPeers){
    var thisPeer = oldPeers[index];
    if (thisPeer.url !== toRemove.url) {
      console.log("adding peer "+thisPeer.url);
      newPeers.push(thisPeer);
    }
  }
  return newPeers;
}

export function flattenPeerLinksList(peerManifestCache) {
  // combines links from multuple peers into a single feed
  // for now all we are doing is  putting them in whatever order they are
  // not doing any deduplicatoin
  // todo: eventually give way more options for sorting/scoring
  var linksList = []
  for (var key in peerManifestCache.peers) {
    var thisPeerManifest = peerManifestCache.peers[key]
    thisPeerManifest.content.sites.map((doc) => {
      doc.provenance = { sharers: [ thisPeerManifest.meta ] };
      linksList.push(doc);
    });
  }
  return linksList;
}

// todo: resolve mismatches between titles here
// todo: add assertion that urls match
function mergeFeedDocs(firstDoc, toMerge) {
  firstDoc.timestamp = Math.max(firstDoc.timestamp_ms, toMerge.timestamp_ms);
  firstDoc.provenance.sharers =  [].concat(firstDoc.provenance.sharers, toMerge.provenance.sharers);
  
  return firstDoc;
}

// Takes a flattend links list and combines mutiple referalls for the same site into one
export function mergePeerLinksList (linksList) {
  let siteIndex = {};

  linksList.map((doc) => {
    if (typeof siteIndex[doc.url] === 'undefined') {
        // it's new, add it to the resutls list
        siteIndex[doc.url] = doc;
    } else {
      // someone else already shared this. Marge the result
        siteIndex[doc.url] = mergeFeedDocs(siteIndex[doc.url],doc);
    }
  });
  // lastly return the keys
  let resultList = [];
  for (var siteKey in siteIndex) {
    resultList.push(siteIndex[siteKey]);
  }
  return resultList;
}

// sorts a list of peer links according to how many peers adzed it
// TODO: WAY more options here
export function sortPeerLinksList(linksList) {
  linksList.sort(function (docA, docB) {
    return docB.provenance.sharers.length - docA.provenance.sharers.length;
  });
}

