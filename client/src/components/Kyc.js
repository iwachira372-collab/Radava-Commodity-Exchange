import logo from '../images/Logo .png'
import { useDispatch, useSelector } from "react-redux"
import { setStep } from "../slices/stepSlice"
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { postData } from '../api/api'
import { useState } from 'react';
import Loader from "./Loader";
// `userid`, `address`, `occupation`, `nextofkin`, `k_phone`, `k_relationship`, `k_address`, `kra_pin`, `identification_card`
const Kyc = () => {
    const user = useSelector(state=>state.user)
    const [img, setImg] = useState()
    const [nid, setNid] = useState()
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data=>{
        const formdata = new FormData()
        formdata.append('identification_card',nid)
        Object.keys(data).map(ky=>{
            if(ky!='identification_card'){
                formdata.append(ky,data[ky])
            }
        })
        setLoading(true)
        postData('user/create/userbio',formdata) 
        .then(res=>{
            setLoading(false)
            toast.success('Details saved successfully')
            dispatch(setStep({step:3}))
        })
        .catch(err=>{
            setLoading(false)
            // dispatch(setStep({step:3}))
            let e = err?.response?.data?.error ||'Unkown error, try again'
            toast.error(e)
        })
    }
//   if(!user?.id) dispatch(setStep({step:0}))
  return (
    <div className="kyc">
        {loading &&
          <Loader/>
        }
         <form className="kyc-body" onSubmit={handleSubmit(onSubmit)}>
                {/* <div className="kyc-logo">
                    <div>
                        <img src={logo} alt=""  className='logo'/>
                        <h5 className="success">Upload KYC</h5>
                    </div>
                    
                </div> */}
                <div className="Forms">
                    <div className="Kyc-form">
                        <label>
                            Home Address 
                            <input type="text"
                             className = {`${errors.address?'error':''}`}
                             {...register("address", { required: true})}
                            />
                        </label>
                        <label>
                            Next Of Kin 
                            <input type="text"
                            className = {`${errors.nextofkin?'error':''}`}
                            {...register("nextofkin", { required: true})}
                            />
                        </label>
                        <label>
                            Relationship with Next Of Kin 
                            <input type="text"
                            className = {`${errors.k_relationship?'error':''}`}
                            {...register("k_relationship", { required: true})}
                            />
                        </label>
                        <label className={`Upload ${errors.identification_card?' error':''}`} for='uploadid'
                         style={{position:'relative',cursor:'pointer',overflow:'hidden'}}
                        >
                            {img &&
                            <img src={img} alt=''
                             style={{
                                position:'absolute',
                                objectPosition:'center',
                                objectFit:'cover',
                                width:'100%',
                                height:'100%'
                             }}
                            />
                            }
                            UPLOAD NATIONAL ID
                        </label>
                        <input type='file' id='uploadid' accept="image/jpg, image/png, image/jpeg" style={{display:'none'}}
                        
                        {...register("identification_card", { required: true,
                            onChange:(e)=>{
                                setImg(URL.createObjectURL(e.target.files[0]))
                                setNid(e.target.files[0])
                            
                        }})}
                        />
                        
                    </div>
                    <div className="Kyc-form">
                        <label>
                            Occupation 
                            <input type="text" 
                            className = {`${errors.occupation?'error':''}`}
                            {...register("occupation", { required: true})}
                            />
                        </label>
                        <label>
                            Next Of Kin Phone Number
                            <input type="text"
                            className = {`${errors.k_phone?'error':''}`}
                            {...register("k_phone", { required: true})}
                            />
                        </label>
                        <label>
                        Next Of Kin Adress
                            <input type="text"
                            className = {`${errors.k_address?'error':''}`}
                            {...register("k_address", { required: true})}
                            />
                        </label>
                        <label>
                        Kenya Revenue Authority (KRA) PIN
                            <input type="text" 
                            className = {`${errors.kra_pin?'error':''}`}
                            {...register("kra_pin", { required: true})}
                            />
                        </label>
                        <span>
                            <small> All data submited are treated as confidential and used for the purpose of user verification only <a href="./" className="success"> Read our privacy policy here</a></small>
                        </span>
                        
                    </div>
                    
                </div>
                <div className="kyc-logo">
                    <button className="btn-long btn-success" type='submit'> PROCEED</button>
                </div>
         </form>
    </div>
  )
}

export default Kyc