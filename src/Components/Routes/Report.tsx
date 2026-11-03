/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================================
//  HPV Research Lab - PDF report
//  Same look as the website: light surfaces, deep-green brand,
//  Inter-style type (Helvetica), soft cards, rounded pills.
// ============================================================

import { jsPDF } from 'jspdf'
import { jwtDecode } from 'jwt-decode'

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────

export interface ImageResult {
  image: string
  result: string
  stage: string
  risk: string
  hpv: string
  confidence?: number
  total_cells?: number
  infected_cells?: number
  infection_rate?: number
  error?: string
}

export interface ChartDiv {
  element: HTMLElement
  title: string
}

export type AccountRole = 'lab_engineer' | 'patient' | 'admin'

export interface PDFReportProps {
  logo_url: string
  accountRole?: AccountRole
  patient_name?: string
  patient_id?: string
  age?: number
  gender?: string
  overall_infection_rate: number
  total_cells: number
  total_infected_cells: number
  image_results: ImageResult[]
  S_1_Cal: number
  S_2_Cal: number
  I_Cal: number
  R_Cal: number
  C_Cal: number
  R0_Cal: number
  PatientDetails?: {
    Name?: string
    ID?: string
    Age?: number | string
    Gender?: string
    BloodGroup?: string
    ContactNumber?: string
    SampleDate?: string
    ReportDate?: string
    ReferredBy?: string
  }
  LabEngineerName?: string
  chartDivs?: ChartDiv[]
}

// ─────────────────────────────────────────────
//  DESIGN TOKENS  (mirror src/index.css, light theme)
// ─────────────────────────────────────────────

type RGB = [number, number, number]

const C = {
  white: [255, 255, 255] as RGB,
  surface2: [239, 245, 242] as RGB,
  ink: [14, 31, 25] as RGB,
  ink2: [58, 74, 68] as RGB,
  muted: [105, 122, 115] as RGB,
  line: [225, 234, 230] as RGB,

  brand: [11, 110, 79] as RGB,
  brandSoft: [228, 243, 236] as RGB,
  brandEdge: [190, 224, 208] as RGB,
  brandDeep: [6, 56, 42] as RGB,

  danger: [217, 45, 58] as RGB,
  dangerSoft: [253, 236, 238] as RGB,
  warn: [183, 121, 31] as RGB,
  warnSoft: [253, 243, 220] as RGB,
  info: [37, 99, 235] as RGB,
  infoSoft: [232, 239, 253] as RGB,
  violet: [109, 79, 214] as RGB,
  violetSoft: [239, 234, 252] as RGB,

  // chart series (same colours as the website graph)
  s1: [59, 130, 246] as RGB,
  s2: [16, 185, 129] as RGB,
  inf: [239, 68, 68] as RGB,
  rec: [139, 92, 246] as RGB,
  can: [100, 116, 139] as RGB,
}

// A4 page, millimetres
const PW = 210
const PH = 297
const M = 16
const CW = PW - M * 2
const TOP = 28
const BOTTOM = PH - 20

// ─────────────────────────────────────────────
//  SMALL DRAWING HELPERS
// ─────────────────────────────────────────────

const fillC = (p: jsPDF, c: RGB) => p.setFillColor(c[0], c[1], c[2])
const drawC = (p: jsPDF, c: RGB) => p.setDrawColor(c[0], c[1], c[2])
const textC = (p: jsPDF, c: RGB) => p.setTextColor(c[0], c[1], c[2])

const font = (p: jsPDF, size: number, weight: 'normal' | 'bold' = 'normal', c: RGB = C.ink) => {
  p.setFont('helvetica', weight)
  p.setFontSize(size)
  textC(p, c)
}

function box(p: jsPDF, x: number, y: number, w: number, h: number, fill: RGB, edge?: RGB, r = 3) {
  fillC(p, fill)
  if (edge) {
    drawC(p, edge)
    p.setLineWidth(0.25)
    p.roundedRect(x, y, w, h, r, r, 'FD')
  } else {
    p.roundedRect(x, y, w, h, r, r, 'F')
  }
}

function hairline(p: jsPDF, x1: number, y: number, x2: number, c: RGB = C.line) {
  drawC(p, c)
  p.setLineWidth(0.2)
  p.line(x1, y, x2, y)
}

