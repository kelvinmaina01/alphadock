/** Engine names, descriptions — AlphaDock_Feature_Spec §2.1 */
export const ENGINES = ["vina", "gnina", "diffdock"] as const;
export type DockingEngine = (typeof ENGINES)[number];
