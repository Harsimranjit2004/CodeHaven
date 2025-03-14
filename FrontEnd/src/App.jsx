import { useState } from 'react'
import { ClerkProvider } from '@clerk/clerk-react'
import ReactDOM from "react-dom/client";
import Landing from './pages/Landing';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'

import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import NewDeployment from './pages/NewDeployments';
import ProjectDetails from './components/ProjectDetails';

const clerkFrontendApi = "pk_test_c3RlcmxpbmctdGFkcG9sZS03NS5jbGVyay5hY2NvdW50cy5kZXYk";
function App() {
  const [count, setCount] = useState(0)

  return (
    <ClerkProvider publishableKey={clerkFrontendApi}>

      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path='/new-deployment' element={<NewDeployment/>}/>
          <Route path='/detail' element={<ProjectDetails/>}/>
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  )
}

export default App
