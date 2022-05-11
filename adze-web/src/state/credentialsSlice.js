import { createSlice} from '@reduxjs/toolkit'

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
    authToken: ""
  };
}


export const credentialsSlice = createSlice({
  name: 'credentials',

  initialState: { value: makeNewCredentials() },

  reducers: {
  
    // todo: add abily to attempt setting the credentials
    update: (state, action) => {
      console.log("Updating the credentials with payload");
      console.log(action.payload)
    }
  }

});


export const selectCredentials = (state) =>  state.credentials.value
export const { update } = credentialsSlice.actions

export default credentialsSlice.reducer
