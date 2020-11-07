import useMedia from "use-media";

const BREAKPOINT_WIDE = "1000px";
const BREAKPOINT_NARROW = "700px";

export default () => {
  const isWide = useMedia({ minWidth: BREAKPOINT_WIDE });
  const isNarrow = useMedia({ maxWidth: BREAKPOINT_NARROW });

  if (isWide) return "wide";
  if (isNarrow) return "narrow";
  return "regular";
};
