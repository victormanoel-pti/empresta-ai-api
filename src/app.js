import express from "express";
import jsonwebtoken from "jsonwebtoken";
import compareKeys from "./utils/compareKeys.js";
import userFields from "./utils/mocks.js";
import isObjectKeysEmpty from "./utils/isObjectKeysEmpty.js";
import response from "./utils/response.js";

const app = express();
let jwt = jsonwebtoken;

const secret = "123";

let blacklist = [];

app.use(express.json());

let usuarios = [];

function checkJwt(req, res, next) {
    const token = req.headers["authorization"];
    jwt.verify(token, secret, (err, decodedJwt)=> {
        if(err){
            return res.status(401).json();
        }
        req.email = decodedJwt.email;
        next();
    })
}

app.get("/", (req, res)=> {
    res.status(200).json({"success": true, "message": "API funcionando!"});
});

app.get("/usuarios", checkJwt ,(req, res)=> {
    console.log(req.email + " esta chamando.");
    res.status(200).json(usuarios);
})

app.post("/login", (req, res)=> {
    let dados = req.body;
    
    for(let i = 0; i < usuarios.length; i++){
        if(dados["email"] === usuarios[i].email && dados["senha"] === usuarios[i].senha){
            const token = jwt.sign({email: usuarios[i].email}, secret, {expiresIn: 600});
            res.status(200).json(response(true, token));
        }
    }
        res.status(401).json(response(false, "Email e/ou senha incorreto(s)"));
});

app.post("/logout", (req, res)=> {
    blacklist.push(req.headers["authorization"]);
    res.status(201).json(response(true, "Usuário deslogado"));
});

app.post("/cadastro", (req, res)=> {

    if(compareKeys(userFields, req.body)){
        if(isObjectKeysEmpty(req.body)){
            res.status(400).json(response(false, "Campo(s) inválido(s)."));
        }else{
            usuarios.push(req.body);
            res.status(201).json(response(true, "Cadastro realizado com sucesso."));
        }
    }else{
        res.status(422).json(response(false, "Campo(s) inválido(s)."));
    }
});



export default app;