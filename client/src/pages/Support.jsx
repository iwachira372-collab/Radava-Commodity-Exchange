import { BiSupport } from "react-icons/bi"
import Header from "../components/Header"
import back from '../images/back.png'
import tick from '../images/tick.png'


const Support = ()=>{
    return (
        <div className="success-div">
            <Header logo={true}/>
            <img src={back} alt='' className='background2' />
            <div className="box green-header">
                <h3 style={{textAlign:'center'}}>Contact support through any of these channels</h3>
                <div className="channel">
                    <span><BiSupport/></span> <span> (+254)711-701-958</span>
                </div>
                <div className="channel">
                    <span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-envelope-fill" viewBox="0 0 16 16">
  <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
</svg></span> <span> info@radva.co</span>
                </div>
            </div>
        </div>
    )
}

export default Support