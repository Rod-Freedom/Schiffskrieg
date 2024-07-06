const nicknameEl = document.querySelector('#nickname');
const changeNicknameBtn = document.querySelector('#change-nickname-btn');
const nicknameFormEl = document.querySelector('#nickname-form');
const nicknameInputEL = document.querySelector('#nickname-input');

function changeNicknameHandler() {
    nicknameEl.setAttribute('style', "display: none");
    changeNicknameBtn.setAttribute('style', "display: none");
    nicknameFormEl.setAttribute('style', "display: block");
}

const updateNicknameHandler = async (event) => {
    event.preventDefault();

    const nickname = nicknameInputEL.value.trim();

    if (nickname) {
        const response = await fetch('./api/players/nickname', {
            method: 'PUT',
            body: JSON.stringify({ nickname }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        });
        if (response.ok) {
            alert('Nickname Updated');
            document.location.reload();
        } else {
            alert('Failed to update nickname');
        }
    }
}

changeNicknameBtn.addEventListener('click', changeNicknameHandler);
nicknameFormEl.addEventListener('submit', updateNicknameHandler);

