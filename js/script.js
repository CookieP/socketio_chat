/* global io */

const SOCKET_URL = 'http://35.157.80.184:8080/';
const MIN_MESSAGE_LENGTH = 2;

class Chat {

  constructor(url) {
    this.connection = io(url);
    this.userName = 'Guest';

    this.messagesElement = document.querySelector('.messages');
    this.formElement = document.querySelector('.form');
    this.nameElement = this.formElement.querySelector('.name');

    this.nameElement.textContent = this.userName;

    this.messageHandler = this.messageHandler.bind(this);
    this.sendHandler = this.sendHandler.bind(this);
    this.changeNameHandler = this.changeNameHandler.bind(this);

    this.init();
  }

  init() {
    this.connection.on('message', this.messageHandler);
    this.formElement.addEventListener('submit', this.sendHandler);
    this.nameElement.addEventListener('click', this.changeNameHandler);
  }

  messageHandler({user, message}) {
    const messageElement = this.generateMessageElement(user, message);

    this.messagesElement.appendChild(messageElement);
    window.scrollTo(0, document.body.scrollHeight);
  }

  sendHandler(event) {
    event.preventDefault();
    const message = this.formElement.elements.message.value.trim();

    if (message.length >= MIN_MESSAGE_LENGTH) {
      this.connection.emit('message', {message, user: this.userName});
      this.formElement.elements.message.value = '';
    }
  }

  changeNameHandler(event) {
    event.preventDefault();
    const newUserName = prompt('Please, enter your name', this.userName);

    if (newUserName) {
      this.userName = newUserName;
      this.nameElement.textContent = newUserName;
    }
  }

  generateMessageElement(user, message) {
    const messageType = (user === this.userName) ? 'outgoing' : 'incoming';
    const userTemplate = (user === this.userName) ? '' : `<span class="user-name">${user}</span>`;
    const template = `<div class="message ${messageType}"><div class=""><p>${message}</p>${userTemplate}</div></div>`;
    const element = document.createElement('div');

    element.innerHTML = template;

    return element.firstElementChild;
  }
}

// eslint-disable-next-line no-unused-vars
const chat = new Chat(SOCKET_URL);
