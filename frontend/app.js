const API_BASE_URL = 'https://notesonline-c91q.onrender.com'; // Your backend URL

// Check if the user is logged in by checking for a token in localStorage
const token = localStorage.getItem('token');

// 🚀 Prevent unauthorized access to `notes.html`
if (window.location.pathname.includes('notes.html') && !token) {
    window.location.href = 'index.html'; // Redirect to login if not logged in
}

// Show Notes Page if Logged In (for notes.html)
if (document.getElementById('notesSection')) {
    if (token) {
        fetchNotes(); // Load notes if logged in
    } else {
        window.location.href = 'index.html'; // Redirect to login page if not authenticated
    }
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
            localStorage.setItem('token', data.token); // Store JWT token
            window.location.href = 'notes.html'; // Redirect to notes page
        } else {
            alert(data.error);
        }
    });
}

// Handle Login (for index.html)
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
            localStorage.setItem('token', data.token); // Store JWT token
            window.location.href = 'notes.html'; // Redirect to notes page
        } else {
            alert(data.error);
        }
    });
}

// Fetch Notes (for notes.html)
async function fetchNotes() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/notes`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch notes');

        const notes = await response.json();
        const notesList = document.getElementById('notesList');
        notesList.innerHTML = notes.map(note => `<li>${note.title}: ${note.content}</li>`).join('');
    } catch (error) {
        console.error('Error fetching notes:', error);
        alert('Error fetching notes.');
    }
}

// Create a Note (for notes.html)
if (document.getElementById('createNoteForm')) {
    document.getElementById('createNoteForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('noteTitle').value;
        const content = document.getElementById('noteContent').value;

        try {
            const response = await fetch(`${API_BASE_URL}/api/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, content }),
            });

            if (!response.ok) throw new Error('Failed to create note');

            fetchNotes(); // Refresh notes list
            document.getElementById('createNoteForm').reset(); // Clear input fields
        } catch (error) {
            console.error('Error creating note:', error);
            alert('Error creating note.');
        }
    });
}

// Logout (for notes.html)
if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token'); // Remove token from storage
        window.location.href = 'index.html'; // Redirect to login page
    });
}
