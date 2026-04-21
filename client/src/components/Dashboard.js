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
import { getData, getAdmin } from '../api/api'
import { moneyFormat } from '../util/moneyFormat'
import { toast } from 'react-toastify'
import Loader from './Loader'

import Sidebar from './Sidebar'
import TopBar from './TopBar'

const Dashboard = () => {
  
  const [loading, setLoading] = useState(false)


  return (
    <div className="container">
        { loading &&
        <Loader/>
        }
        <Sidebar/>
        <div className="main">
            <TopBar/>
            <ProductsChart/>
        </div>
        
    </div>
  )
}

export default Dashboard