function trunc(p: jsPDF, text: string, maxW: number): string {
  if (p.getTextWidth(text) <= maxW) return text
  let t = text
  while (t.length > 1 && p.getTextWidth(t + '...') > maxW) t = t.slice(0, -1)
  return t + '...'
}

/** Rounded status chip. Returns its width. */
function pill(p: jsPDF, x: number, y: number, label: string, fg: RGB, bg: RGB, size = 7): number {
  font(p, size, 'bold', fg)
  const w = p.getTextWidth(label) + 6
  fillC(p, bg)
  p.roundedRect(x, y, w, 5.4, 2.7, 2.7, 'F')
  p.text(label, x + 3, y + 3.8)
  return w
}

const num = (n: unknown, digits: number) =>
  typeof n === 'number' && Number.isFinite(n) ? n.toFixed(digits) : '-'

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

function riskTone(risk: string): { fg: RGB; bg: RGB } {
  const r = (risk || '').toLowerCase()
  if (r.includes('high') || r.includes('critical') || r.includes('severe')) return { fg: C.danger, bg: C.dangerSoft }
  if (r.includes('med') || r.includes('moderate')) return { fg: C.warn, bg: C.warnSoft }
  if (r.includes('low')) return { fg: C.brand, bg: C.brandSoft }
  return { fg: C.muted, bg: C.surface2 }
}

const riskBucket = (risk: string): 'Low' | 'Medium' | 'High' | 'Other' => {
  const r = (risk || '').toLowerCase()
  if (r.includes('high') || r.includes('critical') || r.includes('severe')) return 'High'
  if (r.includes('med') || r.includes('moderate')) return 'Medium'
  if (r.includes('low')) return 'Low'
  return 'Other'
}

const hpvBucket = (hpv: string): 'Detected' | 'Not detected' | 'Unknown' => {
  const h = (hpv || '').toLowerCase()
  if (/not|neg|no /.test(h)) return 'Not detected'
  if (/detect|pos/.test(h)) return 'Detected'
  return 'Unknown'
}

// ─────────────────────────────────────────────
//  PAGE FURNITURE
// ─────────────────────────────────────────────

/** Brand mark: rounded green square with a double helix, like the site's logo tile. */
function brandMark(p: jsPDF, x: number, y: number, s: number) {
  fillC(p, C.brand)
  p.roundedRect(x, y, s, s, s * 0.28, s * 0.28, 'F')
  drawC(p, C.white)
  p.setLineWidth(0.45)
  const cx = x + s / 2
  const pts = (sign: number) =>
    Array.from({ length: 13 }, (_, i) => {
      const t = i / 12
      return [cx + sign * s * 0.2 * Math.sin(t * Math.PI * 2.4), y + s * 0.18 + s * 0.64 * t] as [number, number]
    })
  ;[1, -1].forEach((sign) => {
    const a = pts(sign)
    for (let i = 0; i < a.length - 1; i++) p.line(a[i][0], a[i][1], a[i + 1][0], a[i + 1][1])
  })
  p.setLineWidth(0.3)
  ;[0.3, 0.5, 0.7].forEach((t) => {
    const dx = s * 0.2 * Math.sin(t * Math.PI * 2.4)
    const yy = y + s * 0.18 + s * 0.64 * t
    p.line(cx - Math.abs(dx), yy, cx + Math.abs(dx), yy)
  })
}

function pageHeader(p: jsPDF, first: boolean, typeLabel: string) {
  brandMark(p, M, 9, 9)
  font(p, 12, 'bold', C.ink)
  p.text('HPV', M + 12, 15.4)
  const hpvW = p.getTextWidth('HPV ')
  font(p, 12, 'bold', C.brand)
  p.text('Research Lab', M + 12 + hpvW, 15.4)

  if (first) {
    font(p, 7, 'bold', C.brand)
    const w = p.getTextWidth(typeLabel) + 8
    fillC(p, C.brandSoft)
    p.roundedRect(PW - M - w, 10.6, w, 6.2, 3.1, 3.1, 'F')
    p.text(typeLabel, PW - M - w / 2, 14.8, { align: 'center' })
  } else {
    font(p, 8, 'normal', C.muted)
    p.text('HPV Analysis Report', PW - M, 15, { align: 'right' })
  }
  hairline(p, M, 22, PW - M)
}

