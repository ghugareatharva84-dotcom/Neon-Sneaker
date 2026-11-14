# 👟 Neon Sneaker Store — Next-Gen 3D Footwear Experience

An interactive 3D e-commerce showcase built with **Three.js**, **GLTF/GLB models**, and modern vanilla JavaScript. Features realistic 3D sneaker models with 360° interactive rotation, dynamic lighting, custom UI effects, audio feedback, cart, and authentication.

---

## 🌟 Key Features

- **Realistic 3D GLB Models**: Interactive Air Jordan 1 High and Adidas Racer TR21 3D silhouettes.
- **Interactive 3D Stage**: 360° orbital drag rotation, mouse parallax, auto-spin idle mode, and zoom controls.
- **Glassmorphism UI**: High-contrast cyberpunk golden neon styling with custom glowing cursor.
- **Client-Side Auth & Cart**: Persistent cart, saved wishlist, and user account management using `localStorage`.
- **Zero Build Tools Needed**: Fully client-side with CDN import maps — ready for GitHub Pages out of the box!
- **Zero-Dependency Local Server**: Built-in `server.js` using native Node.js HTTP (no `npm install` needed).

---

## 📂 Project Structure

```
neon-sneaker-store/
├── .gitignore              # Ignores node_modules, temp and OS files
├── index.html              # Main single-page application entrypoint
├── package.json            # Node project configuration
├── README.md               # Documentation and guides
├── server.js               # Lightweight Node.js local preview server
├── js/
│   └── app.js              # Application logic, Three.js canvas & store state
└── models/
    ├── adidas_racer.glb    # Adidas Racer TR21 3D model
    └── jordan.glb          # Air Jordan 1 High 3D model
```

---



## 🛠️ Built With
- **Three.js** (WebGL 3D Rendering)
- **GLTFLoader** & **OrbitControls**
- **HTML5 / CSS3 / Vanilla JavaScript**
- **Google Fonts** (Outfit & Plus Jakarta Sans)

---

## 👤 Author
**Atharva Ghugare**  
- Email: [atharva.ghugare@vpt.edu.in](mailto:atharva.ghugare@vpt.edu.in)
- LinkedIn: [Atharva Ghugare](https://www.linkedin.com/in/atharva-ghugare-725a703b6)
