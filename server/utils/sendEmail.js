const nodemailer = require('nodemailer');

const requestPasswordTemplate = (name,link) => (
    `<h3>Hi ${name.toUpperCase()}</h3>
    <p>You have requested to reset your password.</p>
    <p>Kindly click on the link below to reset your password.</p>
    <p>If you did not perform this action, please ignore this meassage.</p>
    <a href="${link}">Reset Password</a>`
)

const welcomeTemplate = (name) => (
    `<h3>Welcome ${name.toUpperCase()}</h3>
    <p>We are glad to have you at Hackermann.</p>
    <p>Enjoy your stay here.</p>`
)

const resetPasswordTemplate = (name) => (
    `<h3>Hi ${name.toUpperCase()}</h3>
    <p>Your password has been successfully reset.</p>
    <p>Thank you for your patience.</p>`
)

const sendEmail = (recipient,subject,html) => {

    try {

        const transporter = nodemailer.createTransport({
            host : 'smtp.gmail.com',
            port : 587,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        }) 
      
    const mailOptions = {
        from: '"Hackermann" <69ryanreynolds69@gmail.com>',
        to: recipient.email,
        subject: subject,
        html: html
    };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error)
            return error
        } else {
            console.log(info.response)
            return null
        }
    });
    }catch(err){
        return err
    }
}

const sendWelcomeEmail = (recipient) => {
    if (sendEmail(recipient,'Successful Registration at Hackermann',welcomeTemplate(recipient.user)))
        return true
    return false
}

const sendRequestPasswordEmail = (recipient,link) => {
    if(sendEmail(recipient,'Request for password change at Hackermann',requestPasswordTemplate(recipient.user,link)))
        return true
    return false
}

const sendResetPasswordEmail = (recipient) => {
    if(sendEmail(recipient,'Successful password reset at Hackermann',resetPasswordTemplate(recipient.user)))
        return true
    return false
}

module.exports = {sendWelcomeEmail,sendRequestPasswordEmail,sendResetPasswordEmail}
