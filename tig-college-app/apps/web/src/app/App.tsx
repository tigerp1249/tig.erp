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
