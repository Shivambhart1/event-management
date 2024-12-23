import Navbar from "../Components/Navbar";
import AttendeeComponent from "../Components/AttendeeComponent";
import EventComponent from "../Components/EventComponent";
import TaskComponent from "../Components/TaskComponent";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeComponent from "../Components/HomeComponent";

function App() {
  return (
    <>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<HomeComponent />} />
          <Route path="/attendees" element={<AttendeeComponent />} />
          <Route path="/events" element={<EventComponent />} />
          <Route path="/tasks" element={<TaskComponent />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
