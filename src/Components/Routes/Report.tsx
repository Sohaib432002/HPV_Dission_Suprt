/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================================
//  PDFReport.ts  —  HPV Research Lab  |  v4.0
//  Dark professional theme · Role-aware display · No overlaps
//  Clean spacing · Built-in SIR charts · Proper image sizing
// ============================================================

import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
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
}

export interface ChartDiv {
  element: HTMLElement
  title: string
}

export type AccountRole = 'lab_engineer' | 'patient' | 'admin'

export interface PDFReportProps {
  logo_url: string
  accountRole?: AccountRole // determines what sections to show
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
//  COLOUR PALETTE  — Deep Slate / Purple Pro
// ─────────────────────────────────────────────

type RGB = [number, number, number]

const C = {
  // Page & structural backgrounds
  pageBg: [6, 8, 22] as RGB,
  cardBg: [13, 17, 42] as RGB,
  cardBgAlt: [18, 24, 56] as RGB,
  cardBgLight: [24, 32, 72] as RGB,
  headerBg: [10, 13, 35] as RGB,
  footerBg: [8, 11, 28] as RGB,

  // Table rows (light for readability)
  tableRowA: [238, 237, 252] as RGB,
  tableRowB: [248, 247, 255] as RGB,
  tableHeader: [30, 24, 80] as RGB,

  // Core accents
  purple: [138, 92, 255] as RGB,
  purpleMid: [115, 72, 230] as RGB,
  purpleDark: [78, 50, 178] as RGB,
  purpleGlow: [175, 140, 255] as RGB,
  violet: [180, 110, 255] as RGB,

  // Secondary accents
  cyan: [56, 196, 220] as RGB,
  cyanLight: [130, 220, 240] as RGB,
  teal: [40, 180, 180] as RGB,
  green: [44, 196, 126] as RGB,
  greenLight: [110, 220, 165] as RGB,
  gold: [252, 186, 56] as RGB,
  goldLight: [255, 215, 120] as RGB,
  orange: [252, 136, 52] as RGB,
  red: [232, 70, 70] as RGB,
  pink: [226, 86, 178] as RGB,
  pinkLight: [244, 145, 210] as RGB,

  // Risk
  riskLow: [38, 178, 108] as RGB,
  riskMed: [236, 158, 28] as RGB,
  riskHigh: [222, 62, 62] as RGB,

  // Text
  white: [255, 255, 255] as RGB,
  textPrimary: [220, 224, 245] as RGB,
  textSecondary: [148, 158, 195] as RGB,
  textMuted: [100, 112, 158] as RGB,
  textDark: [28, 22, 68] as RGB,
  textTableVal: [100, 52, 200] as RGB,
  textTableDesc: [62, 68, 108] as RGB,

  // Borders
  borderPurple: [60, 48, 148] as RGB,
  borderLight: [90, 78, 175] as RGB,
  divider: [38, 34, 100] as RGB,
  hairline: [195, 190, 228] as RGB,
}

// ─────────────────────────────────────────────
//  TYPOGRAPHY
// ─────────────────────────────────────────────

const F = {
  h1: 24,
  h2: 14,
  sectionH: 10.5,
  tableH: 8.5,
  tableCell: 8,
  label: 8.5,
  value: 9,
  sm: 7,
  xs: 6,
  badge: 6.5,
  statVal: 13,
  statLbl: 6,
  coverLbl: 6.5,
  coverVal: 8.5,
}

// ─────────────────────────────────────────────
//  LAYOUT (mm)
// ─────────────────────────────────────────────

const L = {
  mL: 12,
  mR: 12,
  headerH: 22,
  footerH: 13,
  rowH: 8.5,
  secGap: 8,
  secBarH: 9,
  innerPad: 5,
  lineH: 5.5,
}

// ─────────────────────────────────────────────
//  PRIMITIVES
// ─────────────────────────────────────────────

const sf = (p: jsPDF, c: RGB) => p.setFillColor(c[0], c[1], c[2])
const st = (p: jsPDF, c: RGB) => p.setTextColor(c[0], c[1], c[2])
const sd = (p: jsPDF, c: RGB) => p.setDrawColor(c[0], c[1], c[2])

function rRect(
  p: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: RGB,
  stroke?: RGB,
  lw = 0.3,
  r = 0
): void {
  sf(p, fill)
  if (stroke) {
    sd(p, stroke)
    p.setLineWidth(lw)
  }
  const mode = stroke ? 'FD' : 'F'
  if (r > 0) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(p as any).roundedRect(x, y, w, h, r, r, mode)
    } catch {
      p.rect(x, y, w, h, mode)
    }
  } else {
    p.rect(x, y, w, h, mode)
  }
}

function dLine(p: jsPDF, x1: number, y1: number, x2: number, y2: number, c: RGB, lw = 0.3): void {
  sd(p, c)
  p.setLineWidth(lw)
  p.line(x1, y1, x2, y2)
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src
    img.onload = () => res(img)
    img.onerror = () => rej(new Error(`Failed: ${src}`))
  })
}

function riskColor(risk: string): RGB {
  const r = risk.toLowerCase()
  if (r.includes('high') || r.includes('severe')) return C.riskHigh
  if (r.includes('med') || r.includes('moderate')) return C.riskMed
  return C.riskLow
}

function ensureSpace(
  p: jsPDF,
  y: number,
  needed: number,
  pH: number,
  pW: number,
  drawHdr: (p: jsPDF, pW: number) => void
): number {
  if (y + needed > pH - L.footerH - 8) {
    p.addPage()
    drawHdr(p, pW)
    return L.headerH + 8
  }
  return y
}

function truncate(p: jsPDF, text: string, maxW: number): string {
  if (p.getTextWidth(text) <= maxW) return text
  let t = text
  while (t.length > 1 && p.getTextWidth(t + '\u2026') > maxW) t = t.slice(0, -1)
  return t + '\u2026'
}

function cardWrap(p: jsPDF, y: number, pW: number, h: number, border: RGB = C.borderPurple): void {
  rRect(p, L.mL, y, pW - L.mL - L.mR, h, C.cardBg, border, 0.28, 1.5)
}

// ─────────────────────────────────────────────
//  PAGE HEADER
//  Fixed 22 mm tall — date pill sized to not overlap title
// ─────────────────────────────────────────────

