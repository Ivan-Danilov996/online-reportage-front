class Viget {
  constructor(URL) {
    this.URL = URL;
  }

  async createRequest() {
    this.response = await fetch(`${this.URL}/actions`, {
      method: 'GET',
    });
    return this.response.json();
  }

  createEventSource() {
    this.eventSource = new EventSource(`${this.URL}/sse`);
    this.eventSource.addEventListener('message', (evt) => {
      this.showEvent(JSON.parse(evt.data));
    });
  }

  showEvent(data) {
    this.event = document.createElement('div');
    this.event.classList.add('event', `${data.type}`);
    this.event.innerHTML = `
      <div class="date-time">${data.time} ${data.date}</div>
      <div class="text">${data.text}</div>
      `;
    document.querySelector('.actions').appendChild(this.event);
    if (document.querySelector('.actions').offsetHeight >= document.querySelector('.viget-body').offsetHeight) {
      document.querySelector('.viget-body').scrollTo({
        top: document.querySelector('.actions').getBoundingClientRect().height,
      });
    }
  }

  showHistory(data) {
    data.forEach((element) => {
      this.showEvent(JSON.parse(element));
    });
  }

  init() {
    this.vigetNode = document.createElement('section');
    this.vigetNode.className = 'viget';
    this.vigetNode.innerHTML = `
    <div class="viget-body">
      <div class="actions">
      </div>
    </div>`;
    document.body.appendChild(this.vigetNode);

    this.createRequest().then((data) => {
      this.showHistory(data);
    });

    this.createEventSource();
  }
}

const viget = new Viget('https://online-reportage-back.herokuapp.com');

viget.init();
