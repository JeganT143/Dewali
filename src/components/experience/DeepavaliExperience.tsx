"use client";

import { useState } from "react";
import { CrackersSection } from "@/components/crackers/CrackersSection";
import { PetalShower } from "@/components/decor/FlowerDecorations";
import { SceneBackdrop } from "@/components/decor/SceneBackdrop";
import { SectionDivider } from "@/components/decor/SectionDivider";
import { FireworksEffect } from "@/components/effects/FireworksEffect";
import { FloatingParticles } from "@/components/effects/FloatingParticles";
import { FamilyWishes } from "@/components/family/FamilyWishes";
import { GreetingMessage } from "@/components/greeting/GreetingMessage";
import { GreetingHero } from "@/components/hero/GreetingHero";
import { PersonalityPicker } from "@/components/personality/PersonalityPicker";
import { ShareControls } from "@/components/share/ShareControls";
import { SweetsSection } from "@/components/sweets/SweetsSection";
import { LiveAnnouncer } from "@/components/ui/LiveAnnouncer";
import { Reveal } from "@/components/ui/Reveal";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { GREETING } from "@/lib/greeting";
import { usePageVisibility } from "@/lib/hooks/usePageVisibility";

/**
 * Jegan's Deepavali celebration: light the Vilakku, taste the sweets, play
 * with virtual crackers, a moment for family and friends, a small playful
 * choice, then the personal wishes and sharing.
 */
export function DeepavaliExperience() {
  const [lit, setLit] = useState(false);
  const [allLit, setAllLit] = useState(false);
  const [fireworks, setFireworks] = useState(0);
  const [petals, setPetals] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  usePageVisibility();

  const light = () => {
    if (lit) return;
    setLit(true);
    setFireworks((n) => n + 1);
    setPetals((n) => n + 1);
    setAnnouncement(`${GREETING.litCelebration} ${GREETING.smallHint}. The celebration continues below.`);
  };

  const lightSmall = (litCount: number, total: number) => {
    if (litCount < total) {
      setAnnouncement(`Little vilakku lit, ${litCount} of ${total}.`);
      return;
    }
    setAllLit(true);
    setFireworks((n) => n + 1);
    setPetals((n) => n + 1);
    setAnnouncement(GREETING.allLit);
  };

  return (
    <div data-scene-lit={lit}>
      <SceneBackdrop lit={lit} />
      <FloatingParticles lit={lit} />
      <PetalShower trigger={petals} />
      <FireworksEffect trigger={fireworks} ambient={lit} />

      <main className="overflow-x-clip">
        <GreetingHero lit={lit} allLit={allLit} onLight={light} onLightSmall={lightSmall} />
        {lit && (
          <>
            <Reveal>
              <SweetsSection />
            </Reveal>
            <SectionDivider />
            <Reveal>
              <CrackersSection onFireworks={() => setFireworks((n) => n + 1)} />
            </Reveal>
            <SectionDivider />
            <Reveal>
              <FamilyWishes />
            </Reveal>
            <SectionDivider />
            <Reveal>
              <PersonalityPicker />
            </Reveal>
            <SectionDivider />
            <Reveal>
              <GreetingMessage />
            </Reveal>
            <ShareControls />
          </>
        )}
      </main>

      <SiteFooter />
      <LiveAnnouncer message={announcement} />
    </div>
  );
}
