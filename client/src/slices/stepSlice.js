import { createSlice } from '@reduxjs/toolkit'

export const stepSlice = createSlice({
  name: 'step',
  initialState: {
    step: 0,
  },
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload.step
    },
  },
})

// Action creators are generated for each case reducer function
export const { setStep } = stepSlice.actions

export default stepSlice.reducer