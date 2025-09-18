import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';
import { AuthProvider } from './context/AuthContext'
import { UserProfileProvider } from "./context/UserProfileContext"
import ApiPersistWrapper from './components/ApiPersistWrapper' 
import ROLE_CONSTANT from "./constants/RoleConstants";

const Authentication = lazy(() => import('./pages/Authentication/Authentication'))
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'))
const EmployeesList = lazy(() => import('./pages/Employees List/EmployeesList'))
const Department = lazy(() => import('./pages/Department/Department'))
const AddAdmin = lazy(() => import('./pages/Add Admin/AddAdmin'))
const Settings = lazy(() => import('./pages/Settings/Settings'))
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'))
  
function AppContent() {
  return (
    <AuthProvider>
      <UserProfileProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Public routes - no persist wrapper needed */}
            <Route path="/authentication" element={<Authentication />}/>

            {/* Protected routes wrapped with ApiPersistWrapper */}
            <Route element={<ApiPersistWrapper />}>
              <Route element={<ProtectedRoute allowedRoles={ROLE_CONSTANT[101]} />}>
                <Route path="/dashboard" element={<Dashboard />}/>
                <Route path="/employee-list" element={<EmployeesList />}/>
                <Route path="/department" element={<Department />}/>
                <Route path="/add-admin" element={<AddAdmin />}/>
                <Route path="/settings" element={<Settings />}/>
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </UserProfileProvider>
    </AuthProvider>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App