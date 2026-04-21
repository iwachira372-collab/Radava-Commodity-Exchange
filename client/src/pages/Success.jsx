import Header from "../components/Header"
import back from '../images/back.png'
import tick from '../images/tick.png'


const Success = ()=>{
    return (
        <div className="success-div">
            <Header logo={true}/>
            <img src={back} alt='' className='background2' />
            <div className="box">
                <img src={tick} alt="" />
                <div>
                    <h2>Withdrawal Successful</h2>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatem inventore harum modi porro tempore numquam tenetur totam reiciendis earum omnis cumque deserunt.</p>
                </div>
            </div>
        </div>
    )
}

export default Success