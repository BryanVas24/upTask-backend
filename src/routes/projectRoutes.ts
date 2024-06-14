import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
//el param es para tomar el id de un registro de mongo
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
const router = Router();
//cuando hagan post a la ruta api/projects
router.post(
  "/",
  //acá se valida con express-validator
  body("ProjectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La descripción del proyecto es obligatorio"),
  //esto viene de middleware y verifica que no exista ningun mensaje de error
  handleInputErrors,
  //aca se manda a llamar la funcion que hace el envio de datos
  ProjectController.createProject
);
//cuando hagan get a la ruta api/projects
router.get("/", ProjectController.getAllProjects);
//cuando hagan una busqueda por id a la ruta api/projects
router.get(
  "/:id",
  param("id").isMongoId().withMessage("id no válido"),
  //aca se manda a llamar la funcion que hace el get del proyecto dependiendo del id
  ProjectController.getOneProject
);
//cuando hagan un put la ruta api/projects
router.put(
  "/:id",
  //esto es para ver si el id es de mongo
  param("id").isMongoId().withMessage("id no válido"),
  //la validación con express-validator
  body("ProjectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La descripción del proyecto es obligatorio"),
  //esto viene de middleware y verifica que no exista ningun mensaje de error
  handleInputErrors,

  ProjectController.updateProject
);
//cuando quieran hacer un delete a la ruta api/projects
router.delete(
  "/:id",
  param("id").isMongoId().withMessage("id no válido"),
  ProjectController.deleteProject
);

/*ACA ESTAN LAS RUTAS DE LAS TAREAS*/
router.post("/:projectId/tasks", TaskController.createProject);

export default router;
