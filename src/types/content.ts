export interface ContentData {
  hero: HeroContent
  about: AboutContent
  projects: ProjectContent[]
  skills: SkillsContent
  contact: ContactContent
  metadata: MetadataContent
}

export interface HeroContent {
  name: string
  tagline: string
  cta: CTAButton[]
}

export interface CTAButton {
  text: string
  link: string
  primary?: boolean
}

export interface AboutContent {
  bio: string
  photo: string
  experience: ExperienceItem[]
  education: EducationItem[]
}

export interface ExperienceItem {
  title: string
  company: string
  period: string
  description: string
}

export interface EducationItem {
  degree: string
  institution: string
  year: string
  gpa?: string
}

export interface ProjectContent {
  id: string
  name: string
  description: string
  technologies: string[]
  links: ProjectLinks
  featured: boolean
  slug: string
  date?: string
  dateValue?: number
}

export interface ProjectLinks {
  repository?: string
  demo?: string
  documentation?: string
}

export interface SkillsContent {
  categories: SkillCategory[]
}

export interface SkillCategory {
  name: string
  skills: Skill[]
}

export interface Skill {
  name: string
  proficiency: number
}

export interface ContactContent {
  email: string
  linkedin?: string
  github?: string
  formUrl?: string
  social: SocialLink[]
}

export interface SocialLink {
  platform: string
  url: string
}

export interface MetadataContent {
  title: string
  description: string
  keywords: string[]
  author: string
}

export interface ProjectDetailContent {
  title: string
  role: string
  techStack: string
  period?: string
  executiveSummary: string
  achievements: ProjectAchievement[]
  impact: string
  technologies: string[]
  duration?: string
  team?: string
  lessonsLearned?: string
}

export interface ProjectAchievement {
  title: string
  challenge: string
  solution: string
  result: string
}
