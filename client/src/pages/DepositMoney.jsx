import Header from "../components/Header"
import {io} from "socket.io-client"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import Modal from "../components/Modal"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"
import { useForm } from "react-hook-form";
import { postData } from "../api/api"
import Loader from "../components/Loader"
// add to wallet
const DepositMoney = ()=>{
    const { register, handleSubmit, formState: { errors } } = useForm();
   
    const { amount } = useParams()
    const [loading, setLoading] = useState(false)
    const [gateway, setGateway] = useState()
    const [success, setSuccess] = useState()
    const [trans, setTrans] = useState()
    const user = useSelector(state=>state.user.user)
    useEffect(()=>{
        const socket = io('http://io.radava.co')
        socket.on('payment',(data)=>{
        setLoading(false)
        if(data.msg =='failed' && data.userid == user.id){
            toast.error(data.ResultDesc)
        }else if(data.msg =='success' && data.userid == user.id){
            setSuccess(true)
            setTrans(data)
        }
        })
    },[])

    const onSubmit = data=>{

        if(data.phone.toString().length !== 10) return toast.error('Invalid phone number')

        const phone = "254"+parseInt(data.phone)
        setLoading(true)
        postData('mpesa',{amount,phone})
        .then(res=>{
           toast.success('Translation initiated, Enter your pin to complete translation')
        })
        .catch(err=>{
            setLoading(false)
            toast.error('Unable to initiate transaction check phone number and try again')
        })
   }
    return (
        <>
        {loading &&
         <Loader/>
        }
        {(success && trans) &&
         <Modal
          header={false}
         title="Payment Processed Successfully"
         text={`You have successfully funded your wallet with KES ${amount}`}
         />
        }
        <Header logo={true}/>
        <div className="add-to-wallet">
         <h2>Top Up Wallet</h2>
         <form className="form-card" style={{alignItems:'center'}} onSubmit={handleSubmit(onSubmit)}>
            <label>You are about to top up your wallet with</label>
            <h2>KES {amount}</h2>
            <div className="radio" style={{display:'flex',justifyContent:'flex-start',alignItems:'center',gap:'10px',width:'160px'}}>
                <input type="radio" onChange={e=>setGateway(1)} id="st" style={{width:'fit-content',accentColor:'green'}} checked={gateway==1}/>
                <label htmlFor="st" style={{width:'fit-content'}} >Pay With PayStack</label>
            </div>
            <div className="radio" style={{display:'flex',justifyContent:'flex-start',alignItems:'center',gap:'10px',width:'160px'}}>
                <input type="radio" onChange={e=>setGateway(2)} checked={gateway==2} id="mp" style={{width:'fit-content',accentColor:'green'}}/>
                <label htmlFor="mp" style={{width:'fit-content'}}>Pay With Mpesa</label>
            </div>
            {gateway==2 &&
                <div className="radio" style={{display:'flex',justifyContent:'flex-start',alignItems:'flex-start',gap:'10px',width:'100%',flexDirection:"column"}}>
                <label htmlFor="" style={{width:'fit-content'}}>Enter Your Mpesa Phone Number</label>
                <input type="number"
                className = {`${errors.phone?'error':''}`}
                {...register("phone", { required: true})}
                style={{width:'100%',accentColor:'green'}} placeholder="0745656473"/>
            </div>
            }
            {gateway == 2 &&
                <button className="btn-success2" style={{marginTop:'20px'}} type="submit">Proceed</button>
            }
         </form>
        </div>
        </>
    )
}

export default DepositMoney