import { Router } from 'express';
import AuthUserController from "../controllers/AuthUserController";

const router = Router();

router.post('/login', AuthUserController.loginUser)
router.delete('/logout', AuthUserController.logout)
router.post('/token', AuthUserController.accessToken)

export default router;
