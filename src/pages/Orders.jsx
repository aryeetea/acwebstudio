import { useEffect, useState } from 'react'
import SectionIntro from '../components/SectionIntro'

export default function Orders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    // Load orders from localStorage (or replace with API call if backend is added)
    const saved = localStorage.getItem('orders')
    if (saved) setOrders(JSON.parse(saved))
  }, [])

  return (
    <>
      <section className="relative overflow-hidden px-5 pb-20 pt-36 sm:px-6 sm:pt-40">
        <div className="relative mx-auto max-w-6xl">
          <SectionIntro
            label="Orders"
            title="Client Inquiries & Orders"
            copy="All requests submitted through the contact form are listed here for easy review and follow-up."
          />
        </div>
      </section>
      <section className="px-5 pb-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          {orders.length === 0 ? (
            <div className="text-center text-ink/60 text-lg">No orders yet.</div>
          ) : (
            <div className="overflow-x-auto rounded border border-warmbrown-pale bg-softwhite shadow">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-cream text-warmbrown uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Business</th>
                    <th className="px-4 py-3">Package</th>
                    <th className="px-4 py-3">Timeline</th>
                    <th className="px-4 py-3">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, i) => (
                    <tr key={i} className="border-t border-warmbrown-pale/40">
                      <td className="px-4 py-3">{order.firstName} {order.lastName}</td>
                      <td className="px-4 py-3">{order.email}</td>
                      <td className="px-4 py-3">{order.businessName}</td>
                      <td className="px-4 py-3">{order.package}</td>
                      <td className="px-4 py-3">{order.timeline}</td>
                      <td className="px-4 py-3 max-w-xs whitespace-pre-line">{order.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
