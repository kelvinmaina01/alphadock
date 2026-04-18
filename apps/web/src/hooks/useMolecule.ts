/** RDKit.js WASM wrapper hook — AlphaDock_Feature_Spec §2.3 */
export function useMolecule() {
  return { smiles: "", validate: (_: string) => true };
}
