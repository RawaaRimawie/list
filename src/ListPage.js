import React, { useState, useEffect } from "react";
import "./ListPageStyle.css";

export default function ListPage() {
    const [todoList, settodoList] = useState([]);
    const [editDevice, setEditDevice] = useState(null);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addTaskTitle, setAddTaskTitle] = useState("");
    const [addTaskDescription, setAddTaskDescription] = useState("");
    const [addAvatar, setAddAvatar] = useState(""); // State for avatar image
    const [searchTerm, setSearchTerm] = useState(""); // State for search functionality
    const [deleteItemId, setDeleteItemId] = useState(null); // State for delete confirmation

    // Load tasks from localStorage on component mount
    useEffect(() => {
        const storedtodoList = localStorage.getItem("todoList");
        if (storedtodoList) {
            settodoList(JSON.parse(storedtodoList));
        }
    }, []);

    // Save tasks to localStorage whenever todoList state changes
    useEffect(() => {
        if (todoList.length > 0) {
            localStorage.setItem("todoList", JSON.stringify(todoList));
        }
    }, [todoList]);

    // Handle avatar file input
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAddAvatar(reader.result); // Store the uploaded image
            };
            reader.readAsDataURL(file);
        }
    };

    // Search functionality
    const filteredtodoList = todoList.filter(device =>
        device.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Delete handler
    const handleDelete = () => {
        settodoList(todoList.filter(device => device.id !== deleteItemId));
        setDeleteItemId(null);
    };

    // Edit handler
    const handleEditClick = (device) => {
        setEditDevice(device);
        setNewTitle(device.title);
        setNewDescription(device.description);
    };

    // Save edited task
    const handleSaveClick = () => {
        settodoList(todoList.map(device =>
            device.id === editDevice.id
                ? { ...device, title: newTitle, description: newDescription }
                : device
        ));
        setEditDevice(null);
        setNewTitle("");
        setNewDescription("");
    };

    // Save new task
    const handleAddTask = () => {
        const newTask = {
            id: todoList.length + 1,
            avatar: addAvatar || `https://robohash.org/${todoList.length + 1}`,
            title: addTaskTitle,
            description: addTaskDescription,
            checked: false, // Initialize checked state
        };
        settodoList([...todoList, newTask]);
        setIsAddModalOpen(false);
        setAddTaskTitle("");
        setAddTaskDescription("");
        setAddAvatar(""); // Reset avatar state after adding
    };

    // Handle checkbox change
    const handleCheckboxChange = (id) => {
        settodoList(todoList.map(device =>
            device.id === id
                ? { ...device, checked: !device.checked }
                : device
        ));
    };

    return (
        <div className="container">
            <h1 className="page-title">TODOLIST</h1>

            <div className="input-section">
                <input
                    id="search-field"
                    placeholder="Search..."
                    value={searchTerm} // Bind input value to searchTerm
                    onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on input change
                />
                <button onClick={() => setIsAddModalOpen(true)}>Add</button>
            </div>

            <div className="table-container">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">Avatar</th>
                            <th scope="col">Task Title</th>
                            <th scope="col">Task Description</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredtodoList.map((device) => (
                            <tr key={device.id} className={device.checked ? "checked" : ""}>
                                <td>
                                    <input
                                        type="checkbox"
                                        className="checkbox-select"
                                        checked={device.checked}
                                        onChange={() => handleCheckboxChange(device.id)}
                                    />
                                </td>
                                <td>
                                    {device.avatar ? (
                                        <img src={device.avatar} alt="Avatar" className="avatar-image" />
                                    ) : (
                                        "No Avatar"
                                    )}
                                </td>
                                <td>{device.title}</td>
                                <td>{device.description}</td>
                                <td>
                                    <button
                                        className="btn btn-edit"
                                        onClick={() => handleEditClick(device)}
                                    >
                                        <i className="fas fa-edit fa-2x"></i>
                                    </button>
                                    <button
                                        className="btn btn-delete"
                                        onClick={() => setDeleteItemId(device.id)}
                                    >
                                        <i className="fas fa-trash fa-2x"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Task Modal */}
            {editDevice && (
                <div className="edit-modal">
                    <h3>Edit Task</h3>
                    <form onSubmit={(e) => { e.preventDefault(); handleSaveClick(); }}>
                        <label>
                            Task Title:
                            <input
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                            />
                        </label>
                        <label>
                            Task Description:
                            <textarea
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                            />
                        </label>
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => setEditDevice(null)}>Cancel</button>
                    </form>
                </div>
            )}

            {/* Add Task Modal */}
            {isAddModalOpen && (
                <>
                    <div className="add-modal-overlay" onClick={() => setIsAddModalOpen(false)}></div>
                    <div className="add-modal">
                        <h3>Add Task</h3>
                        <form onSubmit={(e) => { e.preventDefault(); handleAddTask(); }}>
                            <label>
                                Task Title:
                                <input
                                    type="text"
                                    value={addTaskTitle}
                                    onChange={(e) => setAddTaskTitle(e.target.value)}
                                />
                            </label>
                            <label>
                                Task Description:
                                <textarea
                                    value={addTaskDescription}
                                    onChange={(e) => setAddTaskDescription(e.target.value)}
                                />
                            </label>
                            <label>
                                Avatar:
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </label>
                            <button type="submit">Add Task</button>
                            <button type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                        </form>
                    </div>
                </>
            )}

            {/* Delete Task Modal */}
            {deleteItemId !== null && (
                <>
                    <div className="delete-modal-overlay" onClick={() => setDeleteItemId(null)}></div>
                    <div className="delete-modal">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this task?</p>
                        <form onSubmit={(e) => { e.preventDefault(); handleDelete(); }}>
                            <button type="submit">Delete</button>
                            <button type="button" onClick={() => setDeleteItemId(null)}>Cancel</button>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}
