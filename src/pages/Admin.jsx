import { useEffect, useRef, useState } from 'react'
import {
  createPortfolioProject,
  deletePortfolioProject,
  fetchAdminContactInquiries,
  fetchAdminOrders,
  fetchAdminStatus,
  fetchPortfolioProjects,
  loginAdmin,
  updateAdminOrderStatus,
  updatePortfolioProjectPackage,
  verifyAdminSession,
} from '../lib/api'
import { packages } from '../data/packages'

const ADMIN_TOKEN_KEY = 'adminSessionToken'
const PACKAGE_OPTIONS = [...packages.map(pkg => pkg.name), 'Custom']

function getStoredToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY) || ''
}

function formatInquiryDate(value) {
  if (!value) return 'Unknown'

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(value))
  } catch {
    return 'Unknown'
  }
}

function formatCurrencyRange(min, max) {
  if (!min && !max) return 'Custom quote'
  if (min === max) return `$${min}`
  return `$${min} - $${max}`
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

function getOrderStatusLabel(status) {
  switch (status) {
    case 'payment_pending':
      return 'Awaiting Payment'
    case 'paid':
      return 'Deposit Paid'
    case 'accepted':
      return 'Accepted'
    case 'declined':
      return 'Declined'
    default:
      return 'Pending Review'
  }
}

function getOrderStatusClasses(status) {
  switch (status) {
    case 'accepted':
      return 'bg-green-50 text-green-700'
    case 'declined':
      return 'bg-red-50 text-red-700'
    case 'paid':
      return 'bg-amber-50 text-amber-800'
    default:
      return 'bg-softwhite text-warmbrown'
  }
}

function canAcceptOrder(order) {
  return order.status === 'paid'
}

function getAdminConfigMessage() {
  if (typeof window !== 'undefined' && !/^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname)) {
    return 'Admin access is not configured on the deployed server yet. Add `ADMIN_ACCESS_CODE` in your hosting dashboard, then redeploy.'
  }

  return 'Admin access is not configured yet. Add `ADMIN_ACCESS_CODE` to `.env.local`, then restart the API server.'
}

