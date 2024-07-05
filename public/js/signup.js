const signUpFormHandler = async (event) => {
    event.preventDefault();
  
    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value.trim();

    const passwordConfirm = document.querySelector('#confirm-password').value.trim();

    const nickname = document.querySelector('#username').value.trim();
  
    if ((nickname && email && password && passwordConfirm) && (password === passwordConfirm)) {
      try {
        const response = await fetch('/api/players/signup', {
          method: 'POST',
          body: JSON.stringify({ nickname, email, password}),
          headers: { 'Content-Type': 'application/json' },
        });
      
        if (response.ok) {
          alert('')
          document.location.replace('/');
        } else {
          alert(`Error: ${error.message}`);
        }

    }catch (error) {
      console.error('Error:', error);
    }
  }

}
  
  document
    .querySelector('#signup-form')
    .addEventListener('submit', signUpFormHandler);
  