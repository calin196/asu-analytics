import { useEffect, useRef } from "react";
import "../styles/firstPage.css";
import planetImg from "../assets/proxima-b.png";

const items = [
  "News",
  "Crypto",
  "Stocks",
  "Currencies",
  "Exchanges",
  "Trends",
  "Markets",
  "Insights",
  "Settings",
  "Exit",
];

export function FirstPage() {
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let angle = 0;
    const radius = 480;
    const speed = 0.00035;

    // 👇 VISUAL CENTER CORRECTION
    const offsetX = -70; // move orbit LEFT
    const offsetY = -40; // move orbit UP

    function animate() {
      if (!orbitRef.current) return;

      const buttons = orbitRef.current.children;
      const count = buttons.length;

      for (let i = 0; i < count; i++) {
        const a = angle + (i * Math.PI * 2) / count;

        const x = Math.cos(a) * radius + offsetX;
        const y = Math.sin(a) * radius + offsetY;

        const el = buttons[i] as HTMLElement;
        el.style.transform = `translate(${x}px, ${y}px)`;
      }

      angle += speed;
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, []);

  return (
    <div className="first-page-root">
      <div className="planet-system">
        <img src={planetImg} className="planet" />

        <div className="orbit-js" ref={orbitRef}>
          {items.map(label => (
            <button key={label} className="orbit-btn">
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}