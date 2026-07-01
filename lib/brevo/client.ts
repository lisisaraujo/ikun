const BREVO_API_URL = 'https://api.brevo.com/v3'

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'api-key': process.env.BREVO_API_KEY!,
  }
}

export async function subscribeEmail(email: string): Promise<void> {
  const listId = Number(process.env.BREVO_LIST_ID ?? '2')

  const res = await fetch(`${BREVO_API_URL}/contacts`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      email,
      listIds: [listId],
      updateEnabled: true,
    }),
  })

  if (!res.ok && res.status !== 204) {
    const body = await res.json().catch(() => ({}))
    // 400 with code "duplicate_parameter" means already subscribed — treat as success
    if ((body as { code?: string }).code === 'duplicate_parameter') return
    throw new Error(`Brevo subscribe failed: ${res.status}`)
  }
}

export async function sendIronuNotification(
  postTitle: string,
  postSlug: string,
  siteUrl: string
): Promise<void> {
  const listId = Number(process.env.BREVO_LIST_ID ?? '2')
  const templateId = process.env.BREVO_TEMPLATE_ID
    ? Number(process.env.BREVO_TEMPLATE_ID)
    : undefined

  const postUrl = `${siteUrl}/ironu/${postSlug}`

  const body = templateId
    ? {
        templateId,
        params: { POST_TITLE: postTitle, POST_URL: postUrl },
        messageVersions: [{ to: [{ email: `list+${listId}@send.sendinblue.com` }] }],
      }
    : {
        sender: {
          name: process.env.BREVO_SENDER_NAME ?? 'IKUN Mufutau Yusuf',
          email: process.env.BREVO_SENDER_EMAIL!,
        },
        to: [{ email: `list+${listId}@send.sendinblue.com` }],
        subject: `New Irònú post: ${postTitle}`,
        htmlContent: `<p>A new reflection has been published.</p>
<h2>${postTitle}</h2>
<p><a href="${postUrl}">Read it here →</a></p>`,
      }

  const res = await fetch(`${BREVO_API_URL}/smtp/email`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(`Brevo send failed: ${res.status}`)
  }
}
