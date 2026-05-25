## GLB/GLTF Optimizer API

A lightweight MVC for optimizing .glb and .gltf 3D models using Draco compression and texture optimization techniques.

Built with Express.js, TypeScript and glTF Transform.

Features
Draco mesh compression
GLB/GLTF upload support
Binary-safe processing pipeline
Significant geometry size reduction
Ready for future texture optimization
Simple REST API
Simple Front-end

Current Results

| Model         |  Type          | Original Size    | Optimized Size | Reduction |
|:--------------|:--------------:|-----------------:|:--------------:|----------:|
| Simple mesh   | (no textures)  | 11 KiB           | 2 KiB          | ~81%      |
| Character     |  with textures | 273 KiB          | 149.9 KiB      | ~45%      |

Results vary depending on geometry complexity and texture usage.

Tech Stack
- Node.js
- Express.js
- TypeScript
- glTF Transform
- Draco 3D Compression
- EJS Front-end
