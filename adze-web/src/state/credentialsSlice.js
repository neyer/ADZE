import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

//########################################
// Defines a Slice managing user credentials.
// Creentials are used to interface with a hub which accepts manifests for public uploads.
//########################################


// helper to create new manifest. Might consider adding separate class just for type checking here.
function makeNewCredentials () {
  return {
    hubAddress: "https://adze-web.anvil.app/_/api/",
    username: "faker",
    email: "fake@email.co",
    authToken: "",
    manifestUrl: "",
    errorMessage: ""
  };
}

// async function to call the hub url and set credentials
async function validateCredentialsAPI(credentials) {
  var hubRegisterUrl = credentials.hubAddress + "register";

  const response = await fetch(hubRegisterUrl, {
    body: new URLSearchParams({
      username: credentials.username,
      email: credentials.email,
    }),
    method: 'POST',
  });
  var response_json = await response.json();

  if (response_json.result == 'success') {
    credentials.manifestUrl = response_json.manifestUrl;
    credentials.authToken = response_json.authToken;
    // now save these
  } else {
    credentials.errorMessage = response_json.message;
  }
  return credentials;
}

export const validateCredentials = createAsyncThunk(
  'credentials/setCredentials',
  async (credentials, thunkAPI) => {
  console.log("Sending credential API request");
  console.log(credentials);
  const response = await validateCredentialsAPI(credentials);
  // gives back some credentials with a possible error message present
  return response;
  }
)



export const credentialsSlice = createSlice({
  name: 'credentials',

  initialState: { value: makeNewCredentials() },

  reducers: {
  },
  
  extraReducers: (builder) => {
  builder.addCase(validateCredentials.fulfilled, (state, action) => {  
      console.log("Updating the credentials with payload");
      console.log(action.payload);
      // set values from the payload to the state
      return {value: action.payload };
    })
  }

});


export const selectCredentials = (state) =>  state.credentials.value
export const { update } = credentialsSlice.actions

export default credentialsSlice.reducer
