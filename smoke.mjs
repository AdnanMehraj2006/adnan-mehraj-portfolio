import { chromium } from 'playwright-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE =
  process.env.SMOKE_URL || 'http://localhost:5173/adnan-mehraj-portfolio/'

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

  // ---- Hero actions: exactly two, consistent, no resume ----
  const heroActions = await page.evaluate(() => {
    const actionBtns = Array.from(document.querySelectorAll('.hero__actions .btn'))
    const texts = actionBtns.map((b) => b.textContent.trim())
    const hasIcons = actionBtns.some((b) => b.querySelector('svg'))
    return { count: actionBtns.length, texts, hasIcons }
  })
  report('hero has exactly 2 actions', heroActions.count === 2, heroActions.texts.join(' | '))
  report('hero actions: no resume/cv', !heroActions.texts.some((t) => /cv|resume/i.test(t)))
  report(
    'hero actions consistent (both no arrow)',
    heroActions.count === 2 && !heroActions.hasIcons,
  )
  report('hero webgl label removed', !(await page.$('.hero__stage-label')))
  report(
    'legacy hero stage removed',
    (await page.$('.hero__stage, .hero__fallback')) === null,
  )

  const scene = await page.evaluate(() => {
    const el = document.querySelector('.hero__scene')
    return {
      present: !!el,
      canvas: !!(el && el.querySelector('canvas')),
      fallback: !!(el && el.querySelector('.hero__scene-fallback')),
    }
  })
  report('hero 3D core mounted (desktop)', scene.present && scene.canvas)
  report('hero 3D fallback present', scene.present && (scene.canvas || scene.fallback))

  // personal introduction
  const intro = await page.evaluate(() => ({
    eyebrow: document.querySelector('.hero__kicker')?.textContent.trim().toUpperCase() ?? '',
    name: document.querySelector('.hero__title')?.textContent.trim() ?? '',
    subtitle: document.querySelector('.hero__subtitle')?.textContent.trim() ?? '',
    desc: document.querySelector('.hero__desc')?.textContent.trim() ?? '',
  }))
  report('hero eyebrow is HELLO, I\'M', intro.eyebrow.includes('HELLO, I\'M'), intro.eyebrow)
  report('hero name heading present', intro.name === 'Adnan Mehraj', intro.name)
  report(
    'hero subtitle present',
    intro.subtitle === 'Computer Engineering Student & Developer',
    intro.subtitle,
  )
  report('hero description present', intro.desc.length > 0)

  // hero metadata removed
  const metaRemoved = await page.evaluate(
    () => document.querySelectorAll('.hero__meta-chip').length === 0,
  )
  report('hero metadata boxes removed', metaRemoved)


  // scroll indicator: horizontally centered on the hero content
  const scrollCheck = await page.evaluate(() => {
    const grid = document.querySelector('.hero__grid')
    const scrollEl = document.querySelector('.hero__scroll')
    if (!grid || !scrollEl) return null
    const g = grid.getBoundingClientRect()
    const s = scrollEl.getBoundingClientRect()
    return { delta: Math.abs(s.left + s.width / 2 - (g.left + g.width / 2)) }
  })
  report(
    'scroll indicator centered on hero content',
    !!scrollCheck && scrollCheck.delta <= 1,
    scrollCheck ? `offset ${scrollCheck.delta.toFixed(1)}px` : 'missing',
  )

  // contact section: email present once, mailto correct, other links intact
  const contactInfo = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('#contact .contact__link'))
    const email = links.find((a) => a.getAttribute('href') === 'mailto:adnanmehraj@kcet.edu.in')
    return {
      emailCount: links.filter((a) => a.textContent.includes('adnanmehraj@kcet.edu.in')).length,
      emailHref: email ? email.getAttribute('href') : null,
      emailTarget: email ? email.getAttribute('target') : null,
      emailRel: email ? email.getAttribute('rel') : null,
      externalCount: links.filter((a) => a.getAttribute('target') === '_blank').length,
      total: links.length,
      hasGithub: links.some((a) => a.getAttribute('href')?.includes('github.com/AdnanMehraj2006')),
      hasLinkedIn: links.some((a) => a.getAttribute('href')?.includes('linkedin.com')),
      hasLeetCode: links.some((a) => a.getAttribute('href')?.includes('leetcode.com')),
      hasGfg: links.some((a) => a.getAttribute('href')?.includes('geeksforgeeks.org')),
      hasX: links.some((a) => a.getAttribute('href')?.includes('x.com/AdnanMehraj2006')),
      hasInstagram: links.some((a) => a.getAttribute('href')?.includes('instagram.com/adn4nmehraj')),
      hasSnapchat: links.some((a) => a.getAttribute('href')?.includes('snapchat.com/add/adn4n.mehraj')),
      order: links.map((a) => a.getAttribute('href')),
    }
  })
  report('email appears exactly once', contactInfo.emailCount === 1)
  report('email uses correct mailto link', contactInfo.emailHref === 'mailto:adnanmehraj@kcet.edu.in')
  report('email does not open a new tab', contactInfo.emailTarget === null)
  report('existing external contact links intact (7)', contactInfo.externalCount === 7)
  report(
    'all existing profile links present',
    contactInfo.hasGithub &&
      contactInfo.hasLinkedIn &&
      contactInfo.hasLeetCode &&
      contactInfo.hasGfg &&
      contactInfo.hasX &&
      contactInfo.hasInstagram &&
      contactInfo.hasSnapchat,
  )
  report('contact cards total = 8 (email + 7 profiles)', contactInfo.total === 8)

  const EXPECTED_PROFILE_ORDER = [
    'mailto:adnanmehraj@kcet.edu.in',
    'https://github.com/AdnanMehraj2006',
    'https://leetcode.com/u/Adnan_Mehraj_2006/',
    'https://www.geeksforgeeks.org/profile/adnanmehraj2006',
    'https://www.linkedin.com/in/adnan-mehraj-611904344/',
    'https://x.com/AdnanMehraj2006',
    'https://www.instagram.com/adn4nmehraj',
    'https://snapchat.com/add/adn4n.mehraj',
  ]
  const orderMatches =
    contactInfo.order.length === EXPECTED_PROFILE_ORDER.length &&
    EXPECTED_PROFILE_ORDER.every((u, i) => contactInfo.order[i] === u)
  report('contact profile order matches spec', orderMatches)

  const contactSceneGone = await page.evaluate(
    () => !document.querySelector('.contact__scene, .contact__emblem-static'),
  )
  report('contact 3D scene removed', contactSceneGone)

  // hero buttons: dark bordered surfaces, primary green-accented
  const heroBtnStyle = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.hero__actions .btn'))
    const primary = document.querySelector('.hero__actions .btn.hero__action--primary')
    const cs = (el) => (el ? window.getComputedStyle(el) : null)
    const sPrimary = cs(primary)
    return {
      count: btns.length,
      bordered: btns.every((b) => parseFloat(window.getComputedStyle(b).borderTopWidth) > 0),
      primaryTinted: sPrimary
        ? /198,\s*255,\s*77/.test(sPrimary.backgroundColor + sPrimary.backgroundImage) ||
          sPrimary.color === 'rgb(198, 255, 77)'
        : false,
    }
  })
  report(
    'hero buttons: 2 bordered surfaces',
    heroBtnStyle.count === 2 && heroBtnStyle.bordered,
  )
  report('hero primary button green-accented', heroBtnStyle.primaryTinted)

  // ---- hackathon achievement on page ----
  const hackathon = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#achievements .ach__card'))
    const texts = cards.map((c) => c.textContent.trim())
    return {
      genericCash: texts.filter((t) => /Cash Prize/.test(t)).length,
      synertech: texts.filter((t) =>
        t.includes('Synertech 2026 Hackathon – 2nd Runner-Up'),
      ).length,
    }
  })
  report('generic "Cash Prize" card removed', hackathon.genericCash === 0)
  report('Synertech 2026 remains exactly once', hackathon.synertech === 1)

  const achievementsInfo = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#achievements .ach__card'))
    const texts = cards.map((c) => c.textContent.trim())
    const titles = [
      'Internship Common Aptitude Test (ICAT) – Certificate of Participation',
      'Synertech 2026 Hackathon – 2nd Runner-Up Certificate',
      'All India Career Summit – Certificate of Participation',
      'Java Programming in Hindi – Certificate of Completion',
      'Career Guidance Session – Certificate of Participation',
      'Synertech-2025 – Certificate of Participation',
      'Synertech-2025 – Certificate of Appreciation (Student Coordinator)',
      'Innovation, Design & Entrepreneurship (IDE) Bootcamp – Volunteer Certificate',
      'Cybersecurity – Certificate of Participation (Tech Mahindra Foundation)',
      'Fundamentals of Digital Marketing – Google Digital Unlocked Certificate',
    ]
    const verify = Array.from(document.querySelectorAll('#achievements .ach__verify'))
    return {
      count: cards.length,
      synertech: texts.filter((t) =>
        t.includes('Synertech 2026 Hackathon – 2nd Runner-Up'),
      ).length,
      allTenPresentOnce: titles.every((t) => texts.filter((x) => x.includes(t)).length === 1),
      verifies: verify.map((v) => ({
        href: v.getAttribute('href'),
        target: v.getAttribute('target'),
        rel: v.getAttribute('rel') || '',
        text: v.textContent.trim(),
      })),
    }
  })
  const EXPECTED_VERIFY = [
    'https://www.mygreatlearning.com/certificate/QYAKIMPD',
    'https://courses.skillindiadigital.gov.in/api/custom_api/view_certificate/bed492930106468bac8c724214744dc7',
  ]
  report('synertech achievement appears exactly once', achievementsInfo.synertech === 1)
  report('certificates: 10 cards total', achievementsInfo.count === 10)
  report('all 10 supplied certificates present exactly once', achievementsInfo.allTenPresentOnce)
  report(
    'verify buttons: exactly 2, safe',
    achievementsInfo.verifies.length === 2 &&
      achievementsInfo.verifies.every(
        (v) => v.target === '_blank' && v.rel.includes('noopener') && v.text === 'Verify Certificate',
      ),
  )
  report(
    'verify URLs are the supplied real URLs',
    achievementsInfo.verifies.length === 2 &&
      EXPECTED_VERIFY.every((u) =>
        achievementsInfo.verifies.some((v) => v.href === u),
      ),
  )

  const verifyStyle = await page.evaluate(() => {
    const btn = document.querySelector('#achievements .ach__verify')
    if (!btn) return null
    const s = window.getComputedStyle(btn)
    return {
      fs: parseFloat(s.fontSize),
      pt: parseFloat(s.paddingTop),
      ph: parseFloat(s.paddingLeft),
      radius: parseFloat(s.borderRadius),
    }
  })
  report(
    'verify button compact styling',
    !!verifyStyle &&
      verifyStyle.fs <= 13.5 &&
      verifyStyle.pt <= 9 &&
      verifyStyle.ph <= 16 &&
      verifyStyle.radius >= 8,
    verifyStyle ? JSON.stringify(verifyStyle) : 'missing',
  )

  // ---- other core features ----
  const sectionIds = ['home', 'about', 'skills', 'projects', 'problem-solving', 'achievements', 'journey', 'contact']
  let missing = []
  for (const id of sectionIds) {
    if (!(await page.$(`section#${id}`))) missing.push(id)
  }
  report('all sections present', missing.length === 0, missing.join(','))

  // section spacing tokens applied (About as representative)
  const spacing = await page.evaluate(() => {
    const heading = document.querySelector('section#about .section-heading')
    if (!heading) return null
    const get = (sel) => window.getComputedStyle(heading.querySelector(sel))
    const labelMb = parseFloat(get('.section-heading__label').marginBottom || '0')
    const descMt = parseFloat(get('.section-heading__desc').marginTop || '0')
    const headingMb = parseFloat(window.getComputedStyle(heading).marginBottom || '0')
    return { labelMb, descMt, headingMb }
  })
  report(
    'section spacing tokens applied',
    !!spacing && spacing.labelMb >= 16 && spacing.descMt >= 12 && spacing.headingMb >= 32,
    spacing ? JSON.stringify(spacing) : 'missing',
  )

  // removed UI elements are gone; remaining links/cards intact
  const removals = await page.evaluate(() => {
    const moreBtn = document.querySelector('.projects__more .btn')
    return {
      projectsArrow: moreBtn ? Array.from(moreBtn.querySelectorAll('svg')).length > 0 : true,
      projectMoreText: moreBtn ? moreBtn.textContent.trim() : '',
      psNote: !!document.querySelector('.ps__note'),
      achFoot: !!document.querySelector('.ach__foot'),
      psCards: document.querySelectorAll('.ps__card').length,
      psCardKey: Array.from(document.querySelectorAll('.ps__card')).map((c) =>
        c.querySelector('.ps__platform')?.textContent.trim().toLowerCase(),
      ),
    }
  })
  report('projects "View All" arrow removed', !removals.projectsArrow)
  report(
    'projects "View All" link preserved',
    removals.projectMoreText.includes('View All Projects on GitHub'),
    removals.projectMoreText,
  )
  report('problem-solving note removed', !removals.psNote)
  report(
    'problem-solving: 3 cards present',
    removals.psCards === 3,
    removals.psCardKey.join(','),
  )
  report('achievements footer box removed', !removals.achFoot)

  // live demo buttons (CardShield pattern reused)
  const demos = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('.project-card__action--demo'))
    return {
      hrefs: anchors.map((a) => a.getAttribute('href')),
      counts: anchors.every(
        (a) =>
          a.getAttribute('target') === '_blank' &&
          (a.getAttribute('rel') || '').includes('noopener'),
      ),
      count: anchors.length,
      sources: document.querySelectorAll(
        '.project-card__action:not(.project-card__action--demo):not(.project-card__action--release)',
      ).length,
    }
  })
  const EXPECTED_DEMOS = [
    'https://adnanmehraj2006.github.io/CardShield/',
    'http://1clickos.blogspot.com/',
    'https://adnanmehraj2006.github.io/StreamVerse/',
    'https://adnanmehraj2006.github.io/LawMitra-Ai/',
  ]
  report('demo buttons: exactly 4', demos.count === 4)
  report(
    'demo URLs match provided list',
    demos.hrefs.length === EXPECTED_DEMOS.length &&
      EXPECTED_DEMOS.every((u) => demos.hrefs.includes(u)),
    demos.hrefs.join(' | '),
  )
  report('demo links open safely (new tab + rel)', demos.counts)
  report('source buttons preserved for all 6 projects', demos.sources === 6)

  // ClipMind v1.0.0 release
  const release = await page.evaluate(() => {
    const anchor = document.querySelector('.project-card__action--release')
    const badge = document.querySelector('.project-card__release-badge')
    return {
      count: document.querySelectorAll('.project-card__action--release').length,
      href: anchor ? anchor.getAttribute('href') : null,
      target: anchor ? anchor.getAttribute('target') : null,
      rel: anchor ? anchor.getAttribute('rel') || '' : '',
      text: anchor ? anchor.textContent.trim() : '',
      badgeText: badge ? badge.textContent.trim() : '',
      badgeCount: document.querySelectorAll('.project-card__release-badge').length,
    }
  })
  const RELEASE_URL = 'https://github.com/AdnanMehraj2006/ClipMind/releases/tag/v1.0.0'
  report('clipmind release button: exactly 1', release.count === 1)
  report('clipmind release URL matches', release.href === RELEASE_URL, release.href ?? 'missing')
  report(
    'clipmind release opens safely (new tab + rel)',
    release.target === '_blank' && release.rel.includes('noopener'),
  )
  report('clipmind release label correct', release.text === 'Download v1.0.0')
  report(
    'clipmind RELEASED badge present',
    release.badgeCount === 1 &&
      release.badgeText.includes('RELEASED') &&
      release.badgeText.includes('v1.0.0'),
  )

  const clipmindSource = await page.evaluate(() => {
    const card = Array.from(document.querySelectorAll('.project-card')).find((c) =>
      c.textContent.includes('ClipMind'),
    )
    const src = card
      ? Array.from(card.querySelectorAll('.project-card__action')).find((a) =>
          a.textContent.trim().toLowerCase().includes('source'),
        )
      : null
    return { hasCard: !!card, srcHref: src ? src.getAttribute('href') : null }
  })
  report(
    'clipmind source button preserved',
    clipmindSource.hasCard &&
      clipmindSource.srcHref === 'https://github.com/AdnanMehraj2006/ClipMind',
  )

  // navbar resume styled as an interactive button
  const resumeBtn = await page.evaluate(() => {
    const el = document.querySelector('.navbar__actions .btn.navbar__resume')
    if (!el) return null
    const s = window.getComputedStyle(el)
    return {
      border: parseFloat(s.borderTopWidth),
      radius: parseFloat(s.borderRadius),
      bg: s.backgroundColor,
      label: el.getAttribute('aria-label'),
      text: el.textContent.trim(),
    }
  })
  report(
    'navbar resume styled as button',
    !!resumeBtn &&
      resumeBtn.border > 0 &&
      resumeBtn.radius > 8 &&
      resumeBtn.bg !== 'rgba(0, 0, 0, 0)' &&
      resumeBtn.label === 'Resume / CV' &&
      resumeBtn.text === 'Resume / CV',
  )

  const cvBtn = await page.$('.navbar__resume')
  if (cvBtn) {
    const urlBefore = page.url()
    const newPagePromise = page.context().waitForEvent('page', { timeout: 1200 }).catch(() => null)
    await cvBtn.click()
    await page.waitForTimeout(400)
    const newPage = await newPagePromise
    report('navbar CV button silent no-op', page.url() === urlBefore && !newPage)
  } else {
    report('navbar CV button present', false)
  }

  await page.click('a[href="#about"]')
  await page.waitForTimeout(600)
  report('nav link navigates to #about', (await page.evaluate(() => location.hash)) === '#about')

  // ---- active navbar highlighting ----
  const activeLink = () =>
    page.evaluate(() => {
      const a = document.querySelector('.navbar__link.is-active')
      return a ? a.getAttribute('href') : null
    })

  await page.click('a[href="#projects"]')
  await page.waitForTimeout(900)
  const activeProjects = await activeLink()
  report('Projects item active after nav click', activeProjects === '#projects', activeProjects ?? 'none')

  await page.click('a[href="#achievements"]')
  await page.waitForTimeout(900)
  const activeAchievements = await activeLink()
  report(
    'Achievements item active after nav click',
    activeAchievements === '#achievements',
    activeAchievements ?? 'none',
  )

  // ---- refresh / direct-link restoration ----
  await page.click('a[href="#contact"]')
  await page.waitForTimeout(900)
  await page.reload({ waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(900)
  const restored = await page.evaluate(() => {
    const a = document.querySelector('.navbar__link.is-active')
    const contact = document.getElementById('contact')
    const r = contact ? contact.getBoundingClientRect() : null
    return {
      href: a ? a.getAttribute('href') : null,
      scrollY: window.scrollY,
      contactTop: r ? r.top : null,
    }
  })
  report(
    'refresh at #contact restores Contact active',
    restored.href === '#contact' && restored.contactTop !== null && restored.contactTop < 800,
    JSON.stringify(restored),
  )

  // direct-link restoration is exercised as a real reload of the target URL
  // on the existing (warm) page, which is a cold document load and avoids
  // spawning extra heavy WebGL contexts on this low-end machine.
  const directLoad = async (target) => {
    try {
      await page.goto(`${BASE}#${target}`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      })
      await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 })
      await page.waitForTimeout(1600)
      return page.evaluate((id) => {
        const a = document.querySelector('.navbar__link.is-active')
        const sec = document.getElementById(id)
        const r = sec ? sec.getBoundingClientRect() : null
        return { href: a ? a.getAttribute('href') : null, top: r ? r.top : null }
      }, target)
    } catch (err) {
      return { error: err.message }
    }
  }

  const directProjects = await directLoad('projects')
  report(
    'direct #projects cold-load restores Projects active',
    !!directProjects &&
      directProjects.href === '#projects' &&
      directProjects.top !== null &&
      directProjects.top < 800,
    JSON.stringify(directProjects),
  )

  const directAchievements = await directLoad('achievements')
  report(
    'direct #achievements cold-load restores Achievements active',
    !!directAchievements &&
      directAchievements.href === '#achievements' &&
      directAchievements.top !== null &&
      directAchievements.top < 800,
    JSON.stringify(directAchievements),
  )

  await page.click('.project-card__toggle')
  await page.waitForTimeout(300)
  report('project highlights expand', !!(await page.$('.project-card__highlights')))

  await page.click('.skill-chip')
  await page.waitForTimeout(400)
  report('skill chip selects', !!(await page.$('.skill-chip.is-active')))

  await page.keyboard.type('am.dev')
  await page.waitForTimeout(500)
  report('easter egg reveals', !!(await page.$('.egg')))

  // ---- responsive sweep ----
  const widths = [1440, 1280, 1024, 768, 430, 390, 360, 320]
  for (const w of widths) {
    await page.setViewportSize({ width: w, height: 900 })
    await page.waitForTimeout(500)
    const check = await page.evaluate(() => {
      const overflowGlobal = document.documentElement.scrollWidth > window.innerWidth + 1
      const container = document.querySelector('.hero__actions')
      const buttons = Array.from(
        container ? container.querySelectorAll('.btn') : [],
      ).map((el) => {
        const r = el.getBoundingClientRect()
        return { left: r.left, right: r.right, top: r.top }
      })
      const containerOverflow = container ? container.scrollWidth > container.clientWidth + 1 : false
      const clipped = buttons.some((b) => b.right > window.innerWidth + 1 || b.left < -1)
      const sameLine = buttons.length === 2 && Math.abs(buttons[1].top - buttons[0].top) < 2
      const heroGrid = document.querySelector('.hero__grid')
      const scrollEl = document.querySelector('.hero__scroll')
      let scrollDelta = Infinity
      if (heroGrid && scrollEl) {
        const g = heroGrid.getBoundingClientRect()
        const s = scrollEl.getBoundingClientRect()
        scrollDelta = Math.abs(s.left + s.width / 2 - (g.left + g.width / 2))
      }
      return {
        overflowGlobal,
        metaGone: document.querySelectorAll('.hero__meta-chip').length === 0,
        buttons: buttons.length,
        containerOverflow,
        clipped,
        sameLine,
        scrollDelta,
      }
    })
    report(`width ${w}: no horizontal overflow`, !check.overflowGlobal)
    report(`width ${w}: hero metadata absent`, check.metaGone)
    report(
      `width ${w}: hero actions present & unclipped`,
      check.buttons === 2 && !check.containerOverflow && !check.clipped,
      check.sameLine ? 'single line' : 'wrapped',
    )
    report(
      `width ${w}: scroll centered`,
      check.scrollDelta <= 1,
      `offset ${check.scrollDelta.toFixed(1)}px`,
    )
  }

  // mobile menu
  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForTimeout(400)
  if (await page.$('.egg')) {
    await page.click('.egg__close')
    await page.waitForTimeout(300)
  }
  await page.click('.navbar__toggle')
  await page.waitForTimeout(300)
  report('mobile menu opens', !!(await page.$('#mobile-menu')))
  await page.click('.navbar__moblink')
  await page.waitForTimeout(500)
  report('mobile menu closes on link tap', !(await page.$('#mobile-menu')))
} catch (err) {
  report('script execution', false, err.message)
}

console.log(results.join('\n'))
console.log(errors.length ? `\nCAPTURED ERRORS (${errors.length}):\n` + errors.join('\n') : '\nNo console/page errors captured.')

await browser.close()
