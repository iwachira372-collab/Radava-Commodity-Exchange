import tick from '../images/tick.png'
import { Link } from "react-router-dom"
const Modal = ({title, text,header})=>{
    return (
        <div className="modal">
            {header==true &&
            <div className="top-header">
            <div className="logo" style={{height:'70px'}}></div>
            <Link to='/dashboard'>Back to dashboard</Link>
            </div>
            }
            <div className="modal-content">
                <img src={tick} alt="" />
               <div className="modal-body">
                    <h2>{title}</h2>
                    <p>{text}</p>
               </div>
            </div>
        </div>
    )
}

export default Modal