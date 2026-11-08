"use client";

import { Check, Link2, MessageCircle, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { buttonClass } from "@/components/ui/buttonStyles";
import { LiveAnnouncer } from "@/components/ui/LiveAnnouncer";
import { GREETING } from "@/lib/greeting";
import { useOrigin } from "@/lib/hooks/useOrigin";
import { useCanNativeShare } from "@/lib/hooks/useShareCapabilities";
import { copyText } from "@/lib/share/clipboard";
import { SHARE_MESSAGE, SHARE_TITLE, buildWhatsAppUrl, shareUrlFrom } from "@/lib/share/share";

/** Scene 5: share the same page with friends and family. */
export function ShareControls() {
  const origin = useOrigin();
  const canShare = useCanNativeShare();
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("");
  const url = shareUrlFrom(origin);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    const ok = await copyText(url);
    setCopied(ok);
    setStatus(ok ? "Link copied. Paste it anywhere to share." : `Couldn't copy automatically. The link is ${url}`);
  }

  async function handleNativeShare() {
    try {
      await navigator.share({ title: SHARE_TITLE, text: SHARE_MESSAGE, url });
      setStatus("Thank you for sharing the light!");
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setStatus("Sharing isn't available right now. Try WhatsApp or copy the link.");
      }
    }
  }

  return (
    <section aria-labelledby="share-title" className="animate-reveal px-4 pb-16 [animation-delay:250ms]">
      <div className="mx-auto max-w-md text-center">
        <h2 id="share-title" className="font-display text-[clamp(1.9rem,7vw,2.5rem)] font-semibold text-gold-soft">
          {GREETING.share.heading}
        </h2>
        <p className="mt-2 text-cream/75">{GREETING.share.intro}</p>

        <div className="mt-7 flex flex-col gap-3">
          <a
            href={buildWhatsAppUrl(url)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonClass("whatsapp")} w-full`}
            data-testid="share-whatsapp"
          >
            <MessageCircle aria-hidden="true" className="size-5" />
            Share on WhatsApp
          </a>
          <div className={`grid gap-3 ${canShare ? "grid-cols-2" : "grid-cols-1"}`}>
            {canShare && (
              <button type="button" onClick={handleNativeShare} className={buttonClass("secondary")} data-testid="share-native">
                <Share2 aria-hidden="true" className="size-4" />
                Share…
              </button>
            )}
            <button type="button" onClick={handleCopy} className={buttonClass("secondary")} data-testid="share-copy">
              {copied ? <Check aria-hidden="true" className="size-4 text-gold" /> : <Link2 aria-hidden="true" className="size-4" />}
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </div>

        <p aria-hidden="true" className="mt-4 min-h-6 text-sm text-gold-soft [overflow-wrap:anywhere]">
          {status}
        </p>
        <LiveAnnouncer message={status} />
      </div>
    </section>
  );
}
