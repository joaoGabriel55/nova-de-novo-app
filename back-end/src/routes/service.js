import { Router } from 'express';
import ServiceController from "../controllers/ServiceController";
const router = Router();

router.get('/', ServiceController.index)
router.get('/:id', ServiceController.findById)
// router.post('/', ServiceController.store)
// router.patch('/:id', ServiceController.update)
router.delete('/:id', ServiceController.destroy)

export default router;
