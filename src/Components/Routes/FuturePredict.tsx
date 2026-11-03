/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ImagePlus, LineChart, UploadCloud, X } from 'lucide-react'
import ResultDashboard from './ResultDashboard'
import FlowChart from './FlowChart'
import SimulationChart from './Graph'
import { Button, Card, CardHeader, Container, EmptyState, Field, Input, Modal, PageGuide, PageHeader, Spinner, useToast } from '../ui'
import { apiFetch } from '../../lib/api'
import { useAuth } from '../../lib/auth'

type FormParams = {
  recruitment_rate: number | ''
  natural_death_rate: number | ''
  transition_rate: number | ''
  recovery_proportion: number | ''
  cancer_progression_rate: number | ''
  stepSize: number | ''
  transmission_rate: number | ''
}

const FuturePredict = () => {
  const toast = useToast()
  const { user: User } = useAuth()

  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [results, setResults] = useState<any>(null)
  const [mainResult, setMainResult] = useState<any>(null)
  const [form, setForm] = useState<FormData | null>(null)
  const [showResult, setShowResult] = useState<boolean>(false)
  const [infectionRate, setInfectionRate] = useState<number | null>(null)
  const [PredictionParameters, setPredictionParameters] = useState<any>(null)
  const [showGraph, setshowGraph] = useState<boolean>(false)
  const [loading, setloading] = useState<boolean>(false)
  const [uploading, setUploading] = useState<boolean>(false)
  const [dragging, setDragging] = useState<boolean>(false)
  const [Model, setModel] = useState<boolean>(false)
  const [pendingAction, setPendingAction] = useState<string | null>(null)
  const [PatientDetails, setPatientDetails] = useState<any>({ Name: '', Age: 0, Gender: '' })
  const [params, setParams] = useState<FormParams>({
    recruitment_rate: 50,
    natural_death_rate: 0.014,
    transition_rate: 0.1,
    transmission_rate: 0.1,
    recovery_proportion: 0.98,
    cancer_progression_rate: 0.003,
    stepSize: 1,
  })

  const setFiles = useCallback((files: File[]) => {
    setImages(files)
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)))
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setFiles(Array.from(e.target.files))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const dropped = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'))
    if (dropped.length) setFiles(dropped)
  }

  const removeImage = (index: number) => setFiles(images.filter((_, i) => i !== index))

  const runUpload = async () => {
    const formData = new FormData()
    images.forEach((img) => formData.append('images', img))
    setForm(formData)
    setUploading(true)

    try {
      const response = await apiFetch('/simulation/real_prediction', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      setResults(data)
    } catch {
      toast.error('Image upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = () => {
    if (images.length === 0) return toast.error('Please upload at least one image')
    if (User?.role === 'lab_engineer') {
      setPendingAction('upload') // collect patient details first
      setModel(true)
      return
    }
    runUpload()
  }

  useEffect(() => {
    return () => previewUrls.forEach((url) => URL.revokeObjectURL(url))
  }, [previewUrls])

  useEffect(() => {
    if (!results || !form) return

    const handleResults = async () => {
      try {
        const response = await apiFetch('/simulation/ApplyModel', {
          method: 'POST',
          body: form,
        })
        const data = await response.json()
        setMainResult(data)
            setInfectionRate(
              data.total_cells > 0 ? data.total_infected_cells / data.total_cells : 0
            )
      } catch {
        toast.error('Prediction failed. Please try again.')
      }
    }

    handleResults()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, form])

  const handlePatiendDetails = (e: React.FormEvent) => {
    e.preventDefault()
    setModel(false)
    if (pendingAction === 'upload') runUpload()
  }

  const handlePredictionSubmit = async () => {
    const payload = { ...params, transmission_rate: infectionRate }
    setloading(true)
    setshowGraph(true)

    try {
      const response = await apiFetch('/simulation/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      setPredictionParameters(data)
    } catch {
      toast.error('Prediction failed. Please try again.')
    } finally {
      setloading(false)
    }
  }

  return (
    <Container className="space-y-8 py-10 sm:py-12">
      <PageHeader
        title="Check cell pictures and see what may happen next"
        description="Add microscope pictures of cervical cells. The website checks them for signs of HPV, then shows how the infection could change over time."
      />

      <PageGuide
        id="prediction"
        title="How this page works"
        steps={[
          'Add one or more cell pictures (JPG or PNG).',
          'Press the button and wait while the pictures are checked.',
          'Look at the results, then press “Predict graph” to see the forecast.',
          'Download the PDF report to keep your results.',
        ]}
      >
        You do not need to know any medical or computer terms. The website does the counting and the
        calculations for you. Results are for research and should be confirmed by a doctor.{' '}
        No pictures to try?{' '}
        <Link to="/sample-images" className="font-semibold text-brand underline-offset-2 hover:underline">
          Download sample images
        </Link>
      </PageGuide>

      {!results ? (
        <Card className="mx-auto max-w-3xl">
          <div className="p-5 sm:p-8">
            <label
              onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors focus-within:ring-2 focus-within:ring-brand/40 ${
                dragging ? 'border-brand bg-brand-soft' : 'border-line hover:border-brand hover:bg-surface-2'
              }`}
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand">
                <UploadCloud className="h-7 w-7" aria-hidden />
              </span>
              <span className="mt-4 text-base font-semibold text-ink">Click here, or drag your pictures into this box</span>
              <span className="mt-1 text-sm text-muted">PNG or JPG. You can add several pictures at once.</span>
              <input type="file" multiple accept="image/*" onChange={handleFileChange} className="sr-only" />
            </label>

            {previewUrls.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-bold text-ink">
                  Image preview <span className="font-medium text-muted">({previewUrls.length})</span>
                </h2>
                <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {previewUrls.map((url, idx) => (
                    <li key={url} className="group relative aspect-square overflow-hidden rounded-xl border border-line">
                      <img src={url} alt={`Selected image ${idx + 1}`} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        aria-label={`Remove image ${idx + 1}`}
                        className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white opacity-100 transition-opacity hover:bg-black/80 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              size="lg"
              full
              className="mt-8"
              loading={uploading}
              onClick={handleSubmit}
              icon={<ImagePlus className="h-5 w-5" />}
            >
              {uploading ? 'Uploading…' : 'Check my pictures'}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[420px_1fr]">
          <Card className="lg:sticky lg:top-24">
            <CardHeader title="Your progress" description="Follow each step from picture to forecast." />
            <div className="p-5 sm:p-6">
              <FlowChart
                showResult={showResult}
                Result={results}
                mainResult={mainResult}
                setshowResult={setShowResult}
                InfectionRate={infectionRate}
                params={params}
                setParams={setParams}
                handlePredictionSubmit={handlePredictionSubmit}
              />
            </div>
          </Card>

          <Card className="min-w-0">
            <CardHeader title="Simulation graph" description="Projected infection dynamics based on your images." icon={LineChart} />
            <div className="flex min-h-[460px] items-center justify-center p-4 sm:p-6">
              {!showGraph ? (
                <EmptyState
                  icon={LineChart}
                  title="Waiting for parameters"
                  description="Once the image analysis finishes, set the simulation parameters to generate the graph."
                />
              ) : loading ? (
                <Spinner label="Running simulation…" />
              ) : PredictionParameters?.data || PredictionParameters?.future_time ? (
                <SimulationChart
                  mainResult={mainResult}
                  Limitaions={''}
                  data={PredictionParameters}
                  startYear={2026}
                  PatientDetails={PatientDetails}
                />
              ) : (
                <EmptyState
                  icon={LineChart}
                  title="No graph yet"
                  description="Run the simulation to visualize infection dynamics."
                />
              )}
            </div>
          </Card>
        </div>
      )}

      {showResult && mainResult && <ResultDashboard setshowResult={setShowResult} data={mainResult} />}

      <Modal
        open={Model}
        onClose={() => setModel(false)}
        title="Patient information"
        description="These details appear on the generated report."
      >
        <form onSubmit={handlePatiendDetails} className="space-y-5">
          <Field label="Patient name">
            {(id) => (
              <Input
                id={id}
                placeholder="Enter name"
                onChange={(e) => setPatientDetails({ ...PatientDetails, Name: e.target.value })}
              />
            )}
          </Field>
          <Field label="Age">
            {(id) => (
              <Input
                id={id}
                type="number"
                min={0}
                placeholder="Enter age"
                onChange={(e) => setPatientDetails({ ...PatientDetails, Age: e.target.value })}
              />
            )}
          </Field>
          <fieldset>
            <legend className="mb-1.5 text-sm font-medium text-ink-2">Gender</legend>
            <div className="grid grid-cols-2 gap-3">
              {['male', 'female'].map((g) => (
                <label
                  key={g}
                  className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-line px-4 py-2.5 text-sm font-medium capitalize text-ink transition-colors has-[:checked]:border-brand has-[:checked]:bg-brand-soft has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/40"
                >
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    onChange={(e) => setPatientDetails({ ...PatientDetails, Gender: e.target.value })}
                    className="accent-[var(--brand)]"
                  />
                  {g}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex justify-end gap-3 pt-1">
            <Button variant="ghost" onClick={() => setModel(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Modal>
    </Container>
  )
}

export default FuturePredict
