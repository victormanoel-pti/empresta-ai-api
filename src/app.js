import express from "express";
import compareKeys from "./utils/validate.js";

const app = express();
app.use(express.json());

const usuarios = [
    {
        "nome": "Victor",
        "sobrenome": "Manoel", 
        "cidade": "SP",
        "genero": "Masculino",
        "dataNascimento": new Date(),
        "email":"victor@email.com",
        "senha":"senha",
        /*
        "amigos": {
            1: "Victor",
            2: "Manoel"
        }
        */
    }
]

app.get("/", (req, res)=> {
    res.status(200).json({"success": true, "message": "API funcionando!"});
});

app.get("/usuarios", (req, res)=> {
    res.status(200).json(usuarios);
})

/*
app.get("/amigos", (req, res)=> {
    res.status(200).json(usuarios[0].amigos);
});
*/

app.post("/login", (req, res)=> {
    let dados = req.body;
    
    if(dados["email"] === usuarios[0].email && dados["senha"] === usuarios[0].senha){
        res.status(200).json(`Bem vindo (a), ${usuarios[0].nome}!`);
    }else{
        res.status(401).json();
    }
    
});

app.post("/cadastro", (req, res)=> {
    if(compareKeys(usuarios[0], req.body)){
        usuarios.push(req.body);
        res.status(201).json({"success": true, "message": "Cadastro realizado com sucesso!"});
    }else{
        res.status(422).json({"success": false, "message": "Oppss... algo deu errado, tente novamente!"});
    }
});



export default app;