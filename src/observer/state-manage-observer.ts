type Message = {
  id: number;
  text: string;
  timestamp: number;
};

type Subscriber = (data: Message) => void;

export class MessageObserver {
  subscribers = new Set<Subscriber>();
  messages: Message[] = [];
  nextId = 1;
  subscribe(subscribeFn: Subscriber) {
    this.subscribers.add(subscribeFn);
    this.messages.forEach((message) => {
      subscribeFn(message);
    });


    return () => {
      this.subscribers.delete(subscribeFn);
    };
  }

  publish(data: Message) {
    this.subscribers.forEach((subscriber) => subscriber(data));
  }

  addMessage(text: string) {
    const message = {
      id: this.nextId++,
      text,
      timestamp: Date.now(),
    };

    this.messages = [...this.messages, message];
    this.publish(message);

    return message;
  }

  getMessages() {
    return [...this.messages];
  }
}

// subscriber functions are called when a new message is published
// new message will be added to the messages array which is stored in the class

function example() {
  const observer = new MessageObserver();
  const unsub1 = observer.subscribe((data) => {
    console.log("subscribe1", data);
  });
  const unsub2 = observer.subscribe((data) => {
    console.log("subscribe2", data);
  });
  observer.addMessage("Hello");
  observer.addMessage("World");
  unsub1();
  observer.addMessage("React");
  unsub2();
  observer.addMessage("Vue");
  console.log("getMessages", observer.getMessages());
}

example();
