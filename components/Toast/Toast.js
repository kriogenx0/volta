import './Toast.scss';

export default class Toast {

}

Toast.createContainer = () => {
  if (Toast.container) return;
  Toast.container = document.createElement('div');
  Toast.container.className = 'toaster-message';
  document.body.appendChild(Toast.container);
};

Toast.createMessage = (text) => {
  Toast.lastMessage = document.createElement('div');
  Toast.lastMessage.className = 'message show';
  Toast.lastMessage.innerText = text;
  Toast.container.appendChild(Toast.lastMessage);
};

Toast.render = (text) => {
  Toast.createContainer();
  Toast.createMessage(text);
};
