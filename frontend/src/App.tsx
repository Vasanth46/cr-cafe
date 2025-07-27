import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import MenuPage from "./pages/MenuPage";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from './pages/UsersPage';
import CafeMenuPage from './pages/CafeMenuPage';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-cafe-light font-sans">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute allowedRoles={["WORKER", "MANAGER"]} /> }>
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
      </Router>
    </AuthProvider>
  );
}

export default App;
