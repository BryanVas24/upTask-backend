import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
//el param es para tomar el id de un registro de mongo
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExist } from "../middleware/project";
import {
  hasAuthorization,
  taskBelongsToProject,
  validateTaskExist,
} from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamController } from "../controllers/TeamController";
const router = Router();
//proteje todos los endpoints que usen el router
router.use(authenticate);
//cuando hagan post a la ruta api/projects
router.post(
  "/",

  //acá se valida con express-validator
  body("projectName")
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
  handleInputErrors,
  //aca se manda a llamar la funcion que hace el get del proyecto dependiendo del id
  ProjectController.getOneProject
);
//cuando hagan un put la ruta api/projects
router.put(
  "/:id",
  //esto es para ver si el id es de mongo
  param("id").isMongoId().withMessage("id no válido"),
  //la validación con express-validator
  body("projectName")
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
/*-----RUTAS PARA EQUIPO ----- */
router.get("/:projectId/team", TeamController.getTeamMembers);

router.post("/:projectId/team/find", TeamController.findMemberbyEmail);
router.post(
  "/:projectId/team",
  body("id").isMongoId().withMessage("Id no valido"),
  handleInputErrors,
  TeamController.AddMemberById
);
router.delete(
  "/:projectId/team/:userId",
  param("userId").isMongoId().withMessage("Id no valido"),
  handleInputErrors,
  TeamController.RemoveMemberById
);
/*-----------------ACA ESTAN LAS RUTAS DE LAS TAREAS--------------------*/

//recibe un valor en la url y que hacer con el cada vez que una url lo tenga
router.param("projectId", validateProjectExist);
//si te fijas solo podes ir poniendo un callback a la vez, se ejecutan en ese orden
router.param("taskId", validateTaskExist);
router.param("taskId", taskBelongsToProject);

router.post(
  "/:projectId/tasks",
  hasAuthorization,
  //siempre validando con express validator
  body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La descripción de la tarea es obligatorio"),
  //esto viene de middleware y verifica que no exista ningun mensaje de error
  handleInputErrors,
  TaskController.createTask
);

router.get("/:projectId/tasks", TaskController.getProjectTask);

router.get(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("id no válido"),
  TaskController.getTaskById
);
router.put(
  "/:projectId/tasks/:taskId",
  hasAuthorization,
  param("taskId").isMongoId().withMessage("id no válido"),
  body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La descripción de la tarea es obligatorio"),
  handleInputErrors,
  TaskController.updateTask
);
router.delete(
  "/:projectId/tasks/:taskId",
  hasAuthorization,
  param("taskId").isMongoId().withMessage("id no válido"),
  handleInputErrors,
  TaskController.deleteTask
);
router.post(
  "/:projectId/tasks/:taskId/status",
  param("taskId").isMongoId().withMessage("id no válido"),
  body("status").notEmpty().withMessage("El estado es obligatorio"),
  handleInputErrors,
  TaskController.updateStatus
);
/*---------------NOTAS--------------- */
router.post(
  "/:projectId/tasks/:taskId/notes",
  body("content")
    .notEmpty()
    .withMessage("El contenido de la nota es obligatorio"),
  handleInputErrors
);
export default router;
