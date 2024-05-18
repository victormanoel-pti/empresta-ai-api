import { body } from "express-validator";


export const cadastroValidator = [
    body("nome").exists()
    .isAlpha()
    .not().isEmpty()
    .isLength({min: 3, max: 20}),
    body("sobrenome").exists()
    .isAlpha()
    .not().isEmpty()
    .isLength({min: 3, max: 20}),
    body("cidade").exists()
    .isAlpha()
    .not().isEmpty()
    .isLength({max: 20}),
    body("genero").exists()
    .isAlpha()
    .not().isEmpty(),
    body("email").exists()
    .not().isEmpty()
    .isEmail()
    .isLength({min: 3, max: 20}),
    body("senha").exists()
    .isString()
    .not().isEmpty()
    .isLength({min: 8, max: 20}).withMessage("Senha deve conter entre 8 e 20 caracteres."),
    body("amigos").exists()
    .isArray()
];


export const grupoValidador = [
    body("nome").exists()
    .not().isEmpty()
    .isLength({min: 3, max: 20})
];

export const grupoEditarValidador = [
    body("detalhe")
    .exists()
    .not().isEmpty(),
    body("nome")
    .exists()
    .not().isEmpty(),
    body("foto_perfil")
    .exists()
    .not().isEmpty()

]