function pageHeader(p: jsPDF, pW: number): void {
  rRect(p, 0, 0, pW, L.headerH, C.headerBg)
  rRect(p, 0, 0, 4, L.headerH, C.purple)
  rRect(p, 4, 0, 1, L.headerH, C.violet)

  // Title + subtitle  — left zone only, capped at 60% of page width
  p.setFont('helvetica', 'bold')
  p.setFontSize(11)
  st(p, C.white)
  p.text('HPV Research Lab', 9, 9)

  p.setFont('helvetica', 'normal')
  p.setFontSize(F.sm)
  st(p, C.purpleGlow)
  p.text('Simulation & Analysis Platform  \u00b7  v4.0', 9, 15.5)

  // Date pill — uses a fixed width (38 mm), placed well to the right
  const dateStr = new Date().toISOString().slice(0, 10)
  const pillW = 38,
    pillH = 7
  const pillX = pW - L.mR - pillW
  const pillY = (L.headerH - pillH) / 2
  rRect(p, pillX, pillY, pillW, pillH, C.purpleDark, C.purple, 0.3, 2)
  p.setFont('helvetica', 'bold')
  p.setFontSize(F.badge)
  st(p, C.purpleGlow)
  p.text(dateStr, pillX + pillW / 2, pillY + 4.8, { align: 'center' })

  dLine(p, 0, L.headerH, pW, L.headerH, C.purple, 0.5)
}

// ─────────────────────────────────────────────
//  PAGE FOOTER
//  Three distinct zones — pill around page number prevents bleed
// ─────────────────────────────────────────────

function pageFooter(p: jsPDF, pW: number, pH: number, pageNum: number, total: number): void {
  const fY = pH - L.footerH
  const mid = fY + 8

  rRect(p, 0, fY, pW, L.footerH, C.footerBg)
  dLine(p, 0, fY, pW, fY, C.borderPurple, 0.4)

  // Left
  p.setFont('helvetica', 'normal')
  p.setFontSize(F.xs)
  st(p, C.textMuted)
  p.text('HPV Research Lab  \u00b7  Confidential', L.mL, mid)

  // Centre
  st(p, C.purpleGlow)
  p.text('www.hpvresearchlab.com', pW / 2, mid, { align: 'center' })

  // Right — pill to make it distinct
  const pgTxt = `Page ${pageNum} / ${total}`
  p.setFont('helvetica', 'bold')
  p.setFontSize(F.xs)
  const pgW = p.getTextWidth(pgTxt) + 6
  rRect(p, pW - L.mR - pgW, fY + 3, pgW, 7, C.cardBgAlt, C.borderPurple, 0.2, 1.5)
  st(p, C.cyan)
  p.text(pgTxt, pW - L.mR - pgW / 2, mid, { align: 'center' })
}

// ─────────────────────────────────────────────
//  SECTION BAR
// ─────────────────────────────────────────────

function sectionBar(
  p: jsPDF,
  title: string,
  y: number,
  pW: number,
  accent: RGB = C.purple
): number {
  const bW = pW - L.mL - L.mR
  rRect(p, L.mL, y, bW, L.secBarH, C.cardBgAlt, C.borderPurple, 0.25, 1.5)
  rRect(p, L.mL, y, 3, L.secBarH, accent, undefined, 0, 1)
  p.setFont('helvetica', 'bold')
  p.setFontSize(F.sectionH)
  st(p, accent)
  p.text(title.toUpperCase(), L.mL + 7, y + 6.3)
  return y + L.secBarH + 4
}

// ─────────────────────────────────────────────
//  PATIENT INFORMATION
// ─────────────────────────────────────────────

function drawPatientInfo(p: jsPDF, props: PDFReportProps, y: number, pW: number): number {
  const { PatientDetails, patient_name, patient_id, age, gender } = props
  y = sectionBar(p, 'Patient Information', y, pW, C.green)

  const fields: [string, string][] = [
    ['Full Name', PatientDetails?.Name || patient_name || 'N/A'],
    ['Patient ID', PatientDetails?.ID || patient_id || 'N/A'],
    ['Age', String(PatientDetails?.Age || age || 'N/A')],
    ['Gender', PatientDetails?.Gender || gender || 'N/A'],
    ['Blood Group', PatientDetails?.BloodGroup || 'N/A'],
    ['Contact', PatientDetails?.ContactNumber || 'N/A'],
    ['Sample Date', PatientDetails?.SampleDate || 'N/A'],
    ['Report Date', PatientDetails?.ReportDate || new Date().toLocaleDateString()],
    ['Referred By', PatientDetails?.ReferredBy || 'N/A'],
  ]

  const rowH = 9
  const rows = Math.ceil(fields.length / 2)
  const blockH = rows * rowH + L.innerPad * 2
  cardWrap(p, y, pW, blockH)

  const colW = (pW - L.mL - L.mR) / 2
  const lbW = 28

  fields.forEach(([lbl, val], i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const cx = L.mL + L.innerPad + col * colW
    const ry = y + L.innerPad + row * rowH + 6

    p.setFont('helvetica', 'bold')
    p.setFontSize(F.sm)
    st(p, C.textMuted)
    p.text(lbl + ':', cx, ry)

    p.setFont('helvetica', 'normal')
    p.setFontSize(F.value)
    st(p, C.textPrimary)
    p.text(truncate(p, val, colW - lbW - L.innerPad - 3), cx + lbW, ry)
  })

  return y + blockH + L.secGap
}

// ─────────────────────────────────────────────
//  LAB ENGINEER BLOCK  (lab / admin only)
// ─────────────────────────────────────────────

function drawLabEngineerInfo(p: jsPDF, name: string, y: number, pW: number): number {
  y = sectionBar(p, 'Lab Engineer Details', y, pW, C.cyan)

  const blockH = 22
  cardWrap(p, y, pW, blockH, C.cyan)

  const bW = pW - L.mL - L.mR
  const half = bW / 2

  p.setFont('helvetica', 'bold')
  p.setFontSize(F.sm)
  st(p, C.textMuted)
  p.text('Lab Engineer:', L.mL + L.innerPad, y + 10)

  p.setFont('helvetica', 'bold')
  p.setFontSize(F.value)
  st(p, C.cyan)
  p.text(name || 'N/A', L.mL + L.innerPad + 30, y + 10)

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  p.setFont('helvetica', 'bold')
  p.setFontSize(F.sm)
  st(p, C.textMuted)
  p.text('Generated:', L.mL + half + L.innerPad, y + 10)

  p.setFont('helvetica', 'normal')
  p.setFontSize(F.value)
  st(p, C.textPrimary)
  p.text(dateStr, L.mL + half + L.innerPad + 22, y + 10)

  return y + blockH + L.secGap
}

// ─────────────────────────────────────────────
//  STAT BADGES
// ─────────────────────────────────────────────

