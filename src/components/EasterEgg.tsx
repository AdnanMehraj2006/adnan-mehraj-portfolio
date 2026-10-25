import { useEffect, useRef, useState } from 'react'
import { X, Terminal } from 'lucide-react'
import './EasterEgg.css'

const TRIGGER = 'am.dev'

export function EasterEgg() {
  const [open, setOpen] = useState(false)
  const buffer = useRef('')

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const tag = target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) {
        return
      }
      if (event.key.length !== 1) return

      buffer.current = (buffer.current + event.key.toLowerCase()).slice(-TRIGGER.length)
      if (buffer.current === TRIGGER) {
        setOpen(true)
        buffer.current = ''
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (open && event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (!open) return null

  return (
    <div className="egg" role="dialog" aria-modal="true" aria-label="Hidden terminal message">
      <div className="egg__panel">
        <div className="egg__bar">
          <Terminal size={16} />
          <span className="egg__title mono">hidden.log</span>
          <button
            type="button"
            className="egg__close"
            aria-label="Close"
            onClick={() => setOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        <div className="egg__body">
          <div className="egg__line">
            <span className="egg__prompt mono">$</span>
            <span className="egg__cmd mono">echo curiosity</span>
          </div>
          <p className="egg__msg mono">
            &gt; nice find. everything on this page was built the same way:
            <br />
            understand · build · test · improve.
          </p>
          <div className="egg__line">
            <span className="egg__prompt mono">$</span>
            <span className="egg__cursor" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  )
}
