import { Route, Routes } from "react-router-dom";
import GuestOrderPage from "./pages/GuestOrderPage";
import GuestShopPage from "./pages/GuestShopPage";
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

      {/* Guarded pages */}
      {/* <Router path='/shop'/> */}

      {/* Public pages */}
      <Route path="/s/:shopPublicId" element={<GuestShopPage />} />
      <Route path="/s/:shopPublicId/:number" element={<GuestOrderPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
