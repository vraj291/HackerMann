const {google} = require('googleapis')

function createConnection() {
    const googleConfig = {
        clientId: process.env.GOOGLE_CLIENT_ID, 
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirect: process.env.GOOGLE_REDIRECT_URL, 
    };
    return new google.auth.OAuth2(
      googleConfig.clientId,
      googleConfig.clientSecret,
      googleConfig.redirect
    );
  }
  
function getConnectionUrl(auth) {
    const defaultScope = [
        'https://www.googleapis.com/auth/plus.me',
        'https://www.googleapis.com/auth/userinfo.email',
    ];
    return auth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: defaultScope
    });
}

function urlGoogle() {
    const auth = createConnection();
    const url = getConnectionUrl(auth);
    return url;
}

const getGoogleEmailFromCode = async(code) => {
    const auth = createConnection();
    const data = await auth.getToken(code);
    auth.setCredentials(data.tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth })
    const userinfo = await oauth2.userinfo.get()
    return userinfo.data.email
}

module.exports = {urlGoogle,getGoogleEmailFromCode}