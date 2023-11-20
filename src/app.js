import express from "express";
import cors from "cors";
import jsonwebtoken from "jsonwebtoken";
import {v4 as uuid} from "uuid";
import compareKeys from "./utils/compareKeys.js";
import { userModel, groupModel } from "./utils/models.js";
import isObjectKeysEmpty from "./utils/isObjectKeysEmpty.js";
import response from "./utils/response.js";

const app = express();
const secret = "123";

let jwt = jsonwebtoken;
let blacklist = [];
let usuarios = [];
let grupos = [];

app.use(cors({
    origin: "*"
}));
app.use(express.json());

function checkJwt(req, res, next) {
    const token = req.headers["authorization"];
    jwt.verify(token, secret, (err, decodedJwt)=> {
        if(err || blacklist.includes(token)){
            console.log(blacklist)
            return res.status(401).json();
        }
        req.id = decodedJwt.id;
        next();
    })
}

app.get("/", (req, res)=> {
    res.status(200).json({"success": true, "message": "API funcionando!"});
});

app.get("/amigos", checkJwt, (req, res)=> {
    for(let i =0; i < usuarios.length; i++){
        if(usuarios[i].id === req.id){
            console.log(usuarios[i].amigos.length)
            if(usuarios[i].amigos.length <= 0){
                if(Object.keys(usuarios[i].amigos).length === 0){
                    res.status(404).json(response(true, "Amigos não encontrados."));
                }
            }
            res.status(200).json(response(true, usuarios[i].amigos));
        }
    }
});

app.post("/amigos", checkJwt, (req, res)=> {
    for(let i= 0; i < usuarios.length; i++){
        if(usuarios[i].id === req.id){
            req.body.id = uuid();
            usuarios[i].amigos.push(req.body);
            res.status(201).json(response(true, "Amigo adicionado com sucesso!"));
        }
    }
    res.status(400).json(response(400, "Erro ao adicionar o amigo."));
});

app.delete("/amigos/excluir/:id", checkJwt, (req, res)=> {
    for(let i =0; i < usuarios.length; i++){
        if(usuarios[i].id === req.id){
            for(let j = 0; j < usuarios[i].amigos.length; j++){
                console.log(usuarios[i].amigos[j].id);
                if(usuarios[i].amigos[j].id === req.params.id){
                    console.log(usuarios[i].amigos[j])
                    usuarios[i].amigos.splice(usuarios[i].amigos[j], 1);
                    res.status(204).json()
                }
            }
        }
    }
    res.status(404).json(response(false, "Houve um erro ao remover o amigo."));
    
});

app.get("/usuarios", checkJwt,(req, res)=> {
    console.log(req.id + " esta chamando.");
    res.status(200).json(usuarios);
})

app.post("/login", (req, res)=> {
    let data = req.body;
    for(let i = 0; i < usuarios.length; i++) {            
        if(usuarios[i].email === data.email && usuarios[i].senha === data.senha) {                
            const token = jwt.sign({id: usuarios[i].id}, secret, {expiresIn: 600});
            res.status(200).json(response(true, token)); 
        }
    }
    res.status(401).json(response(false, "Email e/ou senha incorreto(s)"));
});

app.post("/logout", checkJwt,(req, res)=> {
    blacklist.push(req.headers["authorization"]);
    res.status(200).json(response(true, "Usuário deslogado"));
});

app.post("/cadastro", (req, res)=> {
    if(compareKeys(req.body, userModel)){
        if(isObjectKeysEmpty(req.body)){
            res.status(400).json(response(false, "Campo(s) inválido(s)."));
        }else{
            req.body.id = uuid();
            for(let i =0; i < req.body.amigos.length; i++){
                req.body.amigos[i].id = uuid();
            }
            usuarios.push(req.body);
            res.status(201).json(response(true, "Cadastro realizado com sucesso."));
        }
    }else{
        res.status(400).json(response(false, "Campo(s) inválido(s)."));
    }        
});

app.post("/grupos/criar", checkJwt,(req, res) => {
    if(compareKeys(req.body, groupModel)){
        if(isObjectKeysEmpty(req.body)){
            res.status(400).json(response(false, "Campo(s) não preenchido(s)."));
        }else{
            req.body.userId = req.id;
            req.body.grupoId = uuid();
            grupos.push(req.body);
            res.status(201).json(response(true, "Grupo criado com sucesso."));
        }
    }else{
        res.status(400).json(response(false, "Campo(s) inválido(s)."));
    }        
});

app.get("/grupos/meus-grupos", checkJwt, (req, res)=> {

    let meusGrupos = [];
    for(let i =0; i < grupos.length; i++){
        if(grupos[i].userId === req.id){
            meusGrupos.push(grupos[i]);
        }
    }
    if(meusGrupos.length <=0 ){
        res.status(404).json(response(true, "Não há grupos para esse usuário."))
    }
    res.status(200).json(response(true, meusGrupos));
    
});

app.delete("/grupos/remover/:id", (req, res)=> {
    for(let i = 0; i < grupos.length; i++){
        if(grupos[i].grupoId === req.params.id){
            grupos.splice(grupos[i], 1);
            res.status(204).json();
        }
    }
    res.status(404).json(response(false, "Houve um problema ao remover o grupo."));
    
});

app.get("/grupos/detalhes/:id", (req, res)=> {
    for(let i = 0; i < grupos.length; i++){
        if(grupos[i].grupoId === req.params.id){
            res.status(200).json(response(true, grupos[i]));
        }
    }
    res.status(404).json(response(false, "Grupo não encontrado."));
});

app.patch("/grupos/editar/:id", checkJwt, (req,res)=> {
    for(let i = 0; i < grupos.length; i++){
        if(grupos[i].grupoId === req.params.id){
            req.body.grupoId = req.params.id;
            req.body.userId = req.id;
            grupos[i] = req.body;
            res.status(200).json(response(true, "Grupo editado com sucesso."));
        }
    }
    res.status(404).json(response(false, "Houve um erro ao editar o grupo."));

});

export default app;