function pageFooter(p: jsPDF, page: number, total: number) {
  hairline(p, M, PH - 14, PW - M)
  font(p, 7.5, 'normal', C.muted)
  p.text('HPV Research Lab  -  Confidential', M, PH - 9)
  p.text('Research use only. Not a medical diagnosis.', PW / 2, PH - 9, { align: 'center' })
  font(p, 7.5, 'bold', C.ink2)
  p.text(`Page ${page} of ${total}`, PW - M, PH - 9, { align: 'right' })
}

type Doc = { p: jsPDF; y: number; typeLabel: string }

function ensure(d: Doc, need: number) {
  if (d.y + need > BOTTOM) {
    d.p.addPage()
    pageHeader(d.p, false, d.typeLabel)
    d.y = TOP
  }
}

/** Section heading: green accent bar, bold title, optional muted line below. */
function section(d: Doc, title: string, desc?: string) {
  ensure(d, desc ? 22 : 16)
  const { p } = d
  fillC(p, C.brand)
  p.roundedRect(M, d.y - 3.6, 1.4, desc ? 9.6 : 5.2, 0.7, 0.7, 'F')
  font(p, 12.5, 'bold', C.ink)
  p.text(title, M + 4, d.y)
  if (desc) {
    font(p, 8.5, 'normal', C.muted)
    p.text(desc, M + 4, d.y + 5)
    d.y += 12
  } else {
    d.y += 8
  }
}

// ─────────────────────────────────────────────
//  CONTENT BLOCKS
// ─────────────────────────────────────────────

function drawTitle(d: Doc, name: string, dateText: string) {
  const { p } = d
  font(p, 8, 'bold', C.brand)
  p.text('HPV ANALYSIS REPORT', M, d.y)
  font(p, 24, 'bold', C.ink)
  p.text('Your results at a glance', M, d.y + 10)
  font(p, 9.5, 'normal', C.muted)
  p.text(`Prepared for ${name}  -  ${dateText}`, M, d.y + 17)
  d.y += 26
}

function drawHero(d: Doc, rate: number, infected: number, total: number, pictures: number) {
  const { p } = d
  const h = 46
  const tone = rate > 60 ? { fg: C.danger, bg: C.dangerSoft, t: 'High level' } : rate > 30 ? { fg: C.warn, bg: C.warnSoft, t: 'Moderate level' } : { fg: C.brand, bg: C.white, t: 'Low level' }

  box(p, M, d.y, CW, h, C.brandSoft, C.brandEdge, 4)
  font(p, 7.5, 'bold', C.ink2)
  p.text('OVERALL INFECTION RATE', M + 8, d.y + 10)
  font(p, 32, 'bold', tone.fg)
  p.text(`${num(rate, 2)}%`, M + 8, d.y + 26)
  pill(p, M + 8, d.y + 29.5, tone.t, tone.fg, tone.bg)

  const rx = M + CW / 2 + 4
  font(p, 11, 'bold', C.ink)
  const line = p.splitTextToSize(`${infected.toLocaleString()} of ${total.toLocaleString()} counted cells show signs of HPV.`, CW / 2 - 14)
  p.text(line, rx, d.y + 14)
  font(p, 8.5, 'normal', C.ink2)
  p.text(`Based on ${pictures} picture${pictures === 1 ? '' : 's'} checked by the AI.`, rx, d.y + 14 + line.length * 5 + 2)

  const barX = M + 8
  const barW = CW - 16
  fillC(p, C.white)
  p.roundedRect(barX, d.y + h - 9, barW, 3, 1.5, 1.5, 'F')
  const fillW = (barW * clamp(rate, 0, 100)) / 100
  if (fillW > 0.5) {
    fillC(p, tone.fg)
    p.roundedRect(barX, d.y + h - 9, Math.max(fillW, 3), 3, 1.5, 1.5, 'F')
  }
  d.y += h + 6
}

function drawStatTiles(d: Doc, tiles: { label: string; value: string; color: RGB }[]) {
  const { p } = d
  const gap = 4
  const w = (CW - gap * (tiles.length - 1)) / tiles.length
  tiles.forEach((t, i) => {
    const x = M + i * (w + gap)
    box(p, x, d.y, w, 22, C.white, C.line, 3)
    font(p, 7.5, 'normal', C.muted)
    p.text(t.label, x + 6, d.y + 8)
    font(p, 16, 'bold', t.color)
    p.text(t.value, x + 6, d.y + 17.5)
  })
  d.y += 28
}

