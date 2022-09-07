import nodemailer from 'nodemailer';

export const emailRegistro = async(datos)=>{
    const {email, nombre, token} = datos;
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });
    // Información del email
    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: 'UpTask - Confirma de Cuenta',
        text: 'Comprueba tu cuenta en UpTask',
        html: `
            <p>Hola: ${nombre} Comprueba tu cuenta en UpTask</p>
            <p>Tu cuenta ya está casi lista, solo debes comprobarla en el siguiente enlace: </p>
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
            <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
    });
}

export const olvidePassword = async(datos)=>{
    const {email, nombre, token} = datos;
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });
    // Información del email
    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: 'UpTask - Reestablece tu Password',
        text: 'Reestablece tu password',
        html: `
            <p>Hola: ${nombre} has solicitado reestablecer tu password</p>
            <p>Sigue el siguiente enlace para generar un nuevo password </p>
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>
            <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
    });
}
  
