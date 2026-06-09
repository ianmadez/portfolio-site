(function () {
    let mountEl = null;
    let renderer = null;
    let scene = null;
    let camera = null;
    let animationFrame = null;
    let orbGroup = null;

    function createGlowTexture() {
        const canvas = document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext("2d");
        const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        g.addColorStop(0, "rgba(255,255,255,1)");
        g.addColorStop(0.2, "rgba(180,220,255,0.8)");
        g.addColorStop(0.5, "rgba(100,150,255,0.2)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 64, 64);
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    function initVersionScene(mount) {
        if (!mount) return;
        mountEl = mount;

        const canvas = document.getElementById('version-canvas');
        if (!canvas) return;

        scene = new THREE.Scene();
        
        // Setup Camera
        camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 0, 8);

        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

        orbGroup = new THREE.Group();
        // Move the invisible globe to the left side of the screen
        orbGroup.position.set(-2.5, 0, 0); 
        scene.add(orbGroup);

        const glowTexture = createGlowTexture();
        const material = new THREE.SpriteMaterial({
            map: glowTexture,
            color: 0xffffff,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0.9
        });

        // Generate 7 orbs wrapped around an invisible sphere
        for (let i = 0; i < 7; i++) {
            const sprite = new THREE.Sprite(material);
            sprite.scale.set(0.4, 0.4, 0.4);
            
            // Math to distribute them in a tilted ring
            const angle = (i / 7) * Math.PI * 2;
            const radius = 1.6;
            sprite.position.x = Math.cos(angle) * radius;
            sprite.position.y = Math.sin(angle) * radius;
            // Add slight Z-depth so they cross in front/behind each other
            sprite.position.z = Math.sin(angle * 2) * 0.5; 
            
            orbGroup.add(sprite);
        }

        // Give the globe an initial tilt
        orbGroup.rotation.x = 1.2;
        orbGroup.rotation.y = 0.5;

        window.addEventListener('resize', resize);
        animate();
    }

    function resize() {
        if (!renderer || !camera) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        if (!renderer || !scene || !camera) return;
        
        const time = performance.now() * 0.001;

        // Spin the entire globe
        orbGroup.rotation.z = time * 0.8; 
        
        // Subtle 3D wobble
        orbGroup.rotation.x = 1.2 + Math.sin(time * 0.5) * 0.1;

        // Make individual orbs pulse slightly
        orbGroup.children.forEach((orb, i) => {
            const scale = 0.35 + (Math.sin(time * 3 + i) * 0.1);
            orb.scale.set(scale, scale, scale);
        });

        renderer.render(scene, camera);
        animationFrame = requestAnimationFrame(animate);
    }

    window.initVersionScene = initVersionScene;
    
    window.disposeVersionScene = function() {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        window.removeEventListener('resize', resize);
        renderer = null;
        scene = null;
        camera = null;
        orbGroup = null;
    };
})();