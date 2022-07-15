import { writeFile } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
const subcommand = process.argv[2];
const itemIndex = process.argv[3];

switch (subcommand) {
  case "create": {
    const newPet = {};
    newPet.age = parseInt(process.argv[3]);
    newPet.kind = process.argv[4];
    newPet.name = process.argv[5];
    readFile("./pets.json", "utf-8").then((str) => {
      let data = JSON.parse(str);
      data.push(newPet);
      data = JSON.stringify(data);
      writeFile("./pets.json", data).then(() => {
        console.log("newPet", newPet);
      });
    });
    if (newPet.age === undefined || newPet.kind === undefined || newPet.name === undefined) {
      console.error("Usage: node pets.js create AGE KIND NAME");
      process.exit(1);
    }
    break;
  }
  case "read": {
    readFile("./pets.json", "utf-8").then((str) => {
      const data = JSON.parse(str);
      if (itemIndex === undefined) {
        console.log(data);
      } else if (data[itemIndex] === undefined) {
        console.error("Usage: node pets.js read INDEX");
        process.exit(1);
      } else {
        console.log(data[itemIndex]);
      }
    });
    break;
  }
  case "update": {
    const [,,, index, age, kind, name] = process.argv;
    readFile("pets.json", "utf-8").then(str => {
      const data = JSON.parse(str);
      if (data[index]) {
        const pet = data[index];
        pet.age = parseInt(age);
        pet.kind = kind;
        pet.name = name;
        writeFile("pets.json", JSON.stringify(data));
      } else {
        console.error("Usage: node pets.js update INDEX AGE KIND NAME");
        process.exit(1);
      }
    });
    break;
  }

  case "destroy":{
  readFile("pets.json", "utf-8").then(str => {
    const data = JSON.parse(str);
    if (itemIndex !== undefined) {
      data.splice(itemIndex, 1);
    } else if(data[itemIndex] === undefined){
      console.error("Usage: node pets.js destroy INDEX");
      process.exit(1);
    }else {
      console.error("Usage: node pets.js destroy INDEX");
      process.exit(1);
    }
    writeFile("pets.json", JSON.stringify(data));
      });
      break;
  }
//   default: {
//     console.error("Usage: node pets.js [read | create | update | destroy]");
//   }
}