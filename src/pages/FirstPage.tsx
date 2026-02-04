import { useEffect, useState } from "react";
import "../styles/firstPage.css";
import { TopBar } from "../components/TopBar";
import earthImg from "../assets/earth.png";

export function FirstPage() {
  const [enter, setEnter] = useState(false);

  useEffect(() => {
    // trigger animation after mount
    requestAnimationFrame(() => {
      setEnter(true);
    });
  }, []);

  return (
    <div className={`first-page-root ${enter ? "enter" : ""}`}>
      <TopBar />

      {/* HERO MESSAGE */}
      <div className="earth-text">
        <h1>
          Every day, people lose money in the markets,
          <br />
          <span>others make it.</span>
        </h1>
        <p>We make sure you’re in the second group.</p>
      </div>

      {/* EARTH IMAGE */}
      <img
        src={earthImg}
        alt="Earth"
        className="earth-image"
      />
    </div>
  );
}