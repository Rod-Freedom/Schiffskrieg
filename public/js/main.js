const logout = async () => {
  const response = await fetch('/api/players/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    document.location.replace('/login');
  } else {
    alert(response.statusText);
  }
};

function profileButtonHandler() {
  location.href = './profile';
}

function titleHandler() {
  location.href = './';
}

document.querySelector('#logout').addEventListener('click', logout);

document.querySelector('#profile').addEventListener('click', profileButtonHandler);