function drawStatBadges(
  p: jsPDF,
  rate: number,
  cells: number,
  infected: number,
  images: number,
  y: number,
  pW: number
): number {
  y = sectionBar(p, 'Analysis Overview', y, pW, C.purple)

  const bW = pW - L.mL - L.mR
  const gap = 3
  const bBW = (bW - gap * 3) / 4
  const bH = 24

  const badges = [
    { lbl: 'Total Cells', val: cells.toLocaleString(), col: C.cyan },
    { lbl: 'Infected Cells', val: infected.toLocaleString(), col: C.red },
    { lbl: 'Infection Rate', val: `${rate.toFixed(2)}%`, col: C.orange },
    { lbl: 'Images Analysed', val: images.toString(), col: C.purple },
  ]

  badges.forEach((b, i) => {
    const bX = L.mL + i * (bBW + gap)
    rRect(p, bX, y, bBW, bH, C.cardBgAlt, b.col, 0.4, 2)
    rRect(p, bX, y, bBW, 3, b.col, undefined, 0, 2)

    p.setFont('helvetica', 'bold')
    p.setFontSize(F.statLbl)
    st(p, b.col)
    p.text(b.lbl.toUpperCase(), bX + 5, y + 10)

    p.setFont('helvetica', 'bold')
    p.setFontSize(F.statVal)
    st(p, C.white)
    p.text(b.val, bX + bBW / 2, y + 21, { align: 'center' })
  })

  return y + bH + L.secGap
}

// ─────────────────────────────────────────────
//  INFECTION RATE BAR
// ─────────────────────────────────────────────

function drawInfectionBar(p: jsPDF, rate: number, y: number, pW: number): number {
  const bW = pW - L.mL - L.mR
  const barH = 9

  p.setFont('helvetica', 'bold')
  p.setFontSize(F.label)
  st(p, C.textPrimary)
  p.text('Overall Infection Rate', L.mL, y + 5)

  p.setFont('helvetica', 'normal')
  p.setFontSize(F.sm)
  st(p, C.textMuted)
  p.text('Percentage of infected cells in the analysed sample', L.mL, y + 10.5)
  y += 14

  // Track
  rRect(p, L.mL, y, bW, barH, C.cardBgAlt, C.borderPurple, 0.25, 3)

  // Fill
  const fillW = Math.max(5, Math.min((rate / 100) * bW, bW))
  const fillC: RGB = rate > 60 ? C.riskHigh : rate > 30 ? C.riskMed : C.riskLow
  rRect(p, L.mL, y, fillW, barH, fillC, undefined, 0, 3)

  // Milestone ticks
  ;[25, 50, 75].forEach((pct) => {
    const tx = L.mL + (pct / 100) * bW
    dLine(p, tx, y, tx, y + barH, C.divider, 0.2)
    p.setFont('helvetica', 'normal')
    p.setFontSize(F.xs)
    st(p, C.textMuted)
    p.text(`${pct}%`, tx, y + barH + 4.2, { align: 'center' })
  })

  // Rate label
  p.setFont('helvetica', 'bold')
  p.setFontSize(F.sm)
  st(p, C.white)
  p.text(`${rate.toFixed(2)}%`, Math.min(L.mL + fillW / 2, pW - L.mR - 10), y + 6.2, {
    align: 'center',
  })

  return y + barH + 10 + L.secGap
}

// ─────────────────────────────────────────────
//  SUMMARY TABLE
// ─────────────────────────────────────────────

function drawSummaryTable(p: jsPDF, props: PDFReportProps, y: number, pW: number): number {
  const {
    total_cells,
    total_infected_cells,
    overall_infection_rate,
    image_results,
    S_1_Cal,
    S_2_Cal,
    I_Cal,
    R_Cal,
    C_Cal,
    R0_Cal,
  } = props

  y = sectionBar(p, 'Simulation Summary', y, pW, C.cyan)

  const tX = L.mL
  const tW = pW - L.mL - L.mR
  const hH = L.rowH
  const COL = [tW * 0.32, tW * 0.22, tW * 0.46]

  const rows: [string, string, string, RGB][] = [
    ['total_cells', total_cells.toLocaleString(), 'Total cells analysed in sample', C.cyan],
    [
      'total_infected',
      total_infected_cells.toLocaleString(),
      'Confirmed infected cell count',
      C.red,
    ],
    [
      'infection_rate (%)',
      overall_infection_rate.toFixed(4),
      'Overall infection percentage',
      C.orange,
    ],
    ['images_analysed', image_results.length.toString(), 'Slide images processed', C.purple],
    ['S1 — Susceptible 1', S_1_Cal.toFixed(6), 'Susceptible group 1 compartment', C.green],
    ['S2 — Susceptible 2', S_2_Cal.toFixed(6), 'Susceptible group 2 compartment', C.greenLight],
    ['I  — Infected', I_Cal.toFixed(6), 'Infected compartment value', C.red],
    ['R  — Recovered', R_Cal.toFixed(6), 'Recovered compartment value', C.teal],
    ['C  — Cancer Prog.', C_Cal.toFixed(6), 'Cancer progression estimate', C.orange],
    ['R0 — Basic Repro.', R0_Cal.toFixed(6), 'Basic reproduction number (R0)', C.gold],
  ]

  // Header
  rRect(p, tX, y - hH + 2, tW, hH, C.tableHeader, C.borderPurple, 0.3)
  let xP = tX + 4
  ;['Parameter', 'Value', 'Description'].forEach((h, ci) => {
    p.setFont('helvetica', 'bold')
    p.setFontSize(F.tableH)
    st(p, ci === 0 ? C.greenLight : ci === 1 ? C.goldLight : C.cyanLight)
    p.text(h, xP, y)
    xP += COL[ci]
  })
  dLine(p, tX, y + 1.5, tX + tW, y + 1.5, C.purple, 0.5)
  y += hH

  rows.forEach((row, ri) => {
    const fill: RGB = ri % 2 === 0 ? C.tableRowA : C.tableRowB
    rRect(p, tX, y - hH + 2, tW, hH, fill)
    rRect(p, tX, y - hH + 2, 2.5, hH, row[3])

    let cx = tX + 5
    p.setFont('helvetica', 'bold')
    p.setFontSize(F.tableCell)
    st(p, C.textDark)
    p.text(row[0], cx, y)
    cx += COL[0]

    p.setFont('helvetica', 'bold')
    p.setFontSize(F.tableCell)
    st(p, C.textTableVal)
    p.text(row[1], cx, y)
    cx += COL[1]

    p.setFont('helvetica', 'normal')
    p.setFontSize(F.sm)
    st(p, C.textTableDesc)
    p.text(row[2], cx, y)

    dLine(p, tX, y + 2, tX + tW, y + 2, C.hairline, 0.1)
    y += hH
  })

  sd(p, C.cyan)
  p.setLineWidth(0.45)
  p.rect(tX, y - (rows.length + 1) * hH, tW, (rows.length + 1) * hH)

  return y + 4 + L.secGap
}

// ─────────────────────────────────────────────
//  SIR COMPARTMENT LIST
// ─────────────────────────────────────────────

