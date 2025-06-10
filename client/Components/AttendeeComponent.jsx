import { useState, useEffect } from "react";
import apiClient from "../apiClient";
import "../styles/Attendee.css";

const AttendeeComponent = () => {
  const [attendees, setAttendees] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendeesAndTasks = async () => {  
      try {
        setLoading(true);
        const { data: attendeesData } = await apiClient.get("/attendees");
        setAttendees(attendeesData);
        console.log(attendeesData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data: " + err.message);
        setLoading(false);
      }
    };

    fetchAttendeesAndTasks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateAttendee = async (e) => {
    e.preventDefault();
    if (loading) return;
    try {
      const { data } = await apiClient.post("/attendees", form);
      setAttendees((prev) => [...prev, data.attendee]);
      setForm({ name: "", email: "" });
    } catch (err) {
      setError("Failed to create attendee: " + err.message);
    }
  };

  const handleDeleteAttendee = async (id) => {
    if (loading) return;
    try {
      await apiClient.delete(`/attendees/${id}`);
      setAttendees((prev) => prev.filter((attendee) => attendee._id !== id));
    } catch (err) {
      setError("Failed to delete attendee: " + err.message);
    }
  };

  return (
    <div className="attendee-container">
      <h1>Attendee Manager</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleCreateAttendee} className="attendee-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Enter name"
            value={form.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            placeholder="Enter email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="create-attendee-btn"
        >
          Create Attendee
        </button>
      </form>

      <h2>Attendee List</h2>
      <ul className="attendee-list">
        {attendees?.map((attendee) => (
          <li key={attendee._id} className="attendee-item">
            <p className="attendee-details">
              <strong>{attendee.name}</strong>
              <br />
              <span>Email: {attendee.email}</span>
              <br />
              <span>ID: {attendee._id}</span>
            </p>

            {attendee.assignedTasks && attendee.assignedTasks.length > 0 && (
              <>
                <p>Assigned Tasks:</p>
                <ul>
                  {attendee?.assignedTasks?.map((task) => (
                    <li key={task._id}>
                      <p>
                        <strong>Task Name: </strong>
                        {task.name}
                      </p>
                      <p>
                        <strong>Deadline: </strong>
                        {task.deadline}
                      </p>
                      <p>
                        <strong>Status: </strong>
                        {task.status}
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <button
              onClick={() => handleDeleteAttendee(attendee._id)}
              disabled={loading}
              className="attendee-delete-btn"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttendeeComponent;
