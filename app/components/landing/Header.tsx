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
    const minPolar = Math.PI / 3.1;
    const maxPolar = Math.PI / 2.25;
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
    <header className="relative w-full max-w-full h-screen min-h-[600px] overflow-hidden bg-white select-none">
      {/* พื้นหลังแบ่งครึ่ง 50/50 ซ้ายเหลือง - ขวาขาว */}
      <div className="absolute inset-0 flex flex-row pointer-events-none">
        <div className="w-1/2 h-full bg-brand-yellow" />
        <div className="w-1/2 h-full bg-white" />
      </div>

      {/* ================= ของตกแต่งรอบนอก ================= */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {/* ของตกแต่งโซนบน-กลาง: แสดงเฉพาะจอคอมพิวเตอร์ (xl: 1280px ขึ้นไป) เพื่อไม่ให้กวนสายตาบนมือถือและ iPad */}
        <span className="hidden xl:block absolute left-[4%] top-[16%] w-1.5 h-1.5 bg-black" />
        <span className="hidden xl:block absolute left-[36%] top-[11%] text-black font-bold text-sm leading-none">
          ✕
        </span>
        <svg
          className="hidden xl:block absolute left-[6%] top-[53%] w-36 h-5 text-white/60"
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
        <span className="hidden xl:block absolute left-[24%] top-[62%] w-1.5 h-1.5 bg-black rounded-full" />
        <span className="hidden xl:block absolute left-[80%] bottom-[22%] w-1.5 h-1.5 bg-black rounded-full" />
        <div className="hidden xl:flex absolute right-[6%] top-[48%] items-center gap-6">
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

        {/* ของตกแต่งโซนล่าง: แสดงทั้งบนมือถือ/iPad และจอคอม */}
        {/* 1. วงกลมโปร่ง + จุด มุมซ้ายล่าง */}
        <div className="flex absolute left-[6%] sm:left-[8%] bottom-[5%] sm:bottom-[8%] xl:bottom-[14%] items-center">
          <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-[2px] sm:border-[2.5px] border-black block" />
          <span className="w-1.5 h-1.5 bg-black rounded-full -mt-6 sm:-mt-8 ml-1.5 sm:ml-2 block" />
        </div>

        {/* 2. กากบาท 3 ตัวเรียง ด้านล่างฝั่งเหลือง */}
        <div className="flex absolute left-[24%] sm:left-[26%] xl:left-[28%] bottom-[5%] sm:bottom-[8%] xl:bottom-[10%] items-center gap-2 sm:gap-2.5 text-black text-[10px] sm:text-xs font-bold">
          <span>✕</span>
          <span>✕</span>
          <span>✕</span>
        </div>

        {/* 3. วงกลมเส้นบางขนาดใหญ่ ซ้อนมุมขวาล่างของการ์ดดำ */}
        <div className="block absolute left-[54%] sm:left-[58%] xl:left-[60%] bottom-[14%] sm:bottom-[12%] xl:bottom-[8%] w-28 h-28 sm:w-44 sm:h-44 xl:w-56 xl:h-56 rounded-full border-2 border-black" />

        {/* 4. เส้นซิกแซก 2 ชั้น มุมขวาล่าง */}
        <div className="flex absolute right-[3%] bottom-[4%] sm:bottom-[6%] xl:bottom-[12%] flex-col gap-1.5 sm:gap-2 xl:gap-2.5">
          <svg className="w-20 sm:w-28 xl:w-36 h-3 sm:h-4 text-brand-yellow" viewBox="0 0 140 16" fill="none">
            <path
              d="M2 14 L 14 2 L 26 14 L 38 2 L 50 14 L 62 2 L 74 14 L 86 2 L 98 14 L 110 2 L 122 14 L 134 2"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg className="w-20 sm:w-28 xl:w-36 h-3 sm:h-4 text-black" viewBox="0 0 140 16" fill="none">
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

      {/* ================= เลเยอร์ข้อความพาดผ่าน 2 ฝั่ง (ยึดจากกึ่งกลางจอเหมือนกันทุกขนาด เพื่อไม่ให้มีช่องว่างโล่งใต้ตัวหนังสือ และไม่ถูกการ์ดบังบน iPad Pro) ================= */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-3 sm:px-6 md:px-10 xl:px-16 pointer-events-none flex flex-col justify-center min-h-screen overflow-hidden">
        <div className="w-full -mt-[420px] min-[390px]:-mt-[440px] sm:-mt-[490px] md:-mt-[530px] lg:-mt-[580px] xl:-mt-[430px]">
          {/* บรรทัดที่ 1: ระบบ (ขยายใหญ่เต็มพื้นที่คอลัมน์ซ้าย) */}
          <h1 className="font-primary font-bold text-white text-[clamp(2.75rem,11vw,4rem)] sm:text-[clamp(3.25rem,7vw,4.5rem)] lg:text-[58px] xl:text-[72px] tracking-[0.14em] leading-tight uppercase">
            ระบบ
          </h1>

          {/* บรรทัดที่ 2: พาดข้ามฝั่งเหลือง (สีขาว) ไปฝั่งขาว (สีดำ) - ขยายเต็มความกว้างทั้ง 2 ฝั่ง */}
          <div className="grid grid-cols-2 items-baseline mt-1 sm:mt-1.5 xl:mt-2 w-full">
            <div className="font-primary font-bold text-white text-[clamp(1.35rem,5.6vw,2.3rem)] sm:text-[clamp(2.1rem,4.8vw,3.2rem)] lg:text-[44px] xl:text-[62px] tracking-tight sm:tracking-[0.02em] xl:tracking-[0.08em] leading-tight uppercase whitespace-nowrap">
              จัดการสนามกีฬา
            </div>
            <div className="font-primary font-bold text-black text-[clamp(1.5rem,6.4vw,2.5rem)] sm:text-[clamp(2.2rem,5.2vw,3.4rem)] lg:text-[46px] xl:text-[62px] tracking-[0.06em] sm:tracking-[0.1em] xl:tracking-[0.08em] leading-tight uppercase pl-2 sm:pl-5 md:pl-6 xl:pl-8 whitespace-nowrap">
              ภายในชุมชน
            </div>
          </div>

          {/* บรรทัดที่ 3: คำอธิบายเล็กฝั่งซ้าย & คำว่า ง่ายและรวดเร็ว ฝั่งขวา */}
          <div className="grid grid-cols-2 items-start mt-3 sm:mt-5 md:mt-6 xl:mt-10 w-full">
            <p className="text-[clamp(0.8rem,3.4vw,1rem)] sm:text-sm md:text-base xl:text-sm text-black/85 font-secondary max-w-[95%] sm:max-w-[260px] leading-relaxed pr-2">
              ลงทะเบียนได้ทั้งแบบเดี่ยวและกลุ่ม
              <br />
              มีรหัสยืนยันตัวตนที่ชัดเจน
            </p>
            <div className="font-primary font-semibold text-black text-[clamp(0.95rem,4.2vw,1.25rem)] sm:text-lg md:text-xl xl:text-[22px] tracking-[0.1em] sm:tracking-[0.16em] xl:tracking-[0.2em] uppercase pl-2 sm:pl-5 md:pl-6 xl:pl-8 xl:text-right xl:pr-4 mt-1">
              ง่ายและรวดเร็ว
            </div>
          </div>
        </div>
      </div>

      {/* ================= กรอบการ์ดสีดำตรงกลาง พร้อมโมเดล 3D ด้านใน ================= */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none overflow-hidden">
        <div className="relative w-[94vw] sm:w-[88vw] sm:max-w-[580px] md:max-w-[640px] lg:w-[680px] lg:max-w-none xl:w-[740px] h-[290px] min-[390px]:h-[310px] sm:h-[360px] md:h-[390px] lg:h-[420px] xl:h-[450px] rounded-[20px] sm:rounded-[24px] xl:rounded-[26px] shadow-[0_28px_55px_rgba(0,0,0,0.36)] xl:shadow-[0_35px_70px_rgba(0,0,0,0.38)] overflow-hidden translate-y-10 sm:translate-y-12 md:translate-y-14 lg:translate-y-16 pointer-events-auto bg-[#0a0a0a]">
          {/* ลวดลายเส้นโค้งสีเหลืองมุมซ้ายบนของการ์ดดำ */}
          <div className="absolute -top-16 sm:-top-20 xl:-top-24 -left-6 sm:-left-8 w-44 sm:w-56 xl:w-64 h-44 sm:h-56 xl:h-64 rounded-full border-[14px] sm:border-[18px] xl:border-[22px] border-brand-yellow pointer-events-none" />

          {/* ลวดลายเส้นโค้งสีเหลือง + จุด มุมขวาล่างของการ์ดดำ */}
          <div className="absolute -bottom-16 sm:-bottom-20 xl:-bottom-24 -right-10 sm:-right-14 xl:-right-16 w-44 sm:w-56 xl:w-64 h-44 sm:h-56 xl:h-64 rounded-full border-[14px] sm:border-[18px] xl:border-[22px] border-brand-yellow pointer-events-none" />
          <span className="absolute bottom-6 sm:bottom-8 xl:bottom-9 right-8 sm:right-11 xl:right-14 w-3.5 sm:w-4 xl:w-5 h-3.5 sm:h-4 xl:h-5 rounded-full bg-brand-yellow pointer-events-none z-10" />

          {/* วงกลมเหลืองเล็กตกแต่งด้านในของการ์ด */}
          <span className="absolute top-[32%] right-[14%] w-2 sm:w-2.5 xl:w-3 h-2 sm:h-2.5 xl:h-3 rounded-full border-2 border-brand-yellow pointer-events-none z-10" />

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
