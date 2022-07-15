import http from "http";
import fs from "fs";
import fr from "fs/promises";
const petRegExp = /^\/pets\/(\d*)$/;
const server = http.createServer((req, res) => {
    // const url = new URL("http://localhost;8000" + req.url)
    if(req.url === "/pets" && req.method === "GET") {
        fs.readFile("./pets.json", "utf-8", (err, data) => {
            res.end(data);
        });
        console.log('in conditional');
    } else if(petRegExp.test(req.url) === true && req.method === "GET") {
        let newIndex = req.url.match(petRegExp)[1];
        console.log(req.url.match(petRegExp)[1])
        fs.readFile("./pets.json", "utf-8", (err, data) => {
            const str = JSON.parse(data);
            if(str[newIndex] !== undefined){
                res.setHeader("Content-Type", "application/json");
                res.end( JSON.stringify(str[newIndex]));
            } else {
                res.setHeader("Content-Type", "text/plain");
                res.statusCode = 404;
                res.end('Not Found')
            }           
        });
    } else if (req.url === "/pets" && req.method === "POST"){
        let body = "";
        req.on("data", (chunk) => {
            body+= chunk;
        });
        req.on("end", () => {
            const newPet = JSON.parse(body);
            fr.readFile("pets.json", "utf-8").then(str => {
                const existingPets = JSON.parse(str);
                existingPets.push(newPet);
                return fr
                .writeFile("pets.json", JSON.stringify(existingPets))
                .then(() => {
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify(newPet));
                });
            });
            console.log(newPet);
        });

    } else {
        res.setHeader("Content-Type", "text/plain");
        res.statusCode = 404;
        res.end('Not Found')
    }
});

server.listen(8000, () => {
    console.log("server started on port 8000");
});