import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item">
            <a href="/attendees">ATTENDEES</a>
          </li>
          <li className="nav-item">
            <a href="/events">EVENTS</a>
          </li>
          <li className="nav-item">
            <a href="/tasks">TASKS</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
