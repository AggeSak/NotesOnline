const API_BASE_URL = 'https://notesonline-c91q.onrender.com';  // Your backend URL

// Check if the user is logged in by checking for a token in localStorage
const token = localStorage.getItem('token');

// Show Notes Page if Logged In (for notes.html)
if (document.getElementById('notesSection') && token) {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('notesSection').style.display = 'block';
    fetchNotes();
}

// Handle Sign Up (for signup.html)
if (document.getElementById('signupBtn')) {
    document.getElementById('signupBtn').addEventListener('click', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        const response = await fetch(`${API_BASE_URL}/api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Sign Up successful!');
            localStorage.setItem('token', data.token);  // Store JWT token
            window.location.href = 'notes.html';  // Redirect to notes page
        } else {
            alert(data.error);
        }
    });
}

// Handle Login (for login.html)
if (document.getElementById('loginBtn')) {
    document.getElementById('loginBtn').addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);  // Store JWT token
            window.location.href = 'notes.html';  // Redirect to notes page
        } else {
            alert(data.error);
        }
    });
}

// Fetch Notes (for notes.html)
async function fetchNotes() {
    const response = await fetch(`${API_BASE_URL}/api/notes`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    const notes = await response.json();
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = notes.map(note => `<li>${note.title}: ${note.content}</li>`).join('');
}

// Create a Note (for notes.html)
if (document.getElementById('createNoteForm')) {
    document.getElementById('createNoteForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('noteTitle').value;
        const content = document.getElementById('noteContent').value;

        const response = await fetch(`${API_BASE_URL}/api/notes`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, content }),
        });

        if (response.ok) {
            fetchNotes();  // Refresh notes list
        } else {
            alert('Failed to create note');
        }
    });
}

// Logout (for notes.html)
if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/index.html';  // Redirect to login page
    });
}
