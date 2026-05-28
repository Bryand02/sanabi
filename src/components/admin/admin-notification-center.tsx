"use client";

import Link from "next/link";
import { Bell, BellOff, CheckCheck, Download, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  href: string | null;
  readAt: string | null;
  createdAt: string;
};

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; ++index) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AdminNotificationCenter({
  initialNotifications,
  initialUnreadCount,
  vapidPublicKey,
}: {
  initialNotifications: NotificationItem[];
  initialUnreadCount: number;
  vapidPublicKey: string;
}) {
  const supported =
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window;
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [isSupported] = useState(supported);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const canInstall = useMemo(() => Boolean(installPrompt), [installPrompt]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    async function loadSubscriptionState() {
      if (!isSupported) {
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(Boolean(subscription));
    }

    loadSubscriptionState().catch(() => {
      setIsSubscribed(false);
    });
  }, [isSupported]);

  async function markAllAsRead() {
    const unreadIds = notifications.filter((item) => !item.readAt).map((item) => item.id);
    if (unreadIds.length === 0) {
      return;
    }

    await fetch("/api/admin-notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: unreadIds }),
    });

    setNotifications((current) =>
      current.map((item) =>
        item.readAt ? item : { ...item, readAt: new Date().toISOString() },
      ),
    );
    setUnreadCount(0);
  }

  async function enableNotifications() {
    if (!isSupported || !vapidPublicKey) {
      return;
    }

    setIsBusy(true);

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setIsBusy(false);
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });
      }

      await fetch("/api/push-subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });

      setIsSubscribed(true);
    } finally {
      setIsBusy(false);
    }
  }

  async function disableNotifications() {
    if (!isSupported) {
      return;
    }

    setIsBusy(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await fetch("/api/push-subscriptions", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        await subscription.unsubscribe();
      }

      setIsSubscribed(false);
    } finally {
      setIsBusy(false);
    }
  }

  async function installApp() {
    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-cloud)] text-[var(--color-primary-ink)]"
        aria-label="Centro de notificaciones"
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" />
        <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[11px] font-bold text-white">
          {unreadCount}
        </span>
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-40 w-[min(24rem,calc(100vw-2rem))] rounded-[1.75rem] border border-white/80 bg-white/98 p-4 shadow-[0_24px_60px_rgba(31,41,55,0.16)] backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Centro de notificaciones</p>
              <p className="mt-1 text-xs text-slate-500">
                Avisos de compras y actividad reciente para administradores.
              </p>
            </div>
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Marcar todo
            </button>
          </div>

          <div className="mt-4 rounded-[1.25rem] bg-slate-50 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Alertas en este dispositivo</p>
                <p className="text-xs text-slate-500">
                  Instala la app y activa notificaciones para recibir compras nuevas.
                </p>
              </div>
              <button
                type="button"
                onClick={isSubscribed ? disableNotifications : enableNotifications}
                disabled={!isSupported || isBusy || !vapidPublicKey}
                className="inline-flex min-w-28 items-center justify-center gap-2 rounded-full bg-[var(--color-primary-ink)] px-4 py-2 text-xs font-semibold text-white disabled:bg-slate-300"
              >
                {isBusy ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : isSubscribed ? (
                  <BellOff className="h-4 w-4" />
                ) : (
                  <Bell className="h-4 w-4" />
                )}
                {isSubscribed ? "Desactivar" : "Activar"}
              </button>
            </div>

            {canInstall ? (
              <button
                type="button"
                onClick={installApp}
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700"
              >
                <Download className="h-4 w-4" />
                Instalar app
              </button>
            ) : null}
          </div>

          <div className="mt-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="rounded-[1.25rem] bg-slate-50 px-4 py-5 text-sm text-slate-500">
                Aún no hay notificaciones para este administrador.
              </div>
            ) : (
              notifications.map((notification) => {
                const content = (
                  <div
                    className={`rounded-[1.25rem] border px-4 py-3 ${
                      notification.readAt
                        ? "border-slate-200 bg-white"
                        : "border-[var(--color-accent-soft)] bg-[var(--color-accent-soft)]/35"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{notification.body}</p>
                      </div>
                      {!notification.readAt ? (
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
                      ) : null}
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{formatDate(notification.createdAt)}</p>
                  </div>
                );

                return notification.href ? (
                  <Link
                    key={notification.id}
                    href={notification.href}
                    onClick={() => setOpen(false)}
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={notification.id}>{content}</div>
                );
              })
            )}
          </div>

          {unreadCount > 0 ? (
            <p className="mt-3 text-xs font-medium text-[var(--color-primary-ink)]">
              Tienes {unreadCount} notificacion{unreadCount === 1 ? "" : "es"} sin leer.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
