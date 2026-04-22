// 'userid', 'productid', 'quantity', 'price', 'expiry', 'type', 'status'
const { save, fetch } = require('../../db/db.js');
const { addReceipt } = require('../../utils/contract/contract.js');
const { handleError }  = require("../../utils/error.js");
const { invoice } = require('../../utils/invoice.js');
const { sendCustomEmail } = require('../../utils/sendEmail.js');

module.exports.createBuyOrder = async (req,res) =>{
    try {
       if(!req.body?.productid || !req.body?.quantity || !req.body?.price || !req.body?.expiry) return handleError(new Error('Invalid request, all fields are required'), res)

       const products = await fetch('SELECT * FROM "portfolio" WHERE id = $1', [req.body?.productid])
       if(products.length !=1) return handleError(new Error('Product not found'), res)
       const product = products[0]
       if(req.body.quantity > product.qty) return handleError(new Error('Only '+product.qty+" bags of "+product.product+" available"), res)
       const balance = await fetch('SELECT * FROM "accounts" WHERE "userid" = $1', [req.user.id])
       if(balance.length !=1) return handleError(new Error('Please fund your wallet to continue with this trade'), res)

       const bal = balance[0].balance
       const amount = parseFloat(req.body.quantity) * parseFloat(req.body.price)
       
       const fee = amount * 0.05
       const total = amount + fee

       const charge = bal - total

       if(isNaN(charge) ) return handleError(new Error("Mathematical syntax error, please try again"), res)

       if(charge < 0) return handleError(new Error('Your balance is KES '+charge+ " less, please fund your wallet and continue"), res)

       await save('UPDATE "accounts" SET "balance" = $1 WHERE "userid" = $2',[charge,req.user.id])
       await save('INSERT INTO "order" SET ?',[{
        userid:req.user.id,
        productid:req.body.productid,
        quantity:req.body.quantity,
        price:req.body.price,
        expiry:req.body.expiry,
        type: 0,
       }])
       const qty = parseInt(product.qty) - parseInt(req.body.quantity)
       await save('UPDATE "portfolio" SET "qty" = $1 WHERE "id" = $2',[qty, req.body.productid])
       //    'userid', 'productid', 'quantity', 'price', 'expiry', 'type', 'status'
       res.send({status:'ok'})
    } catch (error) {
       handleError(error, res)
    }
 }

module.exports.createSellOrder = async (req,res) =>{
    try {
       if(!req.body?.productid || !req.body?.quantity || !req.body?.price || !req.body?.expiry) return handleError(new Error('Invalid request, all fields are required'), res)

       const products = await fetch('SELECT * FROM "portfolio" WHERE id = $1', [req.body?.productid])
       if(products.length !=1) return handleError(new Error('Product not found'), res)

       if(req.body?.receipt_id != 0 && !isNaN(req.body?.receipt_id)){
         const receipts = await fetch('SELECT * FROM "receipts" WHERE id = $1', [req.body?.receipt_id])
         if(receipts.length != 1) return handleError(new Error('Receipt not found'), res)
         const receipt = receipts[0]
         if(receipt.status != 1) return handleError(new Error('Receipt not found'), res)
         const orders = await fetch('SELECT * FROM "order" WHERE id = $1', [receipt.orderid])
         if(orders.length != 1) return handleError(new Error('Receipt not found'), res)
         if(orders[0].userid != req.user.id) return handleError(new Error('Receipt not found'), res)
         if(parseFloat(req.body.quantity) > parseFloat(receipt.qty)) return handleError(new Error("You don't have enough assets to sell "+req.body.quantity), res)
         if(orders[0].productid != req.body?.productid ) return handleError(new Error("Product don't match"), res)

         

         const balance = await fetch('SELECT * FROM "accounts" WHERE "userid" = $1', [req.user.id])
         const bal = balance[0].balance
         const amount = parseFloat(req.body.quantity) * parseFloat(products[0].sellingprice)
         
         const fee = amount * 0.05
         const total = amount - fee
  
         const charge = bal + total
  
         if(isNaN(charge) ) return handleError(new Error("Mathematical syntax error, please try again"), res)
  
  
         await save('UPDATE "accounts" SET "balance" = $1 WHERE "userid" = $2',[charge,req.user.id])
         await save('UPDATE "receipts" SET ? WHERE "id" = ?',[{status: 0}, req.body?.receipt_id])
         // await save('UPDATE `order` SET ? WHERE `id` = ?',[{status:1}, orders[0].id])

         const qty = parseFloat(receipt.qty) - parseFloat(req.body.quantity)
         if(qty>0){
           sendToBlockChain(req.user.id,orders[0].id,products[0].product,qty,receipt.price)
         }

       }else{
         await save('INSERT INTO "order" SET ?',[{
            userid:req.user.id,
            productid:req.body.productid,
            quantity:req.body.quantity,
            price:req.body.price,
            expiry:req.body.expiry,
            type: 1,
            receipt_id: req.body?.receipt_id
           }])
            
       }
       res.send({status:'ok'})
    } catch (error) {
       handleError(error, res)
    }
 }

