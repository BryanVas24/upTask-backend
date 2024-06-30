import { Router } from "express";
import { Request, Response } from "express";
const router = Router();

router.get("/", (req: Request, response: Response) => {
  response.send("desde auth");
});

export default router;
