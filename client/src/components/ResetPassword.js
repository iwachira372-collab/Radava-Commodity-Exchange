import { useForm } from "react-hook-form"
import { toast } from 'react-toastify'
import { postData } from '../api/api'
import { useNavigate } from "react-router-dom"
import Loader from "./Loader";
import { useState } from "react";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const onSubmit = data=>{
    setLoading(true)
    postData('resetpassword', data)
    .then(res=>{
      setLoading(false)
      if(res.data?.msg){
        toast.success('Email with further instructions has been sent to your email address.')
        navigate('/otp/'+data.email)
      }else{
        toast.error("Unable to send email, please try again")
      }
    })
    .catch(err=>{
      setLoading(false)
      let e = err?.response?.data?.error ||'Unkown error, try again'
      toast.error(e)
    })
  }
  return (
    <div className="other-wraps">
      {loading &&
          <Loader/>
        }
         <form onSubmit={handleSubmit(onSubmit)} className="Auth-form" >
                <span className="info">
                    <h3>Reset Password?</h3>
                    <p>Enter the email with which you registerd your account and we would send an OTP with which you can change your password</p>
                </span>
                <input
                className = {`${errors.email?'error':''}`}
                {...register("email", { required: true})}
                type="text" placeholder="Email"/>
               
           
            <button  className="btn btn-success" type="submit">Proceed</button>
            
        </form>
    </div>
  )
}

export default ResetPassword