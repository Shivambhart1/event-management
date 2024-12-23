const HomeComponent = () => {
  return (
    <>
      <div>
        <h1
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            padding: "2rem",
            textAlign: "center",
            backgroundColor: "#f5f5f5",
            color: "#2d3748",
          }}
        >
          EVENT MANAGEMENT SYSTEM <br />
        </h1>
        <h3
          style={{
            textAlign: "center",
            color: "#4a5568",
            position: "relative",
            top: "-380px",
          }}
        >
          Please navigate to the respective tabs to manage events, tasks, and
          attendees.
        </h3>
      </div>
    </>
  );
};

export default HomeComponent;
