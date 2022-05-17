import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import produce from "immer"

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

// peers
async function getPeerManifest(url) {
  var cleanUrl = cleanPeerUrl(url);
  const response = await fetch(cleanUrl, {
    method: 'GET'
  });
  var responseBody = await response.text();
  return JSON.parse(responseBody);
}


function hasPeerAlready(manifest, peer) {
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
function cleanPeerUrl(baseUrl) {
  if (baseUrl.search("//peers.adze.network/") != -1 && !baseUrl.endsWith('/')) {
    return baseUrl+"/";
  }
  return baseUrl;
}





// hub interaction APIS

async function validateLinkFromHub(credentials, linkAddress) {
  // prepare the parameters to the API call
  var hubGetLinkDescriptionUrl = credentials.hubAddress + "get-link-description";
  
  console.log("Getting description for "+linkAddress);

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
  console.log("Sending manifest");
  console.log(manifest);

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
  console.log("Uploaded and got response: ");
  console.log(response_json);
}

export const addLinkByUrl = createAsyncThunk(
  'manifest/addLinkByUrl',
  async (linkAndCreds, thunkAPI) => {
   const linkDesc = await validateLinkFromHub(linkAndCreds.credentials, linkAndCreds.link)
   return {
     title: linkDesc.title,
     url: linkDesc.url,
     timestamp_ms: Date.now(),
   }
  }
)


export const addPeerByUrl = createAsyncThunk(
  'manifest/addPeerByUrl',
   async (peerUrl) => {
   const peerManifest = await getPeerManifest(peerUrl);
   console.log("Adding a peer here "+peerUrl);
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

  reducers: {},
  
  extraReducers: (builder) => {
    // add Link by url
    builder.addCase(addLinkByUrl.fulfilled, (state, action) =>  {
    
      const newState = produce(state, draftState => { 
          draftState.content.sites.push(action.payload);
     });

      return newState;
    });

    // add Peer by url
    builder.addCase(addPeerByUrl.fulfilled, (state, action) =>  {
    

      console.log("Adding a peer here twoo");
      console.log(action.payload);
      const newState = produce(state, draftState => { 
          draftState.content.peers.push(action.payload);
     });

      return newState;
    });

  }
});


export const selectManifest = (state) =>  state.manifest

export default manifestSlice.reducer