function drawPatientInfo(d: Doc, props: PDFReportProps, isLab: boolean, labName: string) {
  const { p } = d
  const { PatientDetails, patient_name, patient_id, age, gender } = props
  const na = 'Not provided'
  const fields: [string, string][] = [
    ['Full name', PatientDetails?.Name || patient_name || na],
    ['Patient ID', PatientDetails?.ID || patient_id || na],
    ['Age', String(PatientDetails?.Age || age || na)],
    ['Gender', PatientDetails?.Gender || gender || na],
    ['Blood group', PatientDetails?.BloodGroup || na],
    ['Contact', PatientDetails?.ContactNumber || na],
    ['Sample date', PatientDetails?.SampleDate || na],
    ['Report date', PatientDetails?.ReportDate || new Date().toLocaleDateString('en-GB')],
    isLab ? ['Lab engineer', labName || na] : ['Referred by', PatientDetails?.ReferredBy || na],
  ]

  section(d, 'Patient information')
  const rows = Math.ceil(fields.length / 2)
  const h = rows * 13 + 8
  ensure(d, h + 4)
  box(p, M, d.y, CW, h, C.white, C.line, 3)
  fields.forEach(([label, value], i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = M + 8 + col * (CW / 2)
    const y = d.y + 9 + row * 13
    font(p, 7.5, 'normal', C.muted)
    p.text(label.toUpperCase(), x, y)
    font(p, 10, 'bold', value === na ? C.muted : C.ink)
    p.text(trunc(p, value, CW / 2 - 14), x, y + 5.2)
  })
  d.y += h + 8
}

function drawHowToRead(d: Doc) {
  const { p } = d
  const items: [string, string][] = [
    ['Infection rate', 'out of all the cells counted, the share that show signs of HPV.'],
    ['Risk', 'Low, Medium or High, based on what the AI found in each picture.'],
    ['R0', 'how many people one infected person passes HPV to. Above 1 it spreads; below 1 it fades.'],
  ]
  const lineH = 5.6
  const h = 14 + items.length * lineH + 4
  ensure(d, h + 4)
  box(p, M, d.y, CW, h, C.infoSoft, undefined, 3)
  font(p, 9.5, 'bold', C.info)
  p.text('How to read this report', M + 7, d.y + 8)
  items.forEach(([k, v], i) => {
    const y = d.y + 15 + i * lineH
    font(p, 8.5, 'bold', C.ink)
    p.text(k + ':', M + 7, y)
    const kw = p.getTextWidth(k + ':  ')
    font(p, 8.5, 'normal', C.ink2)
    p.text(trunc(p, v, CW - 14 - kw), M + 7 + kw, y)
  })
  d.y += h + 8
}

