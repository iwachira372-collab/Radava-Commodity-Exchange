
import { setStep } from "../slices/stepSlice"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { postData } from '../api/api'
import { setUser } from "../slices/userSlice"
import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

//https://www.npmjs.com/package/reactjs-social-login
import {
  LoginSocialGoogle,
  LoginSocialAmazon,
  LoginSocialFacebook,
  LoginSocialGithub,
  LoginSocialInstagram,
  LoginSocialLinkedin,
  LoginSocialMicrosoft,
  LoginSocialPinterest,
  LoginSocialTwitter,
  LoginSocialApple,
  IResolveParams,
} from 'reactjs-social-login';

import {
  FacebookLoginButton,
  GoogleLoginButton,
  GithubLoginButton,
  AmazonLoginButton,
  InstagramLoginButton,
  LinkedInLoginButton,
  MicrosoftLoginButton,
  TwitterLoginButton,
  AppleLoginButton,
} from 'react-social-login-buttons';

import Loader from "./Loader";

const Login = (props) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false)
  const [provider, setProvider] = useState('');
  const [profile, setProfile] = useState();
  const onLoginStart = useCallback(() => {
    alert('login redirect');
  }, []);
  const onLogoutSuccess = useCallback(() => {
    setProfile(null);
    setProvider('');
    alert('logout success');
  }, []);
  const onLogout = useCallback(() => {}, []);
  const REDIRECT_URI =
  '/dashboard';

  useEffect(()=>{
    console.log(window.location,'test')
    if(window.location.href.includes('/trade')) window.location.href = window.location.href.replace('/trade', '')
  },[])


  const responseGoogle = response => {
    props.callback({
      type: "GMAIL",
      payload: response
    }) 
  }

  const responseFacebook = (response) => {
    console.log(response);
    props.callback({
      type: "FACEBOOK",
      payload: response
    }) 
  }


  const types = props.typeOfLogin;
  const text = props
  // developer key ids placed in .env.local 
  function showGmail() {
      return <LoginSocialGoogle
          client_id={process.env.REACT_APP_GG_APP_ID || ''}
          onLoginStart={onLoginStart}
          redirect_uri={REDIRECT_URI}
          scope="openid profile email"
          discoveryDocs="claims_supported"
          access_type="offline"
          onResolve={({ provider, data }: IResolveParams) => {
            setProvider(provider);
            setProfile(data);
          }}
          onReject={err => {
            console.log(err);
          }}
        >
          <GoogleLoginButton />
      </LoginSocialGoogle>
  }

  // developer key ids placed in .env.local 
  function showFacebook() {
      return <LoginSocialFacebook 
          appId={process.env.REACT_APP_FB_APP_ID || ''}
          fieldsProfile={
            'id,first_name,last_name,middle_name,name,name_format,picture,short_name,email,gender'
          }
          onLoginStart={onLoginStart}
          onLogoutSuccess={onLogoutSuccess}
          redirect_uri={REDIRECT_URI}
          onResolve={({ provider, data }: IResolveParams) => {
            setProvider(provider);
            setProfile(data);
          }}
          onReject={err => {
            console.log(err);
          }}
        >
          <FacebookLoginButton />
      </LoginSocialFacebook>

  }


  const onSubmit = data=>{
    setLoading(true)
    postData('user/login',data)
    .then(res=>{
      if(res.data.user){
        window.localStorage.setItem('token',res.data.token)
        // window.localStorage.setItem('user',JSON.stringfy(res.data.user))
        window.location.reload()
      }else{
        setLoading(false)
      }
    })
    .catch(err=>{
      setLoading(false)
      let e = err?.response?.data?.error ||'Unknown error, try again'
      toast.error(e)
    })
  }

  return (
    // <div style={{margin:'auto'}}> 
    <div style={{}}>
        {loading &&
          <Loader/>
        }
        <form className="Auth-form" onSubmit={handleSubmit(onSubmit)}>
                <input type="text" placeholder="Email"
                  className = {`${errors.email?'error':''}`}
                  {...register("email", { required: true})}
                />
                <input type="password" placeholder="Password"
                  className = {`${errors.password?'error':''}`}
                  {...register("password", { required: true})}
                />
           
            <button  className="btn btn-success" type="submit">Log in</button>
            <div className="Auth-extras">
                <span>Dont have an account? <a onClick={()=>dispatch(setStep({step:1}))} className="success">Signup here</a></span>
                <Link className="warning" style={{textDecolation:'none'}} to='/reset-password'>Forgot Password?</Link>
            </div>
            <div className="flex-container" style={{ backgroundColor: '#FBF9FA', width: '23vw', display: 'flex', flexFlow: 'column', alignItems: 'center', borderRadius: '25px' }}>
              { showGmail() }
              { showFacebook() }
          </div>
        </form>
    </div>
  )
}

export default Login