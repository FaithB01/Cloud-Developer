import { Router, Request, Response } from 'express';
import { filterImageFromURL, LocalContext, deleteLocalFiles } from '../../util/util';
import { validateImageUrl, deleteTempFiles } from './image.middleware';

const router: Router = Router();

router.use(deleteTempFiles)

router.get('/', validateImageUrl, async (req: Request, res: Response) => {
    let { image_url } = req.query;
    let filtered_image_path = await filterImageFromURL(image_url);
    res.locals = new LocalContext(filtered_image_path);
    res.sendFile(filtered_image_path);
});

export const ImageRouter: Router = router;