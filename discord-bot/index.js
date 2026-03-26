const { Client, GatewayIntentBits, Events } = require('discord.js')
const fetch = require('node-fetch')
require('dotenv').config()

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
})

client.once(Events.ClientReady, (c) => {
  console.log(`✅ XERON Bot ready as ${c.user.tag}`)
})

client.on(Events.GuildMemberAdd, async (member) => {
  console.log(`New member: ${member.user.tag} (${member.id})`)

  // Notify webhook to give credits
  try {
    const res = await fetch(`${process.env.APP_URL || 'https://xeron-labs.com'}/api/discord/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        discord_id: member.id,
        secret: process.env.DISCORD_WEBHOOK_SECRET || 'XeronBot2025Geheim',
      }),
    })
    const data = await res.json()
    console.log('Webhook response:', data)
  } catch (err) {
    console.error('Webhook error:', err)
  }

  // DM the new member
  try {
    await member.send(
      `🎮 **Welcome to the XERON Engine community!**\n\n` +
      `You just received **10 bonus credits** for joining our Discord!\n\n` +
      `🚀 Start building your Roblox game: https://xeron-labs.com/dashboard\n\n` +
      `Need help? Ask in #support. Happy building! ✨`
    )
    console.log(`DM sent to ${member.user.tag}`)
  } catch (err) {
    console.log(`Could not DM ${member.user.tag}:`, err.message)
  }
})

const token = process.env.DISCORD_BOT_TOKEN
if (!token) {
  console.error('❌ DISCORD_BOT_TOKEN not set!')
  process.exit(1)
}

client.login(token)
