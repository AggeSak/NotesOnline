const API_BASE_URL = 'https://notesonline-c91q.onrender.com'; // Replace with your Render URL after deployment

// Fetch and display users
async function fetchUsers() {
    const response = await fetch(`${API_BASE_URL}/users`);
    const users = await response.json();
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = users.map(user => `<li>${user.name} (${user.email})</li>`).join('');
}

// Fetch and display notes for a user
async function fetchNotes(userId) {
    const response = await fetch(`${API_BASE_URL}/notes/${userId}`);
    const notes = await response.json();
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = notes.map(note => `<li>${note.title}: ${note.content}</li>`).join('');
}

// Create a new user
document.getElementById('createUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        fetchUsers();
        e.target.reset();
    }
});

// Create a new note
document.getElementById('createNoteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        fetchNotes(data.user_id);
        e.target.reset();
    }
});

// Initial fetch
fetchUsers();