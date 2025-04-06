type SubscribeFn<T> = (data: T) => void;

export class BasicObserver<T> {
  subscribers: Set<SubscribeFn<T>> = new Set();
  subscribe(subscribeFn: SubscribeFn<T>) {
    this.subscribers.add(subscribeFn);

    return () => {
      this.subscribers.delete(subscribeFn);
    };
  }

  publish(data: T) {
    this.subscribers.forEach((subscriber) => subscriber(data));
  }
}

function example() {
  const observer = new BasicObserver<number>();
  const unsub1 = observer.subscribe((data) => {
    console.log("subscribe1", data);
  });
  const unsub2 = observer.subscribe((data) => {
    console.log("subscribe2", data);
  });
  observer.publish(1);
  // subscribe1 1
  // subscribe2 1
  observer.publish(2);
  // subscribe1 2
  // subscribe2 2
  unsub1();
  observer.publish(3);
  // subscribe2 3
  unsub2();
  observer.publish(4);
  // No output
}

example();
