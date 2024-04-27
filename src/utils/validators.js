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
