
import Sidebar from "./Sidebar"
import TopBar from "./TopBar"
import {useState } from 'react'
import Loader from './Loader'
import { useDispatch, useSelector } from "react-redux"
import { setStep } from "../slices/stepSlice"
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { postData } from '../api/api';
import image from '../images/wave.png'
import { banks } from '../util/bank';




const Profile = () => {
    

    const user = useSelector(state=>state.user)
    console.log(user);
    const [img, setImg] = useState()
    const [nid, setNid] = useState()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmitBANK = data=>{
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
      const onSubmitKYC = data=>{
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

  return (
    <div className="container">
        {/* { loading &&
        <Loader/>
         
    
        } */}
        <Sidebar active={true}/>
        <div className="main">
              <TopBar/>
              <div className="content">
                 <h3>My Profile</h3>
                  <div className="profile">
                      <div className="profile-card" style={{backgroundImage:`url('${image}')`}}>
                        <div className="bio" >

                          <div className="profile-img">
                              <h1> {`${user.user.firstName} ${user.user.lastName}`.split(' ').map(function(item){return item[0]}).join('').toUpperCase()}</h1>
                          </div>
                          <div className="profile-info">
                              <h4> {`${user.user.firstName} ${user.user.lastName}`.toLocaleUpperCase()}</h4>
                              <p>
              
                                  <span>{user.user.phone}</span>
                              </p>
                              <p>
                  
                                  <span>{user.user.email}</span>
                              </p>
                             

                        </div>
                        
                        <span className={`${user.user.status?'status-success':'status-warning'} account-status `}>{user.user.status?'Verified':'Pending KYC'}</span>
                        </div>
                      </div>
                      <div className="profile-card">
                             <div className="Kyc">
                                  <h4>KYC </h4>
                                  <form  className="profile-form"  onSubmit={handleSubmit(onSubmitKYC)} >
                                      <div className="form-group"> 
                                          <label htmlFor="name">Next Of Kin</label>
                                          <input type="text" 
                                          className = {`${errors.nextofkin?'error':''}`}
                                          {...register("nextofkin", { required: true})}
                                          placeholder="John Doe"/>
                                      </div>
                                      <div className="form-group">
                                          <label htmlFor="phone">Relationship with Next Of Kin</label>
                                          <input type="text" 
                                          className = {`${errors.k_relationship?'error':''}`}
                                          {...register("k_relationship", { required: true})}
                                          placeholder="Father, Mother, Uncle"/>
                                      </div>  
                                      <div className="form-group">
                                          <label htmlFor="phone">Next Of Kin Phone Number</label>
                                          <input type="text" 
                                          className = {`${errors.k_phone?'error':''}`}
                                          {...register("k_phone", { required: true})}
                                          placeholder="+234 812 345 6789"/>
                                      </div>  
                                      <div className="form-group">
                                          <label htmlFor="address">Occupation</label>
                                          <input type="text" 
                                           className = {`${errors.occupation?'error':''}`}
                                           {...register("occupation", { required: true})}
                                          placeholder="eg Teacher, Farmer"/>
                                      </div>
                                      <div className="form-group">
                                          <label htmlFor="address">Home Address</label>
                                          <input type="text"
                                           className = {`${errors.address?'error':''}`}
                                            {...register("address", { required: true})}
                                            placeholder="eg Nairobi, Kenya"/>
                                      </div>
                                      <div className="form-group">
                                          <label htmlFor="address">Next Of Kin Address</label>
                                          <input type="text"
                                           className = {`${errors.k_address?'error':''}`}
                                           {...register("k_address", { required: true})}
                                           placeholder="eg Nairobi, Kenya"/>
                                      </div>
                                      <div className="form-group">
                                          <label htmlFor="address">Kenya Revenue Authority (KRA) PIN</label>
                                          <input type="text" 
                                           className = {`${errors.kra_pin?'error':''}`}
                                           {...register("kra_pin", { required: true})}
                                          placeholder="eg A0000000000L"/>
                                      </div>
                                      <div className="form-group">
                                      <label className={`Upload ${errors.identification_card?' error':''}`} for='uploadid'
                                        style={{position:'relative',cursor:'pointer',overflow:'hidden'}}
                                        >
                                            {img &&
                                            <img src={img} alt=''
                                            style={{
    
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
                                      <div className="form-group">
                                          <span>
                                          <small> All data submited are treated as confidential and used for the purpose of user verification only <a href="./" className="success"> Read our privacy policy here</a></small>
                                      </span>
                                                    </div>
                                      <div className="form-group">
                                          <button className="btn btn-success"> Submit</button>
                                      </div>

                                  </form>
                                    
                             </div>
                      </div>
                      <div className="profile-card">
                             <div className="Kyc">
                                  <h4>ACCOUNT DETAILS</h4>
                                  <form onSubmit={handleSubmit(onSubmitBANK)} className="profile-form">
                                   
                                      <div className="form-group">
                                          <label htmlFor="phone">MPESA NUMBER</label>
                                          <input type="text" name=" eg 07000000" value={user.user.phone} disabled/>
                                      </div>  
                                      <div className="form-group-2">
                                          <label htmlFor="email">BANK NAME</label>
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
                                      </div>
                                     
                                      <div className="form-group">
                                          <label htmlFor="accountname">ACCOUNT NAME</label>
                                          <input type="text"className = {`${errors.account_name?'error':''}`} {...register("account_name", { required: true})} placeholder="Account Name"/>
                                      </div>
                                      <div className="form-group">
                                          <label htmlFor="accountname">ACCOUNT NUMBER</label>
                                          <input type="number" className = {`${errors.account_number?'error':''}`} {...register("account_number", { required: true})} placeholder="Account Number"/>
                                      </div>
                                      
                                      <div className="form-group">
                                          <button className="btn btn-success"> UPDATE</button>
                                      </div>

                                  </form>
                                    
                             </div>
                      </div>
                  </div>
              </div>   

          </div>   
        
    </div>
  )
}

export default Profile