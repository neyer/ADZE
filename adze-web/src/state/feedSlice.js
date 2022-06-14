import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getPeerManifest, mergePeerLinksList, flattenPeerLinksList, sortPeerLinksList } from '../manifestLib.js'
import produce from "immer"

//########################################
// Defines a Slice managing the feed 
//########################################



async function updateFeedLinks(manifest) {
  // update the list of all cached content from the peers
  // how many times should we follow peers?
  // 1 hop: only local peers added by this maniest
  // 2 hops: add 'peers of peers', i.e. order 2 peers
  // todo: make this configurable, dynamic
  var numPeerHops = 2;
  var newPeers= await updatePeerManifestCache(manifest, numPeerHops);
  var mergedLinks =  mergePeerLinksList(flattenPeerLinksList(newPeers));
  var newLinks = sortPeerLinksList(mergedLinks);
  return  { peers: newPeers, links: mergedLinks, meta: { timestamp: new Date().getTime() } };
}

function makeNewCache() { 
  return{
    // mapping from peer to manifest file
    peers: []
  };
}
async function updatePeerManifestCache(localManifest, numTimesToFollow) {
  // todo: have this load from stored value to update rether than make a new one
  var currentCache = makeNewCache();
  // update the list of all cached content from the peers
  var peersSeenSoFar = {};
  var toVisit = [];
  var toVisitNext = [];
  var thisPeerOrder = 1;
  // make a plan to visit all the local peers
  for (let peerNo in localManifest.content.peers) {
    let peer = localManifest.content.peers[peerNo];
    peersSeenSoFar[peer.url] = true;
    toVisit.push(peer);
  }

  while (numTimesToFollow > 0) {
      for (let peerNo in toVisit) {
        let peer = toVisit[peerNo];
        var thisPeerManifest = await getPeerManifest(peer.url);
        peersSeenSoFar[peer.url] = true;
        thisPeerManifest.meta.order = thisPeerOrder;
        thisPeerManifest.meta.url = peer.url;
        currentCache.peers.push(thisPeerManifest);
        // now add this peer's remote peers to visit next
        for (var remotePeerNum in thisPeerManifest.content.peers) {
           var thisRemotePeer = thisPeerManifest.content.peers[remotePeerNum];
          // don't visit this peer twice
          if (typeof peersSeenSoFar[thisRemotePeer.url] === 'undefined') {
              // we will visit this peer if we traverse more hops
              peersSeenSoFar[thisRemotePeer.url] = true;
              toVisitNext.push(thisRemotePeer);
          }
      } // we've considered whether to visit all order n+1 peers of this order n peer
    }
    // we've followed the links once. Decrement counters, reset lets, etc.
    ++thisPeerOrder;
    --numTimesToFollow;
    toVisit = toVisitNext;
    toVisitNext = [];
  }
  // todo: save this cache
  return currentCache;
}


export const updateFeed = createAsyncThunk(
  'feed/update',
   async (manifest, thunkAPI) => {
   return await updateFeedLinks(manifest)
  }
)


function makeInitialFeed() {
  return {
    peers: [], // contains all kinds of fetched peers
    // conatins a bunch of fetched links, in ranked order
    links: [ ],
    meta:  { timestamp: new Date().getTime() }
  }
}


export const feedSlice = createSlice({
  name: 'feed',

  initialState:  makeInitialFeed(),

  reducers: {},
  
  extraReducers: (builder) => {
    builder.addCase(updateFeed.fulfilled, (state, action) =>  {
    
      return action.payload;
    });
  }
});


export const selectFeed = (state) =>  state.feed

export default feedSlice.reducer
