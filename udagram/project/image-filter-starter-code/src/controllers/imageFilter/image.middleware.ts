import { Request, Response, NextFunction } from 'express';
import { LocalContext, deleteLocalFiles } from '../../util/util'
import axios from 'axios';

// @TODO
// Validate if the request contains a image url and if this url does exists.
export async function validateImageUrl(req: Request, res: Response, next: NextFunction) {
    let { image_url } = req.query;

    if (!image_url) {
        res.status(400).send({ "error": "image_url is required." });
        return
    }
    
    //verifying if the url does exist
    try{
        await axios.head(image_url)
        next();
    }catch(error){
        console.error("Error on try to get image:", error);
        res.status(400).send({ "error": `The image url ${image_url} does not exist or it is invalid.`});
        return
    }
}

// Delete Temp Files on request finished
export function deleteTempFiles(req: Request, res: Response, next: NextFunction) {
    res.on('finish', async () => {

        if (res.statusCode != 200) {
            return
        }
        let ctx = res.locals as LocalContext;
        if (!ctx.filePath) {
            console.log("Could not delete temp files");
            return;
        }
        await deleteLocalFiles([ctx.filePath]);
    })
    return next();
}