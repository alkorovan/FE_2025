const API_URL = 'https://jsonplaceholder.typicode.com/users';
const cardList = document.getElementById('cardList');
const spinner = document.getElementById('spinner');

const form = document.getElementById('editForm');
const nameInput = document.getElementById('nameInput');
const usernameInput = document.getElementById('usernameInput');
const phoneInput = document.getElementById('phoneInput');
const websiteInput = document.getElementById('websiteInput');
const emailInput = document.getElementById('emailInput');
const saveBtn = document.getElementById('saveBtn');

let currentEditId = null;
let currentCard = null;

function showSpinner(state) {
  spinner.style.display = state ? 'block' : 'none';
}

function createCard(user) {
  const card = document.createElement('div');
  card.className = 'card';

  const name = document.createElement('div');
  name.className = 'username';
  name.textContent = user.name;

  const username = document.createElement('div');
  username.className = 'tag';
  username.textContent = '@' + user.username;

  const details = document.createElement('div');
  details.className = 'details';
  details.innerHTML = `
    <div><strong>Phone:</strong> ${user.phone}</div>
    <div><strong>Website:</strong> ${user.website}</div>
    <div><strong>Email:</strong> ${user.email}</div>
  `;

  const actions = document.createElement('div');
  actions.className = 'actions';

  const editBtn = document.createElement('button');
  editBtn.textContent = 'EDIT';
  editBtn.className = 'edit-btn';

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'DELETE';
  deleteBtn.className = 'delete-btn';

  editBtn.onclick = (e) => {
    e.stopPropagation();
    form.classList.remove('hidden');
    nameInput.value = user.name;
    usernameInput.value = user.username;
    phoneInput.value = user.phone;
    websiteInput.value = user.website;
    emailInput.value = user.email;
    currentEditId = user.id;
    currentCard = card;
  };

  deleteBtn.onclick = async (e) => {
    e.stopPropagation();
    showSpinner(true);
    await fetch(API_URL + '/' + user.id, { method: 'DELETE' });
    card.remove();
    showSpinner(false);
  };

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  card.appendChild(name);
  card.appendChild(username);
  card.appendChild(details);
  card.appendChild(actions);

  return card;
}

saveBtn.onclick = async () => {
  if (!currentEditId || !currentCard) return;
  showSpinner(true);

  const updated = {
    name: nameInput.value,
    username: usernameInput.value,
    phone: phoneInput.value,
    website: websiteInput.value,
    email: emailInput.value
  };

  await fetch(API_URL + '/' + currentEditId, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updated)
  });

  currentCard.querySelector('.username').textContent = updated.name;
  currentCard.querySelector('.tag').textContent = '@' + updated.username;
  currentCard.querySelector('.details').innerHTML = `
    <div><strong>Phone:</strong> ${updated.phone}</div>
    <div><strong>Website:</strong> ${updated.website}</div>
    <div><strong>Email:</strong> ${updated.email}</div>
  `;

  form.classList.add('hidden');
  currentEditId = null;
  currentCard = null;
  showSpinner(false);
};

async function loadUsers() {
  showSpinner(true);
  const res = await fetch(API_URL);
  const users = await res.json();
  users.forEach(user => {
    const card = createCard(user);
    cardList.appendChild(card);
  });
  showSpinner(false);
}

loadUsers();
