const RAW_API_BASE_URL = import.meta.env.VITE_API_URL || ''

function getApiBaseUrl() {
  if (!RAW_API_BASE_URL) {
    return ''
  }

  if (typeof window === 'undefined') {
    return RAW_API_BASE_URL
  }

  // In production, prefer the current site's own API routes so stale env values
  // do not point the public site at an old deployment hostname.
  if (!/^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname)) {
    return ''
  }

  try {
    const configuredUrl = new URL(RAW_API_BASE_URL, window.location.origin)
    return configuredUrl.origin
  } catch {
    return RAW_API_BASE_URL
  }
}

const API_BASE_URL = getApiBaseUrl()

function getApiUrl(path) {
  return `${API_BASE_URL}${path}`
}

async function fetchWithSameOriginFallback(path, options) {
  const primaryUrl = getApiUrl(path)

  try {
    const response = await fetch(primaryUrl, options)

    if (
      !response.ok &&
      API_BASE_URL &&
      typeof window !== 'undefined' &&
      !/^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname)
    ) {
      return fetch(path, options)
    }

    return response
  } catch (error) {
    if (
      API_BASE_URL &&
      typeof window !== 'undefined' &&
      !/^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname)
    ) {
      return fetch(path, options)
    }

    throw error
  }
}

function getApiOriginLabel() {
  if (API_BASE_URL) {
    return API_BASE_URL
  }

  if (typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname)) {
    return 'http://localhost:5050'
  }

  return 'this site'
}

async function readJson(response) {
  return response.json().catch(() => ({}))
}

function getNetworkErrorMessage(fallback) {
  const apiLocation = getApiOriginLabel()
  const suffix =
    apiLocation === 'this site'
      ? 'Make sure the deployed API is available for this site.'
      : `Make sure the API server is running on ${apiLocation}.`

  return `${fallback} ${suffix}`
}

function getFriendlyErrorMessage(payload, fallback) {
  const raw = typeof payload?.error === 'string' ? payload.error : ''

  if (!raw) {
    return fallback
  }

  if (/supabase is not configured/i.test(raw)) {
    if (typeof window !== 'undefined' && !/^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname)) {
      return 'Supabase is not connected on the deployed server yet. Add the required Supabase server environment variables in your hosting dashboard and redeploy.'
    }

    return 'Supabase is not connected yet. Add your Supabase keys to the local environment first.'
  }

  if (/relation .* does not exist|table .* does not exist/i.test(raw)) {
    return 'Your Supabase tables are not ready yet. Create the required SQL tables first.'
  }

  if (/orders/i.test(raw) && /column .* does not exist/i.test(raw)) {
    return 'Your orders table is missing one or more required columns. Update it to match the schema in the README.'
  }

  if (/bucket .* not found|portfolio-previews/i.test(raw) && /not found|does not exist/i.test(raw)) {
    return 'Your Supabase storage bucket is missing. Create the `portfolio-previews` bucket first.'
  }

  if (/could not reach that website/i.test(raw)) {
    return 'Could not reach that website. Check the link and make sure the site is live.'
  }

  if (/took too long to load for a preview/i.test(raw)) {
    return 'That website took too long to load for a preview. Try again or use another link.'
  }

  if (/blocked the preview request/i.test(raw)) {
    return 'That website blocked the preview request. Some sites do not allow automated previews.'
  }

  if (/preview failed:/i.test(raw)) {
    return 'We could not generate a preview for that website right now.'
  }

  if (/invalid admin access code/i.test(raw)) {
    return 'That admin access code is not correct.'
  }

  if (/admin access code is required/i.test(raw)) {
    return 'Enter the admin access code.'
  }

  if (/admin access code is not configured/i.test(raw)) {
    return 'Admin access is not configured yet. Add `ADMIN_ACCESS_CODE` to `.env.local`, then restart the API server.'
  }

  if (/stripe is not configured/i.test(raw)) {
    return 'Payments are not configured yet. Add your Stripe secret key to the server environment first.'
  }

  if (/email is required/i.test(raw)) {
    return 'Enter an email address before sending the form.'
  }

  if (/already exists|already in the portfolio/i.test(raw)) {
    return raw
  }

  if (/project not found/i.test(raw)) {
    return 'That project could not be found anymore.'
  }

  // For admin/debug flows, showing the server message is more helpful than a vague fallback.
  return raw || fallback
}

export function resolveAssetUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return `${API_BASE_URL}${path}`
}

export async function fetchPortfolioProjects() {
  let response

  try {
    response = await fetchWithSameOriginFallback('/api/portfolio-projects')
  } catch {
    throw new Error(getNetworkErrorMessage('Could not load portfolio projects.'))
  }

  if (!response.ok) {
    const payload = await readJson(response)
    throw new Error(getFriendlyErrorMessage(payload, 'Could not load portfolio projects right now.'))
  }

  return response.json()
}

