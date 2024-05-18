import express from "express";
import cors from "cors";
import jsonwebtoken from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import { param, validationResult } from "express-validator";
import "dotenv/config.js";
import response from "./utils/response.js";
import { cadastroValidator, grupoEditarValidador, grupoValidador } from "./utils/validators.js";
import { doesEmailExists } from "./utils/findUserEmail.js";
import { hash } from "bcrypt";
import checkForbiddenList from "./utils/checkForbbidenList.js";



const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const app = express();
let jwt = jsonwebtoken;


app.use(cors({
    origin: "*"
}));

app.use(express.json());

async function decodeJwt(req, res, next){
    const token = req.headers["authorization"];
    const secret = process.env.SUPABASE_JWT_SECRET;
    let getTokens = await supabase.from('logged_out_tokens').select('tokens');
    let tokens = getTokens.data[0].tokens;

    jwt.verify(token, secret, async (error, decodedJwt) => {
        if(error || checkForbiddenList( tokens, token)){
            return res.status(401).json(response(false, "Token inválido."));
        }
        const {data} = await supabase.from('usuarios').select('id').eq('email', decodedJwt.email );
        req.userEmail = decodedJwt.email;
        req.userId = data[0].id; // id do usuário no banco para consultas
        next();
    });
}


app.get("/", (req, res)=> {
    res.status(200).json(response(true, "API Funcionando!"));
});

app.get("/amigos" , decodeJwt,async (req, res)=> {
   let {data} = await supabase.from('usuarios').select('amigos').eq('id', req.userId);
   if(data[0].amigos.length <= 0 ){
    return res.status(404).json(response(false, "Usuário não possui amigos cadastrados."));
   }
    return res.status(200).json(response(true, data));
});

app.post("/amigos", (req, res)=> {
    /**
     * TODO: Implementar a validação dos campos e efetuar a criação de amigos
     */
});

app.delete("/amigos/excluir/:id", (req, res)=> {
    /**
     * TODO: Implementar a remoção de amigos
     */
});

app.get("/usuarios", decodeJwt ,async (req, res)=> {
    let { data: usuarios, error } = await supabase.from('usuarios').select('*');
    if(error){
        return res.status(400).json(response(false, "Erro ao buscar usuários."));
    }
    return res.status(200).json(response(true, usuarios));
    
});

app.post("/login", async(req, res)=> {
    let {data, error} = await supabase.auth.signInWithPassword({
        email: req.body.email,
        password: req.body.senha
    });
    if(error){
        return res.status(401).json(response(true, "Usuário ou senha inválido(s)."));
    }
    return res.status(201).json(response(true, data.session.access_token));
});

app.post("/logout", decodeJwt, async (req, res)=> {

    let {data, error} = await supabase.from('logged_out_tokens').select('tokens').eq('id', 1);
    if(error){
        res.status(400).json(response(false, "Token inválido"));
    }
    data[0].tokens.push(req.headers['authorization'])

    const update = await supabase.from('logged_out_tokens').update({tokens: data[0].tokens}).eq('id', 1).select()
    if(update.error){
        res.status(400).json(response(false, "Erro ao deslogar usuário."));
    }
    res.status(200).json(response(true, "Usuário deslogado!"));
    
});

app.post("/cadastro", cadastroValidator, async (req, res)=> {
    const errors = validationResult(req);
    if(errors.isEmpty()){
        const { nome, sobrenome, cidade, genero, dataNascimento, email, senha, amigos} = req.body;
        if (await doesEmailExists(email)){
            return res.status(400).json(response(false, "Email já cadastrado."));
        }else{
            await supabase.from('usuarios')
            .insert([
                { nome, sobrenome, cidade, genero, data_nascimento: dataNascimento, email, senha: await hash(senha, 8), amigos},
            ])
            .select()
            await supabase.auth.signUp({email, password: senha})
            return res.status(201).json(response(true, "Usuário cadastrado com sucesso."));
        }
    }
    return res.status(400).json(errors.array());
});

app.post("/grupos/criar", decodeJwt, grupoValidador, async (req, res) => {
    const errors = validationResult(req);
    if(errors.isEmpty()){
        const { nome, foto_perfil} = req.body;
        const {data, error} = await supabase.from('grupo').insert(
            [{
                nome, participante: [req.userEmail], foto_perfil, proprietario: req.userEmail
            }]
        ).select()
        if(error){
            res.status(400).json(response(false, error));
        }
        return res.status(200).json(response(true, "Grupo criado com sucesso."));
    }
    return res.status(400).json(response(false, errors))
});

app.get("/grupos/meus-grupos", decodeJwt, async(req, res)=> {

        //const {data, error} = await supabase.from('grupo').select().contains('participante', [req.userEmail]);
        console.log([`${req.userEmail}`])
        
        const { data, error } = await supabase
        .from('grupo')
        .select()
        .in('participante', ['grupo@gmail.com'])
        
        console.log(error)
        return res.status(200).json(data);
    
    
});

app.delete("/grupos/remover/:id",decodeJwt , async(req, res)=> {
    const {data, error} = await supabase.from('grupo').select('proprietario').eq('id', req.params.id);
    if(error || data.length <= 0){
        return res.status(401).json()
    }else{
        if(data[0].proprietario === req.userEmail){
            await supabase
            .from('grupo')
            .delete()
            .eq('id', req.params.id);
            return res.status(204).json();
        }
    }
    
    return res.status(401).json()
});

app.get("/grupos/detalhes/:id", decodeJwt,  async(req, res)=> {
    const {data, error} = await supabase.from('grupo').select('detalhe').eq('id', req.params.id);
    if(error  || data.length <= 0){
        return res.status(404).json(response(false, "Detalhes do grupo não encontrados."))
    }
    return res.status(200).json(response(true, data));
});

app.patch("/grupos/editar/:id", grupoEditarValidador ,decodeJwt, async(req,res)=> {
    const errors = validationResult(req);
    if(errors.isEmpty()){
        const {data, error} = await supabase.from('grupo').select('proprietario').eq('id', req.params.id);
        const {foto_perfil, nome, detalhe} = req.body;
        if(error || data.length <= 0){
            return res.status(404).json(response(false, "Grupo não encontrado."));
        }else{
            if(data[0].proprietario === req.userEmail){
            await supabase
                .from('grupo')
                .update({ foto_perfil, nome, detalhe })
                .eq('id', req.params.id)
                .select();
                return res.status(200).json(response(true, "Editado com sucesso!"));
            }
        }
    }
    
    
    return res.status(400).json(response(false, "Informe os campos."));
});

export default app;