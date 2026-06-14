import type { APIRoute } from 'astro'
import { Resend } from 'resend'

const resend = new Resend(import.meta.env.RESEND_API_KEY)

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData()

  const nom = data.get('nom')?.toString().trim()
  const email = data.get('email')?.toString().trim()
  const message = data.get('message')?.toString().trim()
  const honeypot = data.get('website')?.toString().trim()
  const ts = Number(data.get('ts'))

  // Réponse "succès" silencieuse pour les bots (on ne les informe pas du rejet)
  const fakeSuccess = () =>
    new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  // Anti-spam 1 : le honeypot doit rester vide (seuls les bots le remplissent)
  if (honeypot) return fakeSuccess()

  // Anti-spam 2 : piège temporel — soumission trop rapide = bot (< 3 s)
  if (!ts || Date.now() - ts < 3000) return fakeSuccess()

  // Validation des champs
  if (!nom || !email || !message) {
    return new Response(JSON.stringify({ error: 'Champs manquants.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Validation du format d'email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Adresse email invalide.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    await resend.emails.send({
      from: 'Contact <onboarding@resend.dev>',
      to: 'bouratchikj@gmail.com',
      replyTo: email,
      subject: `Message de ${nom} — philippemuraro.fr`,
      text: `Nom : ${nom}\nEmail : ${email}\n\nMessage :\n${message}`,
    })

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Resend error:', err)
    return new Response(JSON.stringify({ error: 'Erreur lors de l\'envoi.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