export async function fetchAdminStatus() {
  let response

  try {
    response = await fetchWithSameOriginFallback('/api/admin/status')
  } catch {
    throw new Error(getNetworkErrorMessage('Could not load admin status.'))
  }

  if (!response.ok) {
    const payload = await readJson(response)
    throw new Error(getFriendlyErrorMessage(payload, 'Could not load admin status right now.'))
  }

  return response.json()
}

export async function loginAdmin(code) {
  let response

  try {
    response = await fetchWithSameOriginFallback('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
  } catch {
    throw new Error(getNetworkErrorMessage('Login failed.'))
  }

  const payload = await readJson(response)

  if (!response.ok) {
    throw new Error(getFriendlyErrorMessage(payload, 'Could not sign in right now.'))
  }

  return payload
}

export async function verifyAdminSession(token) {
  let response

  try {
    response = await fetchWithSameOriginFallback('/api/admin/session', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch {
    return null
  }

  if (!response.ok) {
    return null
  }

  return response.json()
}

export async function createPortfolioProject(url, token, packageType = '') {
  let response

  try {
    response = await fetchWithSameOriginFallback('/api/admin/portfolio-projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url, packageType }),
    })
  } catch {
    throw new Error(getNetworkErrorMessage('Could not add this project.'))
  }

  const payload = await readJson(response)

  if (!response.ok) {
    throw new Error(getFriendlyErrorMessage(payload, 'Could not add this project right now.'))
  }

  return payload
}

export async function updatePortfolioProjectPackage(id, packageType, token) {
  let response

  try {
    response = await fetchWithSameOriginFallback(`/api/admin/portfolio-projects/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ packageType }),
    })
  } catch {
    throw new Error(getNetworkErrorMessage('Could not update this project.'))
  }

  const payload = await readJson(response)

  if (!response.ok) {
    throw new Error(getFriendlyErrorMessage(payload, 'Could not update this project right now.'))
  }

  return payload
}

export async function deletePortfolioProject(id, token) {
  let response

  try {
    response = await fetchWithSameOriginFallback(`/api/admin/portfolio-projects/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch {
    throw new Error(getNetworkErrorMessage('Could not remove this project.'))
  }

  const payload = await readJson(response)

  if (!response.ok) {
    throw new Error(getFriendlyErrorMessage(payload, 'Could not remove this project right now.'))
  }

  return payload
}

export async function createContactInquiry(form) {
  let response

  try {
    response = await fetchWithSameOriginFallback('/api/contact-inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
  } catch {
    throw new Error(getNetworkErrorMessage('Could not send your message.'))
  }

  const payload = await readJson(response)

  if (!response.ok) {
    throw new Error(getFriendlyErrorMessage(payload, 'Could not send your message right now.'))
  }

  return payload
}

export async function createCheckoutSession(order) {
  let response

  try {
    response = await fetchWithSameOriginFallback('/api/checkout/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    })
  } catch {
    throw new Error(getNetworkErrorMessage('Could not place your order.'))
  }

  const payload = await readJson(response)

  if (!response.ok) {
    throw new Error(getFriendlyErrorMessage(payload, 'Could not place your order right now.'))
  }

  return payload
}

export async function confirmOrderPayment(sessionId) {
  let response

  try {
    response = await fetchWithSameOriginFallback('/api/orders/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
  } catch {
    throw new Error(getNetworkErrorMessage('Could not confirm your payment.'))
  }

  const payload = await readJson(response)

  if (!response.ok) {
    throw new Error(getFriendlyErrorMessage(payload, 'Could not confirm your payment right now.'))
  }

  return payload
}

export async function fetchAdminContactInquiries(token) {
  let response

  try {
    response = await fetchWithSameOriginFallback('/api/admin/contact-inquiries', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch {
    throw new Error(getNetworkErrorMessage('Could not load inquiries.'))
  }

  if (!response.ok) {
    const payload = await readJson(response)
    throw new Error(getFriendlyErrorMessage(payload, 'Could not load inquiries right now.'))
  }

  return response.json()
}

export async function fetchAdminOrders(token) {
  let response

  try {
    response = await fetchWithSameOriginFallback('/api/admin/orders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch {
    throw new Error(getNetworkErrorMessage('Could not load orders.'))
  }

  if (!response.ok) {
    const payload = await readJson(response)
    throw new Error(getFriendlyErrorMessage(payload, 'Could not load orders right now.'))
  }

  return response.json()
}

export async function updateAdminOrderStatus(id, status, token) {
  let response

  try {
    response = await fetchWithSameOriginFallback(`/api/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })
  } catch {
    throw new Error(getNetworkErrorMessage('Could not update this order.'))
  }

  const payload = await readJson(response)

  if (!response.ok) {
    throw new Error(getFriendlyErrorMessage(payload, 'Could not update this order right now.'))
  }

  return payload
}

export async function deleteAdminOrder(id, token) {
  let response

  try {
    response = await fetchWithSameOriginFallback(`/api/admin/orders/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch {
    throw new Error(getNetworkErrorMessage('Could not remove this order.'))
  }

  const payload = await readJson(response)

  if (!response.ok) {
    throw new Error(getFriendlyErrorMessage(payload, 'Could not remove this order right now.'))
  }

  return payload
}
