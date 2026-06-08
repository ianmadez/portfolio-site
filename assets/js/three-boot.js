window.initTowers = initTowers;
window.triggerBootSequence = triggerBootSequence;
window.triggerWoompCamera = triggerWoompCamera;
window.transitionToPhase2 = transitionToPhase2;
window.hideBootTowers = hideBootTowers;

// GSAP animates this object. The render loop only reads it.
window.PS2BootScene = {
    towerSpeed: 0.004
};

let scene, camera, renderer;
let towers = [];
let orbGroup, ringGroup;
let bootDustGroup, bootFairyGroup;

let isBooting = false;
let isPhase2 = false;

function createTrailLine(color) {
    const trailGeometry = new THREE.BufferGeometry();
    const trailPoints = [];

    for (let i = 0; i < 42; i++) {
        trailPoints.push(new THREE.Vector3(0, 0, 0));
    }

    trailGeometry.setFromPoints(trailPoints);

    const trailMaterial = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.72,
        blending: THREE.AdditiveBlending
    });

    const trail = new THREE.Line(trailGeometry, trailMaterial);
    trail.userData.points = trailPoints;

    return trail;
}

function createBootAtmosphere() {
    bootDustGroup = new THREE.Group();
    bootFairyGroup = new THREE.Group();

    bootDustGroup.visible = false;
    bootFairyGroup.visible = false;

    scene.add(bootDustGroup);
    scene.add(bootFairyGroup);

    // Grey space dust cloud deep in the background.
    const dustCount = 900;
    const dustPositions = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
        const i3 = i * 3;

        dustPositions[i3] = (Math.random() - 0.5) * 34;
        dustPositions[i3 + 1] = (Math.random() - 0.5) * 18;
        dustPositions[i3 + 2] = -38 + Math.random() * 20;
    }

    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));

    const dustMaterial = new THREE.PointsMaterial({
        color: 0x6f86a6, // bluish grey
        size: 0.14,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const dust = new THREE.Points(dustGeometry, dustMaterial);
    bootDustGroup.add(dust);

    // Four PS button color lights.
    const psColors = [
        0x5b7cff, // X blue
        0xff5f7e, // circle pink/red
        0x44ffbf, // triangle green
        0xff7bd5  // square pink
    ];

    psColors.forEach((color, i) => {
        const fairy = new THREE.Group();

        const dotGeometry = new THREE.SphereGeometry(0.16, 24, 24);
        const dotMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        const dot = new THREE.Mesh(dotGeometry, dotMaterial);
        const trail = createTrailLine(color);

        fairy.add(trail);
        fairy.add(dot);

        fairy.userData = {
            dot,
            trail,
            baseOffset: i * Math.PI * 0.5,
            radius: 1.8 + i * 0.45,
            zDepth: -12 - i * 1.4,
            wander: Math.random() * 10
        };

        bootFairyGroup.add(fairy);
    });
}

function initTowers() {
    const canvas = document.getElementById("boot-canvas");

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020205, 0.04);
    scene.background = new THREE.Color(0x020205);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambientLight = new THREE.AmbientLight(0x111122, 1);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x0044ff, 2, 50);
    blueLight.position.set(0, 0, 5);
    scene.add(blueLight);

    createBootAtmosphere();

    // ==========================================
    // 1. GENERATE TOWERS - hidden until PS button
    // ==========================================
    const towerGeometry = new THREE.BoxGeometry(1.5, 12, 1.5);

    for (let i = 0; i < 15; i++) {
        const towerMaterial = new THREE.MeshPhongMaterial({
            color: 0x888899,
            transparent: true,
            opacity: 0,
            shininess: 100,
            specular: 0xffffff
        });

        const tower = new THREE.Mesh(towerGeometry, towerMaterial);
        tower.position.x = (Math.random() - 0.5) * 30;
        tower.position.y = (Math.random() - 0.5) * 20;
        tower.position.z = (Math.random() - 0.5) * 40 - 10;
        tower.rotation.x = Math.random() * Math.PI;
        tower.rotation.y = Math.random() * Math.PI;
        tower.visible = false;

        scene.add(tower);
        towers.push(tower);
    }

    // ==========================================
    // 2. GENERATE CLOCK ORBS - Phase 2
    // ==========================================
    orbGroup = new THREE.Group();
    ringGroup = new THREE.Group();

    // Off-center left and slightly smaller, per PS2 browser layout request.
    orbGroup.position.set(-3.1, 0.15, 0);
    ringGroup.position.set(-3.1, 0.15, 0);

    orbGroup.scale.set(0.52, 0.52, 0.52);
    ringGroup.scale.set(0.52, 0.52, 0.52);

    scene.add(orbGroup);
    scene.add(ringGroup);

    const orbGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const orbMat = new THREE.MeshBasicMaterial({
        color: 0x66ccff,
        transparent: true,
        opacity: 0
    });

    for (let i = 0; i < 7; i++) {
        const orb = new THREE.Mesh(orbGeo, orbMat.clone());
        orbGroup.add(orb);
    }

    const ringGeo = new THREE.TorusGeometry(4, 0.015, 8, 64);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0x0077ff,
        transparent: true,
        opacity: 0
    });

    for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(ringGeo, ringMat.clone());
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        ringGroup.add(ring);
    }

    orbGroup.visible = false;
    ringGroup.visible = false;

    window.addEventListener("resize", onWindowResize, false);
    animate();
}

