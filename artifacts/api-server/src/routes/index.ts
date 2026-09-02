import { Router, type IRouter } from "express";
import healthRouter from "./health";
import roomflashRouter from "./roomflash";
import tenantRouter from "./tenantRoutes";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/tenant", tenantRouter);
router.use(roomflashRouter);

export default router;

