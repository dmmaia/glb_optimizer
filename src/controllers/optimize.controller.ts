import { type Request, type Response } from 'express';
import gltfOptimizerService from '../services/gltf-optimizer.service.ts'

export default {
    async uploadFile(req: Request, res: Response){
        const file = req.file;

        if (!file) {
            return res.status(400).send("No file uploaded");
        }

        console.log({
            name: file.originalname,
            mime: file.mimetype,
            size: file.size,
        });

        res.contentType(file.mimetype);
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${file.originalname}"`
        );

        const optimized = await gltfOptimizerService.compressGLBWithDraco(toArrayBufferCopy(file.buffer))

        const reduction =  ((file.size - Buffer.from(optimized).length) / file.size) * 100;
        console.log(reduction);

        return res.send(Buffer.from(optimized));

    },
}

function toArrayBufferCopy(buf: Buffer): ArrayBuffer {
    const ab = new ArrayBuffer(buf.length);
        const view = new Uint8Array(ab);
        for (let i = 0; i < buf.length; ++i) {
            view[i] = buf[i]!;
        }
        return ab;
}
