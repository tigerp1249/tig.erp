import { Routes, Route, Link } from "react-router-dom";

function Home() { return <div className="p-6">Home</div>; }
function Login() { return <div className="p-6">Login</div>; }

export default function App() {
  return (
    <div className="min-h-screen">
      <nav className="p-4 border-b flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </div>
  );
}
