import { chromium } from 'playwright-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = 'http://localhost:5173/'

const errors = []
const results = []

function report(name, ok, extra = '') {
  results.push(`${ok ? 'PASS' : 'FAIL'} — ${name}${extra ? ' | ' + extra : ''}`)
}

const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
})

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`console: ${msg.text()}`)
})
page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))

try {
  const resp = await page.goto(BASE, { waitUntil: 'networkidle', timeout: 45000 })
  report('page loads 200', !!resp && resp.status() === 200)

  await page.waitForSelector('#root .navbar', { timeout: 15000 })
  await page.waitForTimeout(1500)

  const title = await page.title()
  report('document title', title.includes('Adnan Mehraj'), title)

  const sectionIds = ['home', 'about', 'skills', 'projects', 'problem-solving', 'achievements', 'journey', 'contact']
  let missing = []
  for (const id of sectionIds) {
    const present = await page.$(`section#${id}`)
    if (!present) missing.push(id)
  }
  report('all sections present', missing.length === 0, missing.join(','))

  const canvasOrFallback = await page.evaluate(() => {
    const stage = document.querySelector('.hero__stage')
    return !!(stage && (stage.querySelector('canvas') || stage.querySelector('.hero__fallback')))
  })
  report('hero 3D canvas or fallback', canvasOrFallback)

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  )
  report('no horizontal overflow', !overflow)

  // CV button: silent no-op
  let afterUrl = ''
  let moved = false
  page.on('framenavigated', () => { moved = true })
  const cvBtn = await page.$('.navbar__resume')
  if (cvBtn) {
    await cvBtn.click()
    await page.waitForTimeout(500)
    afterUrl = page.url()
    const hash = await page.evaluate(() => location.hash)
    report('CV button silent no-op (url unchanged)', !moved && afterUrl === BASE && hash === '')
  } else {
    report('CV button present', false)
  }

  // navbar link smooth scrolls to section
  await page.click('a[href="#about"]')
  await page.waitForTimeout(800)
  const aboutHash = await page.evaluate(() => location.hash)
  report('nav link navigates to #about', aboutHash === '#about', aboutHash)

  // projects highlight toggle
  await page.click('.project-card__toggle')
  await page.waitForTimeout(300)
  const highlightsVisible = await page.$('.project-card__highlights')
  report('project highlights expand', !!highlightsVisible)

  // skills select -> focus chip
  await page.click('.skill-chip')
  await page.waitForTimeout(400)
  const focusedChip = await page.$('.skill-chip.is-active')
  report('skill chip selects', !!focusedChip)

  // easter egg
  await page.keyboard.type('am.dev')
  await page.waitForTimeout(500)
  const eggVisible = await page.$('.egg')
  report('easter egg reveals on "am.dev"', !!eggVisible)
  if (eggVisible) {
    await page.click('.egg__close')
    await page.waitForTimeout(300)
    const eggGone = !(await page.$('.egg'))
    report('easter egg dismisses', eggGone)
  }

  // mobile viewport: no overflow, menu works
  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForTimeout(400)
  const mobileOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  )
  report('mobile: no horizontal overflow', !mobileOverflow)
  await page.click('.navbar__toggle')
  await page.waitForTimeout(300)
  const mobileMenu = await page.$('#mobile-menu')
  report('mobile menu opens', !!mobileMenu)
  await page.click('.navbar__moblink')
  await page.waitForTimeout(600)
  const mobileMenuClosed = !(await page.$('#mobile-menu'))
  report('mobile menu closes on link tap', mobileMenuClosed)
} catch (err) {
  report('script execution', false, err.message)
}

console.log(results.join('\n'))
console.log(errors.length ? `\nCAPTURED ERRORS (${errors.length}):\n` + errors.join('\n') : '\nNo console/page errors captured.')

await browser.close()
