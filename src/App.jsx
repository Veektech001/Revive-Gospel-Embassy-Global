import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import LeadershipPage from "./pages/Leadership";
import FirstTimePage from "./pages/FirstTime";
import SermonsPage from "./pages/Sermons";
import GivePage from "./pages/Give";
import NotFoundPage from "./pages/NotFound";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-flame focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/leadership" element={<LeadershipPage />} />
          <Route path="/first-time" element={<FirstTimePage />} />
          <Route path="/sermons" element={<SermonsPage />} />
          <Route path="/give" element={<GivePage />} />
          {/* Old addresses still work */}
          <Route path="/firstTime" element={<Navigate to="/first-time" replace />} />
          <Route path="/sermon" element={<Navigate to="/sermons" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
