import { type Request, type Response } from 'express';
import gltfOptimizerService from '../services/gltf-optimizer.service.ts'
import { writeFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path'

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

        const {optimized, numberOfTextures} = await gltfOptimizerService.compressGLBWithDraco(toArrayBufferCopy(file.buffer))

        const reduction =  ((file.size - Buffer.from(optimized).length) / file.size) * 100;
        console.log(reduction);
        const base64String = Buffer.from(optimized).toString('base64')

        const file_name = crypto.randomUUID()+path.extname(file.originalname)

        const file_path = "tmp/optimized_files/"
        await mkdir(file_path, { recursive: true });
        await writeFile(file_path+file_name, Buffer.from(optimized));

        setTimeout(()=>{
            rm(file_path+file_name,{force:true})
        }, 900000)

        return {
            bufferData: base64String,
            filename: file.originalname,
            urlFile: "/download/"+file_name,
            originalSize: (file.size/1024).toFixed(2),
            finalSize: (Buffer.from(optimized).length/1024).toFixed(2),
            reduction:reduction.toFixed(2),
            mimeType: "model/gltf-binary",
            numberOfTextures
        }

    },

    async downloadFile(req: Request, res: Response){
        const filename = req.params.id+"";
        if(!filename)
            return res.status(400).send("File ID is required");

        const filePath = path.join(process.cwd()+"/tmp/optimized_files/", filename)

        if(!existsSync(filePath)){
            return res.status(404).send("File not found or expired")
        }

        res.download(filePath, filename, (err) => {
            if(err){
                return res.status(500).send("Could nod complete download.")
            }
        })
    }
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
    numberOfTextures: number;
}
