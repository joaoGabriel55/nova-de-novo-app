import { Router } from 'express';
import DressmakerController from "../controllers/DressmakerController";
const router = Router();

router.get('/', DressmakerController.index)
router.get('/:id', DressmakerController.findById)
router.post('/', DressmakerController.store)
router.patch('/:id', DressmakerController.update)
router.delete('/:id', DressmakerController.destroy)

export default router;
