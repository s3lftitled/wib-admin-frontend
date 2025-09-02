import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';

const Authentication = lazy(() => import('./pages/Authentication/Authentication'))

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/authentication" element={<Authentication />}/>
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