function drawSIRBlock(
  p: jsPDF,
  S1: number,
  S2: number,
  I: number,
  R: number,
  Cv: number,
  R0: number,
  y: number,
  pW: number
): number {
  y = sectionBar(p, 'SIR Model Compartments', y, pW, C.orange)

  const comps = [
    { lbl: 'S1  Susceptible Group 1', val: S1.toFixed(8), col: C.green },
    { lbl: 'S2  Susceptible Group 2', val: S2.toFixed(8), col: C.greenLight },
    { lbl: 'I   Infected', val: I.toFixed(8), col: C.red },
    { lbl: 'R   Recovered', val: R.toFixed(8), col: C.cyan },
    { lbl: 'C   Cancer Progression', val: Cv.toFixed(8), col: C.orange },
    { lbl: 'R0  Basic Repro. Number', val: R0.toFixed(8), col: C.gold },
  ]

  const rowH = 8.5
  const blockH = comps.length * rowH + L.innerPad * 2 + 7
  cardWrap(p, y, pW, blockH, C.orange)

  p.setFont('helvetica', 'italic')
  p.setFontSize(F.sm)
  st(p, C.textMuted)
  p.text('Computed compartment values from the SIR epidemiological model', L.mL + L.innerPad, y + 5)

  const valX = L.mL + L.innerPad + 72

  comps.forEach((c, i) => {
    const lY = y + L.innerPad + 7 + i * rowH

    p.setFont('helvetica', 'bold')
    p.setFontSize(F.label)
    st(p, C.textSecondary)
    p.text(c.lbl, L.mL + L.innerPad, lY)

    st(p, C.textMuted)
    p.text('=', valX - 5, lY)

    p.setFont('helvetica', 'bold')
    p.setFontSize(F.value)
    st(p, c.col)
    p.text(c.val, valX, lY)

    if (i < comps.length - 1) dLine(p, L.mL + 6, lY + 2.5, pW - L.mR - 6, lY + 2.5, C.divider, 0.12)
  })

  return y + blockH + L.secGap
}

// ─────────────────────────────────────────────
//  SIR BAR CHART  (built-in, no html2canvas)
// ─────────────────────────────────────────────

function drawSIRBarChart(
  p: jsPDF,
  S1: number,
  S2: number,
  I: number,
  R: number,
  Cv: number,
  R0: number,
  y: number,
  pW: number
): number {
  y = sectionBar(p, 'SIR Compartment Chart', y, pW, C.purple)

  const bX = L.mL
  const bW = pW - L.mL - L.mR
  const axisL = 20
  const axisB = 11
  const plotW = bW - axisL - 6
  const plotH = 44
  const cardH = plotH + axisB + 14

  cardWrap(p, y, pW, cardH, C.purple)

  const bars = [
    { lbl: 'S1', val: S1, col: C.green },
    { lbl: 'S2', val: S2, col: C.greenLight },
    { lbl: 'I', val: I, col: C.red },
    { lbl: 'R', val: R, col: C.cyan },
    { lbl: 'C', val: Cv, col: C.orange },
    { lbl: 'R0', val: R0, col: C.gold },
  ]

  const absVals = bars.map((b) => Math.abs(b.val))
  const maxVal = Math.max(...absVals, 1e-12)
  const originX = bX + axisL
  const originY = y + 8 + plotH
  const barSlot = plotW / bars.length
  const barW = barSlot * 0.52
  const gap = barSlot * 0.24

  // Grid lines
  for (let g = 1; g <= 4; g++) {
    const gY = originY - (g / 4) * plotH
    dLine(p, originX, gY, originX + plotW, gY, C.divider, 0.15)
    const tv = (g / 4) * maxVal
    const ts = tv < 0.0001 ? tv.toExponential(1) : tv.toFixed(3)
    p.setFont('helvetica', 'normal')
    p.setFontSize(4.5)
    st(p, C.textMuted)
    p.text(ts, originX - 1, gY + 1.2, { align: 'right' })
  }

  dLine(p, originX, originY, originX + plotW, originY, C.borderLight, 0.35)
  dLine(p, originX, y + 8, originX, originY, C.borderLight, 0.35)

  bars.forEach((b, i) => {
    const barH = Math.max(1, (Math.abs(b.val) / maxVal) * plotH)
    const barX = originX + i * barSlot + gap
    const barTop = originY - barH

    rRect(p, barX, barTop, barW, barH, b.col, undefined, 0, 1)

    p.setFont('helvetica', 'bold')
    p.setFontSize(F.badge)
    st(p, b.col)
    p.text(b.lbl, barX + barW / 2, originY + 5.5, { align: 'center' })

    const vs = Math.abs(b.val) < 0.0001 ? b.val.toExponential(1) : b.val.toFixed(3)
    p.setFont('helvetica', 'normal')
    p.setFontSize(4)
    st(p, C.textMuted)
    p.text(vs, barX + barW / 2, barTop - 1.5, { align: 'center' })
  })

  p.setFont('helvetica', 'italic')
  p.setFontSize(F.xs)
  st(p, C.textMuted)
  p.text('Value', originX - 14, y + 8 + plotH / 2, { angle: 90 } as any)

  return y + cardH + L.secGap
}

// ─────────────────────────────────────────────
//  INFECTION DONUT CHART
// ─────────────────────────────────────────────

function drawInfectionPieChart(
  p: jsPDF,
  total: number,
  infected: number,
  y: number,
  pW: number
): number {
  y = sectionBar(p, 'Cell Infection Breakdown', y, pW, C.pink)

  const cardH = 56
  cardWrap(p, y, pW, cardH, C.pink)

  const cx = L.mL + (pW - L.mL - L.mR) * 0.28
  const cy = y + 10 + 22
  const r = 19
  const infPct = total > 0 ? infected / total : 0
  const clean = Math.max(0, total - infected)

  // Healthy base circle
  sf(p, C.riskLow)
  sd(p, C.riskLow)
  p.setLineWidth(0)
  p.circle(cx, cy, r, 'F')

  // Infected sector via polygon fan
  if (infPct > 0 && infPct <= 1) {
    const steps = Math.max(3, Math.round(infPct * 72))
    const startA = -Math.PI / 2
    const endA = startA + infPct * 2 * Math.PI
    const pts: number[] = [cx, cy]
    for (let s = 0; s <= steps; s++) {
      const a = startA + (s / steps) * (endA - startA)
      pts.push(cx + r * Math.cos(a), cy + r * Math.sin(a))
    }
    pts.push(cx, cy)
    try {
      sf(p, C.riskHigh)
      const ops = pts.reduce((acc, v, idx) => {
        if (idx % 2 === 0) {
          acc += idx === 0 ? `${v} ` : ` ${v} `
        } else {
          acc += `${v} ${idx === 1 ? 'm' : 'l'} `
        }
        return acc
      }, '')
      ;(p as any).internal.write(ops + 'f')
    } catch {
      /* silent */
    }
  }

  // Donut hole
  sf(p, C.cardBg)
  sd(p, C.cardBg)
  p.setLineWidth(0)
  p.circle(cx, cy, r * 0.54, 'F')

  // Centre label
  p.setFont('helvetica', 'bold')
  p.setFontSize(8)
  st(p, C.white)
  p.text(`${(infPct * 100).toFixed(1)}%`, cx, cy + 3, { align: 'center' })
  p.setFont('helvetica', 'normal')
  p.setFontSize(5)
  st(p, C.textMuted)
  p.text('infected', cx, cy + 7.5, { align: 'center' })

  // Legend
  const legX = cx + r + 14
  const legY = cy - 18
  ;[
    { lbl: 'Infected', cnt: infected, col: C.riskHigh },
    { lbl: 'Healthy', cnt: clean, col: C.riskLow },
    { lbl: 'Total', cnt: total, col: C.purple },
  ].forEach((item, i) => {
    const iy = legY + i * 13
    rRect(p, legX, iy, 7, 5.5, item.col, undefined, 0, 1)
    p.setFont('helvetica', 'bold')
    p.setFontSize(F.sm)
    st(p, item.col)
    p.text(item.lbl, legX + 10, iy + 4.5)
    p.setFont('helvetica', 'normal')
    p.setFontSize(F.sm)
    st(p, C.textPrimary)
    p.text(item.cnt.toLocaleString(), legX + 10 + p.getTextWidth(item.lbl) + 3, iy + 4.5)
  })

  return y + cardH + L.secGap
}

