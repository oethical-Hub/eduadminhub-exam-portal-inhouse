import { useEffect } from "react";

/**
 * Hook to prevent common exam cheating methods
 * - Disable right-click
 * - Disable keyboard shortcuts (Ctrl+C, Ctrl+V, Ctrl+A, F12, etc.)
 * - Disable text selection
 * - Disable developer tools shortcuts
 */
export const useExamSecurity = (enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled) return;

    // Prevent right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12 (Developer Tools)
      if (e.key === "F12") {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+Shift+I (Developer Tools)
      if (e.ctrlKey && e.shiftKey && e.key === "I") {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === "J") {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.key === "C") {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+U (View Source)
      if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+S (Save Page)
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+P (Print)
      if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
        return false;
      }

      // Allow Ctrl+Z (Undo) and other safe shortcuts
      // But disable copy/paste during exam
      if (e.ctrlKey && (e.key === "c" || e.key === "v" || e.key === "x" || e.key === "a")) {
        e.preventDefault();
        return false;
      }
    };

    // Prevent text selection (optional - can be too restrictive)
    const handleSelectStart = (e: Event) => {
      // Allow selection for answering questions, but prevent on question text
      // This is handled more granularly in components
      // e.preventDefault();
    };

    // Prevent drag
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("dragstart", handleDragStart);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, [enabled]);
};

