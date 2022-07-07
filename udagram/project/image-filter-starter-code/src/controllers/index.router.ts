import { Router, Request, Response } from 'express';
import { ImageRouter } from './imageFilter/image.router';

const router: Router = Router();

// @TODO
// GET /filteredimage
router.use('/filteredimage', ImageRouter);

export const IndexRouter: Router = router;