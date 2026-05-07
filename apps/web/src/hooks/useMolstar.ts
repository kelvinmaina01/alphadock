import { useMemo, useRef, useState } from "react";

export function useMolstar() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [representation, setRepresentation] = useState("surface");
  const [selectedPose, setSelectedPose] = useState(1);

  const commands = useMemo(
    () => ({
      setRepresentation,
      focusPose: setSelectedPose,
    }),
    [],
  );

  return {
    ref,
    representation,
    selectedPose,
    commands,
  };
}
