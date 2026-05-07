import { useMemo, useState } from "react";
import { mockDescriptor } from "../lib/mocks";

function detectValidity(smiles: string) {
  const trimmed = smiles.trim();
  if (trimmed.length < 6) {
    return { valid: false, error: "SMILES string is too short for this mock validator." };
  }
  if (!/[A-Zcnosp]/.test(trimmed)) {
    return { valid: false, error: "Expected atom tokens were not found." };
  }
  return { valid: true, error: null };
}

export function useMolecule(initialSmiles = "") {
  const [smiles, setSmiles] = useState(initialSmiles);

  const validation = useMemo(() => {
    const status = detectValidity(smiles);
    return {
      ...status,
      descriptor: status.valid ? mockDescriptor : null,
    };
  }, [smiles]);

  return {
    smiles,
    setSmiles,
    validate: detectValidity,
    validation,
  };
}