export default function Admin() {
  const [token, setToken] = useState(getStoredToken)
  const [adminReady, setAdminReady] = useState(false)
  const [activeView, setActiveView] = useState('projects')
  const [code, setCode] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [packageInput, setPackageInput] = useState('')
  const [projects, setProjects] = useState([])
  const [orders, setOrders] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [authChecking, setAuthChecking] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [updatingProjectId, setUpdatingProjectId] = useState('')
  const [updatingOrderId, setUpdatingOrderId] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [projectError, setProjectError] = useState('')
  const [ordersError, setOrdersError] = useState('')
  const [inquiriesError, setInquiriesError] = useState('')
  const urlRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    async function boot() {
      try {
        const status = await fetchAdminStatus()

        if (!cancelled) {
          setAdminReady(Boolean(status.ready))
        }

        if (!token) {
          return
        }

        const session = await verifyAdminSession(token)

        if (!session) {
          localStorage.removeItem(ADMIN_TOKEN_KEY)
          if (!cancelled) {
            setToken('')
          }
          return
        }

        const [projectsResult, ordersResult, inquiriesResult] = await Promise.allSettled([
          fetchPortfolioProjects(),
          fetchAdminOrders(token),
          fetchAdminContactInquiries(token),
        ])

        if (!cancelled) {
          setProjects(projectsResult.status === 'fulfilled' ? projectsResult.value : [])
          setOrders(ordersResult.status === 'fulfilled' ? ordersResult.value : [])
          setInquiries(inquiriesResult.status === 'fulfilled' ? inquiriesResult.value : [])
          setProjectError(projectsResult.status === 'rejected' ? projectsResult.reason?.message || 'Could not load projects right now.' : '')
          setOrdersError(ordersResult.status === 'rejected' ? ordersResult.reason?.message || 'Could not load orders right now.' : '')
          setInquiriesError(inquiriesResult.status === 'rejected' ? inquiriesResult.reason?.message || 'Could not load inquiries right now.' : '')
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message)
        }
      } finally {
        if (!cancelled) {
          setAuthChecking(false)
          setLoading(false)
        }
      }
    }

    boot()

    return () => {
      cancelled = true
    }
  }, [token])

  async function handleLogin(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setMessage('')

    try {
      const session = await loginAdmin(code)
      localStorage.setItem(ADMIN_TOKEN_KEY, session.token)
      setToken(session.token)
      setCode('')
      setMessage('Admin access granted.')
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleAddProject(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setMessage('')
    setProjectError('')

    const urls = urlInput
      .split('\n')
      .map(item => item.trim())
      .filter(Boolean)

    if (urls.length === 0) {
      setSubmitting(false)
      setError('Enter at least one project link.')
      return
    }

    try {
      const addedProjects = []
      const failures = []

      for (const currentUrl of urls) {
        try {
          const project = await createPortfolioProject(currentUrl, token, packageInput)
          addedProjects.push(project)
        } catch (saveError) {
          failures.push(`${currentUrl}: ${saveError.message}`)
        }
      }

      if (addedProjects.length > 0) {
        setProjects(current => [...addedProjects, ...current])
        setUrlInput('')
        setPackageInput('')
      }

      if (addedProjects.length > 0 && failures.length === 0) {
        setMessage(`${addedProjects.length} project${addedProjects.length === 1 ? '' : 's'} added successfully.`)
      } else if (addedProjects.length > 0) {
        setMessage(`${addedProjects.length} project${addedProjects.length === 1 ? '' : 's'} added. Some links still need attention.`)
        setError(failures.join(' '))
      } else {
        setError(failures.join(' ') || 'Could not add those project links right now.')
      }

      urlRef.current?.focus()
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRemoveProject(id) {
    setError('')
    setMessage('')
    setProjectError('')

    try {
      await deletePortfolioProject(id, token)
      setProjects(current => current.filter(project => project.id !== id))
      setMessage('Project removed from the live portfolio.')
    } catch (removeError) {
      setError(removeError.message)
    }
  }

  async function handlePackageChange(id, packageType) {
    setUpdatingProjectId(id)
    setError('')
    setMessage('')
    setProjectError('')

    try {
      const updatedProject = await updatePortfolioProjectPackage(id, packageType, token)
      setProjects(current => current.map(project => (project.id === id ? updatedProject : project)))
      setMessage('Project package updated.')
    } catch (updateError) {
      setError(updateError.message)
    } finally {
      setUpdatingProjectId('')
    }
  }

  async function handleOrderDecision(id, status) {
    setUpdatingOrderId(id)
    setError('')
    setMessage('')
    setOrdersError('')

    try {
      const updatedOrder = await updateAdminOrderStatus(id, status, token)
      setOrders(current => current.map(order => (order.id === id ? updatedOrder : order)))
      setMessage(
        status === 'accepted'
          ? 'Order accepted and customer notified.'
          : 'Order declined and customer notified.'
      )
    } catch (updateError) {
      setError(updateError.message)
    } finally {
      setUpdatingOrderId('')
    }
  }

  function handleLogout() {
    localStorage.removeItem(ADMIN_TOKEN_KEY)
    setToken('')
    setActiveView('projects')
    setProjects([])
    setOrders([])
    setInquiries([])
    setProjectError('')
    setOrdersError('')
    setInquiriesError('')
    setCode('')
    setMessage('Signed out.')
  }

  if (authChecking) {
    return (
      <section className="px-5 pb-24 pt-36 sm:px-6 sm:pt-40">
        <div className="mx-auto max-w-3xl rounded-[4px] border border-warmbrown-pale bg-softwhite p-10 text-center text-ink/60 shadow-[0_14px_36px_rgba(17,17,16,0.04)]">
          Checking admin access...
        </div>
      </section>
    )
  }

  if (!token) {
    return (
      <section className="relative overflow-hidden px-5 pb-24 pt-36 sm:px-6 sm:pt-40">
        <div className="absolute inset-x-0 top-0 h-130 bg-[radial-gradient(circle_at_top,rgba(255,208,0,0.24),transparent_34%),radial-gradient(circle_at_left,rgba(240,23,106,0.16),transparent_28%)]" />
        <div className="relative mx-auto max-w-3xl">
          <div className="rounded-[4px] border border-warmbrown-pale bg-softwhite p-8 shadow-[0_24px_60px_rgba(17,17,16,0.08)] sm:p-10">
            <p className="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-warmbrown">Admin</p>
            <h1 className="mt-5 font-display text-[3rem] leading-[0.94] text-ink sm:text-[3.8rem]">
              Enter the admin access code.
            </h1>
            <p className="mt-5 max-w-2xl text-[1rem] leading-8 text-ink/65">
              Use the private code shared with admins to open the dashboard and manage portfolio links on the public site.
            </p>
            {!adminReady && (
              <p className="mt-4 max-w-2xl rounded-[4px] border border-warmbrown-pale bg-cream px-4 py-3 text-sm text-ink/70">
                {getAdminConfigMessage()}
              </p>
            )}

            <form onSubmit={handleLogin} className="mt-10 space-y-5">
              <label className="block">
                <span className="mb-2 block text-[0.74rem] font-medium uppercase tracking-[0.18em] text-ink/60">Admin access code</span>
                <input
                  type="password"
                  value={code}
                  onChange={event => setCode(event.target.value)}
                  className="w-full rounded-[4px] border border-warmbrown-pale bg-cream px-4 py-4 text-[1rem] text-ink outline-none focus:border-warmbrown"
                  placeholder="Enter admin code"
                  required
                />
              </label>

              {error && <p className="rounded-[4px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
              {message && <p className="rounded-[4px] border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-ink px-8 py-4 text-[0.76rem] font-medium uppercase tracking-[0.2em] text-softwhite transition hover:bg-warmbrown disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Signing In...' : 'Enter Admin'}
              </button>
            </form>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="px-5 pb-24 pt-36 sm:px-6 sm:pt-40">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[4px] border border-warmbrown-pale bg-softwhite p-8 shadow-[0_14px_36px_rgba(17,17,16,0.04)]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-warmbrown">Admin Dashboard</p>
              <h1 className="mt-4 font-display text-[2.8rem] leading-[0.96] text-ink">Manage projects and orders in one private workspace.</h1>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-warmbrown-pale px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-ink/65 transition hover:border-warmbrown hover:text-ink"
            >
              Log Out
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveView('projects')}
              className={`rounded-full px-5 py-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] transition ${
                activeView === 'projects'
                  ? 'bg-ink text-softwhite'
                  : 'border border-warmbrown-pale bg-cream text-ink/65 hover:border-warmbrown hover:text-ink'
              }`}
            >
              Projects
            </button>
            <button
              type="button"
              onClick={() => setActiveView('orders')}
              className={`rounded-full px-5 py-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] transition ${
                activeView === 'orders'
                  ? 'bg-ink text-softwhite'
                  : 'border border-warmbrown-pale bg-cream text-ink/65 hover:border-warmbrown hover:text-ink'
              }`}
            >
              Orders
            </button>
          </div>
        </div>

        {activeView === 'projects' ? (
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[4px] border border-warmbrown-pale bg-softwhite p-8 shadow-[0_14px_36px_rgba(17,17,16,0.04)]">
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-warmbrown">Projects</p>
              <h2 className="mt-4 font-display text-[2.6rem] leading-[0.96] text-ink">Publish a project link to the public portfolio.</h2>

              <p className="mt-5 text-[1rem] leading-8 text-ink/65">
                When you add a URL here, the backend visits the live website, captures its content, saves preview images when possible, and publishes the project to the main site.
              </p>

              <form onSubmit={handleAddProject} className="mt-8 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-[0.74rem] font-medium uppercase tracking-[0.18em] text-ink/60">Portfolio project link</span>
                  <textarea
                    ref={urlRef}
                    value={urlInput}
                    onChange={event => setUrlInput(event.target.value)}
                    rows={5}
                    className="w-full rounded-[4px] border border-warmbrown-pale bg-cream px-4 py-4 text-[1rem] leading-8 text-ink outline-none focus:border-warmbrown"
                    placeholder={'https://yourclientproject.com\nhttps://anotherproject.com'}
                    required
                  />
                  <span className="mt-2 block text-sm text-ink/55">Add one link per line.</span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-[0.74rem] font-medium uppercase tracking-[0.18em] text-ink/60">Package label</span>
                  <select
                    value={packageInput}
                    onChange={event => setPackageInput(event.target.value)}
                    className="w-full rounded-[4px] border border-warmbrown-pale bg-cream px-4 py-4 text-[1rem] text-ink outline-none focus:border-warmbrown"
                  >
                    <option value="">Auto-detect package</option>
                    {PACKAGE_OPTIONS.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <span className="mt-2 block text-sm text-ink/55">Choose a package yourself when the automatic guess is off.</span>
                </label>

                {error && <p className="rounded-[4px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
                {message && <p className="rounded-[4px] border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-ink px-8 py-4 text-[0.76rem] font-medium uppercase tracking-[0.2em] text-softwhite transition hover:bg-warmbrown disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Rendering Project...' : 'Add Project'}
                </button>
              </form>
            </div>

            <div className="rounded-[4px] border border-warmbrown-pale bg-softwhite p-8 shadow-[0_14px_36px_rgba(17,17,16,0.04)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-warmbrown">Live Entries</p>
                  <h2 className="mt-4 font-display text-[2.2rem] leading-none text-ink">Projects currently showing on the public site.</h2>
                </div>
                <span className="rounded-full bg-cream px-4 py-2 text-[0.7rem] uppercase tracking-[0.16em] text-ink/60">
                  {loading ? 'Loading...' : `${projects.length} total`}
                </span>
              </div>

              <div className="mt-8 space-y-5">
                {projectError && (
                  <p className="rounded-[4px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    {projectError}
                  </p>
                )}
                {projects.length === 0 ? (
                  <div className="rounded-[4px] border border-dashed border-warmbrown-pale bg-cream px-6 py-10 text-center text-ink/60">
                    No projects added yet.
                  </div>
                ) : (
                  projects.map(project => (
                    <article key={project.id} className="rounded-[4px] border border-warmbrown-pale bg-cream p-5">
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-warmbrown">
                            {new URL(project.url).hostname.replace(/^www\./, '')}
                          </p>
                          <h3 className="mt-2 font-display text-[1.7rem] text-ink">{project.title}</h3>
                          <p className="mt-3 text-[0.95rem] leading-7 text-ink/65">{project.summary}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {project.technologies?.map(technology => (
                              <span key={technology} className="rounded-full bg-softwhite px-3 py-1 text-[0.66rem] uppercase tracking-[0.14em] text-warmbrown">
                                {technology}
                              </span>
                            ))}
                          </div>
                          <div className="mt-4 max-w-xs">
                            <span className="mb-2 block text-[0.68rem] uppercase tracking-[0.18em] text-ink/55">Package label</span>
                            <select
                              value={project.packageType || 'Custom'}
                              onChange={event => handlePackageChange(project.id, event.target.value)}
                              disabled={updatingProjectId === project.id}
                              className="w-full rounded-[4px] border border-warmbrown-pale bg-softwhite px-3 py-3 text-[0.9rem] text-ink outline-none focus:border-warmbrown disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              {PACKAGE_OPTIONS.map(option => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveProject(project.id)}
                          className="rounded-full border border-warmbrown-pale px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-ink/65 transition hover:border-red-300 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[4px] border border-warmbrown-pale bg-softwhite p-8 shadow-[0_14px_36px_rgba(17,17,16,0.04)]">
            {error && <p className="mb-6 rounded-[4px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            {message && <p className="mb-6 rounded-[4px] border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</p>}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-warmbrown">Orders</p>
                <h2 className="mt-4 font-display text-[2.2rem] leading-none text-ink">Placed website orders and general inquiries.</h2>
              </div>
              <span className="rounded-full bg-cream px-4 py-2 text-[0.7rem] uppercase tracking-[0.16em] text-ink/60">
                {loading ? 'Loading...' : `${orders.length} orders`}
              </span>
            </div>

            <p className="mt-5 max-w-3xl text-[1rem] leading-8 text-ink/65">
              Structured orders now arrive with package selections, add-ons, deposit amounts, and payment state so the site behaves more like a storefront.
            </p>

            <div className="mt-8 space-y-8">
              <div>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h3 className="font-display text-[1.8rem] text-ink">Orders</h3>
                  <span className="rounded-full bg-cream px-4 py-2 text-[0.68rem] uppercase tracking-[0.16em] text-ink/60">
                    {loading ? 'Loading...' : `${orders.length} total`}
                  </span>
                </div>
                {ordersError && (
                  <p className="mb-4 rounded-[4px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    {ordersError}
                  </p>
                )}
                {loading ? (
                  <div className="rounded-[4px] border border-dashed border-warmbrown-pale bg-cream px-6 py-10 text-center text-ink/60">
                    Loading orders...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="rounded-[4px] border border-dashed border-warmbrown-pale bg-cream px-6 py-10 text-center text-ink/60">
                    No orders yet.
                  </div>
                ) : (
                  <div className="grid gap-5">
                    {orders.map(order => (
                      <article key={order.id} className="rounded-[4px] border border-warmbrown-pale bg-cream p-5">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                              <h4 className="font-display text-[1.8rem] text-ink">
                                {order.firstName} {order.lastName}
                              </h4>
                              <span className={`rounded-full px-3 py-1 text-[0.66rem] uppercase tracking-[0.14em] ${getOrderStatusClasses(order.status)}`}>
                                {getOrderStatusLabel(order.status)}
                              </span>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-4 text-sm text-ink/60">
                              <span>{formatInquiryDate(order.createdAt)}</span>
                              <a href={`mailto:${order.email}`} className="text-warmbrown transition hover:text-ink">
                                {order.email}
                              </a>
                              <span>{order.businessName}</span>
                            </div>

                            <div className="mt-5 grid gap-4 md:grid-cols-2">
                              <div className="rounded-[4px] border border-warmbrown-pale bg-softwhite px-4 py-4">
                                <div className="text-[0.68rem] uppercase tracking-[0.16em] text-ink/48">Package</div>
                                <div className="mt-2 text-[1rem] text-ink">{order.packageName}</div>
                                <div className="mt-1 text-sm text-warmbrown">{order.packagePrice}</div>
                              </div>
                              <div className="rounded-[4px] border border-warmbrown-pale bg-softwhite px-4 py-4">
                                <div className="text-[0.68rem] uppercase tracking-[0.16em] text-ink/48">Estimated total</div>
                                <div className="mt-2 text-[1rem] text-ink">{formatCurrencyRange(order.totalMin, order.totalMax)}</div>
                                <div className="mt-1 text-sm text-ink/55">{order.timeline || 'No timeline provided'}</div>
                              </div>
                              <div className="rounded-[4px] border border-warmbrown-pale bg-softwhite px-4 py-4">
                                <div className="text-[0.68rem] uppercase tracking-[0.16em] text-ink/48">Deposit paid online</div>
                                <div className="mt-2 text-[1rem] text-ink">{formatCurrency(order.amountDueNow)}</div>
                                <div className="mt-1 text-sm text-ink/55">
                                  <span>Session: </span>
                                  <span className="break-all font-mono text-[0.78rem]">
                                    {order.stripeSessionId || 'Not available'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-5 grid gap-4 md:grid-cols-2">
                              <div>
                                <div className="text-[0.68rem] uppercase tracking-[0.16em] text-ink/48">Add-ons</div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {order.addons?.length ? order.addons.map(addon => (
                                    <span key={addon.id || addon.label} className="rounded-full bg-softwhite px-3 py-1 text-[0.66rem] uppercase tracking-[0.14em] text-warmbrown">
                                      {addon.label} {addon.price ? `(${addon.price})` : ''}
                                    </span>
                                  )) : (
                                    <span className="text-sm text-ink/55">No add-ons selected</span>
                                  )}
                                </div>
                              </div>
                              <div>
                                <div className="text-[0.68rem] uppercase tracking-[0.16em] text-ink/48">Website</div>
                                <div className="mt-2 text-sm text-ink/70">{order.website || 'Not provided'}</div>
                              </div>
                            </div>

                            <div className="mt-5">
                              <div className="text-[0.68rem] uppercase tracking-[0.16em] text-ink/48">Project notes</div>
                              <p className="mt-2 whitespace-pre-line text-[0.95rem] leading-7 text-ink/70">
                                {order.notes || 'No project notes included.'}
                              </p>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-3">
                              <button
                                type="button"
                                onClick={() => handleOrderDecision(order.id, 'accepted')}
                                disabled={updatingOrderId === order.id || order.status === 'accepted' || !canAcceptOrder(order)}
                                className="rounded-full bg-ink px-5 py-3 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-softwhite transition hover:bg-warmbrown disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {updatingOrderId === order.id
                                  ? 'Updating...'
                                  : order.status === 'accepted'
                                    ? 'Accepted'
                                    : !canAcceptOrder(order)
                                      ? 'Payment Required'
                                      : 'Accept Order'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOrderDecision(order.id, 'declined')}
                                disabled={updatingOrderId === order.id || order.status === 'declined'}
                                className="rounded-full border border-red-200 px-5 py-3 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-red-700 transition hover:border-red-400 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {updatingOrderId === order.id ? 'Updating...' : order.status === 'declined' ? 'Declined' : 'Decline Order'}
                              </button>
                            </div>
                            {!canAcceptOrder(order) && order.status !== 'accepted' && order.status !== 'declined' && (
                              <p className="mt-3 text-sm text-amber-800">
                                This order can only be accepted after the Stripe deposit is paid.
                              </p>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h3 className="font-display text-[1.8rem] text-ink">General inquiries</h3>
                  <span className="rounded-full bg-cream px-4 py-2 text-[0.68rem] uppercase tracking-[0.16em] text-ink/60">
                    {loading ? 'Loading...' : `${inquiries.length} total`}
                  </span>
                </div>
              {inquiriesError && (
                <p className="mb-4 rounded-[4px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {inquiriesError}
                </p>
              )}
              {loading ? (
                <div className="rounded-[4px] border border-dashed border-warmbrown-pale bg-cream px-6 py-10 text-center text-ink/60">
                  Loading inquiries...
                </div>
              ) : inquiries.length === 0 ? (
                <div className="rounded-[4px] border border-dashed border-warmbrown-pale bg-cream px-6 py-10 text-center text-ink/60">
                  No inquiries yet.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-[4px] border border-warmbrown-pale bg-cream">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-softwhite text-warmbrown uppercase tracking-[0.14em]">
                      <tr>
                        <th className="px-4 py-3">Submitted</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Business</th>
                        <th className="px-4 py-3">Package</th>
                        <th className="px-4 py-3">Timeline</th>
                        <th className="px-4 py-3">Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.map(inquiry => (
                        <tr key={inquiry.id} className="border-t border-warmbrown-pale/60 align-top">
                          <td className="px-4 py-3 whitespace-nowrap text-ink/60">{formatInquiryDate(inquiry.createdAt)}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{inquiry.firstName} {inquiry.lastName}</td>
                          <td className="px-4 py-3">
                            <a href={`mailto:${inquiry.email}`} className="text-warmbrown transition hover:text-ink">
                              {inquiry.email}
                            </a>
                          </td>
                          <td className="px-4 py-3">{inquiry.businessName || 'Not provided'}</td>
                          <td className="px-4 py-3">{inquiry.package || 'Not selected'}</td>
                          <td className="px-4 py-3">{inquiry.timeline || 'Not provided'}</td>
                          <td className="px-4 py-3 max-w-sm whitespace-pre-line text-ink/70">{inquiry.message || 'No message included.'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
