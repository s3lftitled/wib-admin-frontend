import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';

const Authentication = lazy(() => import('./pages/Authentication/Authentication'))
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'))
const EmployeesList = lazy(() => import('./pages/Employees List/EmployeesList'))
const AddAdmin = lazy(() => import('./pages/Add Admin/AddAdmin'))
const AddEmployee = lazy(() => import('./pages/Add Employee/AddEmployee'))
  
function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/authentication" element={<Authentication />}/>
          <Route path="/Dashboard" element={<Dashboard />}/>
          <Route path="/EmployeesList" element={<EmployeesList />}/>
          <Route path="/AddAdmin" element={<AddAdmin />}/>
          <Route path="/AddEmployee" element={<AddEmployee />}/>
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
