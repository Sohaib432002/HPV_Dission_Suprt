import { useMemo, useState } from 'react'
import {
  Activity,
  BarChart3,
  ExternalLink,
  FileText,
  FlaskConical,
  LogIn,
  Microscope,
  Search,
  TriangleAlert,
  Users,
} from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  CardHeader,
  Container,
  EmptyState,
  Input,
  LinkButton,
  PageGuide,
  PageHeader,
  Skeleton,
  StatCard,
} from '../ui'
import { useAuth } from '../../lib/auth'
import { useReports } from '../../lib/useReports'

interface Patient {
  id: number
  name: string
  status: string
}

export default function LabEngineerDashboard() {
  const { isAuth } = useAuth()
  const { reports, loading, error, reload } = useReports(isAuth)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [query, setQuery] = useState('')

  // Patients are derived from the report file names (HPV_Report_<name>.pdf).
  const patients = useMemo(() => {
    const map: Record<string, Patient> = {}
    reports.forEach((r) => {
      const name = r.document.split('/').pop()?.split('_')[2]?.replace(/\.pdf$/i, '') || 'Unknown'
      if (!map[name]) map[name] = { id: r.id, name, status: 'Analyzed' }
    })
    return Object.values(map)
  }, [reports])

  const visiblePatients = patients.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))

  const selectedReports = selectedPatient
    ? reports.filter((r) => r.document.includes(selectedPatient.name.replace(' ', '_')))
    : []

  if (!isAuth) {
    return (
      <Container className="py-16">
        <Card>
          <EmptyState
            icon={LogIn}
            title="Please log in"
            description="Sign in with a lab engineer account to manage patients and reports."
            action={<LinkButton to="/Login">Log in</LinkButton>}
          />
        </Card>
      </Container>
    )
  }

  return (
    <Container className="space-y-8 py-10 sm:py-12">
      <PageHeader
        title="Lab engineer dashboard"
        description="See the patients you have worked with and open their saved reports."
        action={
          <div className="flex flex-wrap gap-3">
            <LinkButton to="/future-predict" variant="secondary" size="sm">
              <Microscope className="h-4 w-4" aria-hidden /> New prediction
            </LinkButton>
            <LinkButton to="/simulation" size="sm">
              <FlaskConical className="h-4 w-4" aria-hidden /> Simulation lab
            </LinkButton>
          </div>
        }
      />

      <PageGuide
        id="lab-dashboard"
        title="What can I do here?"
        steps={[
          'Pick a patient from the list on the left.',
          'Their saved reports appear on the right.',
          'Press a report to open it as a PDF.',
          'Use the buttons at the top to check new pictures or try the simulation.',
        ]}
      >
        This page is your overview. “Processed cases” is the number of reports saved so far.
      </PageGuide>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total patients" value={loading ? '–' : patients.length} icon={Users} />
        <StatCard label="Processed cases" value={loading ? '–' : reports.length} icon={Activity} tone="info" />
        <StatCard label="Accuracy" value="84%" icon={BarChart3} tone="violet" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader
            title="Patient queue"
            description={`${patients.length} patient${patients.length === 1 ? '' : 's'} with reports`}
            icon={Users}
          />
          <div className="border-b border-line p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search patients"
                aria-label="Search patients"
                className="pl-9"
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-2 p-4">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14" />
              ))}
            </div>
          ) : error ? (
            <EmptyState
              icon={TriangleAlert}
              title="Could not load patients"
              description={error}
              action={<Button onClick={reload}>Try again</Button>}
            />
          ) : visiblePatients.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No patients found"
              description={patients.length ? 'Try a different search term.' : 'Patients appear here once reports are generated.'}
            />
          ) : (
            <ul className="scrollbar-thin max-h-[440px] divide-y divide-line overflow-y-auto">
              {visiblePatients.map((p) => {
                const active = selectedPatient?.id === p.id
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedPatient(p)}
                      aria-pressed={active}
                      className={`flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors ${
                        active ? 'bg-brand-soft' : 'hover:bg-surface-2'
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-2 text-sm font-bold text-ink-2">
                          {p.name.slice(0, 2).toUpperCase()}
                        </span>
                        <span className="truncate font-semibold text-ink">{p.name}</span>
                      </div>
                      <Badge tone="brand">{p.status}</Badge>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader title="Patient details" description="Select a patient to review their reports." icon={FileText} />
          {selectedPatient ? (
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand text-lg font-bold text-brand-fg">
                  {selectedPatient.name.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-ink">{selectedPatient.name}</h3>
                  <Badge tone="brand">{selectedPatient.status}</Badge>
                </div>
              </div>

              <h4 className="mt-6 text-sm font-bold text-ink">Reports</h4>
              {selectedReports.length > 0 ? (
                <ul className="scrollbar-thin mt-3 max-h-72 space-y-2 overflow-y-auto">
                  {selectedReports.map((r) => (
                    <li key={r.id}>
                      <a
                        href={r.document}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3 text-sm transition-colors hover:border-brand hover:bg-brand-soft"
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-semibold text-ink">{r.result}</span>
                          <span className="text-muted">{new Date(r.date).toLocaleDateString()}</span>
                        </span>
                        <ExternalLink className="h-4 w-4 shrink-0 text-brand" aria-hidden />
                        <span className="sr-only">Open report PDF</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted">No reports available.</p>
              )}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No patient selected"
              description="Choose a patient from the queue to see their details and reports."
            />
          )}
        </Card>
      </div>
    </Container>
  )
}
