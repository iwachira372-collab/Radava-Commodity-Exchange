import { useDispatch, useSelector } from "react-redux"
import { setStep } from "../slices/stepSlice"
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { postData } from '../api/api'
import Loader from "./Loader";
import { useState } from "react";

const Signup = () => {
const [loading, setLoading] = useState(false)
const dispatch = useDispatch()
const { register, handleSubmit, formState: { errors } } = useForm();
const onSubmit = data=>{
    if(data.password !== data.password2) return toast.error("Passwords do not match")
    delete data.password2
    setLoading(true)
    postData('user/create',data)
    .then(res=>{
       setLoading(false)
       toast.success('Account created successfully')
       window.localStorage.setItem('token',res.data.token)
    //    window.localStorage.setItem('user',JSON.stringfy(res.data.user))
       window.location.reload()
    })
    .catch(err=>{
        setLoading(false)
        let e = err.response.data.error.includes('email') ? "Email already in use, Login instead" :(err.response.data.error.includes('phone')?'Phone number already in use':'Uknown error try again')
        toast.error(e)
    })
    
}
// `firstName`, `lastName`, `phone`, `email`, `password
  return (
    <div>
          {loading &&
          <Loader/>
        }
        <form className="Auth-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="names" style={{flexDirection: 'column'}}>
                <input className = {`${errors.firstName?'error':''}`} {...register("firstName", { required: true})} type="text" placeholder="First Name" />
                <input className = {`${errors.lastName?'error':''}`} {...register("lastName", { required: true})} type="text" placeholder="Last Name" />
            </div>
                <input className = {`${errors.phone?'error':''}`} type="number" {...register("phone", { required: true})} placeholder="Phone Number"/>
                <input className = {`${errors.email?'error':''}`} type="email" {...register("email", { required: true})} placeholder="Email"/>
                <input className = {`${errors.password?'error':''}`} type="password" {...register("password", { required: true})} placeholder="Password"/>
                <input className = {`${errors.password2?'error':''}`} type="password" {...register("password2", { required: true})} placeholder="Retype Password"/>
           
            <button  className="btn btn-success" type="submit">Create Account</button>
            <div className="Auth-extras">
                <span>Already have an account? <a onClick={()=>dispatch(setStep({step:0}))} className="success">Log in here</a></span>
            </div>
        </form>
    </div>
  )
}

export default Signup