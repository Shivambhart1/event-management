import { useEffect, useState } from "react";
import apiClient from "../apiClient";
import "../styles/Task.css";

function TaskComponent() {
  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTask, setNewTask] = useState({
    name: "",
    deadline: "",
    status: "Pending",
    assignedTo: "",
    eventId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [eventResponse, attendeeResponse, taskResponse] =
          await Promise.all([
            apiClient.get("/events"),
            apiClient.get("/attendees"),
            apiClient.get("/tasks"),
          ]);

        setEvents(eventResponse.data);
        setAttendees(attendeeResponse.data);

        // Enrich task data with attendee and event details before setting to state
        const enrichedTasks = taskResponse.data.map((task) => ({
          ...task,
          assignedToDetails: eventResponse.data.find(
            (a) => a._id === task.assignedTo
          ),
          eventDetails: attendeeResponse.data.find(
            (e) => e._id === task.eventId
          ),
        }));

        setTasks(enrichedTasks);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleAddTask = async () => {
    try {
      const response = await apiClient.post("/tasks", newTask);

      // Enrich the new task with attendee and event details
      const enrichedNewTask = {
        ...response.data,
        assignedToDetails: attendees.find(
          (a) => a._id === response.data.assignedTo
        ),
        eventDetails: events.find((e) => e._id === response.data.eventId),
      };

      setTasks((prevTasks) => [...prevTasks, enrichedNewTask]);
      setNewTask({
        name: "",
        deadline: "",
        status: "Pending",
        assignedTo: "",
        eventId: "",
      });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === "Pending" ? "Completed" : "Pending";
    try {
      const updatedTask = { ...task, status: newStatus };
      const response = await apiClient.put(`/tasks/${task._id}`, updatedTask);

      const enrichedUpdatedTask = {
        ...response.data,
        assignedToDetails: attendees.find(
          (a) => a._id === response.data.assignedTo
        ),
        eventDetails: events.find((e) => e._id === response.data.eventId),
      };

      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === task._id ? enrichedUpdatedTask : t))
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const getAssigneeName = (assignedTo) => {
    const attendee = attendees.find((a) => a._id === assignedTo);
    return attendee ? attendee.name : "N/A";
  };

  const getEventName = (eventId) => {
    const event = events.find((e) => e._id === eventId);
    return event ? event.name : "N/A";
  };

  if (isLoading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="task-container">
      <h1 className="header">Task Management</h1>
      <div className="add-task-form">
        <h3>Add Task to an Event</h3>
        <form>
          <select
            name="eventId"
            value={newTask.eventId}
            onChange={handleInputChange}
          >
            <option value="">Select Event</option>
            {events.length > 0 ? (
              events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.name}
                </option>
              ))
            ) : (
              <option disabled>No events available</option>
            )}
          </select>
          <input
            type="text"
            name="name"
            value={newTask.name}
            onChange={handleInputChange}
            placeholder="Task Name"
            required
          />
          <input
            type="date"
            name="deadline"
            value={newTask.deadline}
            onChange={handleInputChange}
          />
          <select
            name="status"
            value={newTask.status}
            onChange={handleInputChange}
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            name="assignedTo"
            value={newTask.assignedTo}
            onChange={handleInputChange}
          >
            <option value="">Assign Attendee</option>
            {attendees.map((attendee) => (
              <option key={attendee._id} value={attendee._id}>
                {attendee.name} ({attendee.email})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAddTask}
            className="add-task-btn"
            disabled={!newTask.name || !newTask.eventId}
          >
            Add Task
          </button>
        </form>
      </div>
      <div className="task-display">
        <h3>All Tasks</h3>
        {tasks.length > 0 ? (
          <div className="task-list">
            {tasks.map((task) => (
              <div key={task._id} className="task-card">
                <h5 className="task-name">Task Name: {task.name}</h5>
                <p className="task-deadline">
                  Deadline: {new Date(task.deadline).toLocaleDateString()}
                </p>
                <p className="task-status">Status: {task.status}</p>
                <p className="task-assigned">
                  Assigned To: {getAssigneeName(task.assignedTo)}
                </p>
                <p className="task-event">
                  Event: {getEventName(task.eventId)}
                </p>
                <div className="task-actions">
                  <button
                    onClick={() => handleToggleStatus(task)}
                    className="toggle-status-btn"
                  >
                    Toggle Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-tasks">No tasks available</p>
        )}
      </div>
    </div>
  );
}

export default TaskComponent;
