import { Router } from 'express';
import ServiceOrderController from "../controllers/ServiceOrderController";
const router = Router();

router.get('/', ServiceOrderController.index)
router.get('/customer/:id', ServiceOrderController.findByCustomerId)
router.get('/dressmaker/:id', ServiceOrderController.findByDressMakerId)
router.get('/customer/:customerId/dressmaker/:dressmakerId', ServiceOrderController.findByCustomerAndDressmakerId)

router.get('/:id', ServiceOrderController.findById)
router.get('/:id/customer/:customerId', ServiceOrderController.findByIdAndCustomerId)
router.get('/:id/dressmaker/:dressmakerId', ServiceOrderController.findByIdAndDressmakerId)
router.get('/:id/customer/:customerId/dressmaker/:dressmakerId', ServiceOrderController.findByIdAndCustomerAndDressmakerId)

router.post('/', ServiceOrderController.store)
router.patch('/:id', ServiceOrderController.update)
router.delete('/:id', ServiceOrderController.destroy)

export default router;
