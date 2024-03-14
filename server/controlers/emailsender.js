const nodemailer = require("nodemailer");
require("dotenv").config()
exports.transporter = nodemailer.createTransport({
    service : "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.SHIFA_EMAIL,
      pass: process.env.EMAIL_PSWD,
    },
  });
 
exports.init =function inializeEmaileOPt (reciver , subject,content){  
 const mailoptions = {
      from: {
          name : "shifa hosptal",
          address : process.env.SHIFA_EMAIL
      }, // sender address
      to: reciver, // list of receivers
      subject: subject, // Subject line
      text: "SEND", // plain text body
      html: content, // html body
  }
  console.log(mailoptions);
  return mailoptions ;
}
exports.sendmail = async (tras,option)=> {
    try{
      const info = await tras.sendMail(option);
      console.log("Message sent");
    }catch(err){
      console.log(err);
    }
  }
  
  