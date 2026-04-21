import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { postData } from '../api/api'
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "./Loader";

const NewPassword = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const {hash} = useParams()
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data=>{
        if(data.password != data.password2) return toast.error('Passwords do not match')
        if(data.password.length < 6)  return toast.error('Password should be at least 6 characters')
        setLoading(true)
        postData('savepassword',{hash,password:data.password})
        .then(res=>{
          setLoading(false)
          if(res.data?.success){
            toast.success("Password has been reset successfully")
            navigate('/')
          }
        })
        .catch(err=>{
          setLoading(false)
          let e = err?.response?.data?.error ||'Unkown error, try again'
          toast.error(e)
        })
  }

  useEffect(()=>{
    postData('verifyotp',{hash})
    .then(res=>{
       if(res.data.success){
         setLoading(false)
       }else{
        navigate('/')
       }
    })
    .catch(err=>{
      setLoading(false)
      // window.location.reload();
      toast.error('Unable to verify your credentials, if unable to reset password request a new otp')
    })

  },[])

  return (
    <div>
       {loading &&
          <Loader/>
        }
    <form  onSubmit={handleSubmit(onSubmit)} className="Auth-form" style={{margin:'auto',marginTop:'20px'}}>
           <span className="info">
               <h3>Choose a New Password</h3>
               <p>Please enter a new password and proceed to login with the new pasword if reset is successful.</p>
           </span>
           <input
            className = {`${errors.password?'error':''}`}
            {...register("password", { required: true})}
           type="password" placeholder="New Password"/>
           <input
           className = {`${errors.password2?'error':''}`}
           {...register("password2", { required: true})}
           type="password" placeholder="Confirm Password"/>
          
      
       <button  className="btn btn-success" type="submit">Reset Password</button>
       
   </form>
</div>
  )
}

export default NewPassword