module.exports.acceptSellOrder = async (req,res) =>{
    try {
       const orders = await fetch('SELECT * FROM "order" WHERE id = $1', [req.params.id])
       if(orders.length !=1) return handleError(new Error('Order not found'), res)
       if(orders[0].status === 4 ) return handleError(new Error('Request already executed'), res)
       const order = orders[0]
     

       await save('UPDATE "order" SET ? WHERE id = ?',[{status:4}, order.id])
      //  const qty = parseInt(order.quantity) + parseInt(portfolio[0].qty)
      //  await save('UPDATE portfolio SET qty = ? WHERE id = ?',[qty, order.productid])
      //  'userid', 'productid', 'quantity', 'price', 'expiry', 'type', 'status'
      const portfolio = await fetch('SELECT * FROM "portfolio" WHERE id = $1', [order.productid])
      const user = await fetch('SELECT * FROM "users" WHERE id = $1',[order.userid])
      const name = user[0].firstName+' '+user[0].lastName
      const total = parseFloat(order.quantity)*parseFloat(order.price)
      const html = invoice(name,portfolio[0].product,order.quantity,total,order.createdAt,order.price)
      sendCustomEmail(html,"INVOICE FROM RADAVA",user[0].email)
       res.send({status:'ok'})
    } catch (error) {
       handleError(error, res)
    }
 }
module.exports.acceptSellOrderListing = async (req,res) =>{
    try {
       const orders = await fetch('SELECT * FROM "order" WHERE id = $1', [req.params.id])
       if(orders?.length !=1) return handleError(new Error('Order not found'), res)
       if(orders[0].status === 3 ) return handleError(new Error('Request already executed'), res)
       const order = orders[0]
       const portfolio = await fetch('SELECT product, qty FROM "portfolio" WHERE id = $1', [order.productid])
     

       await save('UPDATE "order" SET ? WHERE id = ?',[{status:3}, order.id])
       const qty = parseInt(order.quantity) + parseInt(portfolio[0].qty)
       await save('UPDATE "portfolio" SET "qty" = $1 WHERE "id" = $2',[qty, order.productid])
       // 'userid', 'productid', 'quantity', 'price', 'expiry', 'type', 'status'
       const user = await fetch('SELECT * FROM "users" WHERE id = $1',[order.userid])
       sendToBlockChain(order.userid,order.id,portfolio[0].product,order.quantity,order.price)
       sendCustomEmail('<p>You have successfully completed sell order with Radava. You can access your receipt in the customer portal. Thank you for doing business with us.</p>',"ORDER COMPLETED",user[0].email)
       res.send({status:'ok'})
    } catch (error) {
      console.log(error)
       handleError(error, res)
    }
 }

module.exports.rejectSellOrder = async (req,res) =>{
    try {
       const orders = await fetch('SELECT * FROM "order" WHERE id = $1', [req.params.id])
       if(orders.length !=1) return handleError(new Error('Order not found'), res)
       if(orders[0].status === 2 ) return handleError(new Error('Request already executed'), res)
       const order = orders[0]
       const portfolio = await fetch('SELECT qty FROM "portfolio" WHERE id = $1', [order.productid])
     

       await save('UPDATE "order" SET ? WHERE id = ?',[{status:2}, order.id])
       if(order.status === 1){
        const qty =  parseInt(portfolio[0].qty) - parseInt(order.quantity)
        await save('UPDATE "portfolio" SET "qty" = $1 WHERE "id" = $2',[qty, order.productid])
       }
      
       // 'userid', 'productid', 'quantity', 'price', 'expiry', 'type', 'status'
       res.send({status:'ok'})
    } catch (error) {
       handleError(error, res)
    }
 }
module.exports.acceptBuyOrder = async (req,res) =>{
    try {
       const orders = await fetch('SELECT * FROM "order" WHERE id = $1', [req.params.id])
       if(orders.length !=1) return handleError(new Error('Order not found'), res)
       if(orders[0].status === 1 ) return handleError(new Error('Request already executed'), res)

       const order = orders[0]
       await save('UPDATE "order" SET ? WHERE id = ?',[{status:1}, order.id])
       
         //    send invoice
         const portfolio = await fetch('SELECT * FROM "portfolio" WHERE id = $1', [order.productid])
         const user = await fetch('SELECT * FROM "users" WHERE id = $1',[order.userid])
         const name = user[0].firstName+' '+user[0].lastName
         const total = parseFloat(order.quantity)*parseFloat(order.price)
         const html = invoice(name,portfolio[0].product,order.quantity,total,order.createdAt,order.price)
         sendToBlockChain(order.userid,order.id,portfolio[0].product,order.quantity,order.price)
         sendCustomEmail(html,"INVOICE FROM RADAVA",user[0].email)
       // 'userid', 'productid', 'quantity', 'price', 'expiry', 'type', 'status'
       res.send({status:'ok'})
    } catch (error) {
      console.log(error)
       handleError(error, res)
    }
 }

 const sendToBlockChain = async (uid,oid,name,qty,price)=>{
   try {
      let sql = 'INSERT INTO "receipts" SET ?'
      // `orderid`, `product_name`, `qty`, `price`, `tx`, `status`
      const tx = await addReceipt(uid,oid,name,qty,price)
      const data = {
         orderid:oid,
         product_name:name,
         qty:qty,
         price:price,
         tx:tx,
      }
      save(sql,[data])
   } catch (error) {
      console.log(error)
   }

 }

