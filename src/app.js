import express from "express";
import jsonwebtoken from "jsonwebtoken";
import {v4 as uuid} from "uuid";
import compareKeys from "./utils/compareKeys.js";
import { userModel, groupModel } from "./utils/models.js";
import isObjectKeysEmpty from "./utils/isObjectKeysEmpty.js";
import response from "./utils/response.js";
import crudUsers from "./utils/user-crud.js";
import crudFriends from "./utils/friends-crud.js";
import crudGroups from "./utils/group-crud.js";

const app = express();
const secret = "123";

let jwt = jsonwebtoken;
let blacklist = [];
let usuarios = [];

app.use(express.json());

function checkJwt(req, res, next) {
    const token = req.headers["authorization"];
    jwt.verify(token, secret, (err, decodedJwt)=> {
        if(err){
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
    let data = crudFriends.findFriends(req.id);
    if(JSON.stringify(data) === '{}'){
        res.status(404).json(response(true, "Amigos não encontrados."));
    }else{
        res.status(200).json(response(true, data));
    }
});

app.delete("/amigos/excluir/:id", checkJwt, (req, res)=> {
    let result = crudFriends.deleteFriendById(req.params.id, req.id); 
    if(result !== -1 || result !== false){
        crudUsers.addUsers(result, req.id)
        res.status(200).json()
    }
    res.status(404).json();
});

app.get("/usuarios", checkJwt ,(req, res)=> {
    console.log(req.email + " esta chamando.");
    res.status(200).json(usuarios);
})

app.post("/login", (req, res)=> {
    let data = req.body;
    let found = crudUsers.findLogin(data.email, data.senha);
    if(!found){
        res.status(401).json(response(false, "Email e/ou senha incorreto(s)"));
    }
    const token = jwt.sign({id: found.id}, secret, {expiresIn: 600});
    res.status(200).json(response(true, token));        
});

app.post("/logout", (req, res)=> {
    blacklist.push(req.headers["authorization"]);
    res.status(201).json(response(true, "Usuário deslogado"));
});

app.post("/cadastro", (req, res)=> {
    if(compareKeys(req.body, userModel)){
        if(isObjectKeysEmpty(req.body)){
            res.status(400).json(response(false, "Campo(s) inválido(s)."));
        }else{
            req.body.id = uuid();
            crudUsers.addUsers(req.body);
            res.status(201).json(response(true, "Cadastro realizado com sucesso."));
        }
    }else{
        res.status(400).json(response(false, "Campo(s) inválido(s)."));
    }        
});

app.post("/criarGrupo", (req, res) => {
    if(compareKeys(req.body, groupModel)){
        if(isObjectKeysEmpty(req.body)){
            res.status(400).json(response(false, "Campo(s) não preenchido(s)."));
        }else{
            req.body.id = uuid();
            crudGroups.addGroup(req.body);
            res.status(201).json(response(true, "Grupo criado com sucesso."));
        }
    }else{
        res.status(400).json(response(false, "Campo(s) inválido(s)."));
    }        
});

app.get("/grupos", checkJwt, (req, res)=> {
    let data = crudGroups.findGroupsByUserId(req.body.userId);
    if(JSON.stringify(data) === '{}'){
        res.status(404).json(response(true, "Não há grupos para esse usuário."));
    }else{
        res.status(200).json(response(true, data));
    }
});

app.delete("/removerGrupo", (req, res)=> {
    let result = crudGroups.deleteGroupById(req.body.groupId, req.body.userId); 
    if(result === true) {        
        res.status(200).json(response(true, "Grupo removido."));
    }else {
        res.status(400).json(response(false, "Houve um problema ao remover o grupo."));
    }
});

export default app;