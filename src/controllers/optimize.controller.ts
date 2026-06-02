import { type Request, type Response } from 'express';
import gltfOptimizerService from '../services/gltf-optimizer.service.ts'

export default {
    async uploadFile(req: Request, res: Response): Promise<UploadFile>{
        const file = req.file;

        if (!file) {
            throw new Error("No file uploaded")
        }
        if (!file.originalname.match(/\.(glb)$/i)) {
            throw new Error("Only .glb files are supported")
        }
        if(file.size>104857600)
            throw new Error("The size limit is 100MB")

        console.log({
            name: file.originalname,
            size: file.size,
        });

        const optimized = await gltfOptimizerService.compressGLBWithDraco(toArrayBufferCopy(file.buffer))

        const reduction =  ((file.size - Buffer.from(optimized).length) / file.size) * 100;
        console.log(reduction);
        const base64String = Buffer.from(optimized).toString('base64')

        const blob = new Blob([ Buffer.from(optimized)], { type: 'application/octet-stream' });

        const form = new FormData();

        form.append('files[]', blob, file.originalname); 

        const response = await fetch('https://uguu.se/upload', {
            method: 'POST',
            body: form,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        const data = await response.json();

        return {
            bufferData: base64String,
            filename: file.originalname,
            urlFile: data.files[0].url,
            originalSize: (file.size/1024).toFixed(2),
            finalSize: (Buffer.from(optimized).length/1024).toFixed(2),
            reduction:reduction.toFixed(2),
            mimeType: "model/gltf-binary"
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
    urlFile: string;
    originalSize: string;
    finalSize: string;
    reduction: string;
    mimeType: string;
}
