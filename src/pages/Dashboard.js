import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar"; // Import Navbar Component
import "../styles/Dashboard.css"; // Import CSS file for Dashboard
import { db } from "../firebase/firebaseConfig"; // Firebase database
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore"; // Firebase methods

const Dashboard = () => {
  const [data, setData] = useState([]); // Data to display in the table
  const [name, setName] = useState(""); // Data input states
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true); // Loading state for data
  const [nextSerialId, setNextSerialId] = useState(10000); // Track next ID (initialize with 10000)
  const [isIdAscending, setIsIdAscending] = useState(true); // Track sorting order

  // Fetching data dynamically from Firebase Firestore
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "data"));
      const allData = querySnapshot.docs
        .map((doc) => ({
          ...doc.data(),
          id: doc.id, // include the document ID
        }))
        .sort((a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis()); // Sort data in descending order by default

      // Set next serial ID based on the largest current serial
      const lastId = allData.length > 0 ? Math.max(...allData.map((d) => d.serialId)) : 9999;
      setNextSerialId(lastId + 1);

      setData(allData); // Set the data to state
      setLoading(false); // Data loaded
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data on component load
  }, []); // Dependency is empty array so it runs once when the component mounts

  // Handling the form submission to add new data
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone) {
      alert("All fields are required.");
      return;
    }

    try {
      await addDoc(collection(db, "data"), {
        name,
        email,
        phone,
        serialId: nextSerialId, // Add unique serial ID
        status: "default", // Default status
        timestamp: serverTimestamp(), // Add timestamp
      });
      alert("Data added successfully!");

      // Clear form inputs
      setName(""); // Reset the name field
      setEmail(""); // Reset the email field
      setPhone(""); // Reset the phone field

      // Refresh the data
      fetchData(); // Fetch data after adding
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to add data.");
    }
  };

  // Handling the delete button click
  const handleDelete = async (id) => {
    try {
      const docRef = doc(db, "data", id);
      await deleteDoc(docRef);
      alert("Data deleted successfully!");
      fetchData(); // Refresh data after delete
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Failed to delete data.");
    }
  };

  // Handling status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      const docRef = doc(db, "data", id);
      await updateDoc(docRef, { status: newStatus });
      fetchData(); // Refresh the data to reflect the status change
    } catch (error) {
      console.error("Error updating status: ", error);
    }
  };

  // Sorting the data based on ID
  const handleSortById = () => {
    const sortedData = [...data].sort((a, b) => {
      return isIdAscending ? a.serialId - b.serialId : b.serialId - a.serialId;
    });
    setData(sortedData);
    setIsIdAscending(!isIdAscending); // Toggle sorting order
  };

  return (
    <div className="dashboard-wrapper">
      {/* Navbar */}
      <Navbar />
      <br />
      <br />
      <br />
      <br />
      <div className="main-content">
        <h2>Customer Data Base</h2>

        {/* Add Data Form */}
        <div className="data-form">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button type="submit">Add Data</button>
          </form>
        </div>
        <br /> <br />

        {/* Sorting Button */}
        <button onClick={handleSortById} className="sort-btn">
          Sort by ID ({isIdAscending ? "Ascending" : "Descending"})
        </button>
        <br /> <br />

        {/* Displaying the Data Table */}
        {loading ? (
          <div>Loading...</div> // Show loading message
        ) : (
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Serial ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry) => (
                  <tr
                    key={entry.id}
                    style={{
                      backgroundColor:
                        entry.status === "completed"
                          ? "#00ff003d"
                          : entry.status === "pending"
                          ? "#fff7003d"
                          : entry.status === "success"
                          ? "#ff00773d"
                          : "#ffffffaf",
                      color: entry.status !== "default" ? "white" : "black",
                    }}
                  >
                    <td>{entry.serialId}</td>
                    <td>{entry.name}</td>
                    <td>{entry.email}</td>
                    <td>{entry.phone}</td>
                    <td>
                      <select
                        value={entry.status}
                        onChange={(e) => handleStatusChange(entry.id, e.target.value)}
                      >
                        <option value="default">Default</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="success">Success</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(entry.id)} // Delete Action
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