function drawSummaryTable(d: Doc, props: PDFReportProps) {
  const { p } = d
  const { total_cells, total_infected_cells, overall_infection_rate, image_results, S_1_Cal, S_2_Cal, I_Cal, R_Cal, C_Cal, R0_Cal } = props
  const okCount = image_results.filter((r) => !r.error).length

  section(d, 'Summary of numbers', 'Counts from your pictures, then results from the mathematical model.')

  const rows: { name: string; value: string; note: string; dot: RGB }[] = [
    { name: 'Cells counted', value: total_cells.toLocaleString(), note: 'All cells found in the pictures', dot: C.brand },
    { name: 'Infected cells', value: total_infected_cells.toLocaleString(), note: 'Cells that show signs of HPV', dot: C.inf },
    { name: 'Infection rate', value: `${num(overall_infection_rate, 2)}%`, note: 'Infected cells out of all cells', dot: C.warn },
    { name: 'Pictures checked', value: String(okCount), note: 'Images analysed by the AI', dot: C.violet },
    { name: 'S1 - healthy, unvaccinated', value: num(S_1_Cal, 4), note: 'Model: people not yet protected', dot: C.s1 },
    { name: 'S2 - healthy, vaccinated', value: num(S_2_Cal, 4), note: 'Model: vaccinated, still at some risk', dot: C.s2 },
    { name: 'I - infected', value: num(I_Cal, 4), note: 'Model: people who have HPV', dot: C.inf },
    { name: 'R - recovered', value: num(R_Cal, 4), note: 'Model: people who recovered', dot: C.rec },
    { name: 'C - cancer', value: num(C_Cal, 4), note: 'Model: infection that became cancer', dot: C.can },
    { name: 'R0 - reproduction number', value: num(R0_Cal, 4), note: 'How fast the virus can spread', dot: C.brand },
  ]

  const cols = [CW * 0.38, CW * 0.2, CW * 0.42]
  const rowH = 9
  const head = () => {
    box(p, M, d.y, CW, 8.5, C.brandSoft, undefined, 2)
    font(p, 7.5, 'bold', C.brand)
    let x = M + 6
    ;['MEASURE', 'VALUE', 'WHAT IT MEANS'].forEach((h, i) => {
      p.text(h, x, d.y + 5.6)
      x += cols[i]
    })
    d.y += 9.5
  }

  ensure(d, 8.5 + rowH * 3)
  head()
  rows.forEach((r) => {
    if (d.y + rowH > BOTTOM) {
      ensure(d, 999)
      head()
    }
    fillC(p, r.dot)
    p.circle(M + 4, d.y + 4.4, 1.2, 'F')
    font(p, 9, 'bold', C.ink)
    p.text(trunc(p, r.name, cols[0] - 10), M + 8, d.y + 5.4)
    font(p, 9, 'bold', C.ink)
    p.text(r.value, M + 6 + cols[0], d.y + 5.4)
    font(p, 8, 'normal', C.muted)
    p.text(trunc(p, r.note, cols[2] - 4), M + 6 + cols[0] + cols[1], d.y + 5.4)
    hairline(p, M, d.y + rowH - 0.5, M + CW)
    d.y += rowH
  })
  d.y += 8
}

function drawCompartmentBars(d: Doc, props: PDFReportProps) {
  const { p } = d
  const { S_1_Cal, S_2_Cal, I_Cal, R_Cal, C_Cal } = props
  const bars: { label: string; value: number; color: RGB }[] = [
    { label: 'S1  Healthy, unvaccinated', value: S_1_Cal, color: C.s1 },
    { label: 'S2  Healthy, vaccinated', value: S_2_Cal, color: C.s2 },
    { label: 'I   Infected', value: I_Cal, color: C.inf },
    { label: 'R   Recovered', value: R_Cal, color: C.rec },
    { label: 'C   Cancer', value: C_Cal, color: C.can },
  ]
  const max = Math.max(...bars.map((b) => (Number.isFinite(b.value) ? Math.abs(b.value) : 0)), 1e-9)

  section(d, 'Groups of people in the long run', 'A longer bar means a bigger group. Bars are compared with the largest group.')
  const rowH = 10
  const h = bars.length * rowH + 10
  ensure(d, h + 4)
  box(p, M, d.y, CW, h, C.white, C.line, 3)

  const labelW = 58
  const trackX = M + 8 + labelW
  const trackW = CW - 16 - labelW - 28
  bars.forEach((b, i) => {
    const y = d.y + 8 + i * rowH
    font(p, 8.5, 'normal', C.ink2)
    p.text(b.label.replace(/\s{2,}/, '  '), M + 8, y + 1)
    fillC(p, C.surface2)
    p.roundedRect(trackX, y - 2.6, trackW, 4, 2, 2, 'F')
    const w = Number.isFinite(b.value) ? (trackW * Math.abs(b.value)) / max : 0
    if (w > 0) {
      fillC(p, b.color)
      p.roundedRect(trackX, y - 2.6, Math.max(w, 2.5), 4, 2, 2, 'F')
    }
    font(p, 8.5, 'bold', C.ink)
    p.text(num(b.value, 3), M + CW - 8, y + 1, { align: 'right' })
  })
  d.y += h + 8
}

function drawR0(d: Doc, r0: number) {
  const { p } = d
  const spreading = Number.isFinite(r0) && r0 > 1
  const tone = spreading ? { fg: C.danger, bg: C.dangerSoft, t: 'Spreading' } : { fg: C.brand, bg: C.brandSoft, t: 'Fading out' }
  const h = 30
  section(d, 'Reproduction number (R0)')
  ensure(d, h + 4)
  box(p, M, d.y, CW, h, tone.bg, undefined, 3)
  font(p, 26, 'bold', tone.fg)
  p.text(num(r0, 3), M + 8, d.y + 19)
  pill(p, M + 8 + p.getTextWidth(num(r0, 3)) + 6, d.y + 11.2, tone.t, tone.fg, C.white)
  font(p, 9, 'normal', C.ink)
  const text = !Number.isFinite(r0)
    ? 'R0 could not be calculated from these settings.'
    : spreading
      ? 'Each infected person is expected to pass HPV to more than one other person, so the infection keeps spreading.'
      : 'Each infected person is expected to pass HPV to fewer than one other person, so the infection slowly dies out.'
  p.text(p.splitTextToSize(text, CW / 2 - 8), M + CW / 2 + 2, d.y + 12)
  d.y += h + 8
}

