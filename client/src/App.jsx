import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"

import LoginScreen from "./screens/LoginScreen.jsx"
import ChatScreen from "./screens/ChatScreen.jsx"


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/chat" element={<ChatScreen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App