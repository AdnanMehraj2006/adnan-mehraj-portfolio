import { siteConfig } from '../config/site'

/**
 * Validate that a value is a nonempty, legitimate HTTPS URL.
 * Used only to guard the resume download (never to make remote requests
 * with that content).
 */
export function isValidHttpsUrl(value: string): boolean {
  if (!value) return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  // Release the object URL after the browser has had a chance to use it.
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
}

/**
 * Attempt to download the resume as a file.
 *
 * Strategy:
 *  1. Try to fetch the URL as a blob (works for same-origin endpoints and
 *     any origin that allows CORS). The blob is then saved locally with
 *     the `download` attribute, guaranteeing a true download.
 *  2. If the cross-origin fetch is blocked, fall back to opening the
 *     configured direct-download URL in a new tab.
 *
 * NOTE: `download` attributes do not force downloads across every external
 * origin, and Google Drive share URLs usually open a preview page instead
 * of downloading. For that reason the configured value must be a true
 * direct-download URL (e.g. ending in `?export=download` for Drive) or a
 * same-origin download endpoint.
 *
 * The resume button calls this ONLY when a URL is configured. While
 * `resumeDownloadUrl` is empty, the caller performs a silent no-op and
 * this helper is never reached.
 */
export async function downloadResume(): Promise<void> {
  const url = siteConfig.resumeDownloadUrl
  if (!isValidHttpsUrl(url)) return

  const filename = `adnan-mehraj-cv`
  try {
    const response = await fetch(url, {
      mode: 'cors',
      credentials: 'omit',
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const blob = await response.blob()
    triggerBlobDownload(blob, filename)
  } catch {
    // Cross-origin fetch not permitted — open the direct URL directly.
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
