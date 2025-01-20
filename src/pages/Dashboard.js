// Dashboard.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';  // Import Navbar Component
import '../styles/Dashboard.css';  // Import CSS file for Dashboard
import { db } from "../firebase/firebaseConfig";  // Firebase database
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';  // Firebase methods

const Dashboard = () => {
  const [data, setData] = useState([]);  // Data to display in the table
  const [name, setName] = useState("");  // Data input states
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);  // Loading state for data

  // Fetching data dynamically from Firebase Firestore
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "data"));
      const allData = querySnapshot.docs.map((doc, index) => ({
        ...doc.data(),
        id: doc.id,  // include the document ID
      }));
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
      const docRef = await addDoc(collection(db, "data"), {
        name,
        email,
        phone,
      });
      alert("Data added successfully!");
      
      // Clear form inputs
      setName("");  // Reset the name field
      setEmail("");  // Reset the email field
      setPhone("");  // Reset the phone field

      // Refresh the data
      
      
      // Optionally refresh the entire page (page reload)
      window.location.reload();
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
      fetchData();  // Refresh data after delete
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Failed to delete data.");
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Navbar */}
      <Navbar />
<br/><br/><br/><br/>
      <div className="main-content">
        <h2>Public Data Base</h2>

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
<br/> <br/>
        {/* Displaying the Data Table */}
        {loading ? (
          <div>Loading...</div> // Show loading message
        ) : (
            <div className="data-table">
            
            <table>
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry, index) => (
                  <tr key={entry.id}>
                    <td>{index + 1}</td> {/* Serial Number */}
                    <td>{entry.name}</td>
                    <td>{entry.email}</td>
                    <td>{entry.phone}</td>
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
