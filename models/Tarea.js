import mongoose from 'mongoose';

const tareasSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    prioridad: {
        type: String,
        required: true,
        enum: ["Baja", "Media", "Alta"],
    },
    descripcion: {
        type: String,
        required: true,
        trim: true,
    },
    estado: {
      type: Boolean,
      default: false  
    },
    fechaEntrega: {
        type: Date,
        required: true,
        default: Date.now()
    },
    proyecto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proyecto'
    },
    completado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }
}, {
    timestamps: true
});
const Tarea = mongoose.model('Tarea', tareasSchema);
export default Tarea;