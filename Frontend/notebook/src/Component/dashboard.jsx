import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import '../Style/dashboard.css';

const API = "http://localhost:3000/createfolder";
const APIS = "http://localhost:3000/getfolders";
const DELETE_API = "http://localhost:3000/deletefolders";

function Dashbord() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const location = useLocation();
    
    const [folders, setFolders] = useState(location.state?.folders || []);
    const [showpopup, setshowpopup] = useState(false);
    const [foldername, setfoldername] = useState("");
    const [fetchedOnce, setFetchedOnce] = useState(false);
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedFolders, setSelectedFolders] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        if (!token) navigate('/login');
    }, [token, navigate]);

    useEffect(() => {
        if (!fetchedOnce) {
            setFetchedOnce(true);
            axios.get(APIS, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => setFolders(res.data.folders || []))
                .catch(e => console.error("Error loading folders", e));
        }
    }, [fetchedOnce, token]);

    const handlecreate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(API, { foldername }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFolders([res.data.folder, ...folders]);
            setfoldername('');
            setshowpopup(false);
        } catch (e) {
            console.error("Error creating folder:", e);
        }
    };

    const handleCheckboxChange = (folderId) => {
        setSelectedFolders(prev =>
            prev.includes(folderId) ? prev.filter(id => id !== folderId) : [...prev, folderId]
        );
    };

    const handleDeleteConfirmed = async () => {
        try {
            await axios.post(DELETE_API, { folderIds: selectedFolders }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFolders(folders.filter(f => !selectedFolders.includes(f._id)));
            setSelectedFolders([]);
            setDeleteMode(false);
            setShowConfirm(false);
        } catch (e) {
            console.error("Error deleting folders", e);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h3>Your Folders</h3>
                {!deleteMode && (
                    <><div className='folderbtn'>
                        <button className="new-folder-btn" onClick={() => setshowpopup(true)}>New Folder</button>
                        <div className="three-dots-container">
                            <button className="three-dots-btn" onClick={() => setShowOptions(!showOptions)}>⋮</button>
                            {showOptions && (
                                <div className="dropdown-menu">
                                    <button onClick={() => {
                                        setDeleteMode(true);
                                        setShowOptions(false);
                                    }}>Delete</button>
                                </div>
                            )}
                        </div>
                    </div>
                    </>
                )}
            </div>

            {showpopup && (
                <div className="new-folder-popup">
                    <form className="folder-form popup-style" onSubmit={handlecreate}>
                        <input
                            type="text"
                            placeholder="Enter Folder Name"
                            value={foldername}
                            onChange={(e) => setfoldername(e.target.value)}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button type="submit">Create</button>
                            <button type="button" onClick={() => setshowpopup(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {deleteMode && (
                <div className="delete-controls">
                    <button className="delete-selected" onClick={() => setShowConfirm(true)}>Delete Selected</button>
                    <button className="cancel-delete" onClick={() => {
                        setDeleteMode(false);
                        setSelectedFolders([]);
                    }}>Cancel</button>
                </div>
            )}

            <div className="folder-list">
                {folders.length === 0 ? (
                    <p>No folder found.</p>
                ) : (
                    folders.map((folder) => (
                        <div className="folder-item" key={folder._id}>
                            {deleteMode && (
                                <input
                                    type="checkbox"
                                    className="folder-checkbox"
                                    checked={selectedFolders.includes(folder._id)}
                                    onChange={() => handleCheckboxChange(folder._id)}
                                />
                            )}
                            {!deleteMode ? (
                                <Link className="folder-name" to={`/folder/${folder._id}`}>
                                    {folder.foldername}
                                </Link>
                            ) : (
                                <span className="folder-name disabled">{folder.foldername}</span>
                            )}
                            <div className="folder-date">
                                {new Date(folder.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showConfirm && (
                <div className="confirm-popup">
                    <div className="confirm-box">
                        <p>Are you sure you want to delete {selectedFolders.length} selected folder(s)?</p>
                        <div className="confirm-actions">
                            <button className="confirm-delete" onClick={handleDeleteConfirmed}>Yes, Delete</button>
                            <button className="cancel-delete" onClick={() => setShowConfirm(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashbord;