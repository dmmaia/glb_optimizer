import { NodeIO } from '@gltf-transform/core';
import { KHRDracoMeshCompression } from '@gltf-transform/extensions';
import { draco } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';

const encoderModule = await draco3d.createEncoderModule();
const decoderModule = await draco3d.createDecoderModule();

export default {

  async compressGLBWithDraco(glbBuffer: ArrayBuffer): Promise<Uint8Array> {
   
    const io = new NodeIO().registerExtensions([KHRDracoMeshCompression]).registerDependencies({
      'draco3d.encoder': encoderModule,
      'draco3d.decoder': decoderModule
    });

    const document = await io.readBinary(new Uint8Array(glbBuffer));

    await document.transform(
      draco({
        method: 'edgebreaker',
        // level: 7,
      }),
    );

    return await io.writeBinary(document);
   }
}
