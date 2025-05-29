import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import LoginForm from "./components/LoginForm";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";
import AddNewProduct from "./pages/AddNewProduct";
import EditProduct from "./pages/EditProduct";
import RoleBase from "./pages/RoleBase";
import Users from "./pages/Users";
import { ProductProvider } from "./contexts/ProductContext";

import { useEffect, useState } from "react";
import { LanguageProvider } from "./contexts/LanguageContext";

const queryClient = new QueryClient();

const AccessDenied = () => (
  <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-red-600">
    Access Denied
  </div>
);

const ProtectedRoute = ({
  children,
  pageId,
}: {
  children: React.ReactNode;
  pageId?: string;
}) => {
  const { user, isLoading, hasAccess } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  if (pageId && !hasAccess(pageId)) {
    return <AccessDenied />;
  }

  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  const { user } = useAuth();
  const [role, setRole] = useState('');

  useEffect(() => {
    setRole(user?.role);
  }, [user])

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to={role === "Manager" ? "/dashboard" : "/products"} replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute pageId="dashboard">
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute pageId="products">
            <Products />
          </ProtectedRoute>
        }
      />
      <Route
        path="/access"
        element={
          <ProtectedRoute pageId="access">
            <RoleBase />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute pageId="users">
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-product"
        element={
          <ProtectedRoute pageId="add-product">
            <AddNewProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-product/:id"
        element={
          <ProtectedRoute pageId="products">
            <EditProduct />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <LanguageProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <ProductProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </ProductProvider>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </LanguageProvider>
);

export default App;