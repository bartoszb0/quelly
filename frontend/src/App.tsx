import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ShopPage from "./pages/dashboard/shop/ShopPage";
import GuestOrderPage from "./pages/guest-order/GuestOrderPage";
import GuestShopPage from "./pages/guest-shop/GuestShopPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <Routes>
      {/* Auth and homepage */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Guarded dashboard */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/shop/:shopId" element={<ShopPage />} />
      </Route>

      {/* Public pages */}
      <Route path="/s/:shopPublicId" element={<GuestShopPage />} />
      <Route
        path="/s/:shopPublicId/:orderNumber"
        element={<GuestOrderPage />}
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
