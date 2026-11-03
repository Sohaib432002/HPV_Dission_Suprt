import { Spinner } from '../ui'

const Processing = ({ label = 'Processing…' }: { label?: string }) => (
  <Spinner label={label} className="py-6" />
)

export default Processing
