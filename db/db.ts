import { connect } from 'mongoose';
<<<<<<< HEAD
// const { connect } = require('mongoose');
=======

>>>>>>> ebb7c19da056a957e596f1f156cba6a41f245011
const conectarBD = async () => {
  return await connect(process.env.DATABASE_URL)
    .then(() => {
      console.log('Conexion exitosa');
    })
    .catch((e) => {
      console.error('Error conectando a la bd', e);
    });
};

export default conectarBD;
