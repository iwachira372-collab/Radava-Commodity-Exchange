import { useSelector, useDispatch } from 'react-redux'
import { setStep } from "../../slices/stepSlice"

export const useRegister = (elements)=>{
    const step = useSelector((state) => state.step.step)
    const dispatch = useDispatch()
    const titles =  [
        'Login',
        'Sign Up',
        ]

    const nextPage = ()=>{
        if(step>=elements.length) return
        dispatch(setStep({step:step+1}))
    }
    const prevPage = ()=>{
        if(step <= 0) return 
        dispatch(setStep({step:step-1}))
    }

    return {
        Page:elements[step],
        nextPage,
        prevPage,
        title:titles[step]
    }
}