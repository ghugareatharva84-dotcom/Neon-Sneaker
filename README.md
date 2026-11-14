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

## 🚀 How to Run Locally

You have multiple easy options:

### Option 1: Using Node.js (Zero Dependencies)
You don't even need `npm install`! Just run:

```bash
node server.js
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

*(Or run `npm start`)*

---

### Option 2: Using VS Code Live Server
1. Open this folder in **VS Code**.
2. Right-click `index.html` and click **"Open with Live Server"**.

---

### Option 3: Using Python
If you have Python installed:
```bash
python -m http.server 3000
```
Then open [http://localhost:3000](http://localhost:3000).

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

## 🌐 How to Upload to GitHub and Host Free on GitHub Pages

### Step 1: Push to GitHub using Git CLI

1. Open your terminal inside this folder:
```bash
git init
git add .
git commit -m "Initial commit: Neon Sneaker Store 3D"
```

2. Create a new repository on [GitHub](https://github.com/new).

3. Link and push your repository:
```bash
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

---

### Step 2: Enable GitHub Pages (Free Live Website Hosting)

1. Go to your repository on GitHub.
2. Click **Settings** (top tabs) ➔ **Pages** (left sidebar).
3. Under **Branch**, select `main` and keep the folder as `/ (root)`.
4. Click **Save**.
5. Wait 1-2 minutes, and your site will be live at:
   `https://<your-username>.github.io/<your-repo-name>/`

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
