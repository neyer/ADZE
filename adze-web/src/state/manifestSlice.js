import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import produce from "immer"
import { getPeerManifest, hasPeerAlready, cleanUrl, makeDocListWithoutDoc, makeNewManifest } from '../manifestLib.js'

//########################################
// Defines a Slice managing manifest state. Mutators and helper functions as well.
//########################################

// helper to create new manifest. Might consider adding separate class just for type checking here.




// hub interaction APIS

async function validateLinkFromHub(credentials, linkAddress) {
  // prepare the parameters to the API call
  var hubGetLinkDescriptionUrl = credentials.hubAddress + "get-link-description";
  
  const response = await fetch(hubGetLinkDescriptionUrl, {
    body: new URLSearchParams({
      username: credentials.username,
      auth_token: credentials.authToken,
      url: linkAddress,
    }),
    method: 'POST',
  });
  var response_json = await response.json();
  return response_json;
}

async function uploadToHubAPI(credentials, manifest) {
  // prepare the parameters to the API call
  var hubUploadUrl = credentials.hubAddress + "upload-manifest";

  const response = await fetch(hubUploadUrl, {
    body: new URLSearchParams({
      username: credentials.username,
      auth_token: credentials.authToken,
      manifest_body: JSON.stringify(manifest),
    }),
    method: 'POST',
  });
  var response_json = await response.json();
  if (response_json.result === 'success') {
    response_json.manifestUrl =  credentials.manifestUrl;
  }
}

export const addLinkByUrl = createAsyncThunk(
  'manifest/addLinkByUrl',
  async (linkAndCreds, thunkAPI) => {
   const linkDesc = await validateLinkFromHub(linkAndCreds.credentials, linkAndCreds.link)
   return  {
     title: linkDesc.title,
     url: linkDesc.url,
     timestamp_ms: new Date().getTime(),
   }
  }
)


export const addPeerByUrl = createAsyncThunk(
  'manifest/addPeerByUrl',
   async (peerUrl) => {
   const peerManifest = await getPeerManifest(peerUrl);
   return {
     url: peerUrl,
     nickname: peerManifest.meta.nickname
   }
  }
)

export const uploadToHub = createAsyncThunk(
  'manifest/uploadToHub',
   async (manifestAndCreds, thunkAPI) => {
   await uploadToHubAPI(manifestAndCreds.credentials, manifestAndCreds.manifest)
  }
)



export const manifestSlice = createSlice({
  name: 'manifest',

  initialState:  makeNewManifest(true),

  reducers: {
      removePeer: (state, action) => {
        var withoutPeer = makeDocListWithoutDoc(state.content.peers, action.payload);
        state.content.peers = withoutPeer;
      },

      removeLink: (state, action) => {
        var withoutLink = makeDocListWithoutDoc(state.content.sites, action.payload);
        state.content.sites = withoutLink;
      },

      addLinkDoc : (state, action) => {
        state.content.sites.push(action.payload);
      }
  },
  
  extraReducers: (builder) => {
    // add Link by url
    builder.addCase(addLinkByUrl.fulfilled, (state, action) =>  {
    console.log("adding link fulfilled");
     const newState = produce(state, draftState => { 
          draftState.content.sites.push(action.payload);
     });

      return newState;
    });

    builder.addCase(addLinkByUrl.pending, (state, action) =>  {
      console.log("adding link pending");
        return state;
    });

    builder.addCase(addLinkByUrl.rejected, (state, action) =>  {
      console.log("adding link rejected");
      console.log(action);
        return state;
    });

    // add Peer by url
    builder.addCase(addPeerByUrl.fulfilled, (state, action) =>  {
      const newState = produce(state, draftState => { 
          draftState.content.peers.push(action.payload);
     });

      return newState;
    });

  }
});


export const selectManifest = (state) =>  state.manifest

export const { removePeer, removeLink, addLinkDoc } = manifestSlice.actions

export default manifestSlice.reducer