function triggerBootSequence() {
    isBooting = true;
    isPhase2 = false;
    window.PS2BootScene.towerSpeed = 0.004;

    if (bootDustGroup && bootFairyGroup) {
        bootDustGroup.visible = true;
        bootFairyGroup.visible = true;

        bootDustGroup.children.forEach(child => {
            gsap.to(child.material, {
                opacity: 0.32,
                duration: 2.2,
                ease: "power2.out"
            });
        });

        bootFairyGroup.children.forEach(fairy => {
            gsap.to(fairy.userData.dot.material, {
                opacity: 0.85,
                duration: 1.2,
                ease: "power2.out"
            });

            gsap.to(fairy.userData.trail.material, {
                opacity: 0.26,
                duration: 1.2,
                ease: "power2.out"
            });
        });
    }

    towers.forEach(tower => {
        tower.visible = true;
        gsap.to(tower.material, {
            opacity: 0.6,
            duration: 1.0,
            ease: "power2.out"
        });
    });
}

function hideBootTowers() {
    isBooting = false;

    if (bootDustGroup && bootFairyGroup) {
        bootDustGroup.children.forEach(child => {
            gsap.to(child.material, {
                opacity: 0,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                    bootDustGroup.visible = false;
                }
            });
        });

        bootFairyGroup.children.forEach(fairy => {
            gsap.to(fairy.userData.dot.material, {
                opacity: 0,
                duration: 0.45,
                ease: "power2.out"
            });

            gsap.to(fairy.userData.trail.material, {
                opacity: 0,
                duration: 0.45,
                ease: "power2.out",
                onComplete: () => {
                    bootFairyGroup.visible = false;
                }
            });
        });
    }

    towers.forEach(tower => {
        gsap.to(tower.material, {
            opacity: 0,
            duration: 0.2,
            ease: "power3.out",
            onComplete: () => {
                tower.visible = false;
            }
        });
    });
}

function fadeBootAtmosphereFast() {
    if (!bootDustGroup && !bootFairyGroup) return;

    if (bootDustGroup) {
        bootDustGroup.children.forEach(child => {
            gsap.to(child.material, {
                opacity: 0,
                duration: 0.35,
                ease: "power2.out",
                onComplete: () => {
                    bootDustGroup.visible = false;
                }
            });
        });
    }

    if (bootFairyGroup) {
        bootFairyGroup.children.forEach(fairy => {
            gsap.to(fairy.userData.dot.material, {
                opacity: 0,
                duration: 0.25,
                ease: "power2.out"
            });

            gsap.to(fairy.userData.trail.material, {
                opacity: 0,
                duration: 0.3,
                ease: "power2.out",
                onComplete: () => {
                    bootFairyGroup.visible = false;
                }
            });
        });
    }
}

function triggerWoompCamera() {
    fadeBootAtmosphereFast();

    const flashLight = new THREE.PointLight(0x66aaff, 8, 50);
    flashLight.position.set(0, 0, 10);
    scene.add(flashLight);

    gsap.to(camera.position, {
        z: 8,
        duration: 0.55,
        ease: "power4.in"
    });

    gsap.to(flashLight, {
        intensity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => scene.remove(flashLight)
    });
}

function transitionToPhase2() {
    isPhase2 = true;

    orbGroup.visible = true;
    ringGroup.visible = true;

    // Make sure the tower layer is gone before the browser/orb space starts.
    towers.forEach(tower => {
        tower.visible = false;
        tower.material.opacity = 0;
    });

    gsap.to(scene.fog, {
        density: 0.022,
        duration: 2,
        ease: "power2.inOut"
    });

    gsap.to(scene.background, {
        r: 0.003,
        g: 0.004,
        b: 0.006,
        duration: 2,
        ease: "power2.inOut"
    });

    orbGroup.children.forEach((orb, i) => {
        gsap.to(orb.material, {
            opacity: 1,
            duration: 0.8,
            delay: i * 0.06,
            ease: "power2.out"
        });
    });

    ringGroup.children.forEach((ring, i) => {
        gsap.to(ring.material, {
            opacity: 0.22,
            duration: 1.2,
            delay: i * 0.08,
            ease: "power2.out"
        });
    });
}

