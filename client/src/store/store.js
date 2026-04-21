import { configureStore } from '@reduxjs/toolkit'

import stepReducer from '../slices/stepSlice'
import userReducer from '../slices/userSlice'

export default configureStore({
  reducer: {
    step:stepReducer,
    user:userReducer
},
})