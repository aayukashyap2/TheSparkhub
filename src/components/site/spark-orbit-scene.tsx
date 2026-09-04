"use client";

import { useEffect, useRef } from "react";
import {
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  Group,
  IcosahedronGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from "three";

type SparkOrbitSceneProps = {
  className?: string;
};

const nodeColors = [0x1f7a5a, 0x3157a4, 0xd4912a, 0x8eb9aa, 0x101817];

export function SparkOrbitScene({ className }: SparkOrbitSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(new Color(0xf6f3ed), 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new Scene();
    const camera = new PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.35, 8.6);

    const ambient = new AmbientLight(0xffffff, 1.45);
    const keyLight = new DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3.5, 4.2, 5);
    const fillLight = new DirectionalLight(0x9fc2b6, 1.3);
    fillLight.position.set(-4, -2, 3);
    scene.add(ambient, keyLight, fillLight);

    const root = new Group();
    root.rotation.x = -0.12;
    scene.add(root);

    const core = new Mesh(
      new IcosahedronGeometry(1.08, 2),
      new MeshPhysicalMaterial({
        clearcoat: 0.65,
        color: 0x1f7a5a,
        emissive: 0x123b31,
        emissiveIntensity: 0.28,
        metalness: 0.18,
        roughness: 0.22,
        transparent: true,
        opacity: 0.96,
      }),
    );
    root.add(core);

    const halo = new Mesh(
      new IcosahedronGeometry(1.45, 1),
      new MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        opacity: 0.15,
        roughness: 0.06,
        transparent: true,
        wireframe: true,
      }),
    );
    root.add(halo);

    const nodes = [
      new Vector3(-2.8, 1.55, -0.6),
      new Vector3(2.7, 1.25, 0.2),
      new Vector3(-3.15, -1.1, 0.45),
      new Vector3(3.0, -1.35, -0.35),
      new Vector3(0.15, 2.45, -0.8),
      new Vector3(0.35, -2.25, 0.7),
    ];
    const nodeMeshes: Mesh[] = [];

    nodes.forEach((position, index) => {
      const node = new Mesh(
        new SphereGeometry(0.145, 28, 28),
        new MeshPhysicalMaterial({
          clearcoat: 0.5,
          color: nodeColors[index % nodeColors.length],
          emissive: nodeColors[index % nodeColors.length],
          emissiveIntensity: 0.16,
          metalness: 0.14,
          roughness: 0.28,
        }),
      );
      node.position.copy(position);
      nodeMeshes.push(node);
      root.add(node);

      const plate = new Mesh(
        new IcosahedronGeometry(0.36, 1),
        new MeshPhysicalMaterial({
          color: 0xffffff,
          opacity: 0.2,
          roughness: 0.12,
          transparent: true,
        }),
      );
      plate.position.copy(position).multiplyScalar(1.05);
      plate.scale.set(1.9, 0.55, 0.12);
      root.add(plate);
    });

    const lineMaterial = new LineBasicMaterial({
      color: 0x3157a4,
      opacity: 0.32,
      transparent: true,
    });
    const spokeMaterial = new LineBasicMaterial({
      color: 0x1f7a5a,
      opacity: 0.26,
      transparent: true,
    });

    nodes.forEach((position, index) => {
      const spoke = new Line(
        new BufferGeometry().setFromPoints([new Vector3(0, 0, 0), position]),
        spokeMaterial,
      );
      root.add(spoke);

      const next = nodes[(index + 1) % nodes.length];
      const ring = new Line(
        new BufferGeometry().setFromPoints([position, next]),
        lineMaterial,
      );
      root.add(ring);
    });

    const particleCount = 130;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const radius = 2.8 + Math.random() * 3.6;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5.2;
      positions[i * 3 + 2] = Math.sin(angle) * radius * 0.45;
    }
    const particleGeometry = new BufferGeometry();
    particleGeometry.setAttribute("position", new BufferAttribute(positions, 3));
    const particles = new Points(
      particleGeometry,
      new PointsMaterial({
        color: 0x8eb9aa,
        opacity: 0.4,
        size: 0.028,
        transparent: true,
      }),
    );
    root.add(particles);

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      const width = Math.max(Math.round(bounds.width), window.innerWidth, 1);
      const height = Math.max(Math.round(bounds.height), window.innerHeight, 1);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, true);
      camera.aspect = width / height;
      camera.position.z = width < 720 ? 9.2 : 8.2;
      root.position.x = width < 720 ? 2.75 : 1.65;
      root.position.y = width < 720 ? -0.08 : -0.02;
      root.scale.setScalar(width < 720 ? 0.66 : 1.06);
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    window.addEventListener("resize", resize);
    const resizeFrame = window.requestAnimationFrame(resize);

    let frame = 0;
    let raf = 0;
    const animate = () => {
      frame += 0.01;
      root.rotation.y += 0.0026;
      core.rotation.x += 0.004;
      core.rotation.y += 0.006;
      halo.rotation.y -= 0.0035;
      particles.rotation.y += 0.0008;

      nodeMeshes.forEach((node, index) => {
        node.position.y = nodes[index].y + Math.sin(frame * 1.7 + index) * 0.08;
      });

      renderer.render(scene, camera);
      if (!reduceMotion) {
        raf = window.requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.cancelAnimationFrame(raf);
      window.cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", resize);
      observer.disconnect();
      renderer.dispose();
      core.geometry.dispose();
      halo.geometry.dispose();
      particleGeometry.dispose();
      root.traverse((object) => {
        if (object instanceof Mesh || object instanceof Line || object instanceof Points) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, []);

  return (
    <div aria-hidden="true" className={className}>
      <canvas className="h-full w-full" ref={canvasRef} />
    </div>
  );
}
