import {BiLogOut, BiUserCircle,BiSupport} from 'react-icons/bi'
import {GiBuyCard} from 'react-icons/gi'
import {FaWallet,FaBars} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'

import {AiFillCloseCircle} from 'react-icons/ai'
import {BsGrid1X2Fill,BsPersonCircle,BsGraphUp,BsPersonGear} from 'react-icons/bs'
import logo from '../images/Logo .png'

const Sidebar = ({active}) => {
    const navigate = useNavigate()
      const togglehide = ()=>{
        document.getElementById("sidebar").classList.toggle("show");
      }
  return (
    <div className="sidebar" id='sidebar'>
    <div className="sidebar-logo">
            <img src={logo} alt=""  className='logo' />
    </div>
    
        <AiFillCloseCircle className='hide-menu' onClick={togglehide}/>
    
   <div className='navigation'>
      <Link className={active?'link':'link active'} to='/dashboard'>
            <BsGrid1X2Fill className='icon n'/>
            <span className='link-text'>Dashboard</span>
      </Link> 
   </div>
   <div className='navigation'>
      <Link className='link' to='/buy-or-sell'>
            <GiBuyCard className='icon n'/>
            <span className='link-text'>Buy/Sell Commodities</span>
      </Link>
   </div>
   <div className='navigation'>
      <Link className='link' to='/funds'>
            <FaWallet className='icon n'/>
            <span className='link-text'>Add/Withdraw Funds</span>
      </Link>
   </div>
   {/* <div className='navigation'>
      <Link className={active?'link active':'link'} to='/profile'>
            <BsPersonCircle className='icon n'/>
            <span className='link-text'>Profile</span>
      </Link>
   </div> */}
   <div className='navigation'>
      <Link to='/support' className='link'>
            <BiSupport className='icon n'/>
            <span className='link-text'>Get Support</span>
      </Link>
   </div>
   <div className='navigation' onClick={()=>{window.localStorage.removeItem('token');window.location.reload()}}>
      <span className='link'>
            <BiLogOut className='icon n'/>
            <span className='link-text'>Logout</span>
      </span>
   </div>
</div>
  )
}

export default Sidebar