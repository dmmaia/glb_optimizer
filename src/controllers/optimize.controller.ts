import { type Request, type Response } from 'express';
import gltfOptimizerService from '../services/gltf-optimizer.service.ts'

export default {
    async uploadFile(req: Request, res: Response): Promise<UploadFile>{
        const file = req.file;

        if (!file) {
            throw new Error("No file uploaded")
        }
        if (!file.originalname.match(/\.(glb|gltf)$/i)) {
            throw new Error("Only .glb and .gltf files are supported")
        }

        console.log({
            name: file.originalname,
            size: file.size,
        });

        const optimized = await gltfOptimizerService.compressGLBWithDraco(toArrayBufferCopy(file.buffer))

        const reduction =  ((file.size - Buffer.from(optimized).length) / file.size) * 100;
        console.log(reduction);
        const base64String = Buffer.from(optimized).toString('base64')

        return {
            bufferData: base64String,
            filename: file.originalname,
            originalSize: (file.size/1024).toFixed(2),
            finalSize: (Buffer.from(optimized).length/1024).toFixed(2),
            reduction:reduction.toFixed(2),
            mimeType: file.mimetype
        }

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

interface UploadFile {
    bufferData: any;
    filename: string;
    originalSize: string;
    finalSize: string;
    reduction: string;
    mimeType: string;
}
