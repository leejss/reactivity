import { timer } from "../utils/timer";

// 옵저버 패턴의 핵심은 상태변경을 구독자들에게 알리는 것.

// Toast Enum
type ToastType = "success" | "error" | "info" | "warning";

// 시스템 내부에서 사용하는 완전한 토스트 객체
interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number | null;
}

// 옵셔널 필드만 담은 토스트 객체
interface ToastOptions {
  type?: ToastType;
  duration?: number;
}

type ToastSubscriber = (toast: Toast) => void;

class ToastObserver {
  private subscribers = new Set<ToastSubscriber>();
  private toasts = new Map<string, Toast>();

  private readonly DEFAUL_TOAST = {
    type: "info",
    duration: 3000,
  } as const;

  subscribe = (subscriber: ToastSubscriber) => {
    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber);
    };
  };

  // publish is like issueing the ticket
  notify = (toast: Toast) => {
    // publish(toast) or publish()
    this.subscribers.forEach((subscriber) => subscriber(toast));
  };

  show = (message: string, options: ToastOptions = {}) => {
    const id = crypto.randomUUID();
    const newToast: Toast = {
      id,
      message,
      type: options.type || this.DEFAUL_TOAST.type,
      duration: options.duration || this.DEFAUL_TOAST.duration,
    };

    this.toasts.set(id, newToast);
    this.notify(newToast);

    // toast duration이 있는 경우 timer 설정
    if (options.duration) {
      timer(options.duration, () => {
        // this.removeToast(id);
        // this.dismissToast(id);
      });
    }

    return newToast.id;
  };

  success(message: string, options?: ToastOptions) {
    return this.show(message, { ...options, type: "success" });
  }

  error(message: string, options?: ToastOptions) {
    return this.show(message, { ...options, type: "error" });
  }

  info(message: string, options?: ToastOptions) {
    return this.show(message, { ...options, type: "info" });
  }

  warning(message: string, options?: ToastOptions) {
    return this.show(message, { ...options, type: "warning" });
  }

  getAll(): Toast[] {
    return Array.from(this.toasts.values());
  }

  dismiss = (id?: string) => {
    if (!id) {
      this.toasts.clear();
      return;
    }

    if (this.toasts.has(id)) {
      this.toasts.delete(id);
    }
  };
}

function main() {
  const toastManager = new ToastObserver();

  // Subscribe to toast notifications
  const unsubscribe = toastManager.subscribe((toast) => {
    console.log(`New toast: ${toast.type} - ${toast.message}`);
  });

  // Show different types of toasts
  toastManager.success("Operation completed successfully!");
  toastManager.error("An error occurred. Please try again.");
  toastManager.info("Did you know? This is an info toast.");
  toastManager.warning("Warning: Your session will expire soon.");

  // Show a custom toast with options
  const customToastId = toastManager.show("Custom toast", {
    duration: 5000,
    type: "info",
  });

  // Get all active toasts
  console.log("All active toasts:", toastManager.getAll());

  // Dismiss a specific toast
  toastManager.dismiss(customToastId);

  // Dismiss all toasts
  toastManager.dismiss();

  // Unsubscribe from toast notifications
  unsubscribe();
}

main();