function animate() {
    requestAnimationFrame(animate);

    if (isBooting && !isPhase2) {
        const t = performance.now() * 0.001;

        towers.forEach(tower => {
            tower.rotation.x += 0.001;
            tower.rotation.y += 0.002;
            tower.position.z += window.PS2BootScene.towerSpeed;

            if (tower.position.z > 20) tower.position.z = -30;
        });

        // Slow grey dust drift in the back.
        if (bootDustGroup) {
            bootDustGroup.rotation.z = Math.sin(t * 0.05) * 0.08;
            bootDustGroup.rotation.y = Math.sin(t * 0.035) * 0.12;
        }

        // Four PS-color fairy lights dancing inside the dust cloud.
        if (bootFairyGroup) {
            bootFairyGroup.children.forEach((fairy, i) => {
                const data = fairy.userData;

                const base = t * (0.65 + i * 0.08) + data.baseOffset;

                // Slingshot-style movement: speed changes around the curve.
                const warped = base + Math.sin(base * 1.6) * 0.55;

                // Sometimes they break away from the group slightly.
                const breakaway = Math.sin(t * 0.37 + data.wander);
                const breakAmount = Math.max(0, breakaway) * 1.8;

                const x = Math.cos(warped) * (data.radius + breakAmount);
                const y = Math.sin(warped * 1.12) * (1.1 + i * 0.18);
                const z = data.zDepth + Math.sin(warped * 1.4) * 2.2;

                // Move the glowing dot itself, not the whole group.
                data.dot.position.set(x, y, z);

                // Keep trail history in world-like local space.
                const trail = data.trail;
                const points = trail.userData.points;

                points.pop();
                points.unshift(new THREE.Vector3(x, y, z));

                trail.geometry.setFromPoints(points);

                // Neon breathing.
                const pulse = 1.2 + Math.abs(Math.cos(base)) * 1.1;
                data.dot.scale.setScalar(pulse);
            });
        }
    }

    // --- PHASE 2: ORB CLOCK LOGIC ---
    if (isPhase2) {
        const now = new Date();

        const h = now.getHours() % 12;
        const m = now.getMinutes();
        const s = now.getSeconds();
        const ms = now.getMilliseconds();

        const smoothMinute = m + s / 60 + ms / 60000;
        const smoothHour = h + smoothMinute / 60;

        const t = performance.now() * 0.001;

        const hourAngle = -(smoothHour / 12) * Math.PI * 2 + Math.PI / 2;
        const minuteSpread = THREE.MathUtils.lerp(0.55, 1.15, smoothMinute / 60);

        // Whole object spins in place a bit faster.
        orbGroup.rotation.y = t * 0.48;
        orbGroup.rotation.x = Math.sin(t * 0.22) * 0.28;
        orbGroup.rotation.z = hourAngle * 0.18;

        ringGroup.rotation.y = t * 0.42;
        ringGroup.rotation.x = 0.65 + Math.sin(t * 0.16) * 0.22;
        ringGroup.rotation.z = hourAngle * 0.22;

        const radiusX = 3.2;
        const radiusY = 2.15;
        const depth = 1.55;

        orbGroup.children.forEach((orb, i) => {
            const count = orbGroup.children.length;
            const normalized = i / count;

            // Base orbit.
            const baseAngle = hourAngle + normalized * Math.PI * 2 * minuteSpread + t * 0.55;

            // Slingshot curve:
            // The sine distortion makes it speed up around one side and slow down around the other.
            const slingshotAngle = baseAngle + Math.sin(baseAngle) * 0.42;

            orb.position.x = Math.cos(slingshotAngle) * radiusX;
            orb.position.y = Math.sin(slingshotAngle) * radiusY;
            orb.position.z = Math.sin(slingshotAngle * 1.15 + t * 0.45) * depth;

            // Glow/pulse increases slightly during the fast part.
            const speedPulse = 1 + Math.abs(Math.cos(baseAngle)) * 0.18;
            const softPulse = 1 + Math.sin(t * 2.5 + i) * 0.05;
            orb.scale.setScalar(speedPulse * softPulse);
        });
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}