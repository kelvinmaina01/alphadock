/** Axios instance, auth interceptors, retry — AlphaDock_Repo_Guide §1.2 (use fetch/axios when wired). */
export const apiBase = "/api/v1";

export async function getMeta(): Promise<{ name: string; api_version: string }> {
  const r = await fetch(`${apiBase}/meta`);
  if (!r.ok) throw new Error(`meta ${r.status}`);
  return r.json() as Promise<{ name: string; api_version: string }>;
}
