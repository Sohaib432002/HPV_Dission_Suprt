import { useMemo, useState } from 'react'
import { CalendarDays, Download, FileText, LogIn, Search, TriangleAlert } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  CardHeader,
  Container,
  EmptyState,
  Input,
  LinkButton,
  PageHeader,
  Skeleton,
  StatCard,
} from '../ui'
import { useAuth } from '../../lib/auth'
import { useReports } from '../../lib/useReports'

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

export default function PatientDashboard() {
  const { user, isAuth } = useAuth()
  const { reports, loading, error, reload } = useReports(isAuth)
  const [query, setQuery] = useState('')

  const patient = {
    name: user?.username || 'Anonymous',
    id: user?.user_id || 'Unknown',
    age: user?.age || 'Unknown',
    gender: user?.gender || 'Unknown',
  }

  const sorted = useMemo(
    () => [...reports].sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [reports]
  )
  const visible = sorted.filter((r) =>
    `${r.result} ${new Date(r.date).toLocaleDateString()}`.toLowerCase().includes(query.toLowerCase())
  )

  const downloadReport = (url: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = url.split('/').pop() || 'report.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!isAuth) {
    return (
      <Container className="py-16">
        <Card>
          <EmptyState
            icon={LogIn}
            title="Please log in"
            description="Sign in to view your patient details and download your reports."
            action={<LinkButton to="/Login">Log in</LinkButton>}
          />
        </Card>
      </Container>
    )
  }

  return (
    <Container className="space-y-8 py-10 sm:py-12">
      <PageHeader
        title={`Welcome, ${patient.name}`}
        description="View your medical reports and download them instantly."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total reports" value={loading ? '–' : reports.length} icon={FileText} />
        <StatCard
          label="Latest report"
          value={sorted[0] ? new Date(sorted[0].date).toLocaleDateString() : '—'}
          icon={CalendarDays}
          tone="info"
        />
        <StatCard label="Patient ID" value={patient.id} icon={FileText} tone="violet" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="h-fit p-6">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand text-lg font-bold text-brand-fg">
              {initials(patient.name)}
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-ink">{patient.name}</h2>
              <Badge tone="brand">Patient</Badge>
            </div>
          </div>
          <dl className="mt-6 divide-y divide-line text-sm">
            {[
              ['Patient ID', patient.id],
              ['Age', patient.age],
              ['Gender', patient.gender],
            ].map(([k, v]) => (
              <div key={k as string} className="flex justify-between py-3">
                <dt className="text-muted">{k}</dt>
                <dd className="font-semibold capitalize text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card>
          <CardHeader
            title="Previous reports"
            description="Every analysis saved to your account."
            action={
              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search reports"
                  aria-label="Search reports"
                  className="h-10 pl-9"
                />
              </div>
            }
          />

          {loading ? (
            <div className="space-y-3 p-5 sm:p-6">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-[72px]" />
              ))}
            </div>
          ) : error ? (
            <EmptyState
              icon={TriangleAlert}
              title="Could not load reports"
              description={error}
              action={<Button onClick={reload}>Try again</Button>}
            />
          ) : visible.length === 0 ? (
            <EmptyState
              icon={FileText}
              title={reports.length === 0 ? 'No reports yet' : 'No matching reports'}
              description={
                reports.length === 0
                  ? 'Reports appear here once an analysis has been completed for you.'
                  : 'Try a different search term.'
              }
            />
          ) : (
            <ul className="divide-y divide-line">
              {visible.map((report) => (
                <li
                  key={report.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6"
                >
                  <div className="flex min-w-0 items-center gap-3.5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                      <FileText className="h-5 w-5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">{report.result}</p>
                      <p className="text-sm text-muted">{new Date(report.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => downloadReport(report.document)}
                    icon={<Download className="h-4 w-4" />}
                  >
                    Download
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </Container>
  )
}
