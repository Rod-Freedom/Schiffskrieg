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

const userProfile = async () => {
  const response = await fetch('/api/players/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    document.location.replace('/profile');
  } else {
    alert(response.statusText);
  }
};

document.querySelector('#logout').addEventListener('click', logout);

document.querySelector('#profile').addEventListener('click', userProfile);
