
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getData } from "../api/api"
const Receipt = ()=>{
    const {id} = useParams()
    const [receipt, setReceipt] = useState('')

    useEffect(()=>{
      getData('receipt/'+id)
      .then(res=>{
        setReceipt(res.data)
      })
      .catch(error=>{

      })
    },[])
    return (
              <iframe style={{width:'100vw',height:'100vh'}} srcDoc={receipt} frameborder="0">

              </iframe>
           
    )
}

export default Receipt