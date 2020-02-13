const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  }
});

const createEmailTemplate = ({
  title,
  body
}) => `
<html>
  <body>
    <div class="email" style="padding: 10px; border: 2px double #000;">
      <h1>${title}</h1>
      <p>${body}</p>

      <p>Greetings from InkLink 😊</p>
    </div>
  </body>
</html>
`;

module.exports = {
  transport,
  createEmailTemplate
};