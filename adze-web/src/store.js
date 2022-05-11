import { configureStore } from '@reduxjs/toolkit'

import manifestReducer from './state/manifestSlice.js'
import credentialsReducer from './state/credentialsSlice.js'


export default configureStore({
  reducer: {
    manifest: manifestReducer,
    credentials: credentialsReducer,
  },
})

