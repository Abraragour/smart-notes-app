import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout/Layout'
import Notfound from './Components/Notfound/Notfound'
import Home from './Components/Home/Home';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'
import UsercontextProvider from './Context/userContext'
import Auth from './Components/Auth/Auth';
import NoteContextProvider from './Context/noteContext'
import { Toaster } from 'react-hot-toast'
function App() {

  let x = createBrowserRouter([
    {
      path: '/', 
      element: <Layout />, 
      children: [
        { index: true, element: <Auth /> }, 
        
        { path: 'home', element: <ProtectedRoute><Home /></ProtectedRoute> },
        
        { path: 'login', element: <Auth /> },
        { path: 'signUp', element: <Auth/> },
        
        { path: '*', element: <Notfound /> },
      ]
    },
  ])

  return (
    
    <UsercontextProvider>
  <NoteContextProvider>
      <RouterProvider router={x} />
              <Toaster/>
  </NoteContextProvider>

    </UsercontextProvider>
  )
}

export default App