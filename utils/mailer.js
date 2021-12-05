const nodemailer = require("nodemailer");

const sendMail = async (to,subject,text,html) =>{

    const from_id = "serene.brook@outlook.com"
    const from_service="hotmail"
    const password = "zxcvqwer"
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
//   let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: testAccount.user, // generated ethereal user
//       pass: testAccount.pass, // generated ethereal password
//     },
//   });


  let transporter = nodemailer.createTransport({
    service: from_service,
    auth: {
      user: from_id, 
      pass: password, 
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"Blog API" <${from_id}>`,
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html, // html body
  });

  console.log("Message sent: %s", info.messageId);

  // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports={sendMail}
