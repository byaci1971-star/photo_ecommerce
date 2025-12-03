import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Category from "@/pages/Category";
import Product from "@/pages/Product";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Account from "@/pages/Account";
import Subcategory from "@/pages/Subcategory";
import SearchResults from "@/pages/SearchResults";
import PhotoConfigurator from "@/pages/PhotoConfigurator";
import PhotoBookConfigurator from "@/pages/PhotoBookConfigurator";
import CalendarConfigurator from "@/pages/CalendarConfigurator";
import GiftConfigurator from "@/pages/GiftConfigurator";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/category/:id"} component={Category} />
      <Route path={"/product/:id"} component={Product} />
      <Route path={"/cart"} component={Cart} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/account"} component={Account} />
      <Route path={"/category/:categoryId/subcategory/:subcategoryId"} component={Subcategory} />
      <Route path={"/search"} component={SearchResults} />
      <Route path={"/create/photo"} component={PhotoConfigurator} />
      <Route path={"/create/book"} component={PhotoBookConfigurator} />
      <Route path={"/create/calendar"} component={CalendarConfigurator} />
      <Route path={"/create/gift"} component={GiftConfigurator} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
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
