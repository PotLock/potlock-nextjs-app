import { HelpCircle } from "lucide-react";

const DOCS_URL = "https://docs.potlock.io";

export const FloatingDocsButton = () => (
  <a
    href={DOCS_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Open documentation"
    title="Docs"
    className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#dd3345] text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#c52d3d] focus:outline-none focus:ring-2 focus:ring-[#dd3345] focus:ring-offset-2"
  >
    <HelpCircle className="h-6 w-6" />
  </a>
);
