type Stage = { label: string; sub?: string }
type Pipeline = { name: string; color: string; stages: Stage[] }

const PIPELINES: Pipeline[] = [
  {
    name: 'PROSPECT MINING',
    color: 'green',
    stages: [
      { label: 'Addressable\nMarket',   sub: 'TAM' },
      { label: 'Apollo /\nOutbound',    sub: 'Sequences' },
      { label: 'Qualified\nLeads',      sub: 'ICP fit' },
      { label: 'Deals',                 sub: 'Pipeline' },
      { label: 'Revenue',               sub: '€€€' },
    ],
  },
  {
    name: 'CONTENT REFINERY',
    color: 'purple',
    stages: [
      { label: 'Raw Ideas /\nRecordings', sub: 'Input' },
      { label: 'AI\nProcessing',          sub: 'Transform' },
      { label: 'Articles /\nPosts',        sub: 'Output' },
      { label: 'Traffic',                  sub: 'Reach' },
      { label: 'Leads',                    sub: 'Inbound' },
    ],
  },
  {
    name: 'GROWTH ENGINEERING',
    color: 'blue',
    stages: [
      { label: 'Manual\nProcesses', sub: 'Ops' },
      { label: 'Agent\nBuild',      sub: 'Claude' },
      { label: 'Automations',       sub: 'Workflows' },
      { label: 'Leverage\n×',       sub: 'Multiplier' },
      { label: 'Scaling\nCapacity', sub: 'Output↑' },
    ],
  },
]

const COLOR_MAP: Record<string, { text: string; border: string; bg: string; arrow: string }> = {
  green:  { text: 'text-green-400',  border: 'border-green-500/40',  bg: 'bg-green-950/30',  arrow: 'text-green-600' },
  purple: { text: 'text-purple-400', border: 'border-purple-500/40', bg: 'bg-purple-950/30', arrow: 'text-purple-600' },
  blue:   { text: 'text-blue-400',   border: 'border-blue-500/40',   bg: 'bg-blue-950/30',   arrow: 'text-blue-600' },
}

export default function ResourcePipeline() {
  return (
    <div className="panel p-4">
      <div className="panel-header -mx-4 -mt-4 mb-4">
        ◈ RESOURCE PIPELINES
      </div>

      <div className="flex flex-col gap-4">
        {PIPELINES.map(pipeline => {
          const c = COLOR_MAP[pipeline.color]
          return (
            <div key={pipeline.name}>
              <div className={`text-[10px] font-bold tracking-widest mb-2 ${c.text}`}>
                {pipeline.name}
              </div>
              <div className="flex items-center gap-1">
                {pipeline.stages.map((stage, i) => (
                  <div key={i} className="flex items-center gap-1 flex-1 min-w-0">
                    <div className={`flex-1 border rounded text-center px-1 py-1.5 ${c.border} ${c.bg} min-w-0`}>
                      <div className={`text-[9px] font-bold leading-tight ${c.text} whitespace-pre-line`}>
                        {stage.label}
                      </div>
                      {stage.sub && (
                        <div className="text-[8px] text-text-secondary mt-0.5">{stage.sub}</div>
                      )}
                    </div>
                    {i < pipeline.stages.length - 1 && (
                      <span className={`text-xs flex-shrink-0 ${c.arrow}`}>→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
