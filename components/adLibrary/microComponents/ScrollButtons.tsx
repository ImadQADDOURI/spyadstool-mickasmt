import { useCallback } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

import { Button } from "../../ui/button";

export const ScrollButtons = () => {
  const scrollTo = useCallback((position: "top" | "bottom") => {
    window.scrollTo({
      top: position === "top" ? 0 : document.body.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="fixed bottom-16 right-4 flex flex-col space-y-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => scrollTo("top")}
        className="rounded-full bg-white p-3 text-gray-800 shadow-md transition-all hover:bg-gray-100 hover:shadow-lg dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => scrollTo("bottom")}
        className="rounded-full bg-white p-3 text-gray-800 shadow-md transition-all hover:bg-gray-100 hover:shadow-lg dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        aria-label="Scroll to bottom"
      >
        <ArrowDown className="h-5 w-5" />
      </Button>
    </div>
  );
};
