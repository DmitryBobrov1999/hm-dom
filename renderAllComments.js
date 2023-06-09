import { allComments, getComments, postComment, numberOfLikes } from './api.js';

import { getListCommentsEdit } from './getComments.js';

import { renderLoginComponent } from './components/login-component.js';

const initEventListeners = () => {
	const buttonsLike = document.querySelectorAll('.like-button');
	for (const buttonLike of buttonsLike) {
		const index = buttonLike.dataset.index;
		const id = buttonLike.dataset.id;

		buttonLike.addEventListener('click', event => {
			event.stopPropagation();
			allComments[index].isLikeLoading = true;
			numberOfLikes({ token, id }).then(() => {
				allComments[index].countLike = allComments[index].likeComment
					? allComments[index].countLike - 1
					: allComments[index].countLike + 1;
				allComments[index].likeComment = !allComments[index].likeComment;
				allComments[index].isLikeLoading = false;
				renderApp();
			});
			renderApp();
		});
	}
};

const commentAnswer = () => {
	const commentsLi = document.querySelectorAll('.comment');
	const buttonTextInput = document.getElementById('textInput');
	for (const commentLi of commentsLi) {
		const index = commentLi.dataset.index;
		commentLi.addEventListener('click', () => {
			buttonTextInput.value = `${allComments[index].text}${'\n'}${
				allComments[index].name
			},`;
		});
	}
};

let token = localStorage.getItem('setToken');
let name = '';

const renderApp = () => {
	const tokenFromStorage = localStorage.getItem('setToken');
	const nameFromStorage = localStorage.getItem('setUser');

	if (tokenFromStorage) {
		token = tokenFromStorage;
	}
	if (nameFromStorage) {
		name = nameFromStorage;
	}

	if (!token) {
		const appEl = document.getElementById('app');

		const commentsHTML = allComments

			.map((man, index) => getListCommentsEdit(man, index))
			.join('');

		const appHTML = `<div class="container">
			<ul id="idComments" class="comments">${commentsHTML}</ul>
			<div class="add-comment">Комментарий добавляется...</div>
			<div class = 'authDiv'>
			Чтобы добавить комментарий,<button id = "auth-button" class = 'auth-button'>авторизуйтесь</button>
			</div>
		</div>`;

		appEl.innerHTML = appHTML;

		const addComment = document.querySelector('.add-comment');

		addComment.style.display = 'none';

		document.getElementById('auth-button').addEventListener('click', () => {
			renderLoginComponent({
				appEl,
				setToken: newToken => {
					token = newToken;
				},

				getComments,
			});
		});

		initEventListeners();
		commentAnswer();
	}

	if (token) {
		const appEl = document.getElementById('app');

		const commentsHTML = allComments

			.map((man, index) => getListCommentsEdit(man, index))
			.join('');

		const appHTML = `<div class="container">
			<ul id="idComments" class="comments">${commentsHTML}</ul>
			<div class="add-comment">Комментарий добавляется...</div>
			<div class="add-form">
				<input
					id="nameInput"
					type="text"
					class="add-form-name"
					value="${name}"
					placeholder="Введите ваше имя"
					disabled
				/>
				<textarea
					id="textInput"
					type="textarea"
					class="add-form-text"
					placeholder="Введите ваш комментарий"
					
					rows="4"
				></textarea>
				<div class="add-form-row">
					<button id="add-form-button" class="add-form-button">Написать</button>
				</div>
			</div>
		</div>`;

		appEl.innerHTML = appHTML;

		const addComment = document.querySelector('.add-comment');

		addComment.style.display = 'none';

		const buttonNameInput = document.getElementById('nameInput');

		const buttonTextInput = document.getElementById('textInput');

		const buttonElement = document.getElementById('add-form-button');

		document.addEventListener('keyup', enterFunction);

		function enterFunction(event) {
			if (event.key === 'Enter') {
				buttonElement.click();
			}
		}

		buttonElement.addEventListener('click', () => {
			buttonNameInput.addEventListener(
				'input',
				() => (buttonElement.disabled = false)
			);
			buttonTextInput.addEventListener(
				'input',
				() => (buttonElement.disabled = false)
			);
			buttonNameInput.classList.remove('error');
			buttonTextInput.classList.remove('error');
			if (buttonNameInput.value === '' && buttonTextInput.value === '') {
				buttonNameInput.classList.add('error');
				buttonTextInput.classList.add('error');
				buttonElement.disabled = true;
				return;
			}
			if (buttonNameInput.value === '') {
				buttonNameInput.classList.add('error');
				buttonElement.disabled = true;
				return;
			}
			if (buttonTextInput.value === '') {
				buttonTextInput.classList.add('error');
				buttonElement.disabled = true;
				return;
			}

			postComment();
		});

		initEventListeners();
		commentAnswer();
	}
};

export default renderApp;
export { getListCommentsEdit };
export { token };
