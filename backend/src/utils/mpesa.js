const axios = require('axios')
const moment  = require('moment')

const auth_url = 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
const stk_url = 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
const getToken = async ()=>{
   return await new Promise((resolve, reject)=>{
    const str = 'i6QIGXeLjLkogCVn8SxvNdXwN8wK0Nq3:xFbWhAxPjpUAEuAx'
     const token = Buffer.from(str).toString('base64');
      const auth_headers = {
                headers:{
                    Authorization: 'Basic '+token
                }
        }
      axios.get(auth_url,auth_headers)
      .then(res=>{
        return resolve(res.data.access_token)
      })
      .catch(err=>reject(err))

   }) 
}

module.exports.STK = async (phone,amount)=>{
    return await new Promise( async (resolve, reject)=>{
            const token = await getToken()
            const header = {
                headers:{
                    Authorization: 'Bearer ' + token
                }
            }
            const body = getbody(phone,amount)

            axios.post(stk_url,body,header)
            .then(res=>{
               resolve(res.data)
            })
            .catch(err=>{
                reject(err)
            })
            })

}


const getbody = (phone,amount)=>{
    const time_stamp = moment().format('YYYYMMDDHHmmss')
    // Business Short Code + PassKey + Timestamp)
    const passkey = 'f33c6a5c842d5dbd605822a93a14f5c78d97372038989bcbfaeb99787afbe291'
    const password = Buffer.from(6039765+passkey+time_stamp).toString('base64');
    const body =
        {
            "BusinessShortCode": 6039765,
            "Password": password,
            "Timestamp": time_stamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phone,
            "PartyB": 6039765,
            "PhoneNumber": phone,
            "CallBackURL": "https://radava.kuomoka.com/callback",
            "AccountReference": "Radava: "+6039765,
            "TransactionDesc": "Top up wallet with KES "+amount 
          }
    return body
}

