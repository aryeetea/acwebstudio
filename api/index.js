import express from 'express'
import cors from 'cors'
import puppeteer from 'puppeteer'


const app = express()
app.use(cors())
app.use(express.json())

// Helper: Guess tech stack from HTML
function guessTech(html) {
  const tech = []
  if (/react/i.test(html)) tech.push('React')
  if (/next/i.test(html)) tech.push('Next.js')
  if (/vue/i.test(html)) tech.push('Vue.js')
  if (/wordpress|wp-content/i.test(html)) tech.push('WordPress')
  if (/shopify/i.test(html)) tech.push('Shopify')
  if (/bootstrap/i.test(html)) tech.push('Bootstrap')
  if (/tailwind/i.test(html)) tech.push('Tailwind CSS')
  if (/squarespace/i.test(html)) tech.push('Squarespace')
  if (/wix/i.test(html)) tech.push('Wix')
  if (/angular/i.test(html)) tech.push('Angular')
  if (/jquery/i.test(html)) tech.push('jQuery')
  if (/vite/i.test(html)) tech.push('Vite')
  if (/gatsby/i.test(html)) tech.push('Gatsby')
  if (/svelte/i.test(html)) tech.push('Svelte')
  return tech.length ? tech : ['Custom/Other']
}

// Helper: Suggest package type
function suggestPackageType(html) {
  const pageCount = (html.match(/<a [^>]*href=["'][^"']+\.html["']/gi) || []).length
  if (pageCount <= 1) return 'Starter'
  if (pageCount <= 5) return 'Professional'
  return 'Signature'
}

// Helper: Generate summary
function generateSummary(meta, tech, pkg) {
  return `This project is built with ${tech.join(', ')}. It fits the "${pkg}" package. ${meta?.description ? meta.description : ''}`.trim()
}

// API: Analyze project by URL
app.post('/analyze', async (req, res) => {
  const { url } = req.body
  if (!url) return res.status(400).json({ error: 'Missing url' })
  let browser
  try {
    browser = await puppeteer.launch({ args: ['--no-sandbox'] })
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
    const html = await page.content()
    const meta = await extract(url, html)
    const tech = guessTech(html)
    const packageType = suggestPackageType(html)
    const summary = generateSummary(meta, tech, packageType)
    // Take screenshots (main and 2 scroll positions)
    const screenshots = []
    screenshots.push(await page.screenshot({ encoding: 'base64', fullPage: false }))
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
    screenshots.push(await page.screenshot({ encoding: 'base64', fullPage: false }))
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    screenshots.push(await page.screenshot({ encoding: 'base64', fullPage: false }))
    await browser.close()
    res.json({
      title: meta?.title || url,
      url,
      description: meta?.description || '',
      technologies: tech,
      packageType,
      summary,
      screenshots
    })
  } catch (e) {
    if (browser) await browser.close()
    res.status(500).json({ error: e.message })
  }
})

const PORT = process.env.PORT || 5050
app.listen(PORT, () => console.log(`API running on port ${PORT}`))
