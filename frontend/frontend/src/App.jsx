import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/UserLogin/Login';
import Register from './components/UserSignup/Signup'; // Adjust path if needed
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
