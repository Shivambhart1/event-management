import { useEffect, useState } from "react";
import apiClient from "../apiClient";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Event.css";

function EventComponent() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    location: "",
    date: "",
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiClient.get("/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const selectedDay = new Date(selectedDate).toLocaleDateString("en-CA");
      const eventsForDate = events.filter((event) => {
        const eventDay = new Date(event.date).toLocaleDateString("en-CA");
        return eventDay === selectedDay;
      });
      setFilteredEvents(eventsForDate);
    } else {
      setFilteredEvents(events);
    }
  }, [selectedDate, events]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = async () => {
    try {
      const response = await apiClient.post("/events", newEvent);
      setEvents([...events, response.data]);
      setNewEvent({ name: "", description: "", location: "", date: "" });
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setNewEvent({ ...event });
  };

  const handleSaveEvent = async () => {
    try {
      const response = await apiClient.put(
        `/events/${editingEvent._id}`,
        newEvent
      );
      const updatedEvents = events?.map((event) =>
        event._id === editingEvent._id ? response.data : event
      );
      setEvents(updatedEvents);
      setEditingEvent(null);
      setNewEvent({ name: "", description: "", location: "", date: "" });
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await apiClient.delete(`/events/${id}`);
      setEvents(events.filter((event) => event._id !== id));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="event-container">
      <h1 className="header">Event Management</h1>
      <div className="event-form-and-calendar">
        <div className="form-container">
          <h2 className="form-title">
            {editingEvent ? "Edit Event" : "Add New Event"}
          </h2>
          <div className="form-fields">
            <input
              type="text"
              name="name"
              value={newEvent.name}
              onChange={handleInputChange}
              placeholder="Event Name"
              className="input-field"
            />
            <input
              type="text"
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
              placeholder="Event Description"
              className="input-field"
            />
            <input
              type="text"
              name="location"
              value={newEvent.location}
              onChange={handleInputChange}
              placeholder="Event Location"
              className="input-field"
            />
            <input
              type="date"
              name="date"
              value={newEvent.date}
              onChange={handleInputChange}
              className="input-field"
            />
            {editingEvent ? (
              <button onClick={handleSaveEvent} className="save-btn">
                Save Event
              </button>
            ) : (
              <button onClick={handleAddEvent} className="add-event-btn">
                Add Event
              </button>
            )}
          </div>
        </div>
        <div className="calendar-container">
          <Calendar onChange={setSelectedDate} value={selectedDate} />
        </div>
      </div>
      <div className="event-list">
        {filteredEvents.length === 0 ? (
          <p className="no-events">No events found</p>
        ) : (
          filteredEvents?.map((event) => (
            <div key={event._id} className="event-card">
              <h5 className="event-name">{event.name}</h5>
              <p className="event-description">{event.description}</p>
              <p className="event-location">Location: {event.location}</p>
              <p className="event-date">
                Date: {new Date(event.date).toLocaleDateString()}
              </p>
              <div className="event-actions">
                <button
                  onClick={() => handleEditEvent(event)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEvent(event._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default EventComponent;
