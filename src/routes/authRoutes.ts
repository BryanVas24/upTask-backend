import { Router } from "express";
import { body, param } from "express-validator";
import { AuthController } from "../controllers/authController";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post(
  "/create-account",
  body("name").notEmpty().withMessage("El nombre no puede estar vacio"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password es muy corto, minímo 8 caracteres"),
  body("email").isEmail().withMessage("El email debe ser valido"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Las contraseñas no coinciden");
    }
    return true;
  }),
  handleInputErrors,
  AuthController.createAccount
);
router.post(
  "/confirm-account",
  body("token").notEmpty().withMessage("El token no puede estar vacio"),
  handleInputErrors,
  AuthController.confirmAccount
);
router.post(
  "/login",
  body("password").notEmpty().withMessage("El password no puede ir vacio"),
  body("email").isEmail().withMessage("El email debe ser valido"),
  handleInputErrors,
  AuthController.login
);

router.post(
  "/request-code",
  body("email").isEmail().withMessage("email no valido"),
  handleInputErrors,
  AuthController.resendEmail
);
router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("email no valido"),
  handleInputErrors,
  AuthController.forgotPassword
);
router.post(
  "/validate-token",
  body("token").notEmpty().withMessage("El token no puede estar vacio"),
  handleInputErrors,
  AuthController.confirmTokenforpasswordChange
);

router.post(
  "/update-password/:token",
  param("token").isNumeric().withMessage("Token no válido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password es muy corto, minímo 8 caracteres"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Las contraseñas no coinciden");
    }
    return true;
  }),
  handleInputErrors,
  AuthController.passwordChangeWhitToken
);
router.get("/user", authenticate, AuthController.user);

/*-----PROFILE------- */
router.put(
  "/profile",
  authenticate,
  body("name").notEmpty().withMessage("El nombre no puede estar vacio"),
  body("email").isEmail().withMessage("El email debe ser valido"),
  handleInputErrors,
  AuthController.updateProfile
);
export default router;
