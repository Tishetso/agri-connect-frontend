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

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/farmer" element={<FarmerDashboard />} />
          <Route path="/consumer" element={<ConsumerDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
            <Route path="/logout" element={<LogoutHandler />} />
            <Route path="/" element={<WelcomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/farmer/listings" element={<ListingsPage/>}/>
            <Route path="/farmer/alerts" element={<Alerts/>}/>
            <Route path="/farmer/chatroom" element={<Chatroom/>}/>
            <Route path="/settings" element={<SettingsPage/>}/>





        </Routes>
      </Router>
  );
}

export default App;
