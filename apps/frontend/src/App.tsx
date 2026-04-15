import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { EVENTS } from "@monorepo/shared";
import { trackEvent } from "./utils/analytics";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ConsentBanner from "./components/ConsentBanner";

// separate component so it can use useLocation inside Router
const RouteTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    trackEvent(EVENTS.PAGE_VIEW, {
      page_name: location.pathname,
      referrer: document.referrer,
    });
  }, [location.pathname]);

  return null;
};

const App: React.FC = () => (
  <AdminAuthProvider>
    <Router>
      <div className="min-h-screen bg-brand-bg selection:bg-brand-accent selection:text-white">
        <RouteTracker /> {/* ← fires page_view on every route change */}
        <ConsentBanner />
        <NavBar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  </AdminAuthProvider>
);

export default App;
