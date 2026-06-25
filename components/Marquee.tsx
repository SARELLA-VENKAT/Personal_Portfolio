interface MarqueeProps {
  content: string;
  direction: "left" | "right";
  bg?: string;
  textColor?: string;
  style?: React.CSSProperties;
}

export default function Marquee({ content, direction, bg = "", textColor = "text-black", style }: MarqueeProps) {
  const track = `marquee-track-${direction}`;

  return (
    <div
      className={`marquee-wrap overflow-hidden border-y-[3px] border-black py-3 ${bg} ${textColor}`}
      style={style}
    >
      <div className={`${track} flex w-max whitespace-nowrap`}>
        <span className="px-4 text-xl font-black uppercase tracking-tight sm:text-2xl">
          {content}&nbsp;&nbsp;&nbsp;
        </span>
        <span className="px-4 text-xl font-black uppercase tracking-tight sm:text-2xl" aria-hidden="true">
          {content}&nbsp;&nbsp;&nbsp;
        </span>
      </div>
    </div>
  );
}
