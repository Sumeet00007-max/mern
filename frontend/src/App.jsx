import './App.css'
import { Route, Routes, useRoutes } from 'react-router-dom'
import Auth from './pages/auth/Auth'
import Dashboard from './pages/dashboard/Dashboard'
import Layout from './pages/layout/Layout'
import Settings from './pages/settings/Settings'
import { Analytics } from './pages/analytics/Analytics'
import Links from './pages/links/Links'


function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout/>} >
        <Route index element={<Dashboard/>} />
        <Route path="/links" element={<Links/>} />
        <Route path="/analytics" element={<Analytics/>} />
        <Route path="/settings" element={<Settings/>}/>
      </Route>
      <Route path="/auth" element={<Auth/>} />

    </Routes>
  )
}

export default App
