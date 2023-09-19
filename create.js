const apiKey = "AIzaSyA0y-pcsUGMqoHP49hznVSnDQ2K77JqcoM"
const sheetId = '1lPK3HlKE-4AFkfSd3pm9_DTLmOZQ6Nly_Z-ew5t_dtk';
const range = 'Sheet1!A1'; // Replace with the cell you want to update

// Replace this with the data you want to update in the cell
const newValue = 'New Value';

// Construct the URL to access the Google Sheets API
const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?valueInputOption=RAW&key=${apiKey}`;

// Create the request body with the new value
const requestBody = {
  values: [[newValue]],
};

// Make a PUT request to update the cell
fetch(apiUrl, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(requestBody),
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log('Cell updated successfully:', data);
  })
  .catch((error) => {
    console.error('An error occurred:', error);
  });
