import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_GOOGLE_USER,
    pass: process.env.SMTP_GOOGLE_PASS
  }
});


const sendEmail = async (mailOptionsUser: {to:any, cc:any, subject:any, text:any, html:any}) => {
  const mailOptions = {
    from: 'cto@ulpik.com',
    cc: mailOptionsUser.cc,
    to: mailOptionsUser.to,
    subject: mailOptionsUser.subject,
    text: mailOptionsUser.text,
    html: mailOptionsUser.html
  };

  transporter.sendMail(mailOptions, (error:any, info:any) => {
    if (error) {
      return console.log(error);
    }
    console.log('Correo enviado: ' + info.response);
  });

  return;
};

export { sendEmail };
