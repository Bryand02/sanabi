"use client";

import Link from "next/link";
import {
  Bell,
  BellOff,
  CheckCheck,
  Download,
  LoaderCircle,
  ShieldAlert,
  Smartphone,
  X,
} from "lucide-react";
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

function getDeviceHelpMessage({
  isSupported,
  vapidPublicKey,
  isIos,
  isStandalone,
}: {
  isSupported: boolean;
  vapidPublicKey: string;
  isIos: boolean;
  isStandalone: boolean;
}) {
  if (!vapidPublicKey) {
    return "Las notificaciones aún no están configuradas en el servidor.";
  }

  if (isIos && !isStandalone) {
    return "En iPhone debes instalar Sanabi Kids en la pantalla de inicio para activar notificaciones.";
  }

  if (!isSupported) {
    return "Este navegador todavía no permite activar notificaciones push en este dispositivo.";
  }

  return "Activa las alertas para recibir compras nuevas en este dispositivo administrador.";
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
  const [statusMessage, setStatusMessage] = useState("");
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const isIos =
    typeof window !== "undefined" &&
    /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  const isStandalone =
    typeof window !== "undefined" &&
    (window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in window.navigator &&
        Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)));

  const canInstall = useMemo(() => Boolean(installPrompt), [installPrompt]);
  const canEnableNotifications = useMemo(() => {
    if (!vapidPublicKey || !isSupported) {
      return false;
    }

    if (isIos && !isStandalone) {
      return false;
    }

    return true;
  }, [isIos, isStandalone, isSupported, vapidPublicKey]);
  const helpMessage = useMemo(
    () =>
      getDeviceHelpMessage({
        isSupported,
        vapidPublicKey,
        isIos,
        isStandalone,
      }),
    [isIos, isStandalone, isSupported, vapidPublicKey],
  );

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

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

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
    setStatusMessage("Todas las notificaciones quedaron marcadas como leídas.");
  }

  async function enableNotifications() {
    if (!canEnableNotifications) {
      setStatusMessage(helpMessage);
      return;
    }

    setIsBusy(true);

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatusMessage("Permiso denegado. Habilita las notificaciones del navegador e inténtalo de nuevo.");
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

      const response = await fetch("/api/push-subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });

      if (!response.ok) {
        throw new Error("subscription_failed");
      }

      setIsSubscribed(true);
      setStatusMessage("Notificaciones activadas para este dispositivo administrador.");
    } catch {
      setStatusMessage("No fue posible activar las notificaciones. Revisa permisos, instalación de la app y configuración del servidor.");
    } finally {
      setIsBusy(false);
    }
  }

  async function disableNotifications() {
    if (!isSupported) {
      setStatusMessage("Este navegador no tiene soporte disponible para administrar notificaciones.");
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
      setStatusMessage("Notificaciones desactivadas en este dispositivo.");
    } catch {
      setStatusMessage("No fue posible desactivar las notificaciones en este momento.");
    } finally {
      setIsBusy(false);
    }
  }

  async function installApp() {
    if (!installPrompt) {
      if (isIos) {
        setStatusMessage("En iPhone abre Compartir y elige “Agregar a pantalla de inicio” para instalar Sanabi Kids.");
      }
      return;
    }

    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
    setStatusMessage("Instalación solicitada. Cuando termine, vuelve aquí para activar las notificaciones.");
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--color-accent)] bg-white text-[var(--color-primary-ink)] shadow-[0_10px_24px_rgba(255,211,125,0.22)]"
        aria-label="Centro de notificaciones"
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[11px] font-bold text-white">
            {unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Cerrar notificaciones"
            className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-[2px] md:hidden"
            onClick={() => setOpen(false)}
          />

          <div className="fixed inset-x-3 top-22 bottom-3 z-50 flex flex-col overflow-hidden rounded-[1.9rem] border border-white/90 bg-white/98 shadow-[0_32px_70px_rgba(31,41,55,0.22)] backdrop-blur md:absolute md:inset-auto md:right-0 md:top-[calc(100%+0.75rem)] md:z-40 md:w-[26rem] md:max-h-[min(75vh,42rem)]">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-4 md:px-5">
              <div className="min-w-0">
                <p className="text-base font-semibold text-slate-900">Centro de notificaciones</p>
                <p className="mt-1 text-sm text-slate-500">
                  Avisos de compras y actividad para el perfil administrador.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Marcar todo
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 md:hidden"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 md:px-5">
              <div className="rounded-[1.4rem] bg-slate-50 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">Alertas en este dispositivo</p>
                    <p className="mt-1 text-sm text-slate-500">{helpMessage}</p>
                  </div>

                  <button
                    type="button"
                    onClick={isSubscribed ? disableNotifications : enableNotifications}
                    disabled={isBusy || (!isSubscribed && !canEnableNotifications)}
                    className="inline-flex min-h-11 min-w-32 items-center justify-center gap-2 rounded-full bg-[var(--color-primary-ink)] px-5 py-3 text-sm font-semibold text-white disabled:bg-slate-300"
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

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={installApp}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700"
                  >
                    {isIos ? <Smartphone className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                    {canInstall ? "Instalar app" : isIos ? "Guía para iPhone" : "Instalación disponible"}
                  </button>

                  {isSubscribed ? (
                    <span className="inline-flex items-center rounded-full bg-[var(--color-mint)] px-3 py-2 text-xs font-semibold text-[var(--color-primary-ink)]">
                      Activo en este dispositivo
                    </span>
                  ) : null}
                </div>

                {statusMessage ? (
                  <div className="mt-3 rounded-2xl border border-[var(--color-accent-soft)] bg-[var(--color-accent-soft)]/35 px-3 py-3 text-sm text-slate-700">
                    <div className="flex items-start gap-2">
                      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" />
                      <p>{statusMessage}</p>
                    </div>
                  </div>
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
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                            <p className="mt-1 text-sm leading-6 text-slate-600">{notification.body}</p>
                          </div>
                          {!notification.readAt ? (
                            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
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
            </div>

            <div className="border-t border-slate-100 px-4 py-3 md:px-5">
              <p className="text-xs font-medium text-[var(--color-primary-ink)]">
                {unreadCount > 0
                  ? `Tienes ${unreadCount} notificacion${unreadCount === 1 ? "" : "es"} sin leer.`
                  : "No tienes notificaciones pendientes."}
              </p>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
