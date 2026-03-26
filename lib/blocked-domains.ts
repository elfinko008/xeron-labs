export const BLOCKED_DOMAINS = [
  'mailinator.com',
  'tempmail.com',
  'guerrillamail.com',
  '10minutemail.com',
  'throwam.com',
  'yopmail.com',
  'trashmail.com',
  'fakeinbox.com',
  'sharklasers.com',
  'guerrillamailblock.com',
  'grr.la',
  'spam4.me',
  'dispostable.com',
  'mailnull.com',
  'spamgourmet.com',
  'trashmail.at',
  'trashmail.io',
  'tempr.email',
  'discard.email',
]

export function isBlockedEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return true
  return BLOCKED_DOMAINS.includes(domain)
}
