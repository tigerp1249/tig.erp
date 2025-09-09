import { Routes, Route, Link } from "react-router-dom";
import Assignments from "../components/pages/Assignments";
import Attendance from "../components/pages/Attendance";
import LoginPage from "../components/pages/LoginPage";
import Notifications from "../components/pages/Notifications";
import Profile from "../components/pages/Profile";
import Results from "../components/pages/Results";
import Subjects from "../components/pages/Subjects";
import Timetable from "../components/pages/Timetable";

function Home() { return <div className="p-6">Home</div>; }

export default function App() {
  return (
    <div className="min-h-screen">
      <nav className="p-4 border-b flex gap-4 flex-wrap">
        <Link to="/">Home</Link>
        <Link to="/assignments">Assignments</Link>
        <Link to="/attendance">Attendance</Link>
        <Link to="/login">Login</Link>
        <Link to="/notifications">Notifications</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/results">Results</Link>
        <Link to="/subjects">Subjects</Link>
        <Link to="/timetable">Timetable</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/assignments" element={<Assignments/>} />
        <Route path="/attendance" element={<Attendance/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/notifications" element={<Notifications/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/results" element={<Results/>} />
        <Route path="/subjects" element={<Subjects/>} />
        <Route path="/timetable" element={<Timetable/>} />
      </Routes>
    </div>
  );
}
