import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';
import { AuthProvider } from './context/AuthContext'
import { UserProfileProvider } from "./context/UserProfileContext"
import { useApiClientSetup } from './hooks/shared/useApiClient'
import ROLE_CONSTANT from "./constants/RoleConstants";

const Authentication = lazy(() => import('./pages/Authentication/Authentication'))
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'))
const EmployeesList = lazy(() => import('./pages/Employees List/EmployeesList'))
const AddAdmin = lazy(() => import('./pages/Add Admin/AddAdmin'))
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'))
  
function AppContent() {
  useApiClientSetup() 
  return (
    <AuthProvider>
      <UserProfileProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/authentication" element={<Authentication />}/>

          <Route element={<ProtectedRoute allowedRoles={ROLE_CONSTANT[101]} />}>
            <Route path="/*" />
            <Route path="/dashboard" element={<Dashboard />}/>
            <Route path="/employee-list" element={<EmployeesList />}/>
            <Route path="/add-admin" element={<AddAdmin />}/>
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
