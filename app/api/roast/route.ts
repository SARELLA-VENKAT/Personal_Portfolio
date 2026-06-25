import { NextRequest, NextResponse } from "next/server";
import { analyze } from "./analyze";
import { roast } from "./score";
import { supabase } from "@/utils/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Run direct local analysis and scoring
    const analysis = await analyze(url);
    const roastResult = roast(analysis);

    // Save to Supabase Leaderboard (Non-blocking, resilient)
    try {
      const domainName = roastResult.url.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
      
      let crime = "General UX issues.";
      if (roastResult.cards) {
        const cardsList = Object.values(roastResult.cards) as any[];
        if (cardsList.length > 0) {
          const sortedCards = [...cardsList].sort((a, b) => a.score - b.score);
          const worstMetric = sortedCards[0];
          crime = `${worstMetric.name || "UX"}: ${worstMetric.line}`;
        }
      }

      const colors = ["#ff2d1a", "#00f0ff", "#ff00ea", "#ffb700", "#ad00ff", "#00ff66", "#ff5e00", "#0066ff", "#e1ff00", "#00ffb7"];
      const color = colors[Math.floor(Math.random() * colors.length)];

      await supabase.from("roast_leaderboard").upsert(
        {
          domain: domainName,
          score: roastResult.overall,
          label: roastResult.label,
          tagline: roastResult.tagline,
          crime: crime,
          color: color,
        },
        {
          onConflict: "domain",
        }
      );
    } catch (dbErr) {
      console.error("Failed to save roast to Supabase:", dbErr);
    }

    return NextResponse.json({ roast: roastResult });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
