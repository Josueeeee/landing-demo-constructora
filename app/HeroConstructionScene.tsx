"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroConstructionScene() {
  const hostRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" }); }
    catch { host.classList.add("three-fallback"); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = window.innerWidth > 760;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xd9d5cc, 11, 22);
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(9.2, 6.7, 10.5);
    camera.lookAt(0, 2.1, 0);
    scene.add(new THREE.HemisphereLight(0xfffcf3, 0x53504b, 2.6));
    const sun = new THREE.DirectionalLight(0xffe2c4, 4.2);
    sun.position.set(7, 11, 6); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); scene.add(sun);
    const root = new THREE.Group(); root.rotation.y = -0.45; root.position.y = -2.15; scene.add(root);
    const concrete = new THREE.MeshStandardMaterial({ color: 0xd7d2c8, roughness: 0.82, metalness: 0.02 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x191c1d, roughness: 0.54, metalness: 0.5 });
    const glass = new THREE.MeshPhysicalMaterial({ color: 0x70838a, transparent: true, opacity: 0.42, roughness: 0.18, metalness: 0.05 });
    const orange = new THREE.MeshStandardMaterial({ color: 0xf46a2a, roughness: 0.65 });
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x242627, transparent: true, opacity: 0.25 });
    const animated: Array<{ object: THREE.Object3D; delay: number }> = [];
    const addBox = (size: [number, number, number], position: [number, number, number], material: THREE.Material, delay = 0) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material); mesh.position.set(...position); mesh.castShadow = true; mesh.receiveShadow = true; root.add(mesh); mesh.scale.y = 0.001; animated.push({ object: mesh, delay }); return mesh;
    };
    addBox([7.6, 0.34, 5.5], [0, 0, 0], concrete);
    const levels = window.innerWidth < 620 ? 4 : 6;
    for (let floor = 0; floor < levels; floor++) {
      const y = 0.35 + floor * 1.05;
      addBox([6.6, 0.14, 4.4], [0, y, 0], concrete, floor * 0.085);
      ([[-3, -1.9], [3, -1.9], [-3, 1.9], [3, 1.9]] as Array<[number, number]>).forEach(([x, z], index) => addBox([0.17, 1.05, 0.17], [x, y + 0.52, z], dark, floor * 0.085 + index * 0.01));
      addBox([5.55, 0.62, 0.08], [0, y + 0.56, 2.12], floor === 2 ? orange : glass, floor * 0.085 + 0.04);
      addBox([0.08, 0.62, 3.45], [3.17, y + 0.56, 0], glass, floor * 0.085 + 0.05);
    }
    addBox([1.55, levels * 1.05, 1.25], [-1.85, levels * 0.525, -1.25], concrete, 0.08);
    const grid = new THREE.GridHelper(18, 18, 0x55524d, 0x9e9990); grid.position.y = -0.18; (grid.material as THREE.Material).transparent = true; (grid.material as THREE.Material).opacity = 0.28; scene.add(grid);
    const outline = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(8.3, levels * 1.05 + 0.5, 6.1)), lineMaterial); outline.position.y = levels * 0.525; root.add(outline);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = new THREE.Vector2(); let visible = true; let tabVisible = !document.hidden; const started = performance.now();
    const onPointerMove = (event: PointerEvent) => { const rect = host.getBoundingClientRect(); pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2; pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2; };
    const onVisibility = () => { tabVisible = !document.hidden; };
    host.addEventListener("pointermove", onPointerMove, { passive: true }); document.addEventListener("visibilitychange", onVisibility);
    const resize = () => { const { clientWidth: width, clientHeight: height } = host; if (!width || !height) return; renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); };
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host); resize();
    const intersectionObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.02 }); intersectionObserver.observe(host);
    renderer.setAnimationLoop((time) => {
      if (!visible || !tabVisible) return;
      const elapsed = (time - started) / 1000;
      animated.forEach(({ object, delay }) => { const progress = reduced ? 1 : Math.min(1, Math.max(0, (elapsed - delay) / 0.8)); object.scale.y = Math.max(0.001, 1 - Math.pow(1 - progress, 3)); });
      if (!reduced) { root.rotation.y += 0.00075; root.rotation.x += ((-pointer.y * 0.035) - root.rotation.x) * 0.025; camera.position.x += ((9.2 + pointer.x * 0.38) - camera.position.x) * 0.018; camera.lookAt(0, 2.05, 0); }
      renderer.render(scene, camera);
    });
    return () => {
      renderer.setAnimationLoop(null); resizeObserver.disconnect(); intersectionObserver.disconnect(); host.removeEventListener("pointermove", onPointerMove); document.removeEventListener("visibilitychange", onVisibility);
      scene.traverse((object) => { if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) object.geometry?.dispose(); });
      [concrete, dark, glass, orange, lineMaterial].forEach((material) => material.dispose()); (grid.geometry as THREE.BufferGeometry).dispose(); (grid.material as THREE.Material).dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    };
  }, []);
  return <div ref={hostRef} className="three-host"><span className="sr-only">Visualización arquitectónica decorativa</span></div>;
}
