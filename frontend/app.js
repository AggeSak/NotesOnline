const API_BASE_URL = 'https://notesonline-c91q.onrender.com'; // Your backend URL

// Check if the user is logged in
const token = localStorage.getItem('token');

// Redirect if not logged in
if (window.location.pathname.includes('notes.html') && !token) {
    window.location.href = 'index.html';
}

// LOGIN FUNCTION (For index.html)
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

// SIGNUP FUNCTION (For signup.html)
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

// LOGOUT FUNCTION (For notes.html)
if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';  // Redirect to login page
    });
}

// SHOW/HIDE NOTES FUNCTION (For notes.html)
if (document.getElementById('showNotesBtn')) {
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
}

// FETCH NOTES FUNCTION (For notes.html)

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
            li.draggable = true; // Make the note draggable
            li.innerHTML = `
                <div class="note-paper">
                    <h4>${note.title}</h4>
                    <p>${note.content}</p>
                    <div class="note-actions">
                        <button class="edit-btn" onclick="ModifyNote('${note.id}', '${note.title}', '${note.content}')">✏️ Modify</button>
                        <button class="delete-btn" onclick="deleteNote('${note.id}')">🗑️ Delete</button>
                    </div>
                </div>
            `;
            notesList.appendChild(li);
        });

        // Add drag-and-drop event listeners
        makeNotesMovable();
    }
}

// Function to make notes movable
function makeNotesMovable() {
    const notesList = document.getElementById('notesList');
    let draggedItem = null;

    // Event listener for when dragging starts
    notesList.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('note')) {
            draggedItem = e.target;
            setTimeout(() => {
                e.target.style.display = 'none'; // Hide the dragged item
            }, 0);
        }
    });

    // Event listener for when dragging over a note
    notesList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(notesList, e.clientY);
        const currentItem = document.querySelector('.note.dragging');
        if (afterElement == null) {
            notesList.appendChild(draggedItem);
        } else {
            notesList.insertBefore(draggedItem, afterElement);
        }
    });

    // Event listener for when dragging ends
    notesList.addEventListener('dragend', (e) => {
        if (e.target.classList.contains('note')) {
            setTimeout(() => {
                e.target.style.display = 'block'; // Show the dragged item again
                draggedItem = null;
            }, 0);
        }
    });

    // Helper function to determine where to insert the dragged item
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.note:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
}
// CREATE A NOTE FUNCTION (For notes.html)
if (document.getElementById('createNoteForm')) {
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
}

// EDIT A NOTE FUNCTION (For notes.html)
function ModifyNote(id, oldTitle, oldContent) {
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

// DELETE A NOTE FUNCTION (For notes.html)
function deleteNote(id) {
    fetch(`${API_BASE_URL}/api/notes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    }).then(fetchNotes);
}


//Coming soon
// CREATE A NOTE FUNCTION (For notes.html)
if (document.getElementById('Coming Soon')) {
    document.getElementById('Coming Soon').addEventListener('click', async (e) => {
        console.log("Coming Soon");
        
    });
}