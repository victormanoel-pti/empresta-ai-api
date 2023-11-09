import express from "express";
import compareKeys from "./utils/compareKeys.js";
import userFields from "./utils/mocks.js";
import isObjectKeysEmpty from "./utils/isObjectKeysEmpty.js";
import response from "./utils/response.js";

const app = express();
app.use(express.json());


let usuarios = [];

app.get("/", (req, res)=> {
    res.status(200).json({"success": true, "message": "API funcionando!"});
});

app.get("/usuarios", (req, res)=> {
    res.status(200).json(usuarios);
})

app.post("/login", (req, res)=> {
    let dados = req.body;
    
    if(dados["email"] === usuarios[0].email && dados["senha"] === usuarios[0].senha){
        res.status(200).json(`Bem vindo (a), ${usuarios[0].nome}!`);
    }else{
        res.status(401).json();
    }
    
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