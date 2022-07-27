
import express from "express";
import pg from "pg";
import basicAuth from 'express-basic-auth';



const pool = new pg.Pool({
    database: "petshop",
});

const app = express();

app.use(basicAuth({
    users: { 'admin': 'meowmix' },
    unauthorizedResponse: getUnauthorizedResponse
}));

function getUnauthorizedResponse(req) {
    return req.auth
        ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected')
        : 'No credentials provided'
}

app.use(express.json());
const errorHandler1 = (req, res, next) => {
    res.sendStatus(404)
    next();
}

app.get("/pets", (req, res, next) => {
    pool.query("SELECT * FROM pets").then((data) => {
        res.send(data.rows);
    }).catch(next)
});

app.get("/pets/:id", (req, res, next) => {
    const id = req.params.id;
    pool.query(`SELECT * FROM pets WHERE id = $1;`, [id]).then((data) => {
        if(data.rows[0]){
            res.send(data.rows[0]);
        } else {
            res.sendStatus(404);
        }
    }).catch(next)
});

app.delete("/pets/:id", (req, res, next) => {
    const id = req.params.id;
    pool.query("DELETE FROM pets WHERE id = $1 RETURNING *;", [id]).then(data => {
        if(data.rows.length === 0){
            res.sendStatus(404);
        }else {
            res.status(204).send(data.rows[0]);
        }
    }).catch(next)
});

app.post("/pets", (req, res, next) => {
    const newPet = req.body;
    newPet.age = parseInt(newPet.age);
    if(newPet.age === newPet.age && newPet.kind && newPet.name){
        pool.query("INSERT INTO pets (name, kind, age) VALUES ($1, $2, $3);", [newPet.name, newPet.kind, newPet.age]).then(data => {
        res.status(201).send(newPet);
    }).catch(next)
    } else {
        res.sendStatus(400);
    }
});

app.patch("/pets/:id", (req, res, next) => {
    const id = req.params.id;
    const update = req.body;
    if(update.age || update.kind || update.name) {
        pool.query(`UPDATE pets 
        SET name = COALESCE($1, name), 
            kind = COALESCE($2, kind),  
            age = COALESCE($3, age) 
        WHERE id = $4
        RETURNING *;`, [update.name, update.kind, update.age, id]).then(data => {
            if(data.rows.length === 0){
                res.sendStatus(404);
            } else {    
            res.status(200).send(data.rows[0]); 
            }
        }).catch(next) 
    } else {
        res.sendStatus(400);
        }                           
        
});

app.use(errorHandler1);
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
});

app.listen(3000, () => {
    console.log('listening on port 3000')
});