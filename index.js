// Import de las dependencias
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

//Conexión a la base de datos
import conectarDB from './config/db.js';

//Import de las rutas 
import usuarioRoutes from './routes/usuarioRoutes.js';
import proyectoRoutes from './routes/proyectoRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js';

const app = express();

app.use(express.json());

dotenv.config();

conectarDB();

// Lista de dominios permitidos
const whiteList = [process.env.FRONTEND_URL];

// Configurar CORS
const corsOptions = {
    origin: function(origin, callback){
        if(whiteList.includes(origin)){
            // Puede consultar la API
            callback(null, true);
        }else{
            // El origen del request no está dentro de la whitelist y no puede acceder a la API
            callback(new Error('Error de CORS'));
        }
    }
}

app.use(cors(corsOptions));

// Routing
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/tareas', tareaRoutes);

const PORT = process.env.PORT || 4000;
const servidor =  app.listen(PORT, ()=>{
    console.log(`Servidor creado en el puerto ${PORT}`);
})

// Socket.io
import {Server} from 'socket.io';
const io = new Server(servidor, {
    pingTimeout: 60000,
    cors:{
        origin: process.env.FRONTEND_URL
    },
});
io.on('connection', (socket)=>{
    console.log('Conectado a soket.io');
    // Definir los eventos de socket.io
    socket.on('abrir proyecto', (proyecto)=>{
        socket.join(proyecto);
    });
    socket.on('nueva tarea', tarea => {
        const proyecto = tarea.proyecto;
        socket.to(proyecto).emit('tarea agregada', tarea)
    });
    socket.on('eliminar tarea', tarea => {
        const proyecto = tarea.proyecto;
        socket.to(proyecto).emit('tarea eliminada', tarea);
    });
    socket.on('cambiar estado', tarea =>{
        const proyecto = tarea.proyecto._id;
        socket.to(proyecto).emit('nuevo estado', tarea);
    })
    
})