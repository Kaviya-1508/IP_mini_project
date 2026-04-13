import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleSelection from "../pages/RoleSelection";
import FacultyLogin from "../pages/Faculty/FacultyLogin";
import FacultyRegister from "../pages/Faculty/FacultyRegister";
import FacultyEvents from "../pages/Faculty/ViewEvents";
import AddEvent from "../pages/Faculty/AddEvent";
import EditEvent from "../pages/Faculty/EditEvent";  // ✅ Add this import
import StudentLogin from "../pages/Student/StudentLogin";
import StudentRegister from "../pages/Student/StudentRegister";
import StudentEvents from "../pages/Student/StudentEvents";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<RoleSelection />} />

        {/* Faculty Routes */}
        <Route path="/faculty/login" element={<FacultyLogin />} />
        <Route path="/faculty/register" element={<FacultyRegister />} />
        <Route path="/faculty/events" element={<FacultyEvents />} />
        <Route path="/faculty/add-event" element={<AddEvent />} />
        <Route path="/faculty/edit-event" element={<EditEvent />} />  {/* ✅ Add this line */}

        {/* Student Routes */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/student/events" element={<StudentEvents />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;