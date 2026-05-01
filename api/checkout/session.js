import { buildOrderPayload, ensureStripe, ensureSupabase, getCheckoutOrderDetails, getSiteUrl, json, methodNotAllowed, parseMoneyRange, readRequestBody, STRIPE_CURRENCY, stripe, toStripeAmount } from '../_shared/core.js'
import { supabase } from '../supabase.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST'])
  }

  try {
    ensureSupabase()
    ensureStripe()

    const body = readRequestBody(req)
    const details = getCheckoutOrderDetails(body)

    if (!details.firstName || !details.lastName || !details.email || !details.notes) {
      return json(res, 400, { error: 'First name, last name, email, and your website idea are required before payment.' })
    }

    const siteUrl = getSiteUrl(req)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      billing_address_collection: 'auto',
      customer_email: details.email,
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel?package=${details.packageSlug}`,
      submit_type: 'pay',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: STRIPE_CURRENCY,
            unit_amount: toStripeAmount(parseMoneyRange(details.selectedPackage.deposit).min),
            product_data: {
              name: `${details.packageName} package deposit`,
              description: `Initial deposit for the ${details.packageName} website package.`,
            },
          },
        },
        ...details.selectedAddons.map(addon => ({
          quantity: 1,
          price_data: {
            currency: STRIPE_CURRENCY,
            unit_amount: toStripeAmount(parseMoneyRange(addon.price).min),
            product_data: {
              name: `${addon.label} add-on`,
              description: `Add-on for the ${details.packageName} website package.`,
            },
          },
        })),
      ],
      metadata: {
        firstName: details.firstName,
        lastName: details.lastName,
        email: details.email,
        businessName: details.businessName,
        website: details.website.slice(0, 500),
        timeline: details.timeline.slice(0, 500),
        notes: details.notes.slice(0, 500),
        packageSlug: details.packageSlug,
        packageName: details.packageName,
        packagePrice: details.packagePrice,
        addonIds: details.selectedAddons.map(addon => addon.id).join(','),
        totalMin: String(details.totalMin),
        totalMax: String(details.totalMax),
        amountDueNow: String(details.amountDueNow),
      },
    })

    const payload = buildOrderPayload(details, {
      stripeSessionId: session.id,
      status: 'payment_pending',
    })

    const { error } = await supabase.from('orders').insert(payload)

    if (error) {
      throw new Error(error.message)
    }

    return json(res, 201, {
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    return json(res, 500, { error: error.message || 'Could not start checkout.' })
  }
}
