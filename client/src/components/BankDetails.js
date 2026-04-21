
import logo from '../images/Logo .png';
import { useDispatch, useSelector } from "react-redux"
import { setStep } from "../slices/stepSlice"
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { postData } from '../api/api'
import { useState } from 'react';
import Loader from "./Loader";
import { banks } from '../util/bank';

 
const BankDetails = () => {
    const user = useSelector(state=>state.user)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data=>{
        setLoading(true)
        postData('user/create/bankdetails',data)
        .then(res=>{
            setLoading(false)
            toast.success('Details saved successfully')
            dispatch(setStep({step:0}))
        })
        .catch(err=>{
            let e = err?.response?.data?.error ||'Unkown error, try again'
            toast.error(e)
            setLoading(false)
        })
    }
    // `userid`, `bank`, `account_number`, `account_name`
  return (
    <div className="kyc">
        {loading &&
          <Loader/>
        }
         <form className="kyc-body"  onSubmit={handleSubmit(onSubmit)}>
                <div className="Forms">
                    <div className="Kyc-form bank">
                        <label>
                            Bank
                            <select
                            className = {`${errors.bank?'error':''}`}
                            {...register("bank", { required: true})}
                            >
                                <option value="">SELECT BANK</option>
                                {
                                    banks.map((bank,i)=>(
                                        <option key={i} value={bank.bank}>{bank.bank}</option>
                                    ))
                                }
                                
                            </select>
                        </label>
                        <label>
                            Account Number 
                            <input type="number"
                            className = {`${errors.account_number?'error':''}`}
                            {...register("account_number", { required: true})}
                            />
                        </label>
                        <label>
                            Account Name
                            <input type="text"
                            className = {`${errors.account_name?'error':''}`}
                            {...register("account_name", { required: true})}
                            />
                        </label>
                        
                        <label>
                        <button className="btn-bank btn-success" type='submit'> PROCEED</button>
                        </label>
                    </div>

                    
                </div>
                
         </form>
    </div>
  )
}

export default BankDetails