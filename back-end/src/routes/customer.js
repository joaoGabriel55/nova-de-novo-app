import { Router } from 'express';
import CustomerController from "../controllers/CustomerController";
const router = Router();

router.get('/', CustomerController.index)
router.get('/:id', CustomerController.findById)
router.post('/', CustomerController.store)
router.patch('/:id', CustomerController.update)
router.delete('/:id', CustomerController.destroy)

export default router;
