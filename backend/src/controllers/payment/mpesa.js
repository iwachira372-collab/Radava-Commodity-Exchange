const { save, fetch } = require("../../db/db")
const { handleError } = require("../../utils/error")
const { STK } = require("../../utils/mpesa")
const {io} = require('socket.io-client')
const fs = require("fs")


module.exports.initiateSTK = async (req,res)=>{
   try {
    if(!req.body.phone || !req.body.amount) return handleError(new Error('Phone number and amount are required'),res)
    const resp = await STK(req.body.phone, req.body.amount)
    // `userid`, `phone`, `amount
    save('INSERT INTO `initiatedtransactions` SET ?',[{userid:req?.user?.id,phone:req.body.phone,amount:req.body.amount,CheckoutRequestID:resp.CheckoutRequestID}])
    res.send({CustomerMessage:resp.CustomerMessage})
   } catch (error) {
     handleError(error,res)
   }
}

module.exports.STKcallback = async(req,res) =>{
    try {
        
        const Body = req.body.Body
        if(Body.stkCallback.ResultCode != 0){
            
            // CheckoutRequestID
            const user = await fetch('SELECT userid FROM initiatedtransactions WHERE CheckoutRequestID = ?',[Body.stkCallback.CheckoutRequestID])
            try {
              const socket = io('https://io.kuomoka.com')
              socket.emit('message',{msg:"failed",userid:user[0].userid,ResultDesc:Body.stkCallback.ResultDesc})
            } catch (error) {
                fs.writeFileSync('res.json',JSON.stringify({...Body,failed:'true'}))
            }
          
            return res.send('success')
        }else{

        const Item = Body.stkCallback.CallbackMetadata.Item

        const phoneNumber = Item.find(itm=>itm.Name=='PhoneNumber').Value
        const amount = Item.find(itm=>itm.Name=='Amount').Value
        const receipt = Item.find(itm=>itm.Name=='MpesaReceiptNumber').Value
        const reqid = Body.stkCallback.CheckoutRequestID



        const user = await fetch('SELECT userid FROM initiatedtransactions WHERE CheckoutRequestID = ?',[reqid])
        const userid = user[0].userid
        save('UPDATE initiatedtransactions SET ? WHERE userid = ? AND CheckoutRequestID = ?',[{receipt,amount,status:1},userid,reqid])

        let ch = await fetch('SELECT * FROM `accounts` WHERE userid = ?',[userid])
        let sql = 'INSERT INTO `accounts` SET ?'
        let trans = [{userid,balance:amount}]
        if(ch.length > 0){
            sql = 'UPDATE `accounts` SET ? WHERE userid = ?'
            trans = [{balance:parseFloat(amount)+parseFloat(ch[0].balance)},userid]
        }
        await save(sql,trans)
        const socket = io('https://io.kuomoka.com')
        socket.emit('message',{msg:"success",phoneNumber,amount,userid,receipt})

        res.send('success')
        }
    } catch (error) {
        fs.writeFileSync('res.json',JSON.stringify({error:error.message}))
        res.send('success')
    }
}

module.exports.getTransactions = async (req, res)=>{
    try {
        const trs = await fetch('SELECT initiatedtransactions.phone,initiatedtransactions.amount,initiatedtransactions.receipt,initiatedtransactions.startedAt,initiatedtransactions.status, users.firstName, users.lastName FROM initiatedtransactions JOIN users ON users.id = initiatedtransactions.userid WHERE initiatedtransactions.status= 1')
        res.send(trs)
    } catch (error) {
       handleError(error, res) 
    }
}
module.exports.getBalances = async (req, res)=>{
    try {
        const trs = await fetch('SELECT users.firstName, users.lastName, users.phone,users.email, accounts.balance, accounts.last_update FROM accounts JOIN users ON users.id = accounts.userid')
        res.send(trs)
    } catch (error) {
       handleError(error, res) 
    }
}