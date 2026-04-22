const { createUser,createBankdetails,createUserBio,login, resetPassword, verifyotp, savehash, savepassword,getAccount, getUsers, updateKyc, getOneUsers, adminlogin, createAdminUser, updateUsers, getFaggedUsers, createDemoAccount, fundDemoAccount } = require("../controllers/users/userController")
const { validateOrder,validatebankdetails,validateuserbio,validateusers } = require('../utils/validation')
const { middleware, adminmiddleware } = require("../middleware/auth")
const { upload, compress } = require("../utils/uploadfiles")
const { fetch } = require("../db/db")
const { initiateSTK, STKcallback, getTransactions, getBalances } = require("../controllers/payment/mpesa")
const { getPortfolio, createPortfolio, editPortfolio, deletePortfolio, getProduct } = require("../controllers/portfolio/portfolio")
const { createBuyOrder, createSellOrder, getOrders, acceptBuyOrder,acceptSellOrder, rejectSellOrder,acceptSellOrderListing, rejectBuyOrder, getOrdersAdmin, getOrdersByStatusAdmin, getReceipt, getReceipts } = require("../controllers/order/orderController")
const { withdraw, updatewithdrawal, getwithdrawal, getCounts, getwithdrawalByStatus } = require("../controllers/payment/equity")



  module.exports.createRoutes = (app)=>{
    app.get('/api/verify',middleware, async (req,res)=>{
        try {
          const bio = await fetch('SELECT userid, status FROM `userbio` WHERE `userid` = ?',[req.user.id])
          const bank = await fetch('SELECT userid FROM `bankdetails` WHERE `userid` = ?',[req.user.id])
          let step = 0
          if(bank?.length == 0) step = 3
          if(bio?.length == 0) step = 2
          let kyc = false
          if(bio?.length > 0){
            if(bio[0].status==1) kyc = true
          }

          res.send({user:{...req.user,step,kyc}})
        } catch (error) {
          res.send({})
        }
      })
      
    // users
    app.post('/api/user/create',validateusers,createUser)
    app.post('/api/user/create/userbio',middleware,upload.single('identification_card'),compress,validateuserbio,createUserBio)
    app.post('/api/user/create/bankdetails',middleware,validatebankdetails,createBankdetails)
    app.post('/api/user/login',login)
    app.post('/api/resetpassword',resetPassword)
    app.post('/api/verifyotp',verifyotp)
    app.post('/api/savehash',savehash)
    app.post('/api/savepassword',savepassword)
    app.get('/api/user/demo', middleware, createDemoAccount)
    app.post('/api/user/demo', middleware, fundDemoAccount)

     // orders
     app.post('/api/order/create/buy',middleware, createBuyOrder)
     app.post('/api/order/create/sell',middleware, createSellOrder)
     app.get('/api/order/orders',middleware, getOrders)
     app.get('/api/receipt/:id',middleware, getReceipt)
     app.get('/api/receipts/:id',middleware, getReceipts)
     
    
    // mpesa
    app.post('/api/mpesa',middleware,initiateSTK)
    app.post('/callback',STKcallback)

    // account
    app.get('/api/account',middleware,getAccount)

    // admin
    app.get('/admin/users',adminmiddleware,getUsers)
    app.get('/admin/users/:id',adminmiddleware,getOneUsers)
    app.get('/admin/users/status/:id',adminmiddleware,getFaggedUsers)
    //flaged
    app.post('/admin/user/kyc/:id',adminmiddleware,updateKyc)
    app.post('/admin/user/flag/:id',adminmiddleware,updateUsers)
    
    // admin portfoli0
    app.get('/admin/portfolio',middleware, getPortfolio)
    app.get('/admin/portfolio/:product',getProduct)
    app.post('/admin/portfolio/create',adminmiddleware, createPortfolio)
    app.post('/admin/portfolio/edit/:id',adminmiddleware, editPortfolio)
    app.get('/admin/portfolio/delete/:id',adminmiddleware, deletePortfolio)

    // admin order
    app.get('/admin/order/accept/buy/:id',acceptBuyOrder)
    app.get('/admin/order/accept/sell/:id',acceptSellOrder)
    app.get('/admin/order/accept/listing/:id',acceptSellOrderListing)
    app.get('/admin/order/reject/sell/:id',adminmiddleware,rejectSellOrder)
    app.get('/admin/order/reject/buy/:id',adminmiddleware,rejectBuyOrder)
    app.get('/admin/orders',adminmiddleware,getOrdersAdmin)
    app.get('/admin/orders/status/:id',adminmiddleware,getOrdersByStatusAdmin)
   
    // withdraw
    app.post('/api/withdraw',middleware,withdraw)
    app.post('/admin/withdraw/modify/:id',adminmiddleware,updatewithdrawal)
    app.get('/admin/withdrawals',adminmiddleware,getwithdrawal)
    app.get('/admin/withdrawals/status/:id',adminmiddleware,getwithdrawalByStatus)
    //get with
    app.get('/admin/transactions',adminmiddleware,getTransactions)
    app.get('/admin/account/balances',adminmiddleware,getBalances)
    
    // admin auth
    app.post('/admin/login', adminlogin)
    app.post('/admin/create',adminmiddleware,createAdminUser)

    // admin counts
    app.get('/admin/counts',adminmiddleware,getCounts)
  }
  
