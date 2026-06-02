import { NodeIO } from '@gltf-transform/core';
import { KHRDracoMeshCompression } from '@gltf-transform/extensions';
import { draco } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import sharp from 'sharp'

const encoderModule = await draco3d.createEncoderModule();
const decoderModule = await draco3d.createDecoderModule();

export default {

  async compressGLBWithDraco(glbBuffer: ArrayBuffer): Promise<Uint8Array> {
   
    const io = new NodeIO().registerExtensions([KHRDracoMeshCompression]).registerDependencies({
      'draco3d.encoder': encoderModule,
      'draco3d.decoder': decoderModule
    });

    const document = await io.readBinary(new Uint8Array(glbBuffer));

    const textures = document.getRoot().listTextures()
    
    for(const texture of textures){
      const originalBuffer = texture.getImage()
      if(!originalBuffer) continue

      const optimizedBuffer = await sharp(originalBuffer)
        .resize({
          width: 1024,
          height: 1024,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({quality: 75})
        .toBuffer();

      texture.setImage(optimizedBuffer)
      texture.setMimeType('image/webp')
    }

    await document.transform(
      draco({
        method: 'edgebreaker',
        // level: 7,
      }),
    );

    return await io.writeBinary(document);
   }
}
