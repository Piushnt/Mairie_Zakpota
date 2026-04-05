import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

// Configuration VAPID
const publicVapidKey = process.env.VITE_VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

if (publicVapidKey && privateVapidKey) {
  webpush.setVapidDetails(
    'mailto:contact@mairie-zakpota.bj',
    publicVapidKey,
    privateVapidKey
  );
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    if (!publicVapidKey || !privateVapidKey) {
      throw new Error('VAPID keys not configured in environment variables');
    }

    const { title, body, url, image, badge, icon } = req.body;

    const payload = JSON.stringify({
      title: title || 'Mairie de Za-Kpota',
      body: body || 'Nouvelle information disponible.',
      icon: icon || '/logo.jpg', // Icône couleur (emblème)
      badge: badge || '/badge.png', // Icône monochrome (barre d'état)
      image: image || undefined, // Grande image (news/illustration)
      data: {
        url: url || '/'
      }
    });

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all active subscriptions
    const { data: subscriptions, error } = await supabase
      .from('user_subscriptions')
      .select('*');

    if (error) throw error;

    if (!subscriptions || subscriptions.length === 0) {
      return res.status(200).json({ message: 'No active subscriptions found.' });
    }

    const notifications = subscriptions.map((sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      };

      return webpush.sendNotification(pushSubscription, payload).catch(async (err) => {
        console.error('Error sending notification to endpoint:', sub.endpoint, err);
        // If the subscription is expired or invalid (410, 404), remove it from DB
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabase.from('user_subscriptions').delete().eq('endpoint', sub.endpoint);
        }
      });
    });

    await Promise.allSettled(notifications);

    res.status(200).json({ success: true, count: subscriptions.length });
  } catch (error) {
    console.error('Push notification error:', error);
    res.status(500).json({ error: error.message });
  }
}
