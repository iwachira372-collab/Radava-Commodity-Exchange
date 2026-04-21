import { useEffect, useState } from "react"
import Header from "./Header"
import {BsGraphUp} from 'react-icons/bs'
import {FaWallet} from 'react-icons/fa'
import {useNavigate} from 'react-router-dom'
import { getAdmin, getData, getDataAdmin } from "../api/api"
import { moneyFormat } from "../util/moneyFormat"

const Portifolio = () => {
    const navigate = useNavigate()
    
    const buy = (comodity)=>{
        navigate('/buy/'+comodity)
    }
    const sell = (comodity)=>{
        navigate('/sell/'+comodity)
    }

    const [products, setProducts] = useState([])
    const [total, setTotal] = useState(0)
    const [balance,setBalance] = useState(0)
    useEffect(()=>{
        getDataAdmin('portfolio')
       .then(res=>{
        setProducts(res.data)
        setTotal((p)=>{
            let t = 0
            res.data.map(product=>{
                t +=product.sellingprice*product.qty
            })
            return t
        })
    
    })
    getData('account')
    .then(res=>{
        setBalance(res.data.balance)
    })
    },[])
   

  
  return (
    <div className="portfolio">
      <Header logo={"white"}/>
      <div className="top-section">
        <div className="portfolio-cards">
            <div>
                <div><FaWallet style={{color:'red'}}/></div>
                <div>
                    <p>CASH BALANCE</p>
                    <h3>KES {moneyFormat(balance)}</h3>
                </div>
            </div>
            <div>
                <div><BsGraphUp style={{color:'red'}}/></div>
                <div>
                    <p>COMODITIES VALUE</p>
                    <h3>KES {moneyFormat(total)}</h3>
                </div>
            </div>
        </div>

      </div>
    <div className='analytics'>
    <div className='tittle-an'>
        <h4 style={{color:'red',padding:'20px'}}>YOUR PORTIFOLIO OVERVIEW</h4>
    </div>
    <table className='trading-table'>
        <thead >
            <tr key=""> 
                <th></th>
                <th>Product</th>
                <th>Qty/90Kg Bag</th>
                <th>Current cost/90Kg Bag</th>
                <th>Current Selling/90Kg Bag</th>
                <th>Total value (KES)</th>
               
            </tr>
        </thead>
        <tbody>
            {
                products?.map((product, i)=>(
                    <tr key={i}>
                    <td>
                        <span className='buy-span' onClick={()=>buy(product.product)}>BUY</span>
                        <span className='sell-span' onClick={()=>sell(product.product)}>SELL</span>
                    </td>
                    <td>{product.product}</td>
                    <td>{product.qty}</td>
                    <td>KES {moneyFormat(product.cost)}</td>
                    <td>KES {moneyFormat(product.sellingprice)}</td>
                    <td>KES {moneyFormat(product.sellingprice * product.qty)}</td>
                </tr>
                ))
            }
          
           
        </tbody>
        <tfoot>
            <tr key="">
                <th> TOTAL COMMODITIES VALUE</th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th className='warning'>KES {moneyFormat(total)}</th>
            </tr>
        </tfoot>
    </table>
    <div className='portifolio-cards'>
        {
            products?.map((product, i)=>(
                <div className='product'>
                <h4 className='success'>{product.product}</h4>
                <span className='properties'>
                    <span>Qty/90kg Bag</span>
                    <span>{product.qty}</span>
                </span>
                <span className='properties'>
                    <span>Current cost/90kg Bag</span>
                    <span>KES {moneyFormat(product.cost)}</span>
                </span>
                <span className='properties'>
                    <span>Current selling/90kg Bag</span>
                    <span>KES {moneyFormat(product.sellingprice)}</span>
                </span>
                <span className='properties'>
                    <span>Total value (KES)</span>
                    <span>KES {moneyFormat(product.sellingprice * product.qty)}</span>
                </span>
                <div className='property-v'>
                         <span className='buy-span' onClick={()=>buy(product.product)}>BUY</span>
                        <span className='sell-span' onClick={()=>sell(product.product)}>SELL</span>
                </div>
             </div>
            ))
        }

    </div>
</div>
</div>
  )
}

export default Portifolio