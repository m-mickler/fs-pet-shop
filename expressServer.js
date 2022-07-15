import { error } from "console";
import express from "express";
import {readFile} from "fs/promises";
import {writeFile} from "fs/promises";
const app = express();
app.use(express.json());
const errorHandler1 = (req, res, next) => {
    res.sendStatus(404)
    next();
}

app.get("/pets", (req, res, next) => {
    readFile("pet.json", "utf-8").then(str => {
        const pets = JSON.parse(str);
        console.log(pets);
        res.send(pets);
    }).catch(next)
});

app.get("/pets/:id", (req, res, next) => {
    readFile("pets.json", "utf-8").then(str => {
        const index = req.params.id;
        const pets = JSON.parse(str);
        if(pets[index]){
            res.send(pets[index]);
        } else {
            res.set('Content-Type', 'text/plain');
            res.status(404);
            res.send('Not Found');
        }
    }).catch(next)
});

app.post("/pets", (req, res, next) => {
    const newPet = req.body;
    newPet.age = Number(newPet.age);
    readFile("pets.json", "utf-8").then(str => {
        const existingPets = JSON.parse(str);
        if(typeof newPet.age === 'number' && newPet.kind && newPet.name){
            existingPets.push(newPet);
            return writeFile("pets.json", JSON.stringify(existingPets)).then( () =>{
                res.send('pets push');
            });
        } else {
            res.sendStatus(400);
        }
    }).catch(next)
});

app.use(errorHandler1);
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
});

app.listen(3000, () => {
    console.log('listening on port 3000')
});
