import { useLayoutEffect, useRef } from "react";

/**
 * Custom Hook: useAutosizeTextArea
 *
 * This hook automatically adjusts the height of a `<textarea>` element based on its content.
 * It ensures:
 * - The textarea expands to fit the content dynamically.
 * - It does not exceed a specified `maxHeight`.
 * - It respects an optional border width for accurate height calculations.
 *
 * @param {Object} options - Hook options.
 * @param {React.RefObject<HTMLTextAreaElement>} options.ref - Reference to the textarea element.
 * @param {number} [options.maxHeight=Number.MAX_SAFE_INTEGER] - Maximum height limit for the textarea.
 * @param {number} [options.borderWidth=0] - The border width to consider in height calculations.
 * @param {Array} options.dependencies - Dependencies that trigger a height recalculation.
 */
export function useAutosizeTextArea({ ref, maxHeight = Number.MAX_SAFE_INTEGER, borderWidth = 0, dependencies }) {
  const originalHeight = useRef(null); // Stores the initial height of the textarea.

  useLayoutEffect(() => {
    if (!ref.current) return; // Ensure the ref is attached to a valid textarea element.

    const currentRef = ref.current;
    const borderAdjustment = borderWidth * 2; // Adjust for both top and bottom borders.

    // Store the original height on the first render
    if (originalHeight.current === null) {
      originalHeight.current = currentRef.scrollHeight - borderAdjustment;
    }

    // Reset the height to allow the textarea to shrink if necessary
    currentRef.style.removeProperty("height");

    // Get the current scroll height
    const scrollHeight = currentRef.scrollHeight;

    // Ensure the height does not exceed the maximum allowed height
    const clampedToMax = Math.min(scrollHeight, maxHeight);

    // Ensure the height does not shrink below the original height
    const clampedToMin = Math.max(clampedToMax, originalHeight.current);

    // Apply the final calculated height
    currentRef.style.height = `${clampedToMin + borderAdjustment}px`;

  }, [maxHeight, ref, ...dependencies]); // Recalculate height when dependencies change.
}
