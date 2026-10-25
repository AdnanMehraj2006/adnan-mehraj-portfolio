import type { ProjectPreviewKind } from '../data/projects'
import './ProjectPreviews.css'

/**
 * Stylized concept illustrations for each project. These are design
 * mockups, not screenshots of the real applications.
 */

function ClipboardMock() {
  return (
    <div className="pv pv--clipboard">
      <div className="pv-window">
        <div className="pv-bar">
          <span className="pv-dots">
            <i /><i /><i />
          </span>
          <span className="pv-bar-title">ClipMind</span>
        </div>
        <div className="pv-body">
          <div className="pv-search">
            <span className="pv-search-icon" />
            <span className="pv-search-line" />
          </div>
          <div className="pv-list">
            <div className="pv-item">
              <span className="pv-item-type">TXT</span>
              <span className="pv-item-line w70" />
              <span className="pv-star" />
            </div>
            <div className="pv-item">
              <span className="pv-item-type">LINK</span>
              <span className="pv-item-line w50" />
              <span className="pv-star pv-star-on" />
            </div>
            <div className="pv-item">
              <span className="pv-item-type">CODE</span>
              <span className="pv-item-line w80" />
              <span className="pv-star" />
            </div>
            <div className="pv-item">
              <span className="pv-item-type">TXT</span>
              <span className="pv-item-line w60" />
              <span className="pv-star" />
            </div>
          </div>
          <div className="pv-panel">
            <span className="pv-panel-title">Collections</span>
            <span className="pv-panel-row w90" />
            <span className="pv-panel-row w70" />
          </div>
        </div>
      </div>
    </div>
  )
}

function LegalMock() {
  return (
    <div className="pv pv--legal">
      <div className="pv-legal-grid">
        <div className="pv-legal-side">
          <span className="pv-legal-title">Common issues</span>
          <span className="pv-legal-opt">Consumer / refund</span>
          <span className="pv-legal-opt">Cyber fraud</span>
          <span className="pv-legal-opt pv-on">Rental / notice</span>
          <span className="pv-legal-opt">Employment</span>
        </div>
        <div className="pv-legal-main">
          <span className="pv-legal-title">Guidance</span>
          <span className="pv-legal-card">
            <span className="pv-legal-step">1 · Next steps</span>
            <span className="pv-legal-line w80" />
            <span className="pv-legal-line w60" />
          </span>
          <span className="pv-legal-card">
            <span className="pv-legal-step">2 · Evidence checklist</span>
            <span className="pv-legal-line w70" />
            <span className="pv-legal-line w50" />
          </span>
          <span className="pv-legal-card">
            <span className="pv-legal-step">3 · Draft complaint</span>
            <span className="pv-legal-line w85" />
          </span>
        </div>
      </div>
    </div>
  )
}

function PlayerMock() {
  return (
    <div className="pv pv--player">
      <div className="pv-player">
        <div className="pv-player-screen">
          <span className="pv-play" />
        </div>
        <div className="pv-player-controls">
          <span className="pv-fmt">MP4</span>
          <span className="pv-fmt pv-on">HLS</span>
          <span className="pv-fmt">DASH</span>
          <span className="pv-fmt">WEBM</span>
        </div>
      </div>
    </div>
  )
}

function CardMock() {
  return (
    <div className="pv pv--card">
      <div className="pv-card-front">
        <span className="pv-card-chip" />
        <span className="pv-card-number">•••• •••• •••• 4012</span>
        <span className="pv-card-meta">
          <span className="pv-card-name">A. MEHRAJ</span>
          <span className="pv-card-exp">08/29</span>
        </span>
      </div>
      <div className="pv-card-result">
        <span className="pv-result-pass">✓ Luhn valid</span>
        <span className="pv-result-tag">VISA</span>
        <span className="pv-result-line">structural check only</span>
      </div>
    </div>
  )
}

function OsMock() {
  return (
    <div className="pv pv--os">
      <div className="pv-os-list">
        <div className="pv-os-row">
          <span className="pv-os-badge">7</span>
          <span className="pv-os-name">Windows 7</span>
          <span className="pv-os-btn" />
        </div>
        <div className="pv-os-row">
          <span className="pv-os-badge">10</span>
          <span className="pv-os-name">Windows 10</span>
          <span className="pv-os-btn" />
        </div>
        <div className="pv-os-row pv-on">
          <span className="pv-os-badge">11</span>
          <span className="pv-os-name">Windows 11</span>
          <span className="pv-os-btn" />
        </div>
        <div className="pv-os-search">
          <span className="pv-search-icon" />
          <span className="pv-search-line" />
        </div>
      </div>
    </div>
  )
}

function DsaMock() {
  return (
    <div className="pv pv--dsa">
      <div className="pv-editor">
        <div className="pv-editor-bar">
          <span className="pv-editor-file">Solution.java</span>
        </div>
        <div className="pv-code">
          <span className="pv-code-line"><i className="pv-c1">class</i> Solution {`{`}</span>
          <span className="pv-code-line">  <i className="pv-c2">int</i> solve(</span>
          <span className="pv-code-line">    <i className="pv-c3">int[]</i> nums, <i className="pv-c3">int</i> k) {`{`}</span>
          <span className="pv-code-line">    <i className="pv-c2">for</i> (int i = 0; i &lt; n; i++)</span>
          <span className="pv-code-line">      <i className="pv-c1">if</i> (nums[i] &gt; k) return i;</span>
          <span className="pv-code-line">  {`}`}</span>
          <span className="pv-code-line">{`}`}</span>
        </div>
      </div>
      <div className="pv-stats">
        <span className="pv-stat"><b>easy</b><i className="pv-bar1" /></span>
        <span className="pv-stat"><b>medium</b><i className="pv-bar2" /></span>
        <span className="pv-stat"><b>hard</b><i className="pv-bar3" /></span>
      </div>
    </div>
  )
}

export function ProjectPreview({ kind }: { kind: ProjectPreviewKind }) {
  switch (kind) {
    case 'clipboard':
      return <ClipboardMock />
    case 'legal':
      return <LegalMock />
    case 'player':
      return <PlayerMock />
    case 'card':
      return <CardMock />
    case 'os':
      return <OsMock />
    case 'dsa':
      return <DsaMock />
  }
}
