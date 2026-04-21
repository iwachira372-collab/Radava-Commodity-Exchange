import { useEffect } from 'react';
import image1 from '../images/farmer@2x.png';
import logoImage from '../images/Logo .png';
import Login from "./Login"
import { useNavigate } from 'react-router-dom';
// import Signup from './Signup';
// import ResetPassword from './ResetPassword';
// import Otp from './Otp';
// import NewPassword from './NewPassword';


const Auth = ({formTitle,children}) => {
  const navigate = useNavigate()
  
  return (
    <div className="Auth">
        <div className="Auth-left">
            <img src={image1} alt="" />
        </div>
        <div className="Auth-right">
            <div className="Auth-logo" >
                <img src={logoImage} alt="" className='logo' />
            </div>
            <h3 className="Auth-tittle success"> {formTitle}</h3>
            {children}
        </div>
    </div>
  )
}

export default Auth