function drawCellOverview(d: Doc, props: PDFReportProps) {
  const { p } = d
  const { total_cells, total_infected_cells, image_results } = props
  const ok = image_results.filter((r) => !r.error)
  const healthy = Math.max(total_cells - total_infected_cells, 0)
  const infectedShare = total_cells > 0 ? total_infected_cells / total_cells : 0

  section(d, 'Cells and pictures', 'How the cells split, and how the pictures were graded.')

  // healthy vs infected stacked bar
  ensure(d, 40)
  box(p, M, d.y, CW, 24, C.white, C.line, 3)
  const bx = M + 8
  const bw = CW - 16
  fillC(p, C.s2)
  p.roundedRect(bx, d.y + 7, bw, 5, 2.5, 2.5, 'F')
  if (infectedShare > 0) {
    fillC(p, C.inf)
    p.roundedRect(bx + bw * (1 - infectedShare), d.y + 7, Math.max(bw * infectedShare, 2.5), 5, 2.5, 2.5, 'F')
  }
  font(p, 8.5, 'normal', C.ink2)
  fillC(p, C.s2)
  p.circle(bx + 1.5, d.y + 18, 1.2, 'F')
  p.text(`Healthy cells: ${healthy.toLocaleString()}`, bx + 5, d.y + 19)
  fillC(p, C.inf)
  p.circle(bx + 62, d.y + 18, 1.2, 'F')
  p.text(`Infected cells: ${total_infected_cells.toLocaleString()}`, bx + 66, d.y + 19)
  d.y += 30

  // risk + HPV status side by side
  const risk: Record<string, number> = { Low: 0, Medium: 0, High: 0 }
  const hpv: Record<string, number> = { Detected: 0, 'Not detected': 0, Unknown: 0 }
  ok.forEach((r) => {
    const rb = riskBucket(r.risk)
    if (rb !== 'Other') risk[rb]++
    hpv[hpvBucket(r.hpv)]++
  })

  ensure(d, 40)
  const gap = 4
  const w = (CW - gap) / 2
  const panel = (x: number, title: string, items: { label: string; value: number; fg: RGB; bg: RGB }[]) => {
    box(p, x, d.y, w, 34, C.white, C.line, 3)
    font(p, 9.5, 'bold', C.ink)
    p.text(title, x + 6, d.y + 8)
    const cw = (w - 12) / items.length
    items.forEach((it, i) => {
      const cx = x + 6 + i * cw
      box(p, cx, d.y + 12, cw - 2.5, 17, it.bg, undefined, 2.5)
      font(p, 14, 'bold', it.fg)
      p.text(String(it.value), cx + 4, d.y + 21.5)
      font(p, 7, 'bold', it.fg)
      p.text(it.label.toUpperCase(), cx + 4, d.y + 26.2)
    })
  }
  panel(M, 'Risk level of pictures', [
    { label: 'Low', value: risk.Low, fg: C.brand, bg: C.brandSoft },
    { label: 'Medium', value: risk.Medium, fg: C.warn, bg: C.warnSoft },
    { label: 'High', value: risk.High, fg: C.danger, bg: C.dangerSoft },
  ])
  panel(M + w + gap, 'HPV status of pictures', [
    { label: 'Detected', value: hpv.Detected, fg: C.danger, bg: C.dangerSoft },
    { label: 'Not found', value: hpv['Not detected'], fg: C.brand, bg: C.brandSoft },
    { label: 'Unknown', value: hpv.Unknown, fg: C.muted, bg: C.surface2 },
  ])
  d.y += 42
}

