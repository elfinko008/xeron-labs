require('dotenv').config()
const { Client, GatewayIntentBits } = require('discord.js')
const fetch = require('node-fetch')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
})

client.once('ready', () => {
  console.log(`[XERON Bot] Eingeloggt als ${client.user.tag}`)
})

client.on('guildMemberAdd', async (member) => {
  if (member.guild.id !== process.env.DISCORD_SERVER_ID) return

  const discordId = member.id
  console.log(`[XERON Bot] Neues Mitglied: ${member.user.tag} (${discordId})`)

  // Webhook an XERON API senden
  try {
    const res = await fetch('https://xeron-labs.com/api/discord/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        discord_id: discordId,
        secret: process.env.DISCORD_WEBHOOK_SECRET,
      }),
    })

    const data = await res.json()
    console.log(`[XERON Bot] Webhook-Antwort:`, data)

    if (data.success) {
      // DM an neues Mitglied
      try {
        await member.send(
          `🎮 **Willkommen bei XERON Engine!**\n\n` +
          `Du hast **${data.credits_added || 10} Bonus-Credits** erhalten! 🎉\n\n` +
          `Generiere jetzt dein erstes Roblox-Spiel:\n` +
          `👉 https://xeron-labs.com/dashboard`
        )
      } catch {
        console.log(`[XERON Bot] DM konnte nicht gesendet werden (${member.user.tag})`)
      }
    }
  } catch (err) {
    console.error('[XERON Bot] Webhook-Fehler:', err)
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)
