const nodemailer = require('nodemailer');
module.exports.sendEmail = async (code,to)=> {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'mail.kuomoka.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'radava@kuomoka.com', // generated ethereal user
        pass: 'Nashdev@098' // generated ethereal password
      }
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Radava" <radava@kuomoka.com>', // sender address
      to: to, // list of receivers
      subject: 'OTP', // Subject line
      text: '', // plain text body
      html: '<p>Hello!, use this code to reset your password. Note that the code is valid for only few minutes</p> <strong>OTP: '+code+'</strong>' // html body
    });
  return info
  }
  module.exports.sendCustomEmail = async (html,subject,to)=>{
     // create reusable transporter object using the default SMTP transport
     let transporter = nodemailer.createTransport({
      host: 'mail.kuomoka.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'radava@kuomoka.com', // generated ethereal user
        pass: 'Nashdev@098' // generated ethereal password
      }
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Radava" <radava@kuomoka.com>', // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: '', // plain text body
      html: html // html body
    });
  return info
  }