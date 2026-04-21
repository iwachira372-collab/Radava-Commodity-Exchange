import { Link, useNavigate } from "react-router-dom"
import man from '../images/man.png'
import register from '../images/register.png'
import verify from '../images/verify.png'
import fund from '../images/fund.png'
import trade from '../images/trade.png'
import logo1 from '../images/Logo .png'
import logo from '../images/WhiteLogo.png'
import {FaBars, FaTimes} from 'react-icons/fa'
import { useState } from "react"


const Landing = ()=>{
    const [open, setOpen] = useState(false)
    return (
        <div className="page">
         <div className="mrq">
         <div class="marquee">
            <div className="live">LIVE DATA</div>
            <ul className="marquee__content">
                <li>GROUNDNUTS SELL 345 BUY 369</li>
                <li>MAIZE SELL 130 BUY 140</li>
                <li>BEANS SELL 120 BUY 125</li>
                <li>RICE SELL 110 BUY 116</li>
                <li>MILLET SELL 106 BUY 110</li>
                <li>SORGHUM SELL 120 BUY 125</li>
                <li>WHEAT SELL 143 BUY 150</li>
                <li>GREEN GRAMS SELL 128 BUY 135</li>
            </ul>
            <ul className="marquee__content" aria-hidden="true">
                <li>GROUNDNUTS SELL 345 BUY 369</li>
                <li>MAIZE SELL 130 BUY 140</li>
                <li>BEANS SELL 120 BUY 125</li>
                <li>RICE SELL 110 BUY 116</li>
                <li>MILLET SELL 106 BUY 110</li>
                <li>SORGHUM SELL 120 BUY 125</li>
                <li>WHEAT SELL 143 BUY 150</li>
                <li>GREEN GRAMS SELL 128 BUY 135</li>
            </ul>
        </div>

         </div>
         <div className="nav">
            <div className="toggle" role="button" onClick={()=>setOpen(!open)}>
                {
                    open
                    ?<FaTimes/>
                    :<FaBars style={{color:"white"}}/>
                }
                
                
            </div>
           <img src={logo1} alt="" />
           <ul className={`${open?'opennav':''}`}>
            <li><a href="https://radava.co/" target="_blank">Home</a></li>
            <li><a href="https://radava.co/about/" target="_blank">About Us</a></li>
            <li><a href="https://radava.co/sign-up/" target="_blank">Membership</a></li>
            <li><a href="https://radava.co/market-information/" target="_blank">Market Information</a></li>
            <li><a href="https://radava.co/blog-2/" target="_blank">Blog</a></li>
            <li><Link to='/dashboard' className="start">Trading Platform</Link></li>
           </ul>
         </div>
         <section className="hero">
            <div className="left">
                <h1>Start Trading Agricultural commodities Easily</h1>
                <h3>Earn profits while empowering small holder farmers across Africa By investing in Agro-Commodities</h3>
                <Link to="/dashboard"  role="button">Create free account</Link>
            </div>
            <div className="right">
                <img src={man} alt="man with a laptop" />
            </div>
         </section>
         <section className="trade">
            <h1>Start Trading in 4 Easy Steps</h1>
            <div className="divider"><div></div></div>
            <div className="boxes">
                <div className="stepbox">
                    <img src={register} alt=""/>
                    <h3>Register</h3>
                </div>
                <div className="stepbox">
                    <img src={verify} alt=""/>
                    <h3>Verify</h3>
                </div>
                <div className="stepbox">
                    <img src={fund} alt=""/>
                    <h3>Fund</h3>
                </div>
                <div className="stepbox">
                    <img src={trade} alt=""/>
                    <h3>Trade</h3>
                </div>
            </div>
         </section>
         <section className="video">
         <iframe width="640" height="360" src="https://www.youtube.com/embed/V3-b21Ggtac" title="Radava Mercantile" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
         <h2>Watch video to learn how to Navigate the Exchange Platform</h2>
         </section>
         <section className="pagefooter">
            <div className="item">
                <img src={logo} alt="" />
            </div>
            <div className="item">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="">Start Trading</a></li>
                    <li><a href="">Farmer Signup</a></li>
                    <li><a href="">Off-taker Request</a></li>
                </ul>
            </div>
            <div className="item">
                <h3>Company</h3>
                <ul>
                    <li><a href="">Start Trading</a></li>
                    <li><a href="">Farmer Signup</a></li>
                    <li><a href="">Off-taker Request</a></li>
                </ul>
            </div>
            <div className="item">
                <h3>Address</h3>
                <ul>
                    <li><a href="">8th Floor, Pinetree Plaza, Kaburu Drive, off Ngong Road, Nairobi, Kenya</a></li>
                </ul>
            </div>
            <div className="item">
                <h3>Contact</h3>
                <ul>
                    <li><a href="mailto:info@radava.co">E-mail: info@radava.co</a></li>
                    <li><a href="">Tel: +254711701958</a></li>
                </ul>
            </div>
         </section>
        </div>
    )
}

export default Landing