// ─────────────────────────────────────────────
//  RISK DISTRIBUTION BARS
// ─────────────────────────────────────────────

function drawRiskDistribution(p: jsPDF, results: ImageResult[], y: number, pW: number): number {
  if (results.length === 0) return y
  y = sectionBar(p, 'Risk Distribution', y, pW, C.orange)

  const counts = { low: 0, med: 0, high: 0 }
  results.forEach((r) => {
    const rv = r.risk.toLowerCase()
    if (rv.includes('high') || rv.includes('severe')) counts.high++
    else if (rv.includes('med') || rv.includes('mod')) counts.med++
    else counts.low++
  })

  const total = results.length
  const cardH = 46
  cardWrap(p, y, pW, cardH, C.orange)

  const chartX = L.mL + L.innerPad
  const chartY = y + 8
  const maxBarW = pW - L.mL - L.mR - L.innerPad * 2 - 55
  const barH = 8
  const barGap = 5

  ;[
    { lbl: 'Low Risk', cnt: counts.low, col: C.riskLow },
    { lbl: 'Medium Risk', cnt: counts.med, col: C.riskMed },
    { lbl: 'High Risk', cnt: counts.high, col: C.riskHigh },
  ].forEach((b, i) => {
    const bY = chartY + i * (barH + barGap)
    const fill = Math.max(2, (b.cnt / Math.max(total, 1)) * maxBarW)
    const pct = total > 0 ? ((b.cnt / total) * 100).toFixed(0) : '0'

    rRect(p, chartX + 38, bY, maxBarW, barH, C.cardBgLight, C.divider, 0.15, 2)
    rRect(p, chartX + 38, bY, fill, barH, b.col, undefined, 0, 2)

    p.setFont('helvetica', 'bold')
    p.setFontSize(F.sm)
    st(p, b.col)
    p.text(b.lbl, chartX, bY + 6)

    p.setFont('helvetica', 'normal')
    p.setFontSize(F.xs)
    st(p, C.textSecondary)
    p.text(`${b.cnt}  (${pct}%)`, chartX + 38 + maxBarW + 3, bY + 6)
  })

  return y + cardH + L.secGap
}

// ─────────────────────────────────────────────
//  HPV STATUS CARD
// ─────────────────────────────────────────────

function drawHPVStatusCard(p: jsPDF, results: ImageResult[], y: number, pW: number): number {
  if (results.length === 0) return y
  y = sectionBar(p, 'HPV Status Summary', y, pW, C.violet)

  const positive = results.filter((r) => (r.hpv || '').toLowerCase().includes('pos')).length
  const negative = results.length - positive
  const posPct = results.length > 0 ? ((positive / results.length) * 100).toFixed(1) : '0'

  const cardH = 28
  cardWrap(p, y, pW, cardH, C.violet)

  const bW = pW - L.mL - L.mR
  const col = bW / 3

  ;[
    { lbl: 'HPV Positive', val: positive.toString(), col: C.riskHigh },
    { lbl: 'HPV Negative', val: negative.toString(), col: C.riskLow },
    { lbl: 'Positive Rate', val: `${posPct}%`, col: C.violet },
  ].forEach((s, i) => {
    const sx = L.mL + i * col + col / 2
    p.setFont('helvetica', 'bold')
    p.setFontSize(F.statLbl)
    st(p, s.col)
    p.text(s.lbl.toUpperCase(), sx, y + 10, { align: 'center' })
    p.setFont('helvetica', 'bold')
    p.setFontSize(12)
    st(p, C.white)
    p.text(s.val, sx, y + 22, { align: 'center' })
  })

  return y + cardH + L.secGap
}

// ─────────────────────────────────────────────
//  EXTERNAL CHARTS  (html2canvas)
// ─────────────────────────────────────────────

async function drawExternalCharts(
  p: jsPDF,
  chartDivs: ChartDiv[],
  y: number,
  pW: number,
  pH: number
): Promise<number> {
  if (chartDivs.length === 0) return y
  y = sectionBar(p, 'Simulation Charts', y, pW, C.purpleGlow)

  for (const chart of chartDivs) {
    if (!chart.element) continue
    try {
      const canvas = await html2canvas(chart.element, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#0d1132',
      })
      const imgData = canvas.toDataURL('image/png')
      const imgProps = p.getImageProperties(imgData)
      const imgW = pW - L.mL - L.mR
      const imgH = Math.min((imgProps.height * imgW) / imgProps.width, 100)

      y = ensureSpace(p, y, imgH + 16, pH, pW, pageHeader)

      rRect(p, L.mL, y, pW - L.mL - L.mR, 7, C.cardBgAlt, C.purpleGlow, 0.3, 1.5)
      p.setFont('helvetica', 'bold')
      p.setFontSize(F.sectionH)
      st(p, C.purpleGlow)
      p.text(chart.title, L.mL + 5, y + 5.2)
      y += 9

      rRect(p, L.mL, y, imgW, imgH, C.cardBg, C.purple, 0.4, 1.5)
      p.addImage(imgData, 'PNG', L.mL, y, imgW, imgH)
      y += imgH + L.secGap
    } catch {
      console.warn(`Chart render failed: ${chart.title}`)
    }
  }
  return y
}

// ─────────────────────────────────────────────
//  IMAGE RESULTS TABLE
//  Thumbnails: aspect-ratio-preserving within 26×22 mm
// ─────────────────────────────────────────────

