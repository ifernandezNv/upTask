import Usuario from '../models/Usuario.js';
import generarId from '../helpers/generarId.js';
import generarJWT from '../helpers/generarJWT.js';

import {emailRegistro, olvidePassword} from '../helpers/emails.js';

const registrarUsuarios = async (req, res) =>{
    //Evitar registros duplicados
    const {email} = req.body;
    const existeUsuario = await Usuario.findOne({
        email
    });
    if(existeUsuario){
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message});
    }
    try {
        const usuario = new Usuario(req.body);
        usuario.token = generarId();
        await usuario.save();
        
        // Enviar el email de confirmación
        emailRegistro({
            nombre: usuario.nombre,
            token: usuario.token,
            email: usuario.email,
        });
        res.json({msg: 'Usuario Creado Correctamente, Revisa tu email para confirmar tu cuenta'}); 
    } catch (error) {
        console.log(error);    
    }
}

const autenticar = async (req, res)=>{
    const {email, password} = req.body;
    // Comprobar si el usuario existe
    const usuario = await Usuario.findOne({ email });
    if(!usuario){
        const error = new Error('El Usuario no existe');
        return res.status(404).json({msg: error.message});
    }

    // Comprobar si el usuario está confirmado
    const {confirmado} = usuario;
    if(!confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({msg: error.message});
    }
    // Comprobar el password
    if(await usuario.comprobarPassword(password)){
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })
    }else{
        const error = new Error('Password incorrecto');
        return res.status(403).json({msg: error.message});
    }
    
}
const confirmar = async (req, res) => {
    const {token} = req.params;
    const usuarioConfirmar = await Usuario.findOne({token});
    if(!usuarioConfirmar){
        const error = new Error('Token no válido');
        return res.status(403).json({msg: error.message});
    }
    try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = '';
        await usuarioConfirmar.save();
        res.json({msg: 'Usuario Confirmado Correctamente'});
        
    } catch (error) {
        console.log(error);
    }
}

const resetPassword = async (req, res) => {
    const {email} = req.body;
    const usuario = await Usuario.findOne({ email });
    if(!usuario){
        const error = new Error('El Usuario no existe');
        return res.status(404).json({msg: error.message});
    }
    try {
        usuario.token = generarId();
        await usuario.save();
        // Enviar email
        olvidePassword({
            nombre: usuario.nombre,
            email: usuario.email,
            token: usuario.token,
        })
        res.json({msg: 'Se envió un email con las instrucciones para reiniciar tu contraseña'});
    } catch (error) {
        console.log(error);
    }
    
}
const comprobarToken = async (req, res)=>{
    const {token} = req.params;    
    const usuario = await Usuario.findOne({token});
    if(!usuario){
        const error = new Error('Token no válido');
        return res.status(404).json({msg: error.message})
    }
    return res.status(200).json({msg: 'Token válido'});
}

const nuevoPassword = async (req, res) => {
    const {token} = req.params;
    const {password} = req.body;
    const usuario = await Usuario.findOne({token});
    if(!usuario){
        const error = new Error('Token no válido');
        return res.status(404).json({msg: error.message})
    }
    usuario.password = password;
    usuario.token = '';
    try {
        await usuario.save();
        res.json({msg: 'Contraseña Reseteada Correctamente'})   
    } catch (error) {
        console.log(error);
    }
}

const perfil = async (req, res) => {
    const {usuario} = req;
    res.json(usuario);
}
export { 
    registrarUsuarios,
    autenticar,
    confirmar,
    resetPassword,
    comprobarToken,
    nuevoPassword,
    perfil
}