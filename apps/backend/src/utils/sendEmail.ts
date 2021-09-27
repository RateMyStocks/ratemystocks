const sgMail = require('@sendgrid/mail');

// async..await is not allowed in global scope, must use a wrapper
export const sendEmail = async (email: string, username: string, link: string) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const htmlTemplate = `
    <head>
      <style type="text/css">
        .im {
          color: #000000 !important;
        }

        a.button {
          -webkit-appearance: button;
          -moz-appearance: button;
          appearance: button;

          text-decoration: none;

          background-color: #4CAF50;
          border: none;
          color: white;
          padding: 15px 32px;
          text-align: center;
          font-size: 16px;
        }
      </style>
    </head>
    <div style="text-align: center; background-color: black !important;">
      <div style="color: black !important; background-color: white !important;">
        <img style="width: 400px; height: auto;" alt="ratemystocks.com" src="https://res.cloudinary.com/dhalcenyw/image/upload/v1632718852/ratemystocks.com/rms_primary_logomark_otpbj5.png">
        <h1>Welcome ${username}!</h1>
        <p>You're almost all set! Just click the button below to validate your email address.</p>
        <div style="margin-top: 50px; margin-bottom: 50px;">
          <a href="${link}" class="button">
          Confirm Email
        </a>
        </div>
        <div>
          <small>If you encounter any problems, please contact us at <a href="mailto:support@ratemystocks.com">support@ratemystocks.com</a></small>
        </div>
      </div>
    </div>
  `;
  const msg = {
    to: email,
    from: {
      email: process.env.SENDGRID_SENDER_EMAIL,
      name: 'ratemystocks.com',
    },
    subject: 'Welcome to ratemystocks.com!',
    html: htmlTemplate,
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};
