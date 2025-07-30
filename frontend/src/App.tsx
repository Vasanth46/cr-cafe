import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import MenuPage from "./pages/MenuPage";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from './pages/UsersPage';
import CafeMenuPage from './pages/CafeMenuPage';
import './index.css';
import { ToasterProvider } from './components/Toaster';

// This internal component has access to the Router's context
const AppContent = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-cafe-light font-sans">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute allowedRoles={["WORKER", "MANAGER"]} />}>
            <Route path="/menu" element={<MenuPage />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["OWNER"]} /> }>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/cafe-menu" element={<CafeMenuPage />} />
          </Route>
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

function App() {
  return (
    <Router>
      <ToasterProvider>
        <AppContent />
      </ToasterProvider>
    </Router>
  );
}

export default App;