async function drawImageTable(
  p: jsPDF,
  results: ImageResult[],
  y: number,
  pW: number,
  pH: number
): Promise<number> {
  const hdrY = y
  y = sectionBar(p, 'Analysed Image Results', y, pW, C.pink)

  if (results.length === 0) {
    p.setFont('helvetica', 'italic')
    p.setFontSize(F.label)
    st(p, C.textMuted)
    p.text('No image results available.', L.mL + 4, y + 5)
    return y + 14
  }

  const tX = L.mL
  const tW = pW - L.mL - L.mR
  const THUMB = { w: 26, h: 22 }
  const ROW_H = THUMB.h + 6

  // Column definitions
  const COLS = [
    { w: 7 }, // #
    { w: THUMB.w + 6 }, // image
    { w: 36 }, // result
    { w: 34 }, // stage
    { w: 28 }, // risk
    { w: 0 }, // hpv — fills remainder
  ]
  const usedW = COLS.slice(0, -1).reduce((s, c) => s + c.w, 0)
  COLS[COLS.length - 1].w = tW - usedW

  const hdrColors: RGB[] = [C.textMuted, C.gold, C.cyan, C.green, C.orange, C.pink]
  const hdrLabels = ['#', 'Image', 'Result', 'Stage', 'Risk', 'HPV Status']

  // Header row
  rRect(p, tX, y - L.rowH + 2, tW, L.rowH, C.tableHeader, C.borderPurple, 0.3)
  let hx = tX + 3
  hdrLabels.forEach((lbl, ci) => {
    p.setFont('helvetica', 'bold')
    p.setFontSize(F.tableH)
    st(p, hdrColors[ci])
    p.text(lbl, hx, y)
    hx += COLS[ci].w
  })
  dLine(p, tX, y + L.rowH - 5, tX + tW, y + L.rowH - 5, C.purple, 0.4)
  y += L.rowH + 1

  for (let i = 0; i < results.length; i++) {
    const r = results[i]
    y = ensureSpace(p, y, ROW_H + 2, pH, pW, pageHeader)

    const fill: RGB = i % 2 === 0 ? C.tableRowA : C.tableRowB
    rRect(p, tX, y, tW, ROW_H, fill)

    let cx = tX + 3

    // # index
    p.setFont('helvetica', 'bold')
    p.setFontSize(F.sm)
    st(p, C.textMuted)
    p.text(`${i + 1}`, cx + 1, y + ROW_H / 2 + 2)
    cx += COLS[0].w

    // Thumbnail
    const thumbX = cx + 1
    const thumbY = y + (ROW_H - THUMB.h) / 2
    try {
      const imgEl = await loadImg(`http://127.0.0.1:8000/media/${r.image}`)
      const aspect = imgEl.naturalWidth / Math.max(imgEl.naturalHeight, 1)
      let tw = THUMB.w,
        th = THUMB.h
      if (aspect > THUMB.w / THUMB.h) {
        th = tw / aspect
      } else {
        tw = th * aspect
      }
      const ox = (THUMB.w - tw) / 2
      const oy = (THUMB.h - th) / 2
      rRect(p, thumbX, thumbY, THUMB.w, THUMB.h, C.cardBgAlt, C.borderPurple, 0.2, 1)
      p.addImage(imgEl, 'PNG', thumbX + ox, thumbY + oy, tw, th)
    } catch {
      rRect(p, thumbX, thumbY, THUMB.w, THUMB.h, C.cardBgAlt, C.borderPurple, 0.2, 1)
      p.setFont('helvetica', 'italic')
      p.setFontSize(F.xs)
      st(p, C.textMuted)
      p.text('No Image', thumbX + THUMB.w / 2, thumbY + THUMB.h / 2 + 1, { align: 'center' })
    }
    cx += COLS[1].w

    const midY = y + ROW_H / 2 + 2

    // Result
    p.setFont('helvetica', 'bold')
    p.setFontSize(F.tableCell)
    st(p, C.textDark)
    p.text(truncate(p, r.result || 'N/A', COLS[2].w - 4), cx, midY)
    cx += COLS[2].w

    // Stage
    p.setFont('helvetica', 'normal')
    p.setFontSize(F.tableCell)
    st(p, [48, 85, 58] as RGB)
    p.text(truncate(p, r.stage || 'N/A', COLS[3].w - 4), cx, midY)
    cx += COLS[3].w

    // Risk badge
    const rc = riskColor(r.risk || '')
    const bW2 = COLS[4].w - 6
    const bH2 = 7
    const bX2 = cx + 1
    const bY2 = y + (ROW_H - bH2) / 2
    rRect(p, bX2, bY2, bW2, bH2, rc, undefined, 0, 2)
    p.setFont('helvetica', 'bold')
    p.setFontSize(F.badge)
    st(p, C.white)
    p.text((r.risk || 'N/A').toUpperCase().slice(0, 8), bX2 + bW2 / 2, bY2 + 5, { align: 'center' })
    cx += COLS[4].w

    // HPV
    p.setFont('helvetica', 'bold')
    p.setFontSize(F.tableCell)
    const hpvPos = (r.hpv || '').toLowerCase().includes('pos')
    st(p, hpvPos ? C.riskHigh : C.riskLow)
    p.text(r.hpv || 'N/A', cx, midY)

    dLine(p, tX, y + ROW_H, tX + tW, y + ROW_H, C.hairline, 0.12)
    y += ROW_H + 1
  }

  // Outer table border
  sd(p, C.pink)
  p.setLineWidth(0.4)
  p.rect(tX, hdrY + L.secBarH + 4, tW, y - hdrY - L.secBarH - 4)

  return y + L.secGap
}

// ─────────────────────────────────────────────
//  SIGN-OFF  (lab / admin only)
// ─────────────────────────────────────────────

