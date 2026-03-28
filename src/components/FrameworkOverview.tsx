import { Layers, Route, ShieldCheck, Sparkles, RefreshCw, User, Code, Brain, Settings, Database, Bug, Rocket, Palette, Users, FileText, Zap } from 'lucide-react'
import { useSkills, Skill } from '../hooks/useSkills'

const iconMap: Record<string, React.ElementType> = {
  analyst: Brain,
  pm: Settings,
  po: FileText,
  sm: Users,
  architect: Code,
  dev: Code,
  qa: Bug,
  devops: Rocket,
  'ux-design-expert': Palette,
  'data-engineer': Database,
  'meeting-analyst': FileText,
  'aiox-master': Zap,
  'squad-creator': Users,
  starter: Rocket
}

const pillars = [
  {
    icon: Layers,
    title: 'Framework interno',
    text: 'Estrutura de agents + skills organizada com manifesto, padrões e pasta oficial consolidada.'
  },
  {
    icon: Route,
    title: 'Roteamento claro',
    text: 'Cada pedido pode ser encaminhador para o papel certo: analyst, pm, architect, dev, qa, devops e outros.'
  },
  {
    icon: ShieldCheck,
    title: 'Governança',
    text: 'O sistema já possui standards, checklist de qualidade, mapa de handoff e playbook de fluxos.'
  },
  {
    icon: Sparkles,
    title: 'Pronto para evoluir',
    text: 'A base já suporta expansão com novas skills, squads, exemplos de uso e integração operacional.'
  }
]

const coreFiles = [
  'Skills/EXECUTIVE-SUMMARY.md',
  'Skills/SYSTEM-MANIFEST.md',
  'Skills/official/INDEX.md',
  'Skills/official/QUICK-ROUTING.md'
]

interface SkillCardProps {
  skill: Skill
}

function SkillCard({ skill }: SkillCardProps) {
  const Icon = iconMap[skill.id] || User
  
  return (
    <div className="glass rounded-xl p-4 border card-hover group">
      <div className="flex items-start gap-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
          style={{ backgroundColor: `${skill.color}20`, color: skill.color }}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-openclaw-text text-sm">{skill.name}</h4>
          <p className="text-xs text-openclaw-textMuted mt-1 line-clamp-2">{skill.description}</p>
          {skill.commands && skill.commands.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {skill.commands.slice(0, 3).map(cmd => (
                <span 
                  key={cmd}
                  className="px-2 py-0.5 rounded text-xs bg-openclaw-bg border border-openclaw-border text-openclaw-textMuted"
                >
                  {cmd}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function FrameworkOverview() {
  const { skills, loading, refresh } = useSkills()

  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-5 border">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-openclaw-textMuted mb-2">Framework</p>
            <h2 className="text-xl font-semibold text-openclaw-text">Skills & Agents Framework</h2>
            <p className="text-sm text-openclaw-textMuted mt-2 max-w-3xl">
              O projeto agora tem uma camada estruturada de agents, skills, fluxos e governança. 
              A base foi convertida dos arquivos originais e consolidada numa pasta oficial pronta para evolução.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={refresh}
              className="p-2 rounded-lg hover:bg-openclaw-cardHover text-openclaw-textMuted hover:text-openclaw-text transition-colors"
              title="Atualizar skills"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="px-3 py-1.5 rounded-full bg-openclaw-primary/10 text-openclaw-primary text-xs font-medium border border-openclaw-primary/20">
              {skills.length} skills
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {pillars.map((item) => (
          <div key={item.title} className="glass rounded-xl p-5 border card-hover">
            <div className="w-11 h-11 rounded-lg bg-openclaw-primary/10 text-openclaw-primary flex items-center justify-center mb-4">
              <item.icon className="w-5 h-5" />
            </div>
            <h3 className="text-openclaw-text font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-openclaw-textMuted leading-6">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="glass rounded-xl p-5 border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-openclaw-text font-semibold">Skills Disponíveis</h3>
          <span className="text-xs text-openclaw-textMuted">
            Clique para usar • Arrastar para reordernar
          </span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="w-6 h-6 animate-spin text-openclaw-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {skills.map(skill => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-5 border">
          <h3 className="text-openclaw-text font-semibold mb-3">Arquivos-chave</h3>
          <div className="space-y-2">
            {coreFiles.map((file) => (
              <div key={file} className="px-3 py-2 rounded-lg bg-openclaw-bg border border-openclaw-border text-sm text-openclaw-textMuted font-mono">
                {file}
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-5 border">
          <h3 className="text-openclaw-text font-semibold mb-3">Fluxo recomendado</h3>
          <div className="flex flex-wrap gap-2 text-sm">
            {['analyst', 'pm', 'po', 'sm', 'architect', 'dev', 'qa', 'devops'].map((step, index, arr) => (
              <div key={step} className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-openclaw-accent/10 text-openclaw-accent border border-openclaw-accent/20">
                  {step}
                </span>
                {index < arr.length - 1 && <span className="text-openclaw-textMuted">→</span>}
              </div>
            ))}
          </div>
          <p className="text-sm text-openclaw-textMuted mt-4 leading-6">
            Para pedidos simples, use o papel mais especializado. Para coordenação entre vários domínios, use o `aiox-master`.
          </p>
        </div>
      </div>
    </div>
  )
}