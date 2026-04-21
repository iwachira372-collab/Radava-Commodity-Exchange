import Header from "../components/Header"
import mpesa from "../images/mpesa.png"
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import Loader from "../components/Loader";
import { getData, postData, getAdmin } from '../api/api'
import { useDispatch, useSelector } from "react-redux"
import { moneyFormat } from "../util/moneyFormat";
import { setUser } from "../slices/userSlice"
import Modal from "../components/Modal";
// this the actual money withdrawal page
const WithdrawFromWallet = ()=>{
    const user = useSelector(state=>state.user.user)
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { register: register2, handleSubmit:  handleSubmit2, formState: { errors:errors2 } } = useForm();
    const [loading, setLoading] = useState(false)
    const [modal, setModal] = useState(false)
    const [balance,setBalance] = useState(0)
    const [balance2,setBalance2] = useState(0)
    const [amount,setAmount] = useState(0)
    const dispatch = useDispatch()

    useEffect(()=>{
        getData('account')
        .then(res=>{
            setBalance(res.data.balance)
            setBalance2(res.data.balance)
        })
    },[])
    const login = async (password)=>{
        return await new Promise((resolve, reject)=>{
            setLoading(true)
            postData('user/login',{email:user.email,password})
            .then(res=>{

              setLoading(false)
              if(res.data.user){
                dispatch(setUser({user:res.data.user}))
                window.localStorage.setItem('token',res.data.token)
              }else{
                setLoading(false)
              }
              resolve(true)
            })
            .catch(err=>{
              setLoading(false)
              let e = 'Wrong password'
              toast.error(e)
              resolve(false)
            })
        })
    }
    const handlebalance = (val)=>{
        if(isNaN(val)) return
        setBalance(balance2-val)
        setAmount(val)
    }
    const onSubmit = async data=>{
        const check = await login(data.password)
        if(!check) return
        delete data.password
        postData('withdraw',data)
        .then(res=>{
            setModal(true)
        }).catch(err=>{
            setLoading(false)
            let e = err?.response?.data?.error ||'Unkown error, try again'
            toast.error(e)
          })

    }
    const onSubmit2 = async data=>{
        const check = await login(data.password2)
        if(!check) return
        postData('withdraw',{amount:data.amount2,phone:data.phone2})
        .then(res=>{
            setModal(true)
        }).catch(err=>{
            setLoading(false)
            let e = err?.response?.data?.error ||'Unkown error, try again'
            toast.error(e)
          })
    }
//   `amount`, `phone`, `bank`, `acountnumber`, `acountname`, `type`
    return (
        <>
        <Header logo={true}/>
        {loading &&
          <Loader/>
        }
        { modal &&
         <Modal
          header={true}
          title={'Request Received'}
          text={'Your withdrawal request of KES '+amount+' has been received successfully and will be processed shortly'}
         />
        }
        <div className="row-center">
            <div className="col">
                <h3>Withdraw With Bank Account</h3>
                <form className="form-card" onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-group">
                        <label htmlFor="">Remaining Balance</label>
                        <input type="text" value={'KES '+moneyFormat(balance)} 
                         className = {`${balance<0?'input error':'input'}`}
                        readOnly/>
                    </div>
                    <div className="input-group">
                        <label htmlFor="">Amount to Withdraw</label>
                        <input type="number"
                        className = {`${errors.amount?'input error':'input'}`}
                        {...register("amount", { required: true,onChange:e=>handlebalance(e.target.value)})}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="">Bank</label>
                        <input type="text" 
                        className = {`${errors.bank?'input error':'input'}`}
                        {...register("bank", { required: true})}
                        placeholder="Prime Bank" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="">Account Number</label>
                        <input type="number" placeholder="0160187865705" 
                        className = {`${errors.acountnumber?'input error':'input'}`}
                        {...register("acountnumber", { required: true})}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="">Account Name</label>
                        <input type="text" 
                         className = {`${errors.acountname?'input error':'input'}`}
                         {...register("acountname", { required: true})}
                        placeholder="John Doe" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="">Enter Login Password</label>
                        <input type="password" 
                        className = {`${errors.password?'input error':'input'}`}
                        {...register("password", { required: true})}
                        />
                    </div>
                    <button className="btn-success2" type="submit" style={{width:'100%'}}>Request Withdrawal</button>
                </form>
            </div>

            <div className="col">
                <h3 >Withdraw With Mpesa Account</h3>
              
                <form className="form-card"  onSubmit={handleSubmit2(onSubmit2)} style={{paddingTop:'10px'}}>
                    <div style={{with:'100%'}}>
                        <img src={mpesa} alt="" width="100"/>
                    </div>
                    <div className="input-group">
                        <label htmlFor="">Remaining Balance</label>
                        <input type="text" value={'KES '+moneyFormat(balance)} 
                         className = {`${balance<0?'input error':'input'}`}
                        readOnly/>
                    </div>
                    <div className="input-group">
                        <label htmlFor="">Amount to Withdraw</label>
                        <input type="number"
                        className = {`${errors2.amount2?'input error':'input'}`}
                        {...register2("amount2", { required: true,onChange:e=>handlebalance(e.target.value)})}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="">Phone Number</label>
                        <input type="number" 
                        className = {`${errors2.phone2?'input error':'input'}`}
                        {...register2("phone2", { required: true})}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="">Enter Login Password</label>
                        <input type="password" 
                        className = {`${errors2.password2?'input error':'input'}`}
                        {...register2("password2", { required: true})}
                        />
                    </div>
                    <button className="btn-success2" type="submit"  style={{width:'100%'}}>Request Withdrawal</button>
                </form>
            </div>
        </div>
        </>
    )
}

export default WithdrawFromWallet