import logo  from  '../images/WhiteLogo.png'
import background from '../images/Maize@2x.png'
import { Link, useParams } from "react-router-dom"
import Header from './Header'
import { useState, useEffect } from 'react'
import { getAdmin, getData, postData } from '../api/api'
import { moneyFormat } from '../util/moneyFormat'
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import Modal from './Modal'
import Loader from './Loader'

const Sell = () => {

  const {comodity} = useParams()
  const [product, setProduct] = useState({})
  const [total, setTotal] = useState(0)
  const [qty, setQty] = useState(0)
  const [price, setPrice] = useState(0)
  const [receipts, setReceipts] = useState([])
  const [receipt, setReceipt] = useState()
  const [error, setError] = useState()

  useEffect(()=>{
    getAdmin('portfolio/'+comodity)
    .then(res=>{
      setProduct(res.data)
      setPrice(res.data?.sellingprice)
      setValue('price', res.data?.sellingprice)
    })
  },[])
  
  useEffect(()=>{
    if(!product?.id) return
    getData('receipts/'+product.id)
    .then(res=>{
      setReceipts(res.data)
      console.log(receipts)
    })
  },[product])

  const { register, handleSubmit,setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const onSubmit = data=>{
    if(!isNaN(receipt)){
      if(data.qty > receipts[receipt].qty) return toast.error("Only "+receipts[receipt].qty+" available in your receipt")
      data.rid = receipts[receipt].id
    }else{
      data.rid = 0
    }
    setLoading(true)
    postData('order/create/sell',{
      quantity:data.qty,
      productid:product.id,
      expiry:data.expiry,
      price:data.price,
      receipt_id:data.rid
    })
    .then(res=>{
      setLoading(false)
      setSuccess(true)
    })
    .catch((error)=>{
      toast(error?.response?.data?.error ||'Unkown error, try again')
      setLoading(false)
    })
  }
  useEffect(()=>{
    const calTotal = ()=>{
      if(isNaN(price) || isNaN(qty)) return
      console.log(receipt)
      if(!isNaN(receipt)){
        if(qty > receipts[receipt].qty) return toast.error("Only "+receipts[receipt].qty+" Available in your receipt")
      }
      setTotal(Math.floor((price*qty)-(price*qty)*0.05))
    }
    calTotal()
  },[price,qty])

  return (
    <>
    { loading &&

    <Loader/>

    }
    <Header logo={'white'}/>
    {success && 
     
     <Modal
       title={'Order Placed successfully'}
       text={'You successfully requested to sell '+qty+' bags of '+product.product+' @ KES '+moneyFormat(price)+', total: '+moneyFormat(qty*product.sellingprice)}
       header={true}
     />
    
    }
    <div className='trading' style={{backgroundImage: `url(${background})`,paddingTop:'120px'}}>
        {/* <img className='trading-image' src={background} alt="" /> */}

        <div className='trading-item'>
              <div className='trading-item-title'>
                    <span className="title">Sell {comodity}</span>
                    <span className='instock'>{product?.qty>0?'IN STOCK':'OUT OF STOCK'}</span>
              </div>
              <div className='trading-details-wrapper'> 
                    <div className='trading-details'>
                            <span className='trading-details-title success'>Current price: <strong className='amount'>KES {moneyFormat(product?.sellingprice)}</strong> <small className='small'> PER 90KG BAG</small>
                                
                            </span>
                            {error &&
                            <p style={{color:'red'}}>You don't have enough money to hold this trade <Link to='/funds'>Fund Wallet</Link></p>
                            }
                            <form className='trading-form' onSubmit={handleSubmit(onSubmit)}>
                                <div className='names'>

                                    <label>
                                            Order quantity (bags) {} 
                                            <input
                                              className = {`${errors.qty?'error':''}`}
                                              {...register("qty", { required: true,onChange:e=>setQty(e.target.value)})}
                                              type="number"  placeholder=''/>
                                          
                                    </label>
                                    <label>
                                            This order is good till
                                            <select
                                            defaultValue={'7 days'}
                                            className = {`${errors.expiry?'error':''}`}
                                            {...register("expiry", { required: true})}
                                            >
                                                <option value="7 days">7 days</option>
                                                <option value="6 days">6 days</option>
                                                <option value="5 days">5 days</option>
                                                <option value="4 days">4 days</option>
                                                <option value="3 days">3 days</option>
                                                <option value="2 days">2 days</option>
                                                <option value="1 days">1 days</option>
                                            </select>
                                          
                                    </label>
                                 
                                </div>
                                <div className='names'>
                                  
                                <label>
                                            Set your Sell price (KES)
                                            <input
                                              readOnly
                                              className = {`${errors.price?'error':''}`}
                                              {...register("price", { required: true,onChange:e=>setPrice(e.target.value)})}
                                              type="number"  placeholder=''/>
                                          
                                </label>  
                                <label>
                                            Receipt
                                            <select
                                            defaultValue={'0'}
                                            className = {`${errors.type?'error':''}`}
                                            {...register("type", { required: true,onChange:(v)=>setReceipt(v.target.value)})}
                                            >
                                                <option value="">Select Receipt</option>
                                                <option value="new">New Receipt</option>
                                                {receipts.map((d,i)=>(
                                                  <option key={i} value={i}>{d.qty+" bags of "+d.product_name+" @KES"+moneyFormat(d.price)}</option>
                                                ))}
                                            </select>
                                          
                                    </label> 
                                </div>
                                <span className='trading-details-foot '>Total Amount Due: <strong className='amount'>KES {moneyFormat(total)}</strong>
                                
                                </span> 
                                <small className='small'> (A processibg of 5% applies to all transactions)</small> 
                                <div className='place'>
                                     <button className='btn btn-success btn-place'>PLACE ORDER</button>                        
                                </div>  
                            </form>
                    </div>
              </div>
        </div>
    </div>
    </>
  )
}

export default Sell