import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  Legend as PieLegend,
} from 'recharts'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface PieChartForPDFProps {
  total_cells: number
  total_infected_cells: number
}

export const PieChartForPDF: React.FC<PieChartForPDFProps> = ({
  total_cells,
  total_infected_cells,
}) => {
  const data = [
    { name: 'Infected Cells', value: total_infected_cells },
    { name: 'Healthy Cells', value: total_cells - total_infected_cells },
  ]
  const COLORS = ['#FF6384', '#36A2EB']

  return (
    <div style={{ width: 500, height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
             
            ))}
          </Pie>
          <PieTooltip />
          <PieLegend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

interface LineChartForPDFProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
}

export const LineChartForPDF: React.FC<LineChartForPDFProps> = ({ data }) => {
  if (!data || data.length === 0) return <p>No data</p>

  // Pick only Infected, Recovered, Cancer for PDF
  return (
    <div style={{ width: 600, height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#88888844" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Infected" stroke="#ef4444" name="Infected" dot={false} />
          <Line type="monotone" dataKey="Recovered" stroke="#929e28" name="Recovered" dot={false} />
          <Line type="monotone" dataKey="Cancer" stroke="#646473" name="Cancer Cases" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
