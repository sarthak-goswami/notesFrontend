import { useEffect, useState } from "react";
import "./app.css";

const API_URL = "https://notesbackend-xpks.onrender.com";

function App() {
    const [loading,setLoading] = useState(true);
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const fetchNotes = async () => {
        try {
            console.time("Fetchdata");
            const res = await fetch(`${API_URL}/api/notes`);
            const data = await res.json();
            setNotes(data);
            console.timeEnd("Fetchdata");
        } catch (error) {
            console.log(error)
        }
        finally{
            setLoading(false)
        }
    };

    
    useEffect(() => {
        fetchNotes();
    }, []);

    const createNote = async (e) => {
        e.preventDefault();
        if (!title || !content) return;

        await fetch(`${API_URL}/api/notes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content })
        });

        setTitle("");
        setContent("");
        fetchNotes();
    };

    const deleteNote = async (id) => {
        await fetch(`${API_URL}/api/notes/${id}`, { method: "DELETE" });
        fetchNotes();
    };

    if(loading){
        return (
            <><h1>Loading...</h1></>
        )
    }

    return (
        <div className="app">
            <div className="header">
                <h1>📝 Notes App</h1>
            </div>

            <form className="note-form" onSubmit={createNote}>
                <input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Content"
                    rows="4"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button>Add Note</button>
            </form>

            <div className="notes">
                {notes.map((note) => (
                    <div className="note" key={note._id}>
                        <h3>{note.title}</h3>
                        <p>{note.content}</p>
                        <button onClick={() => deleteNote(note._id)}>Delete</button>
                    </div>
                ))}
            </div>
            <h4>Note : Your notes are public here so don't share any personal info </h4>
        </div>
    );
}

export default App;
