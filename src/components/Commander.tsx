type Skill = { name: string; filled: number; total: number }
type SkillTree = { category: string; skills: Skill[] }

const SKILL_TREES: SkillTree[] = [
  {
    category: 'THINKER',
    skills: [
      { name: 'Original Thought',  filled: 2, total: 5 },
      { name: 'Domain Knowledge',  filled: 3, total: 5 },
      { name: 'Strategic Vision',  filled: 1, total: 5 },
    ],
  },
  {
    category: 'COMMUNICATOR',
    skills: [
      { name: 'Writing Craft',     filled: 1, total: 5 },
      { name: 'Public Voice',      filled: 2, total: 5 },
      { name: 'Storytelling',      filled: 0, total: 5 },
    ],
  },
  {
    category: 'BUILDER',
    skills: [
      { name: 'Agent Architecture', filled: 3, total: 5 },
      { name: 'Systems Thinking',   filled: 2, total: 5 },
      { name: 'Leverage',           filled: 1, total: 5 },
    ],
  },
  {
    category: 'LEADER',
    skills: [
      { name: 'Team Amplification', filled: 2, total: 5 },
      { name: 'Network',            filled: 1, total: 5 },
      { name: 'Revenue Command',    filled: 2, total: 5 },
    ],
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  THINKER:      'text-purple-400',
  COMMUNICATOR: 'text-cyan-400',
  BUILDER:      'text-blue-400',
  LEADER:       'text-amber-400',
}

function SkillBar({ filled, total }: { filled: number; total: number }) {
  return (
    <span className="font-mono text-[10px]">
      {'■'.repeat(filled)}
      {'□'.repeat(total - filled)}
    </span>
  )
}

export default function Commander() {
  return (
    <div className="panel p-4 flex flex-col gap-3">
      <div className="panel-header -mx-4 -mt-4 mb-2">
        ◈ COMMANDER — BRIDGE
      </div>

      {/* Identity card */}
      <div className="flex items-center gap-3 pb-3 border-b border-border-dim">
        <div className="w-10 h-10 rounded-full bg-blue-900/60 border border-blue-500/40 flex items-center justify-center text-lg glow-blue flex-shrink-0">
          G
        </div>
        <div>
          <div className="text-sm font-bold text-text-primary text-glow-blue">GREGOR SPIELMANN</div>
          <div className="text-[10px] text-text-secondary">Cofounder · Head of Sales · Adasight Colony</div>
          <div className="flex gap-2 mt-1">
            <span className="text-[9px] bg-blue-900/40 text-blue-400 px-1.5 py-0.5 rounded">COMMANDER</span>
            <span className="text-[9px] bg-amber-900/40 text-amber-400 px-1.5 py-0.5 rounded">HUNTER</span>
          </div>
        </div>
      </div>

      {/* Skill trees */}
      <div className="flex flex-col gap-3">
        {SKILL_TREES.map(tree => (
          <div key={tree.category}>
            <div className={`text-[10px] font-bold tracking-widest mb-1 ${CATEGORY_COLORS[tree.category]}`}>
              {tree.category}
            </div>
            <div className="flex flex-col gap-0.5 pl-2">
              {tree.skills.map(skill => (
                <div key={skill.name} className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-text-secondary flex-1">
                    {'├─ '}{skill.name}
                  </span>
                  <span className={`${CATEGORY_COLORS[tree.category]}`}>
                    <SkillBar filled={skill.filled} total={skill.total} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Status footer */}
      <div className="border-t border-border-dim pt-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 pulse-green inline-block" />
          <span className="text-[10px] text-green-400">ACTIVE ON BRIDGE</span>
        </div>
        <span className="text-[10px] text-text-secondary">Barcelona · UTC+2</span>
      </div>
    </div>
  )
}
