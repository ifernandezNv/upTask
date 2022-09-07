import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
const checkAuth = async (req, res, next) => {
    let token = '';
    if(req.headers.authorization &&  req.headers.authorization.startsWith('Bearer') ){
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const {id} = decoded;
            req.usuario = await Usuario.findById(id).select('-password -confirmado -token -createdAt -updatedAt -__v');
            return next();
        } catch (error) {
            return res.status(404).json({msg: 'Hubo un error'})
        }   
    }else{
        const error = new Error('Token no válido');
        return res.status(404).json({msg: error.message});
    }
    next();
}
export default checkAuth;
