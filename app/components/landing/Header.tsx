"use client";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useEffect, useRef } from "react";
import * as THREE from "three";

function Header() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Clock
    const scene = new THREE.Scene();
    const clock = new THREE.Clock();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 2000);

    // 3. Renderer พร้อม GPU Acceleration และระบบเงา
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls ล็อกมุมก้ม-เงยให้อยู่ในระนาบ Isometric เพื่อไม่ให้ชนขอบบน-ล่างของการ์ด
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.rotateSpeed = 0.8;
    const minPolar = Math.PI / 3.1; // ~58 องศา
    const maxPolar = Math.PI / 2.25; // ~80 องศา
    controls.minPolarAngle = minPolar;
    controls.maxPolarAngle = maxPolar;

    // 5. แสง 3 ทิศทาง (Hemisphere + Key Directional + Fill Light)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xb0bec5, 0.95);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.3);
    dirLight.position.set(20, 35, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xffedd5, 0.9);
    fillLight.position.set(-20, 15, -20);
    scene.add(fillLight);

    // 6. โหลดโมเดล GLB
    let modelGroup: THREE.Group | null = null;
    let maxDim = 10;
    let horizRadius = 8;
    let modelHeight = 4;
    let isInitializedCamera = false;
    let isUserInteracting = false;

    const handleControlStart = () => {
      isUserInteracting = true;
    };
    const handleControlEnd = () => {
      isUserInteracting = false;
    };
    controls.addEventListener("start", handleControlStart);
    controls.addEventListener("end", handleControlEnd);

    const updateDimensions = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;

      const aspect = width / height;
      camera.aspect = aspect;

      // คำนวณระยะจากมุมก้มสูงสุดที่อนุญาต (minPolar) เพื่อรับประกันว่าหมุนมุมไหนก็ไม่ล้นกรอบการ์ดดำ
      const vFovRad = THREE.MathUtils.degToRad(camera.fov / 2);
      const hFovRad = Math.atan(aspect * Math.tan(vFovRad));

      const distForWidth = (horizRadius * 1.05) / Math.sin(hFovRad);
      const maxVertProj =
        horizRadius * Math.cos(minPolar) +
        (modelHeight / 2) * Math.sin(minPolar) +
        maxDim * 0.03;
      const distForHeight = (maxVertProj * 1.12) / Math.sin(vFovRad);
      const requiredDistance = Math.max(distForWidth, distForHeight);

      camera.near = Math.max(0.1, maxDim * 0.01);
      camera.far = Math.max(1000, maxDim * 20);

      if (!isInitializedCamera) {
        const isoDir = new THREE.Vector3(1.05, 0.68, 1.05).normalize();
        camera.position.copy(isoDir.multiplyScalar(requiredDistance));
      } else {
        camera.position.normalize().multiplyScalar(requiredDistance);
      }

      controls.target.set(0, 0, 0);
      controls.update();

      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const loader = new GLTFLoader();
    loader.load(
      "/minimal-sports-gym.glb",
      (gltf) => {
        const loadedModel = gltf.scene;

        loadedModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        maxDim = Math.max(size.x, size.y, size.z);
        horizRadius = Math.hypot(size.x, size.z) / 2;
        modelHeight = size.y;

        loadedModel.position.set(-center.x, -center.y, -center.z);

        dirLight.position.set(maxDim * 1.5, maxDim * 2.5, maxDim * 1.5);
        dirLight.shadow.camera.left = -maxDim;
        dirLight.shadow.camera.right = maxDim;
        dirLight.shadow.camera.top = maxDim;
        dirLight.shadow.camera.bottom = -maxDim;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = maxDim * 6;
        dirLight.shadow.camera.updateProjectionMatrix();

        modelGroup = new THREE.Group();
        modelGroup.add(loadedModel);
        modelGroup.rotation.y = -Math.PI / 6;

        scene.add(modelGroup);
        updateDimensions();
        isInitializedCamera = true;
      },
      undefined,
      (error: unknown) => {
        console.error("Failed to load 3D model:", error);
      }
    );

    // 7. Animation Loop: ลอยขึ้น-ลงช้าๆ + อัปเดตการหมุนจากเมาส์
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (modelGroup) {
        const elapsedTime = clock.getElapsedTime();
        modelGroup.position.y = Math.sin(elapsedTime * 1.2) * (maxDim * 0.02);

        if (!isUserInteracting) {
          modelGroup.rotation.y += Math.sin(elapsedTime * 0.5) * 0.0006;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 8. ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    resizeObserver.observe(container);
    updateDimensions();

    // 9. Cleanup
    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      controls.removeEventListener("start", handleControlStart);
      controls.removeEventListener("end", handleControlEnd);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <header className="relative w-full min-h-screen overflow-hidden bg-white flex flex-col justify-center select-none">
      {/* พื้นหลังแบ่งครึ่ง 50/50 (ซ้ายเหลือง - ขวาขาว) */}
      <div className="absolute inset-0 flex flex-col lg:flex-row pointer-events-none">
        <div className="w-full lg:w-1/2 h-1/2 lg:h-full bg-brand-yellow" />
        <div className="w-full lg:w-1/2 h-1/2 lg:h-full bg-white" />
      </div>

      {/* ================= ของตกแต่งรอบนอก (Geometric Decorations) ================= */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {/* จุดสี่เหลี่ยมเล็กด้านซ้ายบน */}
        <span className="hidden lg:block absolute left-[4%] top-[16%] w-1.5 h-1.5 bg-black" />

        {/* กากบาทเดี่ยวด้านบนข้อความซ้าย */}
        <span className="hidden sm:block absolute left-[36%] top-[11%] text-black font-bold text-sm leading-none">
          ✕
        </span>

        {/* เส้นคลื่นสีขาวจางๆ ฝั่งซ้ายใต้ข้อความย่อย */}
        <svg
          className="hidden sm:block absolute left-[6%] top-[53%] w-36 h-5 text-white/60"
          viewBox="0 0 140 20"
          fill="none"
        >
          <path
            d="M2 10 Q 11 2, 20 10 T 38 10 T 56 10 T 74 10 T 92 10 T 110 10 T 128 10"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>

        {/* จุดเล็กข้างซ้ายของการ์ดดำ */}
        <span className="hidden lg:block absolute left-[24%] top-[62%] w-1.5 h-1.5 bg-black rounded-full" />

        {/* วงกลมโปร่ง + จุด ด้านซ้ายล่าง */}
        <div className="absolute left-[8%] bottom-[14%] flex items-center">
          <span className="w-6 h-6 rounded-full border-[2.5px] border-black block" />
          <span className="w-1.5 h-1.5 bg-black rounded-full -mt-8 ml-2 block" />
        </div>

        {/* กากบาท 3 ตัวเรียงกัน ด้านล่างฝั่งสีเหลือง */}
        <div className="absolute left-[28%] bottom-[10%] flex items-center gap-2.5 text-black text-xs font-bold">
          <span>✕</span>
          <span>✕</span>
          <span>✕</span>
        </div>

        {/* วงกลมเส้นบางขนาดใหญ่ ซ้อนด้านหลังมุมขวาล่างของการ์ดดำ */}
        <div className="absolute left-[56%] sm:left-[60%] bottom-[6%] sm:bottom-[8%] w-40 h-40 sm:w-56 sm:h-56 rounded-full border-2 border-black" />

        {/* จุดเล็กด้านขวาวงกลมใหญ่ */}
        <span className="hidden sm:block absolute left-[80%] bottom-[22%] w-1.5 h-1.5 bg-black rounded-full" />

        {/* เส้นคลื่นสีเทา + จุด ด้านขวาใต้คำว่า PROGRAMM */}
        <div className="hidden lg:flex absolute right-[6%] top-[48%] items-center gap-6">
          <svg className="w-36 h-5 text-neutral-300" viewBox="0 0 140 20" fill="none">
            <path
              d="M2 10 Q 11 2, 20 10 T 38 10 T 56 10 T 74 10 T 92 10 T 110 10 T 128 10"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="w-1.5 h-1.5 bg-black rounded-full" />
        </div>

        {/* เส้นซิกแซก 2 ชั้น (เหลือง-ดำ) มุมขวาล่าง */}
        <div className="absolute right-[3%] bottom-[12%] flex flex-col gap-2.5">
          <svg className="w-28 sm:w-36 h-4 text-brand-yellow" viewBox="0 0 140 16" fill="none">
            <path
              d="M2 14 L 14 2 L 26 14 L 38 2 L 50 14 L 62 2 L 74 14 L 86 2 L 98 14 L 110 2 L 122 14 L 134 2"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg className="w-28 sm:w-36 h-4 text-black" viewBox="0 0 140 16" fill="none">
            <path
              d="M2 14 L 14 2 L 26 14 L 38 2 L 50 14 L 62 2 L 74 14 L 86 2 L 98 14 L 110 2 L 122 14 L 134 2"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* ================= เลเยอร์ข้อความพาดผ่าน 2 ฝั่ง ================= */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 pointer-events-none flex flex-col justify-center min-h-screen">
        <div className="w-full -mt-44 sm:-mt-56 lg:-mt-100">
          {/* บรรทัดที่ 1: BECOME (สีขาวบนพื้นเหลือง) */}
          <h1 className="font-primary font-medium text-white text-4xl sm:text-6xl lg:text-[74px] tracking-[0.22em] leading-tight uppercase">
            BECOME
          </h1>

          {/* บรรทัดที่ 2: พาดข้ามฝั่งเหลือง (สีขาว) ไปฝั่งขาว (สีดำ) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 items-baseline mt-1 lg:mt-2">
            <div className="font-primary font-medium text-white text-3xl sm:text-5xl lg:text-[68px] tracking-[0.18em] leading-tight uppercase whitespace-nowrap">
              A MEMBER OF
            </div>
            <div className="font-primary font-medium text-black text-3xl sm:text-5xl lg:text-[68px] tracking-[0.18em] leading-tight uppercase lg:pl-8 mt-2 lg:mt-0 whitespace-nowrap">
              OUR BONUS
            </div>
          </div>

          {/* บรรทัดที่ 3: คำอธิบายเล็กฝั่งซ้าย & คำว่า PROGRAMM ฝั่งขวา */}
          <div className="grid grid-cols-1 lg:grid-cols-2 items-start mt-8 lg:mt-10">
            <p className="text-xs sm:text-sm text-black/80 font-secondary max-w-[240px] leading-relaxed">
              If you want our bonus card - just come to our
              <br />
              sports facility and book one of our courts.
            </p>
            <div className="font-primary font-semibold text-black text-lg sm:text-2xl lg:text-[26px] tracking-[0.32em] uppercase lg:text-right lg:pr-8 mt-4 lg:mt-2">
              PROGRAMM
            </div>
          </div>
        </div>
      </div>

      {/* ================= กรอบการ์ดสีดำตรงกลาง (ขยายขนาดใหญ่ขึ้น) พร้อมโมเดล 3D ด้านใน ================= */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <div className="relative w-[92vw] sm:w-[560px] lg:w-[680px] xl:w-[740px] h-[330px] sm:h-[380px] lg:h-[430px] xl:h-[460px] rounded-[26px] shadow-[0_35px_70px_rgba(0,0,0,0.38)] overflow-hidden translate-y-12 lg:translate-y-16 pointer-events-auto bg-[#0a0a0a]">
          {/* ลวดลายเส้นโค้งสีเหลืองมุมซ้ายบนของการ์ดดำ */}
          <div className="absolute -top-24 -left-8 w-64 h-64 rounded-full border-[22px] border-brand-yellow pointer-events-none" />

          {/* ลวดลายเส้นโค้งสีเหลือง + จุด มุมขวาล่างของการ์ดดำ */}
          <div className="absolute -bottom-24 -right-16 w-64 h-64 rounded-full border-[22px] border-brand-yellow pointer-events-none" />
          <span className="absolute bottom-9 right-14 w-5 h-5 rounded-full bg-brand-yellow pointer-events-none z-10" />

          {/* วงกลมเหลืองเล็กตกแต่งด้านในของการ์ด */}
          <span className="absolute top-[34%] right-[15%] w-3 h-3 rounded-full border-2 border-brand-yellow pointer-events-none z-10" />

          {/* 3D Model Canvas อยู่ตรงกลางการ์ดดำ */}
          <div
            ref={containerRef}
            className="relative z-20 w-full h-full cursor-grab active:cursor-grabbing"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
