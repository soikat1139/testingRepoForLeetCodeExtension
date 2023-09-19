const fs = require('fs');

function writeObjectToFile(objectToWrite, filename) {
  // Convert the object to a JSON string
  const jsonString = JSON.stringify(objectToWrite, null, 2);

  // Write the JSON string to the file
  fs.writeFileSync(filename, jsonString, 'utf-8');

  console.log(`Object has been written to ${filename}`);
}

myObject={
    name:"Soikat",
    age:50,
    village:"Khilpara"
}


writeObjectToFile(myObject, 'write.json');




