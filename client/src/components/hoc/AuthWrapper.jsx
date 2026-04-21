import { useEffect, useState } from "react"
import BankDetails from "../BankDetails"
import Kyc from "../Kyc"
import Login from "../Login"
import Signup from "../Signup"
import { useRegister } from "../hooks/useRegister"
import { getData } from "../../api/api"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "../../slices/userSlice"
import { setStep } from "../../slices/stepSlice"
import Auth from "../Auth"
import Loader from "../Loader"
import { useNavigate } from "react-router-dom"


const AuthWrapper = ({children})=>{
    const user = useSelector(state=>state.user.user)
    const dispatch = useDispatch()
    const {Page,nextPage,prevPage,title} = useRegister([<Login/>,<Signup/>])
    const [auth, setAuth] = useState(false)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
  
    useEffect(()=>{
      getData('verify')
      .then(res=>{
        setLoading(false)
        //dispatch(setUser("Admin"))
        setAuth(true)
        // if(res.data?.user){
        //     dispatch(setUser({user:res.data.user}))
        //     setAuth(true)
        // }
      })
      .catch(err=>setLoading(false))
    },[])
   

    if(loading) return <Loader/>
    if(auth) return children
    return <Auth formTitle = {title}>{Page}</Auth>
    
}


export default AuthWrapper