module.exports.rejectBuyOrder = async (req,res) =>{
    try {
       const orders = await fetch('SELECT * FROM "order" WHERE id = $1', [req.params.id])
       if(orders.length !=1) return handleError(new Error('Order not found'), res)
       if(orders[0].status === 2 ) return handleError(new Error('Request already executed'), res)
       const order = orders[0]

       const balance = await fetch('SELECT * FROM "accounts" WHERE "userid" = $1', [order.userid])
       const bal = balance[0].balance
       const amount = parseFloat(order.quantity) * parseFloat(order.price)
       
       const fee = amount * 0.05
       const total = amount + fee

       const charge = bal + total

       if(isNaN(charge) ) return handleError(new Error("Mathematical syntax error, please try again"), res)


       await save('UPDATE "accounts" SET "balance" = $1 WHERE "userid" = $2',[charge,order.userid])

       await save('UPDATE "order" SET ? WHERE id = ?',[{status:2}, order.id])
       const products = await fetch('SELECT * FROM "portfolio" WHERE id = $1', [order.productid])
       if(products.length>0){
        const qty = parseInt(products[0].qty) + parseInt(order.quantity)
        await save('UPDATE "portfolio" SET "qty" = $1 WHERE "id" = $2',[qty, order.productid])
       }

      //    send email notification
      const user = await fetch('SELECT * FROM "users" WHERE id = $1',[order.userid])
      sendCustomEmail('<p>Your request to bUy '+ order.quantity+' bags of '+products[0].product+' was rejected</p>',"BUY ORDER REJECTED",user[0].email)
      
       // 'userid', 'productid', 'quantity', 'price', 'expiry', 'type', 'status'
       res.send({status:'ok'})
    } catch (error) {
       handleError(error, res)
    }
 }

module.exports.getOrders = async (req,res) =>{
    try {
       sql = 'SELECT "order"."userid","order"."productid","receipts"."qty" AS "quantity","receipts"."price","order"."expiry","order"."type","order"."status","order"."createdAt","receipts"."product_name","receipts"."tx" FROM "order" LEFT JOIN "receipts" ON "order"."id" = "receipts"."orderid" WHERE "order"."userid" = $1 ORDER BY "receipts"."createdAt" DESC'
       const orders = await fetch(sql, [req.user.id])
       res.send(orders)
    } catch (error) {
       handleError(error, res)
    }
 }
module.exports.getOrdersAdmin = async (req,res) =>{
    try {
       sql = 'SELECT "order"."id", "order"."userid","order"."productid","order"."quantity","order"."price","order"."expiry","order"."type","order"."status","order"."createdAt","portfolio"."product" FROM "order" LEFT JOIN "portfolio" ON "order"."productid" = "portfolio"."id" ORDER BY "order"."createdAt" DESC'
       const orders = await fetch(sql)
       res.send(orders)
    } catch (error) {
       handleError(error, res)
    }
 }
module.exports.getOrdersByStatusAdmin = async (req,res) =>{
    try {
       sql = 'SELECT "order"."id", "order"."userid","order"."productid","order"."quantity","order"."price","order"."expiry","order"."type","order"."status","order"."createdAt","portfolio"."product" FROM "order" LEFT JOIN "portfolio" ON "order"."productid" = "portfolio"."id" WHERE "order"."status" = $1 ORDER BY "order"."createdAt" DESC'
       const orders = await fetch(sql,[req.params.id])
       res.send(orders)
    } catch (error) {
       handleError(error, res)
    }
 }
module.exports.getReceipt = async (req,res) =>{
    try {
       sql = 'SELECT * FROM "receipts" WHERE "tx" = $1'
       const receipts = await fetch(sql,[req.params.id])
       const total = parseFloat(receipts[0].qty)*parseFloat(receipts[0].price)
       const html = invoice(req.user.firstName+" "+req.user.lastName,receipts[0].product_name,receipts[0].qty,total,receipts[0].createdAt,receipts[0].price,receipts[0].tx,receipts[0].status)
       res.send(html)
    } catch (error) {
       handleError(error, res)
    }
 }
module.exports.getReceipts = async (req,res) =>{
    try {
       sql = 'SELECT "receipts"."id", "receipts"."product_name","receipts"."price", "receipts"."qty" FROM "order" LEFT JOIN "receipts" ON "order"."id" = "receipts"."orderid" WHERE "receipts"."status" = 1 AND "order"."userid" = $1 AND "order"."productid" = $2'
       const receipts = await fetch(sql,[req.user.id, req.params.id])
       res.send(receipts)
    } catch (error) {
       handleError(error, res)
    }
 }
