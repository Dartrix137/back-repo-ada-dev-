import { ProjectModel } from "./proyecto.js";
import { UserModel } from "../usuario/usuario.js";

const resolversProyecto = {
  Query: {
    //Historia de usuario: HU_006 y HU_019

    //Query para pedir los proyectos registrados
    Proyectos: async (parent, args) => {    
      const proyectos = await ProjectModel.find()
        .populate({
          path: 'avances',
          populate:({
            path: 'creadoPor'
          })
        })
        .populate({
          path: 'inscripciones',
          populate:({
            path: 'estudiante'
          })
        })
        .populate('lider')
      return proyectos; 
    },
 //Historia de usuario: HU_013 y HU_017

    ProyectosLiderados: async(parent, args)=>{   
      
      const proyectosLiderados = await ProjectModel.find({'lider':args.idLider})
      .populate({
        path: 'avances',
        populate:({
          path: 'creadoPor'
        })
      })
      .populate('lider');
      return proyectosLiderados;
    }
  },

  Mutation: {
    //Historia de usuario: HU_012  

    crearProyecto: async (parent, args) => {   
      const proyectoCreado = await ProjectModel.create({
      nombre: args.nombre,
      estado: args.estado,
      fase: args.fase,
      fechaInicio: args.fechaInicio,
      presupuesto: args.presupuesto,
      lider: args.lider,
      objetivos: args.objetivos,
      });
      return proyectoCreado;
    },

     //Historia de usuario: HU_007, HU_008 y HU_009 

    editarProyectoAdmin: async(parent, args)=>{  
      const buscarProyecto = await ProjectModel.findById(
        args._id);
      if(buscarProyecto.fase === "TERMINADO"){
        return null;
      }
      else if(buscarProyecto.estado === "INACTIVO" && buscarProyecto.fase === "NULO" ){
        const proyectoEditado = await ProjectModel.findByIdAndUpdate(
          args._id,
          {
            estado: "ACTIVO",
            fase: "INICIADO",
            fechaInicio:new Date(),
          }, 
          {new:true});
        return proyectoEditado;
      }
      else if (buscarProyecto.fase ==="DESARROLLO"){
        const proyectoEditado = await ProjectModel.findByIdAndUpdate(
          args._id,
          {
            fase: args.fase,
            fechaFin: new Date(),
          }, 
          {new:true});
        return proyectoEditado;
      }
      else{
        const proyectoEditado = await ProjectModel.findByIdAndUpdate(
          args._id,
          {
            estado: args.estado,
          }, 
          {new:true});
        return proyectoEditado;
      }
    },
     //Historia de usuario: HU_014
     
    editarProyectoLider: async(parent, args)=>{  
      const buscarProyecto = await ProjectModel.findById(
        args._id);
      if(buscarProyecto.fase === "TERMINADO"){
        return null;
      }else if(buscarProyecto.estado === "ACTIVO"){
        const proyectoEditado = await ProjectModel.findByIdAndUpdate(
          args._id,
          {
            nombre: args.nombre,
            presupuesto:args.presupuesto,
            $set:{
              [`objetivos.${args.indexObjetivo}.descripcion`]: args.campos.descripcion,
              [`objetivos.${args.indexObjetivo}.tipo`]: args.campos.tipo
            }
          }, 
          {new:true});
        return proyectoEditado;
      }
    },
    crearObjetivo: async(parent, args)=>{
      const proyectoConObjetivo = await ProjectModel.findByIdAndUpdate(args.idProyecto,{
        $addToSet:{
          objetivos:{...args.campos},
        },
      }, {new:true});

      return proyectoConObjetivo;
    },
    eliminarProyecto: async(parent, args) => {
      const proyectoEliminada = await ProjectModel.findByIdAndDelete(args._id);
      return proyectoEliminada;
   },
  
    editarObjetivo: async(parent, args)=>{
      const proyectoEditado= await ProjectModel.findByIdAndUpdate(args.idProyecto, {
        $set:{
          [`objetivos.${args.indexObjetivo}.descripcion`]: args.campos.descripcion,
          [`objetivos.${args.indexObjetivo}.tipo`]: args.campos.tipo
        }
      }, {new:true});

      return proyectoEditado;

    },
    eliminarObjetivo: async(parent, args)=>{
      const proyectoObjetivo = await ProjectModel.findByIdAndUpdate(
        {_id: args.idProyecto},
        {
          $pull:{
            objetivos:{
              _id:args.idObjetivo,
            },
          },
        },
        { new: true }
      );
      return proyectoObjetivo;
    }
  },
};

export { resolversProyecto };
