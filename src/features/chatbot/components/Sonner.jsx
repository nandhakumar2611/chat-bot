import { useTheme } from "next-themes"; // Hook to manage dark/light themes
import { Toaster as Sonner } from "sonner"; // Importing Sonner as Toaster

/**
 * Custom Toaster component using Sonner for toast notifications.
 * It supports Next.js themes and applies custom styles.
 */
const Toaster = ({ ...props }) => {
  // Get the current theme (default to "system" if undefined)
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme} // Passes the current theme (light/dark/system)
      className="toaster group" // Base styling for the toaster
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground", // Styling for description text
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-medium", // Style for action button
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-medium", // Style for cancel button
        },
      }}
      {...props} // Spread any additional props (e.g., position, duration, etc.)
    />
  );
};

export { Toaster }; // Export the component