async function drawExternalCharts(d: Doc, charts: ChartDiv[]) {
  if (charts.length === 0) return
  const { default: html2canvas } = await import('html2canvas')
  for (const chart of charts) {
    try {
      const canvas = await html2canvas(chart.element, { scale: 2, backgroundColor: '#ffffff' })
      const img = canvas.toDataURL('image/png')
      const w = CW
      const h = (canvas.height / canvas.width) * w
      section(d, chart.title)
      ensure(d, h + 4)
      d.p.addImage(img, 'PNG', M, d.y, w, h)
      d.y += h + 8
    } catch (e) {
      console.error('Chart capture failed', e)
    }
  }
}

function drawImageTable(d: Doc, results: ImageResult[]) {
  const { p } = d
  const ok = results.filter((r) => !r.error)
  const failed = results.filter((r) => r.error)

  section(d, 'Picture results', `${ok.length} picture${ok.length === 1 ? '' : 's'} checked.`)

  if (ok.length === 0) {
    font(p, 9, 'normal', C.muted)
    p.text('No picture results are available.', M + 4, d.y)
    d.y += 10
    return
  }

  const cols = [8, 40, 28, 28, 22, 18, 34]
  const heads = ['#', 'PICTURE', 'RESULT', 'STAGE', 'RISK', 'CONF.', 'INFECTED / CELLS']
  const rowH = 9
  const head = () => {
    box(p, M, d.y, CW, 8.5, C.brandSoft, undefined, 2)
    font(p, 7, 'bold', C.brand)
    let x = M + 3
    heads.forEach((h, i) => {
      p.text(h, x, d.y + 5.6)
      x += cols[i]
    })
    d.y += 9.5
  }

  ensure(d, 8.5 + rowH * 2)
  head()
  ok.forEach((r, i) => {
    if (d.y + rowH > BOTTOM) {
      ensure(d, 999)
      head()
    }
    let x = M + 3
    const cell = (text: string, w: number, weight: 'normal' | 'bold' = 'normal', color: RGB = C.ink2) => {
      font(p, 8, weight, color)
      p.text(trunc(p, text, w - 3), x, d.y + 5.8)
      x += w
    }
    cell(String(i + 1), cols[0], 'bold', C.muted)
    cell(r.image, cols[1], 'normal', C.ink)
    cell(r.result, cols[2], 'bold', C.ink)
    cell(r.stage, cols[3])
    const tone = riskTone(r.risk)
    pill(p, x - 1, d.y + 1.8, trunc(p, r.risk || '-', cols[4] - 4), tone.fg, tone.bg, 6.5)
    x += cols[4]
    cell(typeof r.confidence === 'number' ? `${num(r.confidence, 1)}%` : '-', cols[5])
    cell(`${(r.infected_cells ?? 0).toLocaleString()} / ${(r.total_cells ?? 0).toLocaleString()}`, cols[6], 'bold', C.ink)
    hairline(p, M, d.y + rowH - 0.5, M + CW)
    d.y += rowH
  })

  if (failed.length > 0) {
    d.y += 3
    ensure(d, 12 + failed.length * 5)
    const h = 10 + failed.length * 5
    box(p, M, d.y, CW, h, C.dangerSoft, undefined, 3)
    font(p, 8.5, 'bold', C.danger)
    p.text(`${failed.length} picture${failed.length === 1 ? '' : 's'} could not be checked`, M + 6, d.y + 7)
    font(p, 8, 'normal', C.ink2)
    failed.forEach((f, i) => p.text(trunc(p, `${f.image}: ${f.error}`, CW - 12), M + 6, d.y + 12.5 + i * 5))
    d.y += h
  }
  d.y += 8
}

function drawSignOff(d: Doc, name: string) {
  const { p } = d
  section(d, 'Lab engineer sign-off')
  ensure(d, 36)
  box(p, M, d.y, CW, 32, C.white, C.line, 3)
  font(p, 7.5, 'normal', C.muted)
  p.text('PREPARED BY', M + 8, d.y + 9)
  font(p, 11, 'bold', C.ink)
  p.text(name || 'Not provided', M + 8, d.y + 15)
  pill(p, M + 8, d.y + 18.5, 'AUTHORISED SIGNATORY', C.brand, C.brandSoft, 6.5)

  const sx = M + CW / 2 + 6
  drawC(p, C.ink2)
  p.setLineWidth(0.3)
  p.line(sx, d.y + 22, M + CW - 8, d.y + 22)
  font(p, 7.5, 'normal', C.muted)
  p.text('Signature', sx, d.y + 26.5)
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  font(p, 8.5, 'bold', C.ink)
  p.text(date, M + CW - 8, d.y + 26.5, { align: 'right' })
  d.y += 38
}

