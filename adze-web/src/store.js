import { configureStore } from '@reduxjs/toolkit'

import manifestReducer from './state/manifestSlice.js'


export default configureStore({
  reducer: {
    manifest: manifestReducer,
  },
})

