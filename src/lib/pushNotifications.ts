import { supabase } from './supabase';

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const subscribeToPushNotifications = async () => {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert("Votre navigateur ne supporte pas les notifications Web Push.");
      return false;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      alert("Vous avez bloqué les notifications. Autorisez-les dans les paramètres de votre navigateur.");
      return false;
    }

    const registration = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;

    const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) {
      console.error("VITE_VAPID_PUBLIC_KEY manquante dans les variables d'environnement");
      return false;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
    });

    const subData = JSON.parse(JSON.stringify(subscription));

    const { error } = await supabase.from('user_subscriptions').upsert({
      endpoint: subData.endpoint,
      p256dh: subData.keys.p256dh,
      auth: subData.keys.auth
    }, { onConflict: 'endpoint' });

    if (error) {
      console.error("Erreur de sauvegarde Supabase pour l'abonnement push:", error);
      alert("Erreur lors de l'enregistrement de l'abonnement.");
      return false;
    }

    alert("Vous êtes maintenant abonné aux alertes en temps réel de la Mairie !");
    return true;
  } catch (error) {
    console.error("Erreur détaillée lors de l'abonnement push:", error);
    alert("Une erreur inattendue est survenue lors de l'abonnement.");
    return false;
  }
};
