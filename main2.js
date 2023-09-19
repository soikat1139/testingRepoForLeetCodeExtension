const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const axios = require('axios');
const qs = require('qs');
const {GoogleAuth} = require('google-auth-library');


//https://www.googleapis.com/auth/gmail.modify
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(),'googleAuth','token.json');
const CREDENTIALS_PATH = path.join(process.cwd(),'googleAuth','credentials.json');

class GmailAuthByMe{

    constructor(){
        
    
    }


/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
loadSavedCredentialsIfExist=async()=> {
    try {
      const content = await fs.readFile(TOKEN_PATH);
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  }
  
  /**
   * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
   *
   * @param {OAuth2Client} client
   * @return {Promise<void>}
   */
  saveCredentials=async(client)=> {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
  }
  
  /**
   * Load or request or authorization to call APIs.
   *
   */
  authorize=async()=> {
    let client = await this.loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await this.saveCredentials(client);
    }
    return client;
  }
  //////////
  getAccessToken=async()=>{

    const refrsh=await this.authorize();
    var data = qs.stringify({
        client_id:refrsh._clientId,
        client_secret: refrsh._clientSecret,
        refresh_token: refrsh.credentials.refresh_token,
         
        grant_type: "refresh_token",
      });
    
      var config = {
        method: "post",
        url: "https://accounts.google.com/o/oauth2/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data,
      };     
     let accessToken="";  
      await axios(config)
      .then(async function (response) {
        accessToken =await response.data.access_token;
        console.log(accessToken)
    
        
      })
      .catch(function (error) {
        console.log("This Is Access Code Error"+error);
      });
  return accessToken;
}
}


// new GmailAuthByMe().getAccessToken();


const SHEETS_ID =  "1v0ofcKPVSvjs50htyI59BLt1J9e1i8dPk8ULd492uiU"
const range="A1:L2"

async function getValues(spreadsheetId, range) {

  
    // const auth = new GoogleAuth({
    //   scopes: 'https://www.googleapis.com/auth/spreadsheets',
    // });

    const auth= await new GmailAuthByMe().authorize()


  
    const service = google.sheets({version: 'v4', auth});
    try {
      const result = await service.spreadsheets.values.get({
        spreadsheetId,
        range,
      });
      const numRows = result.data.values ? result.data.values.length : 0;
      console.log(result.data.values)
      console.log(`${numRows} rows retrieved.`);
      return result;
    } catch (err) {
      // TODO (developer) - Handle exception
      throw err;
    }
  }

  

  getValues(SHEETS_ID,range)