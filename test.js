const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {google} = require('googleapis');
const {authenticate} = require('@google-cloud/local-auth');






class GoogleAuthentication{

  constructor(){
    this.SCOPES=['https://www.googleapis.com/auth/spreadsheets'];
    this.TOKEN_PATH=path.join(process.cwd(), 'token.json');
    this.CREDENTIALS_PATH=path.join(process.cwd(), 'credentials.json');

  }

  
async  loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(this.TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}


async saveCredentials(client) {
  const content = await fs.readFile(this.CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(this.TOKEN_PATH, payload);
}


async  authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: this.SCOPES,
    keyfilePath: this.CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }

  // console.log(client)
  return client;
}


}



new GoogleAuthentication().authorize()



class GoogleSheetManager{
  constructor(sheetId='1lPK3HlKE-4AFkfSd3pm9_DTLmOZQ6Nly_Z-ew5t_dtk'){

    this.authenticator=new GoogleAuthentication()

    this.authKey=null

    this.sheetId=sheetId

  }


  async authenticate(){
    this.authKey=await this.authenticator.authorize()
    return this.authKey
  }



  async  getRow(range='A3:B3') {
    const auth=await this.authenticate()
    const sheets = google.sheets({version: 'v4', auth});
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId:`${this.sheetId}` ,
      range: `${range}`,
    });
    const rows = res.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found.');
      return;
    }
    console.log(rows)
  
  }

  async  updateSheet(range='Sheet1!A3:B3',valueArr=["exValue1","exValue2"]) {
    const auth=await this.authenticate()
    const sheets = google.sheets({ version: 'v4', auth });
  
    try {
      const updateRequest = {
        spreadsheetId:`${this.sheetId}`,
        range: `${range}`, // Modify the range as needed
        valueInputOption: 'RAW',
        resource: {
          values: [
            [...valueArr], // make an array of all the values and put it here
          ],
        },
      };
  
      const response = await sheets.spreadsheets.values.update(updateRequest);
      console.log('Data updated successfully:', response.data);
      return {
        status:"SuccessFull",
        response:response.data
      }
    } catch (err) {
      console.error('Error updating data:', err);
    }
  }




  async  createCells(range='Sheet1!A1:B2') {
    const auth=await this.authenticate()
    const sheets = google.sheets({ version: 'v4', auth });
  
    try {
      const updateRequest = {
        spreadsheetId: `${this.sheetId}`,
        range: `${range}`, // Specify the range where you want to create cells
        valueInputOption: 'RAW',
        resource: {
          values: [



            ['New Value 1', 'New Value 2'], // Specify the new values for the cells
            ['Another New Value 1', 'Another New Value 2'],



            
          ],
        },
      };
  
      const response = await sheets.spreadsheets.values.update(updateRequest);
      console.log('Cells created successfully:', response.data);
    } catch (err) {
      console.error('Error creating cells:', err);
    }
  }








}













async function listMajors(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: '1lPK3HlKE-4AFkfSd3pm9_DTLmOZQ6Nly_Z-ew5t_dtk',
    range: 'A3:B3',
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log('No data found.');
    return;
  }
  console.log(rows)

}

async function updateSheet(auth) {
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const updateRequest = {
      spreadsheetId: '1lPK3HlKE-4AFkfSd3pm9_DTLmOZQ6Nly_Z-ew5t_dtk',
      range: 'Sheet1!A3:B3', // Modify the range as needed
      valueInputOption: 'RAW',
      resource: {
        values: [
          ['New Value 1', 'New Value 2'], // Replace with the new values
        ],
      },
    };

    const response = await sheets.spreadsheets.values.update(updateRequest);
    console.log('Data updated successfully:', response.data);
  } catch (err) {
    console.error('Error updating data:', err);
  }
}

// Call the updateSheet function with the auth parameter



async function createCells(auth) {
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const updateRequest = {
      spreadsheetId: 'YOUR_SPREADSHEET_ID',
      range: 'Sheet1!A1:B2', // Specify the range where you want to create cells
      valueInputOption: 'RAW',
      resource: {
        values: [
          ['New Value 1', 'New Value 2'], // Specify the new values for the cells
          ['Another New Value 1', 'Another New Value 2'],
        ],
      },
    };

    const response = await sheets.spreadsheets.values.update(updateRequest);
    console.log('Cells created successfully:', response.data);
  } catch (err) {
    console.error('Error creating cells:', err);
  }
}







// const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// const TOKEN_PATH = path.join(process.cwd(), 'token.json');
// const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');


// async function loadSavedCredentialsIfExist() {
//   try {
//     const content = await fs.readFile(TOKEN_PATH);
//     const credentials = JSON.parse(content);
//     return google.auth.fromJSON(credentials);
//   } catch (err) {
//     return null;
//   }
// }


// async function saveCredentials(client) {
//   const content = await fs.readFile(CREDENTIALS_PATH);
//   const keys = JSON.parse(content);
//   const key = keys.installed || keys.web;
//   const payload = JSON.stringify({
//     type: 'authorized_user',
//     client_id: key.client_id,
//     client_secret: key.client_secret,
//     refresh_token: client.credentials.refresh_token,
//   });
//   await fs.writeFile(TOKEN_PATH, payload);
// }


// async function authorize() {
//   let client = await loadSavedCredentialsIfExist();
//   if (client) {
//     return client;
//   }
//   client = await authenticate({
//     scopes: SCOPES,
//     keyfilePath: CREDENTIALS_PATH,
//   });
//   if (client.credentials) {
//     await saveCredentials(client);
//   }

//   console.log(client)
//   return client;
// }


// Call the createCells function with the auth parameter
// createCells(auth);














// authorize().then(updateSheet).catch(console.error); 


