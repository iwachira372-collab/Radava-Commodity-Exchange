import {BiLogOut, BiUserCircle,BiSupport} from 'react-icons/bi'
import {GiBuyCard} from 'react-icons/gi'
import {FaWallet,FaBars} from 'react-icons/fa'


import {AiFillCloseCircle} from 'react-icons/ai'
import {BsGrid1X2Fill,BsPersonCircle,BsGraphUp,BsPersonGear} from 'react-icons/bs'
import logo from '../images/Logo .png'
import { useDispatch, useSelector } from "react-redux"

// import Portifolio from './Portifolio'
// import AddWithdraw from './AddWithdraw'
// import AddWithdraw from './AddWithdraw'

import { Link, useNavigate } from 'react-router-dom'
import Modal from './Modal'
import ProductsChart from './ProductsChart'
import { useEffect, useState } from 'react'
import { getData, getAdmin, getDataAdmin } from '../api/api'
import { moneyFormat } from '../util/moneyFormat'
import { toast } from 'react-toastify'
import Loader from './Loader'

import Sidebar from './Sidebar'

const TopBar = () => {
const navigate = useNavigate()
  const user = useSelector(state=>state.user.user)
  const [balance,setBalance] = useState(0)
  const [demo,setDemo] = useState(window.localStorage.getItem('demo')==undefined)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    getData('account')
    .then(res=>{
        setBalance(res.data.balance)
        setLoading(false)
    })
    .catch(err=>setLoading(false))
  },[demo])

  const [total, setTotal] = useState(0)
    useEffect(()=>{
        getDataAdmin('portfolio')
       .then(res=>{
        setLoading(false)
        setTotal((p)=>{
            let t = 0
            res.data.map(product=>{
              t +=product.sellingprice*product.qty
            })
            return t
        })
    })
    .catch(err=>setLoading(false))
    },[demo])
    const switchDemo = ()=>{
      const st = window.localStorage.getItem('demo')  
      if(st){
         window.localStorage.removeItem('demo')
         window.location.reload()
         setDemo()
      }else{
        setLoading(true)
        getData('user/demo')
        .then(res=>{
           window.localStorage.setItem('demo','true')
           window.location.reload()
           setDemo(true)
           setLoading(false)
        })
        .catch(err=>{
            toast.error('Failed please try again')
            setLoading(false)
        })
      }
    }
    const toggleclick = ()=>{
        document.getElementById("sidebar").classList.toggle("show");
      }
      const togglehide = ()=>{
        document.getElementById("sidebar").classList.toggle("show");
      }

  return (
    <div className='top'>
    <span className='close' onClick={toggleclick}><FaBars/></span>
    <span className='menu'  onClick={togglehide}><FaBars/></span>
    <div className="account-details">
        <Link className='view' to={'/profile'}>
          <BiUserCircle className='icon-c'/>
          <span className=''> {user?.firstName} {user?.lastName}</span>
        </Link>
        <span><Link to="/history"> VIEW TRADE HISTORY</Link></span>
        {/* <span><Link to="/history"> demo</Link></span> */}
        <button onClick={switchDemo} className='demo'>{demo?'Switch Demo':'Switch Live'}</button>
    </div>
    <div className='account-cards'>
        <div className='account-card'>
            <span className='icon warning'><FaWallet /></span>
            <span className='card-details'>
                <label>
                    <small>CASH BALANCE</small>
                    <span>KES {moneyFormat(balance)}.00</span>
                </label>
            </span>
           <small className='warning'>
           <Link className='warning' to='/funds' style={{fontSize:'12px',textDecoration:'none'}}>FUND WALLET</Link>
           </small>

        </div>
        <div className='account-card'>
            <span className='icon warning'><BsGraphUp/></span>
            <span className='card-details'>
                <label>
                    <small>COMMODITIES VALUE</small>
                    <span>KES {moneyFormat(total)}.00</span>
                </label>
            </span>
            <small className='warning'><Link to='/buy-or-sell' style={{fontSize:'12px',textDecoration:'none',color:'red'}}>BUY COMMODITIES</Link></small>
        </div>

    </div>
</div>
  )
}

export default TopBar