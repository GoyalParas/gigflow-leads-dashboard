import { Router } from 'express';
import * as leadController from '../controllers/lead.controller';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createLeadSchema, updateLeadSchema, leadQuerySchema } from '../validators/lead.validator';

const router = Router();

router.use(protect);

router.get('/', validate(leadQuerySchema), leadController.getLeads);
router.post('/', validate(createLeadSchema), leadController.createLead);
router.get('/export', validate(leadQuerySchema), leadController.exportLeads);

router.get('/:id', leadController.getLeadById);
router.put('/:id', validate(updateLeadSchema), leadController.updateLead);
router.delete('/:id', authorize('admin'), leadController.deleteLead);

export default router;
