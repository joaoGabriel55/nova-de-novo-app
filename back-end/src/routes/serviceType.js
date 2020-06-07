import { Router } from 'express';
import ServiceTypeController from "../controllers/ServiceTypeController";
const router = Router();

router.get('/', ServiceTypeController.index)
router.get('/:id', ServiceTypeController.findById)
router.post('/', ServiceTypeController.store)
router.patch('/:id', ServiceTypeController.update)
router.delete('/:id', ServiceTypeController.destroy)

export default router;
