const API_BASE_URL = 'https://notesonline-c91q.onrender.com'; // Your backend URL

// Check if the user is logged in
const token = localStorage.getItem('token');

if (window.location.pathname.includes('notes.html') && !token) {
    window.location.href = 'index.html';
}

// Logout Function
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

// Show Notes Button
document.getElementById('showNotesBtn').addEventListener('click', () => {
    const notesList = document.getElementById('notesList');
    if (notesList.style.display === 'none' || notesList.style.display === '') {
        notesList.style.display = 'block'; 
        fetchNotes();
        document.getElementById('showNotesBtn').innerText = "Hide Notes";
    } else {
        notesList.style.display = 'none';
        document.getElementById('showNotesBtn').innerText = "Show Old Notes";
    }
});

// Fetch Notes
async function fetchNotes() {
    const response = await fetch(`${API_BASE_URL}/api/notes`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
    });

    const notes = await response.json();
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';

    if (notes.length === 0) {
        notesList.innerHTML = '<li class="note">No notes available.</li>';
    } else {
        notes.forEach(note => {
            const li = document.createElement('li');
            li.className = "note";
            li.innerHTML = `
                <strong>${note.title}</strong><br>${note.content}
                <div class="note-actions">
                    <button class="edit-btn" onclick="editNote('${note.id}', '${note.title}', '${note.content}')">✏️ Modify</button>
                    <button class="delete-btn" onclick="deleteNote('${note.id}')">🗑️ Delete</button>
                </div>
            `;
            notesList.appendChild(li);
        });
    }
}

// Create a Note
document.getElementById('createNoteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;

    await fetch(`${API_BASE_URL}/api/notes`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content }),
    });

    document.getElementById('createNoteForm').reset();
});

// Edit a Note
function editNote(id, oldTitle, oldContent) {
    const newTitle = prompt("Modify title:", oldTitle);
    const newContent = prompt("Modify content:", oldContent);
    if (newTitle && newContent) {
        fetch(`${API_BASE_URL}/api/notes/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle, content: newContent }),
        }).then(fetchNotes);
    }
}

// Delete a Note
function deleteNote(id) {
    fetch(`${API_BASE_URL}/api/notes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    }).then(fetchNotes);
}
