import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import produce from "immer"

//########################################
// Defines a Slice managing the feed 
//########################################


async function updateFeedLinks(manifest) {
}

export const updateFeed = createAsyncThunk(
  'feed/update',
   async (manifest, thunkAPI) => {
   const feedResult = await updateFeedLinks(manifest)
  }
)


function makeInitialFeed() {
  return [
    { url: 'https://apxhard.com', title: "some stupid blog"  },
  ]
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
