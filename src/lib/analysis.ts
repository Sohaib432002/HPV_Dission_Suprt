/** Shape of the picture-analysis response (POST /simulation/ApplyModel). */

export interface SlideMatch {
  slide: string
  similarity: number
}

export interface ImageRow {
  image: string
  error?: string
  /** True when the picture belongs to the CCAgT reference set and has expert counts. */
  annotated?: boolean
  nuclei?: number
  clusters?: number
  satellites?: number
  agnor_dots?: number
  dots_per_nucleus?: number | null
  /** Share (0-100) of reference pictures with the same or fewer AgNOR dots per nucleus. */
  reference_percentile?: number | null
  best_slide?: string
  best_slide_similarity?: number
  slide_matches?: SlideMatch[]
}

export interface ReferenceSummary {
  pictures: number
  p25: number
  median: number
  p75: number
  p90: number
}

export interface AnalysisResult {
  images_analyzed: number
  annotated_images: number
  nuclei: number
  agnor_dots: number
  dots_per_nucleus: number | null
  reference: ReferenceSummary
  note: string
  image_results: ImageRow[]
}

/** Plain-words verdict for a dots-per-nucleus value, relative to the reference pictures. */
export function describeDots(value: number | null | undefined, ref: ReferenceSummary | undefined) {
  if (value == null || !ref) return null
  if (value <= ref.p25) return { label: 'Lower than usual', tone: 'brand' as const }
  if (value <= ref.p75) return { label: 'Typical', tone: 'info' as const }
  if (value <= ref.p90) return { label: 'Higher than usual', tone: 'warn' as const }
  return { label: 'Much higher than usual', tone: 'danger' as const }
}
