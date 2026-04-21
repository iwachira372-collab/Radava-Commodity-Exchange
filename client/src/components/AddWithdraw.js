
import {GiWallet} from 'react-icons/gi';
import {FaWallet} from 'react-icons/fa';

const AddWithdraw = () => {
  return (
    <div className="Auth-right">
        <div className="payment-buttons">
            <button className='btn btn-success'><GiWallet className='icon'/> Add Money to wallet</button>
            <button className='btn btn-success'><FaWallet className='icon'/>Withdraw Money from wallet</button>
        </div>
    </div>

  )
}

export default AddWithdraw