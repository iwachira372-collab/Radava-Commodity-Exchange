import { FaWallet } from 'react-icons/fa'
import woman from '../images/woman.png'
import back from '../images/back.png'
import { GiWallet } from 'react-icons/gi'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'

// we have two buttons on this page
const Withdraw = ()=>{
    const navigate = useNavigate()
    return (
        <>
        <Header/>
        <div className="withdraw">
         <img src={woman} alt="" />
          <div className="action">
            <button onClick={()=>navigate('/add-to-wallet')}><GiWallet/> Add Money to Wallet</button>
            <button onClick={()=>navigate('/withdraw-from-wallet')}><FaWallet/>  Withdraw Money from Wallet</button>
            <img src={back} alt='' className='background' />
          </div>
        </div>
        </>
    )
}

export default Withdraw