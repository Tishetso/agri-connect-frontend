import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FarmerDashboard from './pages/Farmer/Dashboard';
import ConsumerDashboard from './pages/Consumer/ConsumerDashboard';
import AdminPanel from './pages/Admin/AdminDashboard';
import LogoutHandler from './pages/Auth/LogoutHandler';
import WelcomePage from "./pages/WelcomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ListingsPage from "./pages/Farmer/ListingsPage";
import Alerts from "./components/Alerts";
import Chatroom from "./components/Chatroom";
import SettingsPage from "./components/SettingsPage";
import FarmerLayout from "./layouts/FarmerLayout";
import ConsumerLayout from "./layouts/ConsumerLayout";

function App() {
  return (
      <Router>
        <Routes>
          {/* Farmer Routes */}
          <Route path="/farmer" element={
            <FarmerLayout>
              <FarmerDashboard/>
            </FarmerLayout>
          }
          />
          <Route path="/farmer/listings" element={
            <FarmerLayout>
              <ListingsPage/>
            </FarmerLayout>
          }
          />
          <Route path="/farmer/alerts" element={
            <FarmerLayout>
              <Alerts/>
            </FarmerLayout>
          }
          />
          <Route path="/farmer/chatroom" element={
            <FarmerLayout>
              <Chatroom/>
            </FarmerLayout>
          }/>
          <Route path="/farmer/settings" element={
            <FarmerLayout>
              <SettingsPage/>
            </FarmerLayout>
          }
          />

          {/* Consumer Routes */}
          <Route path="/consumer" element={
            <ConsumerLayout>
              <ConsumerDashboard/>
            </ConsumerLayout>
          }
          />
          <Route path="/consumer/garden" element={
            <ConsumerLayout>
              {/* GardenPlannerPage component */}
            </ConsumerLayout>
          }
          />
          <Route path="/consumer/orders" element={
            <ConsumerLayout>
              {/* OrdersPage component */}
            </ConsumerLayout>
          }
          />
          <Route path="/consumer/chatroom" element={
            <ConsumerLayout>
              <Chatroom/>
            </ConsumerLayout>
          }
          />
          <Route path="/consumer/settings" element={
            <ConsumerLayout>
              <SettingsPage/>
            </ConsumerLayout>
          }
          />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminPanel />} />

          {/* Auth Routes */}
          <Route path="/logout" element={<LogoutHandler />} />
          <Route path="/" element={<WelcomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Router>
  );
}

export default App;
