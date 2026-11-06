/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================================
//  HPV Research Lab - PDF report
//  Same look as the website: light surfaces, deep-green brand,
//  Inter-style type (Helvetica), soft cards, rounded pills.
// ============================================================

import { jsPDF } from 'jspdf'
import { jwtDecode } from 'jwt-decode'
import { describeDots } from '../../lib/analysis'
import type { AnalysisResult, ImageRow } from '../../lib/analysis'

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────

export type ImageResult = ImageRow

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
  analysis: AnalysisResult
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

function drawHero(d: Doc, a: AnalysisResult) {
  const { p } = d
  const h = 50
  const value = a.dots_per_nucleus
  const verdict = describeDots(value, a.reference)
  const toneColor: Record<string, RGB> = { brand: C.brand, info: C.info, warn: C.warn, danger: C.danger }
  const fg = verdict ? toneColor[verdict.tone] : C.muted

  box(p, M, d.y, CW, h, C.brandSoft, C.brandEdge, 4)
  font(p, 7.5, 'bold', C.ink2)
  p.text('AGNOR DOTS PER NUCLEUS', M + 8, d.y + 10)
  font(p, 32, 'bold', fg)
  p.text(value != null ? num(value, 2) : '-', M + 8, d.y + 26)
  if (verdict) pill(p, M + 8, d.y + 29.5, verdict.label, fg, C.white)

  const rx = M + CW / 2 + 4
  font(p, 10.5, 'bold', C.ink)
  const headline =
    value != null
      ? `${a.agnor_dots.toLocaleString()} AgNOR dots in ${a.nuclei.toLocaleString()} nuclei, counted by experts.`
      : 'No expert counts for these pictures.'
  const lines = p.splitTextToSize(headline, CW / 2 - 14)
  p.text(lines, rx, d.y + 13)
  font(p, 8.5, 'normal', C.ink2)
  const sub =
    value != null
      ? `The middle reference picture has ${num(a.reference.median, 2)} dots per nucleus.`
      : 'Counts exist only for pictures of the reference set. See the closest reference slides below.'
  p.text(p.splitTextToSize(sub, CW / 2 - 14), rx, d.y + 13 + lines.length * 5 + 2)

  // ruler: where this sample sits among the reference pictures
  const bx = M + 8
  const bw = CW - 16
  const by = d.y + h - 10
  const max = Math.max(a.reference.p90 * 1.25, (value ?? 0) * 1.1, 1)
  const at = (v: number) => bx + (bw * Math.min(v, max)) / max
  fillC(p, C.white)
  p.roundedRect(bx, by, bw, 3, 1.5, 1.5, 'F')
  fillC(p, C.brandEdge)
  p.roundedRect(bx, by, at(a.reference.p75) - bx, 3, 1.5, 1.5, 'F')
  fillC(p, C.warnSoft)
  p.rect(at(a.reference.p75), by, at(a.reference.p90) - at(a.reference.p75), 3, 'F')
  fillC(p, C.dangerSoft)
  p.rect(at(a.reference.p90), by, bx + bw - at(a.reference.p90), 3, 'F')
  if (value != null) {
    fillC(p, C.ink)
    p.roundedRect(at(value) - 0.8, by - 1.5, 1.6, 6, 0.8, 0.8, 'F')
  }
  font(p, 6.5, 'normal', C.muted)
  p.text('fewer dots', bx, by + 7)
  p.text('more dots', bx + bw, by + 7, { align: 'right' })
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
    ['AgNOR dots', 'tiny black dots inside a nucleus. Their average number is a research marker of cell activity.'],
    ['Closest slide', 'the AI top guess among 15 reference slides. It was often not the true slide in our spot check, so it is a demo only. It is not a diagnosis.'],
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
  const { analysis: a, S_1_Cal, S_2_Cal, I_Cal, R_Cal, C_Cal, R0_Cal } = props

  section(d, 'Summary of numbers', 'Expert counts from your pictures, then results from the mathematical model.')

  const rows: { name: string; value: string; note: string; dot: RGB }[] = [
    { name: 'Pictures checked', value: String(a.images_analyzed), note: 'Pictures analysed', dot: C.violet },
    { name: 'Pictures with expert counts', value: String(a.annotated_images), note: 'Pictures of the reference set', dot: C.brand },
    { name: 'Nuclei counted', value: a.annotated_images ? a.nuclei.toLocaleString() : '-', note: 'By experts, reference pictures only', dot: C.s2 },
    { name: 'AgNOR dots', value: a.annotated_images ? a.agnor_dots.toLocaleString() : '-', note: 'Clusters and satellites', dot: C.rec },
    { name: 'Dots per nucleus', value: a.dots_per_nucleus != null ? num(a.dots_per_nucleus, 2) : '-', note: `Reference middle: ${num(a.reference.median, 2)}`, dot: C.warn },
    { name: 'S1 - susceptible children', value: num(S_1_Cal, 4), note: 'Model: children who later become adults', dot: C.s1 },
    { name: 'S2 - susceptible adults', value: num(S_2_Cal, 4), note: 'Model: adults who can catch HPV', dot: C.s2 },
    { name: 'I - infected', value: num(I_Cal, 4), note: R0_Cal <= 1 ? 'Model: infection dies out' : 'Model: people who have HPV', dot: C.inf },
    { name: 'R - recovered', value: num(R_Cal, 4), note: 'Model: recovered or vaccine-immune', dot: C.rec },
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
    { label: 'S1  Susceptible children', value: S_1_Cal, color: C.s1 },
    { label: 'S2  Susceptible adults', value: S_2_Cal, color: C.s2 },
    { label: 'I   Infected', value: I_Cal, color: C.inf },
    { label: 'R   Recovered / immune', value: R_Cal, color: C.rec },
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
  const a = props.analysis
  const ok = a.image_results.filter((r) => !r.error)
  const clusters = ok.reduce((n, r) => n + (r.clusters ?? 0), 0)
  const satellites = ok.reduce((n, r) => n + (r.satellites ?? 0), 0)
  const dots = clusters + satellites

  section(d, 'AgNOR dots and reference slides', 'What was counted, and which reference slides the pictures look most like.')

  ensure(d, 40)
  box(p, M, d.y, CW, 24, C.white, C.line, 3)
  const bx = M + 8
  const bw = CW - 16
  fillC(p, C.surface2)
  p.roundedRect(bx, d.y + 7, bw, 5, 2.5, 2.5, 'F')
  if (dots > 0) {
    fillC(p, C.inf)
    p.roundedRect(bx, d.y + 7, Math.max((bw * clusters) / dots, 2.5), 5, 2.5, 2.5, 'F')
    fillC(p, C.warn)
    p.roundedRect(bx + (bw * clusters) / dots, d.y + 7, Math.max((bw * satellites) / dots, 2.5), 5, 2.5, 2.5, 'F')
  }
  font(p, 8.5, 'normal', C.ink2)
  fillC(p, C.inf)
  p.circle(bx + 1.5, d.y + 18, 1.2, 'F')
  p.text(`Clusters (touching dots): ${clusters.toLocaleString()}`, bx + 5, d.y + 19)
  fillC(p, C.warn)
  p.circle(bx + 70, d.y + 18, 1.2, 'F')
  p.text(`Satellites (single dots): ${satellites.toLocaleString()}`, bx + 74, d.y + 19)
  d.y += 30

  const tally: Record<string, number> = {}
  ok.forEach((r) => {
    if (r.best_slide) tally[r.best_slide] = (tally[r.best_slide] ?? 0) + 1
  })
  const top = Object.entries(tally).sort((x, y) => y[1] - x[1]).slice(0, 5)

  ensure(d, 34)
  box(p, M, d.y, CW, 28, C.white, C.line, 3)
  font(p, 9.5, 'bold', C.ink)
  p.text('Closest reference slides', M + 6, d.y + 8)
  let x = M + 6
  if (top.length === 0) {
    font(p, 8.5, 'normal', C.muted)
    p.text('No pictures were compared.', x, d.y + 19)
  }
  top.forEach(([slide, count]) => {
    const w = pill(p, x, d.y + 14, `Slide ${slide}: ${count} picture${count === 1 ? '' : 's'}`, C.violet, C.violetSoft, 7.5)
    x += w + 3
  })
  d.y += 36
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

function drawImageTable(d: Doc, results: ImageRow[]) {
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

  const cols = [8, 58, 20, 20, 30, 42]
  const heads = ['#', 'PICTURE', 'NUCLEI', 'DOTS', 'DOTS / NUCLEUS', 'CLOSEST SLIDE']
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
    cell(r.annotated ? String(r.nuclei ?? 0) : '-', cols[2])
    cell(r.annotated ? String(r.agnor_dots ?? 0) : '-', cols[3])
    cell(r.annotated && r.dots_per_nucleus != null ? num(r.dots_per_nucleus, 2) : '-', cols[4], 'bold', C.ink)
    pill(p, x - 1, d.y + 1.8, `Slide ${r.best_slide ?? '-'} - ${num(r.best_slide_similarity, 0)}%`, C.violet, C.violetSoft, 6.5)
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

function drawDisclaimer(d: Doc, note: string) {
  const { p } = d
  const lines = [
    'This report was created by the HPV Research Lab website. It is a research demo, not a medical test, and it does not replace a doctor.',
    note,
    'The forecast shows how HPV could spread in a population for the settings you chose. It is not a prediction for one person.',
    'Please talk to a qualified medical professional about any health concern.',
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
  const { accountRole, analysis, R0_Cal, LabEngineerName, chartDivs = [], PatientDetails, patient_name } = props

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

  // Page 1: the answer first, details after
  drawTitle(d, patientName, dateText)
  drawHero(d, analysis)
  drawStatTiles(d, [
    { label: 'Pictures checked', value: String(analysis.images_analyzed), color: C.ink },
    { label: 'Nuclei counted', value: analysis.annotated_images ? analysis.nuclei.toLocaleString() : '-', color: C.brand },
    { label: 'AgNOR dots', value: analysis.annotated_images ? analysis.agnor_dots.toLocaleString() : '-', color: C.violet },
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
  drawImageTable(d, analysis.image_results)
  if (isLab) drawSignOff(d, labName)
  drawDisclaimer(d, analysis.note)

  const total = (pdf as any).internal.getNumberOfPages()
  for (let pg = 1; pg <= total; pg++) {
    pdf.setPage(pg)
    pageFooter(pdf, pg, total)
  }

  return pdf.output('blob')
}
