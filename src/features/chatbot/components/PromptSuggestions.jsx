/**
 * PromptSuggestions Component
 *
 * This component displays a list of prompt suggestions.
 * When a user clicks on a suggestion, it gets appended to the chat input.
 *
 * Props:
 * - label (string): A heading displayed above the suggestions.
 * - append (function): Function to add the selected suggestion to the chat input.
 * - suggestions (array): An array of suggested prompts.
 */
function PromptSuggestions({ label, append, suggestions }) {
    return (
      <div className="space-y-6">
        <h2 className="text-center text-2xl font-bold">{label}</h2>
        <div className="flex gap-6 text-sm">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => append({ role: "user", content: suggestion })}
              className="h-max flex-1 rounded-xl border bg-background p-4 hover:bg-muted"
            >
              <p>{suggestion}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  export default PromptSuggestions;
  