import express from "express";
import cors from "cors";
import jsonwebtoken from "jsonwebtoken";
import response from "./utils/response.js";
import sql from "./databases/db.js";


const app = express();
const secret = "123";

let jwt = jsonwebtoken;
let blacklist = [];


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
    res.status(200).json(response(true, "API Funcionando!"));
});

app.get("/amigos", async (req, res)=> {
   let buscarAmigos = await sql`select (amigos) from usuarios where id=8;`;
   console.log(buscarAmigos)
   if(buscarAmigos[0] === null){
    return res.status(404).json(response(true, "Usuário não possui amigos cadastrados."));
   }else{
    return res.status(200).json(buscarAmigos[0]);
   }
});

app.post("/amigos", checkJwt, (req, res)=> {
    /**
     * TODO: Implementar a validação dos campos e efetuar a criação de amigos
     */
});

app.delete("/amigos/excluir/:id", checkJwt, (req, res)=> {
    /**
     * TODO: Implementar a remoção de amigos
     */
});

app.get("/usuarios", async (req, res)=> {
    let buscarUsuarios = await sql`select * from usuarios;`;
    res.status(200).json(response(true, buscarUsuarios));
})

app.post("/login", (req, res)=> {
    /**
     * TODO: Implementar login e geracao de token
     */
});

app.post("/logout", checkJwt,(req, res)=> {
    /**
     * TODO: Implementar logout e desabilitar o token
     */
});

app.post("/cadastro", async (req, res)=> {
    /**
     * TODO: Cadastrar usuario
     */
});

app.post("/grupos/criar", checkJwt,(req, res) => {
    /**
     * TODO: Implementar adicição de grupo
     */   
});

app.get("/grupos/meus-grupos", checkJwt, (req, res)=> {

    /** 
     * Implementar busca de grupos do usuario
     */
    
});

app.delete("/grupos/remover/:id", (req, res)=> {
    /**
     * Implementar remoção de um usuario do grupo 
     */
    
});

app.get("/grupos/detalhes/:id", (req, res)=> {
    /**
     * Implementar busca de detalhes do grupo
     */
});

app.patch("/grupos/editar/:id", checkJwt, (req,res)=> {
    /**
     * Implementar edicao do grupo
     */

});

export default app;