# Webbyleen

This project includes a public portfolio feed, a contact inquiry flow, a storefront-style checkout flow, and an admin dashboard for publishing real project links to the site.

## Run locally

Frontend:

```bash
npm run dev
```

Backend:

```bash
npm run dev:api
```

The backend now reads environment variables from the root `.env.local` file through the `dev:api` script.
On Vercel, the same Express app is served from the repo's `/api` directory as serverless functions, so the deployed frontend can call `/api/...` on the same domain.

## Required environment variables

Add these to `.env.local`:

```env
VITE_SUPABASE_URL=https://ugedvhmgjbxmrinjwyep.supabase.co
VITE_SUPABASE_ANON_KEY=your_publishable_key
SUPABASE_URL=https://ugedvhmgjbxmrinjwyep.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_TOKEN_SECRET=change-this-in-production
STRIPE_SECRET_KEY=sk_test_or_sk_live_key_here
SITE_URL=http://localhost:5173
ORDER_NOTIFICATION_EMAIL=webstudioace@outlook.com
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
EMAILJS_PUBLIC_KEY=your_emailjs_public_key
EMAILJS_PRIVATE_KEY=your_emailjs_private_key
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_contact_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

This is a Vite app, so use `VITE_...` names for frontend values instead of `NEXT_PUBLIC_...`.

## SQL setup

Create the Supabase tables and the `portfolio-previews` storage bucket before using the app. The codebase is now wired to expect those resources.

Suggested SQL tables:

```sql
create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  email text not null,
  business_name text,
  website text,
  timeline text,
  package text,
  message text,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  business_name text,
  website text,
  timeline text,
  notes text,
  package_slug text not null,
  package_name text not null,
  package_price text not null,
  addons jsonb not null default '[]'::jsonb,
  total_min integer not null default 0,
  total_max integer not null default 0,
  amount_due_now integer not null default 0,
  currency text not null default 'usd',
  stripe_session_id text,
  submitted_email_sent_at timestamptz,
  decision_email_sent_at timestamptz,
  customer_notified_status text,
  status text not null default 'payment_pending',
  created_at timestamptz not null default now()
);

create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  url text not null unique,
  title text not null,
  description text,
  technologies text[] not null default '{}',
  package_type text,
  summary text,
  og_image text,
  screenshots text[] not null default '{}',
  created_at timestamptz not null default now()
);
```

You can also run the ready-made SQL file at [supabase/orders-and-notifications.sql](/Users/naaayele/webbyleen/supabase/orders-and-notifications.sql:1).

## EmailJS Notifications

This project now sends order notifications through EmailJS so you can use it without buying a domain first.

Order emails use the server-side EmailJS REST API with:

- `EMAILJS_SERVICE_ID`
- `EMAILJS_TEMPLATE_ID`
- `EMAILJS_PUBLIC_KEY`
- `EMAILJS_PRIVATE_KEY`

The template should accept these variables:

- `to_email`
- `subject`
- `message`
- `reply_to`
- `from_name`

Recommended template content:

Subject:

```text
{{subject}}
```

Body:

```text
From: {{from_name}}
Reply to: {{reply_to}}

{{message}}
```

The contact page can also use EmailJS in the browser with:

- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

## Portfolio flow

1. Visit `/admin`
2. Create the first admin account
3. Paste a live project URL
4. The backend visits the URL, captures preview screenshots and metadata, and stores them in Supabase
5. The homepage and `/portfolio` page render that saved project content for all users

## Contact flow

1. Users submit the contact form
2. The backend stores the inquiry in Supabase
3. Admins review those saved inquiries inside the `/admin` dashboard

## Checkout flow

1. Users open `/checkout` or choose a package from `/services`
2. They select a package, optional add-ons, and project details
3. The backend creates a Stripe Checkout Session for the starting deposit
4. Users pay securely on Stripe and return to `/checkout/success`
5. The order record is saved with package, extras, deposit amount, and payment state for admins in `/admin`

The checkout now only requires the client's name, email, and website idea before taking the deposit.
