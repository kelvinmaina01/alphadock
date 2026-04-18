/** Agent WebSocket connection + message state — AlphaDock_Repo_Guide §1.2 */
export function useAgentSession() {
  return { messages: [] as string[], send: (_: string) => undefined };
}
