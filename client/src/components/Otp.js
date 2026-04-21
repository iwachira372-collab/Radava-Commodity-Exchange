import { Link, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { toast } from 'react-toastify'
import { postData } from '../api/api'
import { useNavigate } from "react-router-dom"
import Loader from "./Loader";
import { useState } from "react"
const Otp = () => {
  const navigate = useNavigate()
  const {email} = useParams()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()
  const onSubmit = data=>{
    setLoading(true)
    postData('savehash',{code:data.otp,email})
    .then(res=>{
      setLoading(false)
      if(res.data?.hash){
          navigate('/new-password/'+res.data.hash)
      }else{
        toast.error('Unkown error, try again') 
      }
    })
    .catch(err => {
      setLoading(false)
      let e = err?.response?.data?.error ||'Unkown error, try again'
      toast.error(e)
    })
  }

  const resendEmail = ()=>{
    setLoading(true)
    postData('resetpassword', {email})
    .then(res=>{
      setLoading(false)
      if(res.data?.msg){
        toast.success('Message with further instructions has been sent to your email address.')
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
    <div>
       {loading &&
          <Loader/>
        }
    <form className="Auth-form"  onSubmit={handleSubmit(onSubmit)}>
           <span className="info">
               <h3>Password Reset OPT has been sent! </h3>
               <p>Please enter the OTP sent to your phone and email</p>
           </span>
           <input
           className = {`${errors.otp?'error':''}`}
           {...register("otp", { required: true})}
           type="text" placeholder="OTP"/>
          
           <div className="names">
                <button  className="btn btn-success btn-half" onClick={(e)=>{
                  e.preventDefault()
                  resendEmail()
                }} >Resend OTP</button>
                <button  className="btn btn-success btn-half" type="submit">Proceed</button>
            </div>
            <p style={{marginTop:'20px'}}><Link to='/reset-password'>Edit Email ({email})</Link></p>
      
       
   </form>
</div>
  )
}

export default Otp