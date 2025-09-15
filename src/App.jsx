import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';
import { AuthProvider } from './context/AuthContext'
import { UserProfileProvider } from "./context/UserProfileContext"
import { useApiClientSetup } from './hooks/shared/useApiClient'

const Authentication = lazy(() => import('./pages/Authentication/Authentication'))
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'))
const EmployeesList = lazy(() => import('./pages/Employees List/EmployeesList'))
const Department = lazy(() => import('./pages/Department/Department'))
const AddAdmin = lazy(() => import('./pages/Add Admin/AddAdmin'))
  
function AppContent() {
  useApiClientSetup() 
  return (
    <AuthProvider>
      <UserProfileProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/authentication" element={<Authentication />}/>
          <Route path="/dashboard" element={<Dashboard />}/>
          <Route path="/employee-list" element={<EmployeesList />}/>
          <Route path="/department" element={<Department />}/>
          <Route path="/add-admin" element={<AddAdmin />}/>
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