function drawSignOff(p: jsPDF, name: string, y: number, pW: number, pH: number): number {
  y = ensureSpace(p, y, 52, pH, pW, pageHeader)
  y = sectionBar(p, 'Lab Engineer Sign-Off', y, pW, C.pink)

  const bW = pW - L.mL - L.mR
  const bH = 42
  cardWrap(p, y, pW, bH, C.pink)

  // Name
  p.setFont('helvetica', 'bold')
  p.setFontSize(F.sm)
  st(p, C.textMuted)
  p.text('Lab Engineer:', L.mL + L.innerPad, y + 12)

  p.setFont('helvetica', 'bold')
  p.setFontSize(F.sectionH)
  st(p, C.pink)
  p.text(name || 'N/A', L.mL + L.innerPad + 30, y + 12)

  // Role pill
  const roleLabel = 'AUTHORISED SIGNATORY'
  const rpW = p.getTextWidth(roleLabel) + 6
  rRect(p, L.mL + L.innerPad, y + 16, rpW, 6.5, C.purpleDark, C.purpleGlow, 0.2, 1.5)
  p.setFont('helvetica', 'bold')
  p.setFontSize(F.xs)
  st(p, C.purpleGlow)
  p.text(roleLabel, L.mL + L.innerPad + rpW / 2, y + 21, { align: 'center' })

  // Signature line
  dLine(p, L.mL + L.innerPad, y + 30, L.mL + L.innerPad + 80, y + 30, C.pink, 0.4)
  p.setFont('helvetica', 'italic')
  p.setFontSize(F.xs)
  st(p, C.textMuted)
  p.text('Authorised Signature', L.mL + L.innerPad, y + 35)

  // Date
  const signDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  p.setFont('helvetica', 'bold')
  p.setFontSize(F.label)
  st(p, C.cyan)
  p.text(`Date: ${signDate}`, L.mL + bW - L.innerPad, y + 30, { align: 'right' })

  // Verified badge
  const vX = L.mL + bW - 36,
    vY = y + 6
  rRect(p, vX, vY, 30, 14, C.purpleDark, C.purple, 0.3, 2)
  p.setFont('helvetica', 'bold')
  p.setFontSize(6.5)
  st(p, C.white)
  p.text('VERIFIED', vX + 15, vY + 6, { align: 'center' })
  p.setFont('helvetica', 'normal')
  p.setFontSize(F.xs)
  st(p, C.purpleGlow)
  p.text('HPV Research Lab', vX + 15, vY + 11, { align: 'center' })

  return y + bH + L.secGap
}

// ─────────────────────────────────────────────
//  DISCLAIMER
// ─────────────────────────────────────────────

function drawDisclaimer(p: jsPDF, y: number, pW: number, pH: number): number {
  y = ensureSpace(p, y, 38, pH, pW, pageHeader)
  y = sectionBar(p, 'Disclaimer & Notes', y, pW, C.gold)

  const notes = [
    'This report is generated by the HPV Research Lab Simulation & Analysis Platform.',
    'All values are the result of mathematical simulation (SIR compartmental model).',
    'This document is NOT a substitute for clinical diagnosis or professional medical advice.',
    'Results must be reviewed and validated by a qualified medical professional.',
    '\u00a9 HPV Research Lab \u2014 Confidential and Proprietary. Unauthorised distribution is prohibited.',
  ]

  const bH = notes.length * L.lineH + L.innerPad * 2 + 3
  cardWrap(p, y, pW, bH, C.gold)

  notes.forEach((line, i) => {
    const hi = i === 0 || i === notes.length - 1
    p.setFont('helvetica', hi ? 'bold' : 'normal')
    p.setFontSize(F.sm)
    st(p, hi ? C.gold : C.textSecondary)
    p.text(`\u2022  ${line}`, L.mL + L.innerPad, y + L.innerPad + 4 + i * L.lineH)
  })

  return y + bH + L.secGap
}

// ─────────────────────────────────────────────
//  LOGO PLACEMENT  (inside header zone)
// ─────────────────────────────────────────────

async function drawLogo(p: jsPDF, url: string, pW: number): Promise<void> {
  if (!url) return
  try {
    const img = await loadImg(url)
    // Right side of header — size capped at 22×10 to stay within 22 mm header
    p.addImage(img, 'PNG', pW - L.mR - 22, 6, 18, 9)
  } catch {
    /* silent */
  }
}

// ─────────────────────────────────────────────
//  COVER PAGE
// ─────────────────────────────────────────────

async function drawCover(
  p: jsPDF,
  props: PDFReportProps,
  pW: number,
  pH: number,
  labName: string,
  role: AccountRole
): Promise<void> {
  const { logo_url, PatientDetails, patient_name, patient_id, overall_infection_rate } = props

  // Background
  rRect(p, 0, 0, pW, pH, C.pageBg)

  // Dot grid
  sd(p, [18, 22, 58] as RGB)
  p.setLineWidth(0.08)
  for (let gx = 0; gx <= pW; gx += 10) p.line(gx, 0, gx, pH)
  for (let gy = 0; gy <= pH; gy += 10) p.line(0, gy, pW, gy)

  // Top + bottom bands
  rRect(p, 0, 0, pW, 5, C.purple)
  rRect(p, 0, 5, pW, 1.5, C.violet)
  rRect(p, 0, 6.5, pW, 0.8, C.cyan)
  rRect(p, 0, pH - 4.5, pW, 3, C.cyan)
  rRect(p, 0, pH - 1.5, pW, 1.5, C.purple)

  // Card
  const cX = 14,
    cY = 14,
    cW = pW - 28,
    cH = pH - 28
  rRect(p, cX, cY, cW, cH, C.cardBg, C.purple, 0.5, 3)
  rRect(p, cX, cY, cW, 5, C.purple, undefined, 0, 3)

  // Logo
  if (logo_url) {
    try {
      const img = await loadImg(logo_url)
      p.addImage(img, 'PNG', cX + cW - 38, cY + 8, 28, 13)
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    } catch {console.log('error')}
  }

  // Lab title
  p.setFont('helvetica', 'bold')
  p.setFontSize(F.h1)
  st(p, C.white)
  p.text('HPV Research Lab', cX + cW / 2, cY + 28, { align: 'center' })

  p.setFont('helvetica', 'normal')
  p.setFontSize(F.h2)
  st(p, C.purpleGlow)
  p.text('Simulation & Analysis Platform', cX + cW / 2, cY + 37, { align: 'center' })

  dLine(p, cX + 18, cY + 42, cX + cW - 18, cY + 42, C.purple, 0.45)

  // Report type pill
  const pillW = 78,
    pillH = 9
  const pillX = cX + (cW - pillW) / 2
  const pillY = cY + 46
  rRect(p, pillX, pillY, pillW, pillH, C.purpleDark, C.purple, 0.3, 3)
  p.setFont('helvetica', 'bold')
  p.setFontSize(F.badge)
  st(p, C.white)
  p.text('PATIENT DIAGNOSTIC REPORT', pillX + pillW / 2, pillY + 6.2, { align: 'center' })

  // Patient fields (always shown on cover)
  const infoY = cY + 62
  const patFields: [string, string][] = [
    ['Patient Name', PatientDetails?.Name || patient_name || 'N/A'],
    ['Patient ID', PatientDetails?.ID || patient_id || 'N/A'],
    ['Gender', PatientDetails?.Gender || 'N/A'],
    ['Age', String(PatientDetails?.Age || 'N/A')],
    ['Blood Group', PatientDetails?.BloodGroup || 'N/A'],
    ['Sample Date', PatientDetails?.SampleDate || 'N/A'],
  ]

  patFields.forEach(([lbl, val], i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const ix = cX + 14 + col * (cW / 2)
    const iy = infoY + row * 14

    p.setFont('helvetica', 'bold')
    p.setFontSize(F.coverLbl)
    st(p, C.textMuted)
    p.text(lbl.toUpperCase(), ix, iy)

    p.setFont('helvetica', 'normal')
    p.setFontSize(F.coverVal)
    st(p, C.white)
    p.text(val, ix, iy + 6.5)
  })

  // Separator line
  const engBlockY = infoY + Math.ceil(patFields.length / 2) * 14 + 5
  dLine(p, cX + 14, engBlockY, cX + cW - 14, engBlockY, C.borderPurple, 0.25)

  // Lab engineer vs patient referred-by
  if (role === 'lab_engineer' || role === 'admin') {
    p.setFont('helvetica', 'bold')
    p.setFontSize(F.coverLbl)
    st(p, C.textMuted)
    p.text('LAB ENGINEER', cX + 14, engBlockY + 7)
    p.setFont('helvetica', 'normal')
    p.setFontSize(F.coverVal)
    st(p, C.cyan)
    p.text(labName || 'N/A', cX + 14, engBlockY + 14)
  } else {
    p.setFont('helvetica', 'bold')
    p.setFontSize(F.coverLbl)
    st(p, C.textMuted)
    p.text('REFERRED BY', cX + 14, engBlockY + 7)
    p.setFont('helvetica', 'normal')
    p.setFontSize(F.coverVal)
    st(p, C.textPrimary)
    p.text(PatientDetails?.ReferredBy || 'N/A', cX + 14, engBlockY + 14)
  }

  // Infection rate block
  const rateY = engBlockY + 22
  rRect(p, cX + 14, rateY, cW - 28, 28, C.cardBgAlt, C.orange, 0.3, 2)
  p.setFont('helvetica', 'bold')
  p.setFontSize(F.sm)
  st(p, C.textMuted)
  p.text('OVERALL INFECTION RATE', cX + cW / 2, rateY + 8, { align: 'center' })

  const rateCol: RGB =
    overall_infection_rate > 60 ? C.riskHigh : overall_infection_rate > 30 ? C.riskMed : C.riskLow
  p.setFont('helvetica', 'bold')
  p.setFontSize(22)
  st(p, rateCol)
  p.text(`${overall_infection_rate.toFixed(2)}%`, cX + cW / 2, rateY + 22, { align: 'center' })

  // Cover footer
  dLine(p, cX + 14, cY + cH - 12, cX + cW - 14, cY + cH - 12, C.borderPurple, 0.25)
  p.setFont('helvetica', 'normal')
  p.setFontSize(F.xs)
  st(p, C.textMuted)
  p.text(
    'CONFIDENTIAL  \u00b7  HPV Research Lab  \u00b7  www.hpvresearchlab.com',
    cX + cW / 2,
    cY + cH - 5,
    { align: 'center' }
  )
}