function drawDisclaimer(d: Doc) {
  const { p } = d
  const lines = [
    'This report was created by the HPV Research Lab website. It is not a medical diagnosis and does not replace a doctor.',
    'The infection rate comes from counting cells in your pictures. The forecast numbers come from a mathematical model.',
    'Please have a qualified medical professional review these results.',
  ]
  font(p, 8, 'normal', C.ink2)
  const wrapped = lines.map((l) => p.splitTextToSize(l, CW - 20) as string[])
  const count = wrapped.reduce((n, w) => n + w.length, 0)
  const h = 14 + count * 4.2
  ensure(d, h + 4)
  box(p, M, d.y, CW, h, C.warnSoft, undefined, 3)
  font(p, 9.5, 'bold', C.warn)
  p.text('Important notes', M + 7, d.y + 8)
  let y = d.y + 14.5
  wrapped.forEach((w) => {
    fillC(p, C.warn)
    p.circle(M + 8, y - 1, 0.7, 'F')
    font(p, 8, 'normal', C.ink2)
    w.forEach((line, i) => p.text(line, M + 11, y + i * 4.2))
    y += w.length * 4.2
  })
  d.y += h + 4
}

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────

function decodedToken(): Record<string, unknown> {
  try {
    const tok = localStorage.getItem('access')
    return tok ? (jwtDecode<Record<string, unknown>>(tok) ?? {}) : {}
  } catch {
    return {}
  }
}

// ─────────────────────────────────────────────
//  MAIN EXPORT
// ─────────────────────────────────────────────

export async function generateProfessionalPDF(props: PDFReportProps): Promise<Blob> {
  const { accountRole, overall_infection_rate, total_cells, total_infected_cells, image_results, R0_Cal, LabEngineerName, chartDivs = [], PatientDetails, patient_name } = props

  // Role: explicit prop, then the signed-in user's token, then patient.
  const decoded = decodedToken()
  const role: AccountRole = accountRole ?? (decoded?.role as AccountRole) ?? (decoded?.user_type as AccountRole) ?? 'patient'
  const labName: string =
    LabEngineerName ||
    (typeof decoded?.lab_engineer === 'string' ? decoded.lab_engineer : '') ||
    (typeof decoded?.username === 'string' ? decoded.username : '') ||
    'HPV Lab Engineer'
  const isLab = role === 'lab_engineer' || role === 'admin'

  const pdf = new jsPDF('p', 'mm', 'a4')
  pdf.setProperties({ title: 'HPV Analysis Report', subject: 'HPV Research Lab', author: 'HPV Research Lab' })
  const typeLabel = isLab ? 'LAB REPORT' : 'PATIENT REPORT'
  const d: Doc = { p: pdf, y: TOP, typeLabel }

  pageHeader(pdf, true, typeLabel)

  const patientName = PatientDetails?.Name || patient_name || 'the patient'
  const dateText = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const okPictures = image_results.filter((r) => !r.error).length

  // Page 1: the answer first, details after
  drawTitle(d, patientName, dateText)
  drawHero(d, overall_infection_rate, total_infected_cells, total_cells, okPictures)
  drawStatTiles(d, [
    { label: 'Pictures checked', value: String(okPictures), color: C.ink },
    { label: 'Cells counted', value: total_cells.toLocaleString(), color: C.brand },
    { label: 'Infected cells', value: total_infected_cells.toLocaleString(), color: C.danger },
  ])
  drawPatientInfo(d, props, isLab, labName)
  drawHowToRead(d)

  // Page 2+: details
  pdf.addPage()
  pageHeader(pdf, false, typeLabel)
  d.y = TOP
  drawSummaryTable(d, props)
  drawCompartmentBars(d, props)
  drawR0(d, R0_Cal)
  drawCellOverview(d, props)
  await drawExternalCharts(d, chartDivs)
  drawImageTable(d, image_results)
  if (isLab) drawSignOff(d, labName)
  drawDisclaimer(d)

  const total = (pdf as any).internal.getNumberOfPages()
  for (let pg = 1; pg <= total; pg++) {
    pdf.setPage(pg)
    pageFooter(pdf, pg, total)
  }

  return pdf.output('blob')
}
