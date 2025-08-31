import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigate, Route, Routes, BrowserRouter } from "react-router";
import "./App.css";
import { Toaster } from "./components/ui/sonner";
import Home from "./routes";
import Login from "./routes/login";
import ProductsPage from "./routes/products";
import ProfilePage from "./routes/profile";
import { useAutoRefreshToken } from "./hooks/use-refresh-token";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

function App() {
  useAutoRefreshToken(5000);
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Navigate to={"/app/products"} replace />} />
          <Route path="/app" element={<Home />}>
            <Route path="products" element={<ProductsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Navigate to={"/login"} />} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