// ─────────────────────────────────────────────
//  JWT TOKEN HELPER
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
  const {
    logo_url,
    accountRole,
    overall_infection_rate,
    total_cells,
    total_infected_cells,
    image_results,
    S_1_Cal,
    S_2_Cal,
    I_Cal,
    R_Cal,
    C_Cal,
    R0_Cal,
    LabEngineerName,
    chartDivs = [],
  } = props

  // Role resolution — prop > JWT > default patient
  const decoded = decodedToken()
  const role: AccountRole =
    accountRole ??
    (decoded?.role as AccountRole) ??
    (decoded?.user_type as AccountRole) ??
    'patient'

  const labName: string =
    LabEngineerName ||
    (typeof decoded?.lab_engineer === 'string' ? decoded.lab_engineer : '') ||
    (typeof decoded?.username === 'string' ? decoded.username : '') ||
    'HPV Lab Engineer'

  const isLabOrAdmin = role === 'lab_engineer' || role === 'admin'

  // Init
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pW = pdf.internal.pageSize.getWidth()
  const pH = pdf.internal.pageSize.getHeight()

  // ─ Page 1: Cover
  await drawCover(pdf, props, pW, pH, labName, role)

  // ─ Page 2+: Report body
  pdf.addPage()
  pageHeader(pdf, pW)
  await drawLogo(pdf, logo_url, pW)

  let y = L.headerH + 8

  // Patient info (always)
  y = ensureSpace(pdf, y, 92, pH, pW, pageHeader)
  y = drawPatientInfo(pdf, props, y, pW)

  // Lab engineer block (lab/admin only)
  if (isLabOrAdmin) {
    y = ensureSpace(pdf, y, 32, pH, pW, pageHeader)
    y = drawLabEngineerInfo(pdf, labName, y, pW)
  }

  // Stats badges
  y = ensureSpace(pdf, y, 38, pH, pW, pageHeader)
  y = drawStatBadges(
    pdf,
    overall_infection_rate,
    total_cells,
    total_infected_cells,
    image_results.length,
    y,
    pW
  )

  // Infection rate bar
  y = ensureSpace(pdf, y, 34, pH, pW, pageHeader)
  y = drawInfectionBar(pdf, overall_infection_rate, y, pW)

  // Summary table
  y = ensureSpace(pdf, y, 120, pH, pW, pageHeader)
  y = drawSummaryTable(pdf, props, y, pW)

  // SIR compartment list
  y = ensureSpace(pdf, y, 82, pH, pW, pageHeader)
  y = drawSIRBlock(pdf, S_1_Cal, S_2_Cal, I_Cal, R_Cal, C_Cal, R0_Cal, y, pW)

  // SIR bar chart
  y = ensureSpace(pdf, y, 76, pH, pW, pageHeader)
  y = drawSIRBarChart(pdf, S_1_Cal, S_2_Cal, I_Cal, R_Cal, C_Cal, R0_Cal, y, pW)

  // Infection donut chart
  y = ensureSpace(pdf, y, 64, pH, pW, pageHeader)
  y = drawInfectionPieChart(pdf, total_cells, total_infected_cells, y, pW)

  // Risk distribution
  y = ensureSpace(pdf, y, 56, pH, pW, pageHeader)
  y = drawRiskDistribution(pdf, image_results, y, pW)

  // HPV status card
  y = ensureSpace(pdf, y, 40, pH, pW, pageHeader)
  y = drawHPVStatusCard(pdf, image_results, y, pW)

  // External charts
  y = await drawExternalCharts(pdf, chartDivs, y, pW, pH)

  // Image results
  y = await drawImageTable(pdf, image_results, y, pW, pH)

  // Sign-off (lab/admin only)
  if (isLabOrAdmin) {
    y = drawSignOff(pdf, labName, y, pW, pH)
  }

  // Disclaimer
  y = drawDisclaimer(pdf, y, pW, pH)

  // Add footers to all content pages (skip cover = page 1)
  const totalPages = (pdf as any).internal.getNumberOfPages()
  for (let pg = 2; pg <= totalPages; pg++) {
    pdf.setPage(pg)
    pageFooter(pdf, pW, pH, pg - 1, totalPages - 1)
  }

  return pdf.output('blob')
}

// ─────────────────────────────────────────────
//  END OF FILE
// ─────────────────────────────────────────────
