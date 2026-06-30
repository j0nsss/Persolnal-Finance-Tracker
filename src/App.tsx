import { useEffect, useState } from "react";
import { ThemeProvider } from "./context/ThemeProvider";
import { StyleGuide } from "./pages/dev/StyleGuide";

function App() {
  const [isStyleGuide, setIsStyleGuide] = useState(false);

  useEffect(() => {
    setIsStyleGuide(window.location.pathname.startsWith("/dev/styleguide"));
  }, []);

  if (isStyleGuide) {
    return (
      <ThemeProvider>
        <StyleGuide />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-base-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display font-bold text-5xl mb-4">NeoFin</h1>
          <p className="font-body text-lg mb-8">Personal Finance Tracker</p>
          <div className="flex gap-4 justify-center">
            <a
              href="/dev/styleguide"
              className="font-display font-bold rounded-brutal border-3 border-base-ink bg-accent-lime px-6 py-3 shadow-brutal hover:shadow-brutal-lg transition-shadow"
            >
              Style Guide
            </a>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
