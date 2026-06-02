## GLB/GLTF Optimizer API

A lightweight MVC for optimizing .glb and .gltf 3D models using Draco compression and texture optimization techniques.(Supports .glb files only. GLTF support is planned.)

Built with Express.js, TypeScript and glTF Transform.

Features
- Draco mesh compression
- GLB upload support
- Binary-safe processing pipeline
- Significant geometry size reduction
- Texture compression and resize
- Simple REST API
- Simple Front-end

Current Results

| Model         |  Type          | Original Size    | Optimized Size | Reduction |
|:--------------|:--------------:|-----------------:|:--------------:|----------:|
| Simple mesh   | (no textures)  | 11 KB            | 2 KB           | ~81%      |
| Character     |  with textures | 273 KB           | 103.82 KB      | ~62%      |

Results vary depending on geometry complexity and texture usage.

Tech Stack
- Node.js
- Express.js
- TypeScript
- glTF Transform
- Draco 3D Compression
- Sharp Texture Compression
- EJS Front-end
