import { Users, BookOpen, Award, TrendingUp } from 'lucide-react'

export interface Stat {
  icon: any // React component
  value: string
  label: string
  color: string
}

export const stats: Stat[] = [
  {
    icon: Users,
    value: '25K+',
    label: 'Active Learners',
    color: 'bg-gradient-to-r from-blue-400 to-indigo-500',
  },
  {
    icon: BookOpen,
    value: '120+',
    label: 'Lessons Available',
    color: 'bg-gradient-to-r from-emerald-400 to-cyan-400',
  },
  {
    icon: Award,
    value: '18K+',
    label: 'Certificates Earned',
    color: 'bg-gradient-to-r from-purple-400 to-violet-500',
  },
  {
    icon: TrendingUp,
    value: '98%',
    label: 'Success Rate',
    color: 'bg-gradient-to-r from-orange-400 to-pink-400',
  },
]
