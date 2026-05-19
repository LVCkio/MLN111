import React, { useState, useEffect } from "react";
import { Quote } from "lucide-react";
import HeroSection from "./HeroBanner_Section";
import IntroduceSection from "./Introduce_Section";
import CoreSection from "./Core_Section";
import TimelineSection from "./TimeLine_Section";
import LegacySection from "./Legacy_Section";

const MarxistPhilosophyAbout = () => {
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => new Set([...prev, entry.target.id]));
        }
      });
    }, observerOptions);

    document.querySelectorAll("[data-section]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 overflow-hidden">
      {/* Hero Banner Section */}
      <HeroSection />

      {/* Introduction Section */}
      <IntroduceSection visibleSections={visibleSections} />

      {/* Core Philosophy Section */}
      <CoreSection visibleSections={visibleSections} />

      {/* Historical Timeline */}
      <TimelineSection visibleSections={visibleSections} />

      {/* Legacy Section */}
      <LegacySection visibleSections={visibleSections} />
    </div>
  );
};

export default MarxistPhilosophyAbout;
