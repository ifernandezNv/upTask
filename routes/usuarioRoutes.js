import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
const router = express.Router();

import {registrarUsuarios, autenticar, confirmar, resetPassword, comprobarToken, nuevoPassword, perfil} from '../controllers/usuarioController.js';

// Autenticación, registro y confirmación de usuarios
router.post('/', registrarUsuarios);
router.post('/login', autenticar);
router.get('/confirmar/:token', confirmar);
router.post('/olvide-password', resetPassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

router.get('/perfil', checkAuth, perfil);


export default router