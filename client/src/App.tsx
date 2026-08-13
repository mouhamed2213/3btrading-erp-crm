import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CatalogueDetail from "./pages/CatalogueDetail";
import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Chantiers from "./pages/admin/Chantiers";
import Locations from "./pages/admin/Locations";
import Boutique from "./pages/admin/Boutique";
import Catalogue from "./pages/admin/Catalogue";
import Atelier from "./pages/admin/Atelier";
import Facturation from "./pages/admin/Facturation";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/catalogue/:type/:id" component={CatalogueDetail} />
      <Route path="/admin" component={() => <AdminLayout><Dashboard /></AdminLayout>} />
      <Route path="/admin/chantiers" component={() => <AdminLayout><Chantiers /></AdminLayout>} />
      <Route path="/admin/locations" component={() => <AdminLayout><Locations /></AdminLayout>} />
      <Route path="/admin/boutique" component={() => <AdminLayout><Boutique /></AdminLayout>} />
      <Route path="/admin/catalogue" component={() => <AdminLayout><Catalogue /></AdminLayout>} />
      <Route path="/admin/atelier" component={() => <AdminLayout><Atelier /></AdminLayout>} />
      <Route path="/admin/facturation" component={() => <AdminLayout><Facturation /></AdminLayout>} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
