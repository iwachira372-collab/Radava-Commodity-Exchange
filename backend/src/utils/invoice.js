const moment = require('moment')
const { moneyFormat } = require('./moneyFormat')
module.exports.invoice = (name,product,qty,total,date,price,tx="", status="")=>{
       
       let formt = moment(date).format("MM/DD/YYYY h:mm:s a")
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>RADAVA | INVOICE</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    width: 100vw;
    background-color: whitesmoke;
    display: flex;
    justify-content: space-around;">
        <div class="container" style=" width: 80%;
        height: fit-content;
        background-color: white;
        padding: 3rem;">
            <div class="header" style=" width: 100%;
            height: 150px;
            display: flex;
            justify-content: space-between;
            /* align-items: center; */
            line-height: 150px;
            color:  rgb(58, 8, 139);">
                <div class="logo" style=" height: 50px;
                display: flex;">
                    <img src="http://rx.radava.co/static/media/Logo%20.c4d60e935005b9b77fad.png" alt="Radava Logo">
                </div>
                <H4>${status !=''?"RECEIPT":"INVOICE"}</H4>
            </div>
            <div class="billing-details" style=" display: flex;
            justify-content: space-between;
            color:  rgb(58, 8, 139);">
                <h5>BILLING TO: ${name}</h5>
                <h5>DATE: ${formt}</h5>
            </div>
            
            <h5 style=" color:  rgb(58, 8, 139);">VIEW ON BLOCKCHAIN:<a href="https://mumbai.polygonscan.com/tx/${tx}" style="text-decoration: none;" target="_blank"> ${tx.slice(0, 6)+"..."+tx.slice(tx.length-7, tx.length-1)}</a> </h5>
            <div class="invoice-table" style=" color: white;
            border-collapse: collapse;
            border: 1px solid;
            margin: 1rem 0rem;">
                <table style=" width: 100%;
                border: 2px solid   rgb(38, 9, 86);
                border-collapse: collapse;">
                    <thead style=" background-color:  rgb(38, 9, 86);
                    color: white;
                    border-collapse: collapse;">
                        <tr>
                            <th class="">S/N</th>
                            <th>DESCRIPTION</th>
                            <th>QTY</th>
                            <th>PRICE</th>
                        </tr>
                    </thead>
                    <tbody style=" text-align: center;
                    color:  rgb(38, 9, 86);">
                        <tr>
                            <td style="border-collapse: collapse;
                            border: 2px solid   rgb(38, 9, 86);">1.</td>
                            <td style="border-collapse: collapse;
                            border: 2px solid   rgb(38, 9, 86);"> ${product}</td>
                            <td style="border-collapse: collapse;
                            border: 2px solid   rgb(38, 9, 86);">${qty}</td>
                            <td style="border-collapse: collapse;
                            border: 2px solid   rgb(38, 9, 86);">${moneyFormat(price)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="billing-details" style="display: flex;flex-direction: row; justify-content: space-between;">
                <h5>PAYMENT INFO: Paid through Radava Wallet Balance</h5>
                <h5>SUBTOTAL:  ${moneyFormat(total)}</h5>
            </div>
            <div class="billing-details" style="display: flex;flex-direction: row; justify-content: space-between;">
                <h5>STATUS:  ${status==0?`<span style='color:red'> CLOSED<span>`:`<span style='color:green'> ACTIVE<span>`}</h5>
            </div>
            <div class="extra-info" style="display: flex;
            justify-content: flex-end;">
                <div class="tax-total" style="text-align:start ;">
                    <h5 style=" padding: 5px;">TAX: 0.00</h5>
                    <h5 style=" background-color:  rgb(38, 9, 86);
                    color: white;
                    padding: 5px 30px;  padding: 5px;">TOTAL: ${moneyFormat(total)}</h5>
                </div>
            </div>
        </div>
    </body>
    </html>
    `
}