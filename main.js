
// https://github.com/Edwardsoen/Leetcode-Premium-Unlocker
// 1v0ofcKPVSvjs50htyI59BLt1J9e1i8dPk8ULd492uiU

const fs = require('fs').promises;
 const API_KEY =  "AIzaSyA0y-pcsUGMqoHP49hznVSnDQ2K77JqcoM"
 const SHEETS_ID =  "1v0ofcKPVSvjs50htyI59BLt1J9e1i8dPk8ULd492uiU"

async function getData(range){


    const url=`https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_ID}/values/A${range}?key=${API_KEY}`
    let response = await fetch(url)
    const data=await response.json()
    // console.log(data["values"][1][11]);
    console.log( data["values"][0][0])

//    element.innerHTML=data["values"][1][11]

     return data["values"][0][0]

}

async function testData(range){


    const url=`https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_ID}/values/A:A?key=${API_KEY}`
    let response = await fetch(url)
    const data=await response.json()
    // console.log(data["values"][1][11]);
    console.log( data)
    console.log( data['values'][5])

//    element.innerHTML=data["values"][1][11]

     return data["values"]

}
// testData()


async function writeObjectToFile(objectToWrite, filename) {
  // Convert the object to a JSON string
 try{
  const jsonString = JSON.stringify(objectToWrite, null, 2);

  // Write the JSON string to the file
  await fs.writeFile(filename, jsonString, 'utf-8');

  console.log(`Object has been written to ${filename}`);
 }
 catch(e){
  console.log(e)

 }
}


const prbToRow = {};

(async () => {
  const data=await testData()
  for (let i = 1; i < data.length; i++) {
    const id =data[i]
    prbToRow[id] = i+1;
  }

  await writeObjectToFile(prbToRow, 'write.json');
});



let objectFile;






 objectFile={
  "1": 2,
  "2": 3,
  "3": 4,
  "4": 5,
  "5": 6,
  "6": 7,
  "7": 8,
  "8": 9,
  "9": 10,
  "10": 11,
  "11": 12,
}


async function getEditorial(problemId){
  const range=problemId in objectFile?objectFile[problemId]:2;

  const url=`https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_ID}/values/A${range}:L${range}?key=${API_KEY}`
  let response = await fetch(url)
  const data=await response.json()

  console.log(typeof data["values"][0][11])
  return data["values"][0][11]


}

// getEditorial("10")

// const storage = browser.storage.local;



// storage.set({ key: "value" }).then(() => {
//   console.log("Data stored successfully");
// }).catch(error => {
//   console.error("Error storing data: " + error);
// });


// storage.get("key").then(result => {
//   const value = result.key;
//   console.log("Retrieved value: " + value);
// }).catch(error => {
//   console.error("Error retrieving data: " + error);
// });




const obj={
  name:"soikat"
}

console.log(obj)







