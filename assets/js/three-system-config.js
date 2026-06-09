(function () {
    let mountEl = null;
    let renderer = null;
    let scene = null;
    let camera = null;
    let animationFrame = null;

    let rootGroup = null;
    let structureGroup = null;
    let cubeGroup = null;
    let innerOrbGroup = null;
    let haloGroup = null;

    let cubes = [];
    let innerOrbs = [];
    let spokes = [];
    let activeCubeIndex = 0;

    let visible = false;
    let startedAt = 0;

    const CONFIG_ITEM_COUNT = 6;

    // Fixed layout: Forms a clean, sequential arc on the left side. 
    // Y-values strictly descend so pressing "down" visually moves down the list.
    const cubeSlots = [
        { pos: new THREE.Vector3(-2.0, 1.6, 0.1), rot: new THREE.Euler(0.4, -0.5, 0.2) },   // 0: Top
        { pos: new THREE.Vector3(-2.7, 1.0, 0.2), rot: new THREE.Euler(0.2, 0.6, -0.1) },   // 1: Upper-mid
        { pos: new THREE.Vector3(-3.0, 0.2, 0.3), rot: new THREE.Euler(-0.3, 0.4, 0.1) },   // 2: Middle
        { pos: new THREE.Vector3(-2.6, -0.6, 0.2), rot: new THREE.Euler(0.3, -0.3, -0.2) }, // 3: Lower-mid
        { pos: new THREE.Vector3(-1.8, -1.2, 0.1), rot: new THREE.Euler(-0.2, 0.5, 0.3) },  // 4: Bottom-mid
        { pos: new THREE.Vector3(-0.9, -1.5, 0.0), rot: new THREE.Euler(0.1, -0.4, -0.1) }, // 5: Bottom (Lifted to clear footer)
    ];

    // Simple top-to-bottom reveal
    const cubeRevealOrder = [0, 1, 2, 3, 4, 5];

    function createGlowTexture() {
        const canvas = document.createElement("canvas");
        canvas.width = 128;
        canvas.height = 128;

        const ctx = canvas.getContext("2d");
        const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        g.addColorStop(0, "rgba(255,255,255,1)");
        g.addColorStop(0.18, "rgba(210,245,255,0.95)");
        g.addColorStop(0.42, "rgba(90,185,255,0.34)");
        g.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 128, 128);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    function createGlassMaterial({
        color = 0x8ebdff,
        opacity = 0.34,
        emissive = 0x4b76d8,
        emissiveIntensity = 0.28,
        transmission = 0.38
    } = {}) {
        return new THREE.MeshPhysicalMaterial({
            color,
            transparent: true,
            opacity,
            roughness: 0.12,
            metalness: 0.02,
            transmission,
            thickness: 0.9,
            clearcoat: 1,
            clearcoatRoughness: 0.08,
            ior: 1.28,
            emissive,
            emissiveIntensity,
            depthWrite: false
        });
    }

    function createCoreAndHalos() {
        haloGroup = new THREE.Group();
        structureGroup.add(haloGroup);

        const core = new THREE.Mesh(
            new THREE.SphereGeometry(0.36, 32, 32),
            createGlassMaterial({
                color: 0x0f1633,
                opacity: 0.92,
                emissive: 0x4eb8ff,
                emissiveIntensity: 0.38,
                transmission: 0.22
            })
        );
        haloGroup.add(core);

        const innerGlow = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: createGlowTexture(),
                transparent: true,
                opacity: 0.82,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                color: 0xa8ecff
            })
        );
        innerGlow.scale.set(1.08, 1.08, 1.08);
        haloGroup.add(innerGlow);

        for (let i = 0; i < 3; i++) {
            const points = [];
            const radius = 0.66 + i * 0.14;
            for (let j = 0; j <= 80; j++) {
                const a = (j / 80) * Math.PI * 2;
                points.push(
                    new THREE.Vector3(
                        Math.cos(a) * radius,
                        Math.sin(a) * radius * (0.82 + i * 0.04),
                        0
                    )
                );
            }

            const line = new THREE.Line(
                new THREE.BufferGeometry().setFromPoints(points),
                new THREE.LineBasicMaterial({
                    color: i === 0 ? 0x81daff : 0x6aa5ff,
                    transparent: true,
                    opacity: i === 0 ? 0.22 : 0.12
                })
            );

            line.rotation.x = 0.85 + i * 0.14;
            line.rotation.y = -0.25 + i * 0.08;
            line.rotation.z = i * 0.62;
            haloGroup.add(line);
        }
    }

    function createSpokes() {
        const hexGeo = new THREE.CylinderGeometry(0.11, 0.11, 2.8, 6, 1, false);

        // Deep diamond blue / purple base colors
        const baseColors = [
            0x1a2b8c, 0x223aab, 0x1f349e, 0x2a44cc,
            0x18267a, 0x263ebf, 0x1c2e99, 0x2842c6,
            0x1a2b8c, 0x2b46d6, 0x1e31a1, 0x253db5
        ];

        const lengths = [2.8, 2.35, 2.0, 1.85, 2.55, 2.15, 1.95, 2.7, 2.1, 1.78, 2.45, 1.92];
        const innerRadius = 0.56;

        for (let i = 0; i < 12; i++) {
            const pivot = new THREE.Group();
            const angle = (i / 12) * Math.PI * 2;

            // Simple radial burst in the XY plane. 
            // We will rotate the entire structureGroup to get the 3D coin spin.
            pivot.rotation.z = angle;

            const material = createGlassMaterial({
                color: baseColors[i],
                opacity: 0.42,
                emissive: baseColors[i],
                emissiveIntensity: 0.35,
                transmission: 0.5
            });

            const spoke = new THREE.Mesh(hexGeo, material);
            const len = lengths[i];

            spoke.scale.set(1, len / 2.8, 1);
            spoke.position.y = innerRadius + len * 0.5;
            spoke.rotation.y = Math.PI / 6;

            pivot.add(spoke);
            structureGroup.add(pivot);

            spokes.push({
                mesh: spoke,
                baseColor: new THREE.Color(baseColors[i]),
                baseOpacity: material.opacity,
                phase: i * 0.42,
                len
            });
        }
    }

    function createInnerOrbs() {
        innerOrbGroup = new THREE.Group();
        structureGroup.add(innerOrbGroup);

        const glowTexture = createGlowTexture();

        for (let i = 0; i < 6; i++) {
            const sprite = new THREE.Sprite(
                new THREE.SpriteMaterial({
                    map: glowTexture,
                    color: 0xe8fbff,
                    transparent: true,
                    opacity: 0.82,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending
                })
            );

            sprite.scale.set(0.12, 0.12, 0.12);

            innerOrbGroup.add(sprite);
            innerOrbs.push({
                sprite,
                phase: (i / 6) * Math.PI * 2
            });
        }
    }

    function createCubes() {
        cubeGroup = new THREE.Group();
        rootGroup.add(cubeGroup);

        const cubeGeo = new THREE.BoxGeometry(0.54, 0.54, 0.54);
        const edgesGeo = new THREE.EdgesGeometry(cubeGeo);

        for (let i = 0; i < CONFIG_ITEM_COUNT; i++) {
            const slot = cubeSlots[i];

            // Inactive material: Smoky grey translucent
            const material = createGlassMaterial({
                color: 0x5a5c70,
                opacity: 0.25,
                emissive: 0x2a2c40,
                emissiveIntensity: 0.1,
                transmission: 0.5
            });

            const cube = new THREE.Mesh(cubeGeo, material);
            cube.position.copy(slot.pos);
            cube.rotation.copy(slot.rot);
            cube.scale.setScalar(0.001);
            cube.visible = false;

            const edgeLines = new THREE.LineSegments(
                edgesGeo,
                new THREE.LineBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.15
                })
            );
            cube.add(edgeLines);

            cube.userData = {
                basePosition: slot.pos.clone(),
                baseRotation: slot.rot.clone(),
                edgeLines,
                revealIndex: cubeRevealOrder.indexOf(i)
            };

            cubes.push(cube);
            cubeGroup.add(cube);
        }
    }

    function setupScene() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
        camera.position.set(0, 0, 8.2);

        renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setClearColor(0x000000, 0);

        if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) {
            renderer.outputColorSpace = THREE.SRGBColorSpace;
        }
        if ("toneMapping" in renderer && THREE.ACESFilmicToneMapping) {
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.05;
        }

        renderer.domElement.className = "system-config-three-canvas";
        mountEl.appendChild(renderer.domElement);

        const ambient = new THREE.AmbientLight(0xd6ddff, 1.4);
        scene.add(ambient);

        const keyLight = new THREE.PointLight(0x92d6ff, 2.8, 18);
        keyLight.position.set(-2.8, 1.2, 3.4);
        scene.add(keyLight);

        const rimLight = new THREE.PointLight(0x6e6cff, 1.5, 12);
        rimLight.position.set(-0.5, -1.5, 2.4);
        scene.add(rimLight);

        rootGroup = new THREE.Group();
        rootGroup.position.set(0.18, -0.08, 0);
        scene.add(rootGroup);

        structureGroup = new THREE.Group();
        structureGroup.position.set(-0.72, -0.12, -0.8); // Pushed back slightly for depth
        rootGroup.add(structureGroup);

        createCoreAndHalos();
        createSpokes();
        createInnerOrbs();
        createCubes();

        resize();
    }

    function resize() {
        if (!mountEl || !renderer || !camera) return;

        const rect = mountEl.getBoundingClientRect();
        const width = Math.max(1, rect.width);
        const height = Math.max(1, rect.height);

        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    function revealCubes(elapsed) {
        cubes.forEach((cube) => {
            const delay = 1.05 + cube.userData.revealIndex * 0.18;
            if (elapsed < delay) return;

            if (!cube.visible) cube.visible = true;

            const progress = Math.min(1, (elapsed - delay) / 0.72);
            const eased = 1 - Math.pow(1 - progress, 3);

            cube.scale.setScalar(0.86 * eased);
            cube.position.copy(cube.userData.basePosition);
            cube.position.y += (1 - eased) * 0.22;
        });
    }

    function updateSpokes(time) {
        // SPIN AXIS FIX: Upright coin spin
        // Rotates around its vertical Y axis, slightly faster.
        structureGroup.rotation.y = time * 0.18;
        structureGroup.rotation.x = 0.25 + Math.sin(time * 0.4) * 0.05;
        structureGroup.rotation.z = -0.1;

        spokes.forEach((spoke) => {
            const shimmer = 0.5 + 0.5 * Math.sin(time * 1.5 + spoke.phase);
            const brighten = 0.25 + shimmer * 0.25;

            const color = spoke.baseColor.clone().lerp(new THREE.Color(0xa7eeff), shimmer * 0.2);
            spoke.mesh.material.color.copy(color);
            spoke.mesh.material.emissive.copy(color);
            spoke.mesh.material.emissiveIntensity = brighten;
            spoke.mesh.material.opacity = 0.34 + shimmer * 0.15;
        });
    }

    function updateInnerOrbs(time) {
        innerOrbs.forEach((orb) => {
            // Increased speed for inner orbs
            const a = time * 1.2 + orb.phase;
            const radius = 0.45;

            orb.sprite.position.set(
                Math.cos(a) * radius,
                Math.sin(a) * radius,
                Math.sin(a * 2.0) * 0.05
            );

            const pulse = 0.12 + (0.5 + 0.5 * Math.sin(time * 2.0 + orb.phase)) * 0.05;
            orb.sprite.scale.set(pulse, pulse, pulse);
            orb.sprite.material.opacity = 0.5 + (0.5 + 0.5 * Math.sin(time * 1.5 + orb.phase)) * 0.3;
        });
    }

    function updateCubes(time) {
        cubes.forEach((cube, index) => {
            if (!cube.visible) return;

            const isActive = index === activeCubeIndex;

            // Only a subtle float, no continuous spinning
            const bob = Math.sin(time * 1.0 + index * 0.7) * 0.02;
            cube.position.x += (cube.userData.basePosition.x - cube.position.x) * 0.12;
            cube.position.y += (cube.userData.basePosition.y + bob - cube.position.y) * 0.12;

            // Active cube pushes slightly forward
            cube.position.z += ((cube.userData.basePosition.z + (isActive ? 0.26 : 0.0)) - cube.position.z) * 0.12;

            cube.rotation.copy(cube.userData.baseRotation);

            const targetScale = isActive ? 1.05 : 0.86;
            cube.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

            // ACTIVE: Deep Diamond Blue | INACTIVE: Smoky Grey
            const targetColor = isActive
                ? new THREE.Color(0x0077ff)
                : new THREE.Color(0x5a5c70);

            const targetEmissive = isActive
                ? new THREE.Color(0x00aaff)
                : new THREE.Color(0x2a2c40);

            cube.material.color.lerp(targetColor, 0.1);
            cube.material.emissive.lerp(targetEmissive, 0.1);
            cube.material.opacity += ((isActive ? 0.6 : 0.25) - cube.material.opacity) * 0.1;
            cube.material.emissiveIntensity += ((isActive ? 0.5 : 0.1) - cube.material.emissiveIntensity) * 0.1;

            if (cube.userData.edgeLines) {
                cube.userData.edgeLines.material.color.lerp(
                    isActive ? new THREE.Color(0xc7f6ff) : new THREE.Color(0xffffff),
                    0.1
                );
                cube.userData.edgeLines.material.opacity += ((isActive ? 0.7 : 0.15) - cube.userData.edgeLines.material.opacity) * 0.1;
            }
        });
    }

    function animate() {
        if (!visible || !renderer || !scene || !camera) return;

        const time = performance.now() * 0.001;
        const elapsed = time - startedAt;

        updateSpokes(time);
        updateInnerOrbs(time);
        revealCubes(elapsed);
        updateCubes(time);

        renderer.render(scene, camera);
        animationFrame = requestAnimationFrame(animate);
    }

    function addListeners() {
        window.addEventListener("resize", resize);
    }

    function removeListeners() {
        window.removeEventListener("resize", resize);
    }

    window.initSystemConfigScene = function (mount) {
        if (!mount) return;

        mountEl = mount;

        const panel = document.querySelector(".system-config-panel");
        if (panel) {
            panel.classList.add("using-three");
        }

        if (renderer && renderer.domElement && renderer.domElement.parentElement === mountEl) {
            resize();
            return;
        }

        if (renderer && renderer.domElement && renderer.domElement.parentElement) {
            renderer.domElement.parentElement.removeChild(renderer.domElement);
        }

        renderer = null;
        scene = null;
        camera = null;
        rootGroup = null;
        structureGroup = null;
        cubeGroup = null;
        innerOrbGroup = null;
        haloGroup = null;
        cubes = [];
        innerOrbs = [];
        spokes = [];

        setupScene();
        addListeners();
    };

    window.showSystemConfigScene = function () {
        if (!renderer || !scene || !camera) return;

        visible = true;
        startedAt = performance.now() * 0.001;

        cubes.forEach((cube) => {
            cube.visible = false;
            cube.scale.setScalar(0.001);
            cube.position.copy(cube.userData.basePosition);
            cube.rotation.copy(cube.userData.baseRotation);
        });

        if (renderer.domElement) {
            renderer.domElement.style.opacity = "0";
            renderer.domElement.style.filter = "blur(3px)";
            renderer.domElement.style.transition = "opacity 900ms ease, filter 1200ms ease";

            requestAnimationFrame(() => {
                renderer.domElement.style.opacity = "1";
                renderer.domElement.style.filter = "blur(0px)";
            });
        }

        if (animationFrame) cancelAnimationFrame(animationFrame);
        animate();
    };

    window.hideSystemConfigScene = function () {
        visible = false;

        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }

        if (renderer && renderer.domElement) {
            renderer.domElement.style.opacity = "0";
        }
    };

    window.setSystemConfigActiveCube = function (index) {
        activeCubeIndex = index;
    };

    window.disposeSystemConfigScene = function () {
        visible = false;

        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }

        removeListeners();

        if (renderer) {
            renderer.dispose();
            if (renderer.domElement && renderer.domElement.parentElement) {
                renderer.domElement.parentElement.removeChild(renderer.domElement);
            }
        }

        renderer = null;
        scene = null;
        camera = null;
        rootGroup = null;
        structureGroup = null;
        cubeGroup = null;
        innerOrbGroup = null;
        haloGroup = null;
        cubes = [];
        innerOrbs = [];
        spokes = [];
    };
})();