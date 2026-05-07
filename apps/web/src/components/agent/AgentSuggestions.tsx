interface AgentSuggestionsProps {
  suggestions: string[];
  onPick: (value: string) => void;
}

export function AgentSuggestions({
  suggestions,
  onPick,
}: AgentSuggestionsProps) {
  return (
    <div className="agent-suggestions">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          className="chip"
          type="button"
          onClick={() => onPick(suggestion)}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
