import { Link } from "react-router-dom"
import Logo from "../images/Logo .png"
import WhiteLogo from "../images/WhiteLogo.png"

const Header = ({logo})=> {
 return (
    <div className="top-header">
        <div className="logo" style={{height:'70px'}}>
           
            {
                logo?(
                    logo=='white'
                    ? <img src={WhiteLogo} alt="" />
                    : <img src={Logo} alt="" />
                ):
                <></>
            }
        </div>
        <Link to='/dashboard'>my dashboard</Link>
    </div>
 )
}

export default Header