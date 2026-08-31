import { Router, type IRouter } from "express";
import healthRouter from "./health";
import roomflashRouter from "./roomflash";

const router: IRouter = Router();

router.use(healthRouter);
router.use(roomflashRouter);

export default router;
