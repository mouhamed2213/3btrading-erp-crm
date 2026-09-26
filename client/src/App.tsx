import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import AdminLayout from "./components/layout/AdminLayout";
import { ThemeProvider } from "./contexts/ThemeContext";
import Atelier from "./pages/admin/Atelier";
import Boutique from "./pages/admin/Boutique";
import Catalogue from "./pages/admin/Catalogue";
import Chantiers from "./pages/admin/Chantiers";
import Dashboard from "./pages/admin/Dashboard";
import Facturation from "./pages/admin/Facturation";
import Locations from "./pages/admin/Locations";
import CatalogueDetail from "./pages/CatalogueDetail";
import Home from "./pages/Home";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalogue/:type/:id" element={<CatalogueDetail />} />
      <Route
        path="/admin"
        element={
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/chantiers"
        element={
          <AdminLayout>
            <Chantiers />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/locations"
        element={
          <AdminLayout>
            <Locations />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/boutique"
        element={
          <AdminLayout>
            <Boutique />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/catalogue"
        element={
          <AdminLayout>
            <Catalogue />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/atelier"
        element={
          <AdminLayout>
            <Atelier />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/facturation"
        element={
          <AdminLayout>
            <Facturation />
          </AdminLayout>
        }
      />
      <Route path="/404" element={<NotFound />} />
      {/* Final fallback route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
