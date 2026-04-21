// `firstName`, `lastName`, `phone`, `email`, `password
module.exports.users = {
    firstName:{required:true,msg:'First Name is required'},
    lastName:{required:true,msg:'Last Name is required'},
    phone:{required:true,msg:'Phone number is required'},
    email:{required:true,msg:'Email is required'},
    password:{required:true,msg:'Password is required'}  
}
// `userid`, `address`, `occupation`, `nextofkin`, `k_phone`, `k_relationship`, `k_address`, `kra_pin`, `identification_card`
module.exports.userbio = {
    address:{required:true,msg:"Address is required"},
    occupation:{required:true,msg:"Occupation is required"},
    nextofkin:{required:true,msg:"Next of kin is required"},
    k_phone:{required:true,msg:"Phone number is required"},
    k_relationship:{required:true,msg:" is required"},
    k_address:{required:true,msg:"Kin address is required"},
    kra_pin:{required:true,msg:"KRA pin is required"},
    identification_card:{required:true,msg:"ID is required"},
}
// `userid`, `bank`, `account_number`, `account_name`
module.exports.bankdetails = {
    bank:{required:true,msg:"Bank is required"},
    account_number:{required:true,msg:"Account number is required"},
    account_name:{required:true,msg:"Account name is required"},
}
// `userid`, `quantity`, `price`, `expiry`
module.exports.order = {
    userid:{required:true,msg:"User is required"},
    quantity:{required:true,msg:"Quantity is required"},
    price:{required:true,msg:"Price is required"},
    expiry:{required:true,msg:"Expiry date is required"},
}
