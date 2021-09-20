import * as nodemailer from 'nodemailer';

// async..await is not allowed in global scope, must use a wrapper
export const sendEmail = async (email: string, link: string) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 465,
    secure: true,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY,
    },
  });

  const logoImagePath = __dirname + '../../../frontend/src/assets/images/logos/rms_primary_logomark.png';

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.SENDGRID_SENDER_EMAIL,
    to: email,
    subject: 'Welcome to ratemystocks.com!',
    text: 'Hello world?',
    // attachments: [
    //   {
    //     filename: 'rms_primary_logomark.png',
    //     path: logoImagePath,
    //     cid: 'logo', //my mistake was putting "cid:logo@cid" here!
    //   },
    // ],
    // html: `<img src="cid:logo"><a href="${link}">Confirm Email</a>`,
    html: `<a href="${link}">Confirm Email</a>`,
  });

  console.log('Message sent: %s', info.messageId);
};
