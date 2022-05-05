import { createSlice} from '@reduxjs/toolkit'

//########################################
// Defines a Slice managing manifest state. Mutators and helper functions as well.
//########################################

// helper to create new manifest. Might consider adding separate class just for type checking here.
function makeNewManifest(addCreator) {
   var result = {
     "meta": { "nickname": "uknown"},
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

function hasPeerAlready(manifest, peer) {
  for(var peerNum in manifest.content.peers) {  
    var thisPeer = manifest.content.peers[peerNum];
    if (thisPeer.url === peer.url) {
      return true;
    }
  }
  return false;
}




export const manifestSlice = createSlice({
  name: 'manifest',

  initialState: { value: makeNewManifest(true) },

  reducers: {
  
    // add a 'document'
    addDocument: (state, action) => {
      // TODO: check document type for validity here
      state.content.sites.push(action.payload);
      },
    removeDocument: (state, action) => {
      // TODO implement this
    },
    addPeer: (state, action) => {
      // TODO: check peer for validity here
      const peer = action.payload;
      if (hasPeerAlready(state, peer)) {
         // TODO: signal that the user has alrady added this peer
         // maybe with some animation that higlights the entry in the list
         return;
      }
      /*

      // todo: figure out use of async fetcher in state
      //var peerManifest = await getPeerManifest(peer.url);
      peer.nickname = peerManifest.meta.nickname || peerManifest.meta.username;

      state.content.peers.push(peer);
      state
      */
    },

    removePeer: (state) => {
      /*
      // TODO
      var newManifest = makeNewManifest();
      // don't start with that default manifest in there.
      newManifest.content.peers = [];
      newManifest.meta = state .meta;
      newManifest.content.sites = state.content.sites;
      
      for(let index in state.content.peers){
        var thisPeer = state.content.peers[index];
        if (thisPeer.url != toRemove.url) {
          newManifest.content.peers.push(thisPeer);
        }
      }
      state = newManifest
      */
    },
  }

  // todo: add docFeedback
});


export const selectManifest = (state) =>  state.manifest.value

export default manifestSlice.reducer
