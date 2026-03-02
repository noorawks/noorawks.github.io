/**
 * ContentReader Service
 * Handles reading and parsing README.md file with markdown processing
 */

import { marked } from 'marked'
import DOMPurify from 'dompurify'
import type { ContentData, ProjectDetailContent, ProjectContent } from '../types/content'

export class ContentReader {

  /**
   * Load and parse README file
   */
  async loadContent(): Promise<ContentData> {
    try {
      const response = await fetch('/README.md')
      
      if (!response.ok) {
        throw new ContentNotFoundError('README.md tidak ditemukan')
      }

      const markdown = await response.text()
      const contentData = this.parseContent(markdown)
      
      return contentData
    } catch (error) {
      if (error instanceof ContentNotFoundError) {
        throw error
      }
      throw new ParseError(`Gagal memproses README: ${error}`)
    }
  }

  /**
   * Parse markdown string to HTML with sanitization
   */
  parseMarkdown(markdown: string): string {
    const html = marked.parse(markdown, { async: false }) as string
    return DOMPurify.sanitize(html)
  }

  /**
   * Extract specific section from README content
   */
  extractSection(content: string, sectionName: string): string {
    const sections = content.split(/^## /m)
    const section = sections.find(s => 
      s.trim().toLowerCase().startsWith(sectionName.toLowerCase())
    )
    
    if (!section) {
      return ''
    }
    
    const lines = section.split('\n')
    lines.shift()
    
    return lines.join('\n').trim()
  }

  /**
   * Parse full README content into ContentData structure
   */
  private parseContent(markdown: string): ContentData {
    const heroSection = this.extractSection(markdown, 'Hero') || markdown.split('##')[0] || ''
    const aboutSection = this.extractSection(markdown, 'About')
    const projectsSection = this.extractSection(markdown, 'Projects')
    const skillsSection = this.extractSection(markdown, 'Skills')
    const contactSection = this.extractSection(markdown, 'Contact')

    return {
      hero: this.parseHeroSection(heroSection),
      about: this.parseAboutSection(aboutSection),
      projects: this.parseProjectsSection(projectsSection),
      skills: this.parseSkillsSection(skillsSection),
      contact: this.parseContactSection(contactSection),
      metadata: this.parseMetadata(markdown)
    }
  }

  private parseHeroSection(_content: string): any {
    const lines = _content.trim().split('\n').filter(l => l.trim())
    return {
      name: lines[0]?.replace(/^#\s*/, '') || 'Portfolio',
      tagline: lines[1] || 'Software Engineer',
      cta: []
    }
  }

  private parseAboutSection(content: string): any {
    const bioMatch = content.match(/^([\s\S]*?)(?=###|$)/)
    const bioText = bioMatch ? bioMatch[1].trim() : content
    
    const experienceMatch = content.match(/###\s+Experience\s*\n([\s\S]*?)(?=###|##|$)/i)
    const experience: any[] = []
    
    if (experienceMatch && experienceMatch[1]) {
      const expText = experienceMatch[1]
      const expItems = expText.split(/\n(?=-\s+\*\*)/).filter(item => item.trim())
      
      expItems.forEach(item => {
        const titleMatch = item.match(/-\s+\*\*(.+?)\*\*\s+at\s+(.+?)\s+\((.+?)\)/)
        if (titleMatch) {
          const lines = item.split('\n')
          const description = lines.slice(1).join(' ').trim()
          
          experience.push({
            title: titleMatch[1].trim(),
            company: titleMatch[2].trim(),
            period: titleMatch[3].trim(),
            description: description
          })
        }
      })
    }
    
    const educationMatch = content.match(/###\s+Education\s*\n([\s\S]*?)(?=###|##|$)/i)
    const education: any[] = []
    
    if (educationMatch && educationMatch[1]) {
      const eduText = educationMatch[1]
      const eduRegex = /-\s+\*\*(.+?)\*\*\s+-\s+(.+?)\s+\((\d{4})\)(?:\s+-\s+GPA\s+([\d.]+))?/g
      let match
      
      while ((match = eduRegex.exec(eduText)) !== null) {
        education.push({
          degree: match[1].trim(),
          institution: match[2].trim(),
          year: match[3].trim(),
          gpa: match[4] ? match[4].trim() : undefined
        })
      }
    }
    
    return {
      bio: this.parseMarkdown(bioText),
      photo: '/profile-pic.jpg',
      experience,
      education
    }
  }

  private parseProjectsSection(content: string): any[] {
    if (!content.trim()) {
      return []
    }

    const projects: any[] = []
    const projectSections = content.split(/^### /m).filter(s => s.trim())
    
    projectSections.forEach((section, index) => {
      const lines = section.split('\n')
      const name = lines[0]?.trim()
      
      if (!name) return
      
      let description = ''
      let i = 1
      while (i < lines.length && lines[i]?.trim() && !lines[i]?.startsWith('**')) {
        description += (lines[i]?.trim() || '') + ' '
        i++
      }
      description = description.trim()
      
      const techLine = lines.find(l => l.startsWith('**Technologies**:'))
      const technologies = techLine 
        ? techLine.replace('**Technologies**:', '').split(',').map(t => t.trim())
        : []
      
      const linksLine = lines.find(l => l.startsWith('**Links**:'))
      const links: any = {}
      
      if (linksLine) {
        const repoMatch = linksLine.match(/\[Repository\]\(([^)]+)\)/)
        const demoMatch = linksLine.match(/\[Demo\]\(([^)]+)\)/)
        const docsMatch = linksLine.match(/\[Documentation\]\(([^)]+)\)/)
        
        if (repoMatch) links.repository = repoMatch[1]
        if (demoMatch) links.demo = demoMatch[1]
        if (docsMatch) links.documentation = docsMatch[1]
      }
      
      const slug = name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      projects.push({
        id: `project-${index + 1}`,
        name,
        description,
        technologies,
        links,
        featured: index < 3,
        slug
      })
    })
    
    return projects
  }

  private parseSkillsSection(content: string): any {
    if (!content.trim()) {
      return {
        categories: []
      }
    }

    const categories: any[] = []
    const categorySections = content.split(/^### /m).filter(s => s.trim())
    
    categorySections.forEach(section => {
      const lines = section.split('\n')
      const categoryName = lines[0]?.trim()
      
      if (!categoryName) return
      
      const skills: any[] = []
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i]?.trim()
        if (!line || !line.startsWith('-')) continue
        
        const skillText = line.replace(/^-\s*/, '')
        let skillName = skillText
        let proficiency = 3
        
        const proficiencyMatch = skillText.match(/\((?:Proficiency:\s*)?(\d+)(?:\/5|%)?\)/)
        if (proficiencyMatch && proficiencyMatch[1]) {
          proficiency = parseInt(proficiencyMatch[1])
          skillName = skillText.replace(/\s*\((?:Proficiency:\s*)?\d+(?:\/5|%)?\)/, '').trim()
        }
        
        skills.push({
          name: skillName,
          proficiency
        })
      }
      
      if (skills.length > 0) {
        categories.push({
          name: categoryName,
          skills
        })
      }
    })
    
    return {
      categories
    }
  }

  private parseContactSection(content: string): any {
    if (!content.trim()) {
      return {
        email: '',
        social: []
      }
    }

    const lines = content.split('\n')
    const contactData: any = {
      email: '',
      social: []
    }

    for (const line of lines) {
      const trimmedLine = line.trim()
      
      if (trimmedLine.toLowerCase().includes('email:')) {
        const emailMatch = trimmedLine.match(/email:\s*([^\s]+)/i)
        if (emailMatch) {
          contactData.email = emailMatch[1]
        }
      }
      
      if (trimmedLine.toLowerCase().includes('linkedin:')) {
        const linkedinMatch = trimmedLine.match(/linkedin:\s*(\S+)/i)
        if (linkedinMatch) {
          contactData.linkedin = linkedinMatch[1]
        }
      }
      
      if (trimmedLine.toLowerCase().includes('github:')) {
        const githubMatch = trimmedLine.match(/github:\s*(\S+)/i)
        if (githubMatch) {
          contactData.github = githubMatch[1]
        }
      }
      
      if (trimmedLine.toLowerCase().includes('form:') || trimmedLine.toLowerCase().includes('contact form:')) {
        const formMatch = trimmedLine.match(/(?:form|contact form):\s*(\S+)/i)
        if (formMatch) {
          contactData.formUrl = formMatch[1]
        }
      }
      
      if (trimmedLine.startsWith('-') && !trimmedLine.toLowerCase().includes('email') && 
          !trimmedLine.toLowerCase().includes('linkedin') && !trimmedLine.toLowerCase().includes('github')) {
        
        const markdownMatch = trimmedLine.match(/\[([^\]]+)\]\(([^)]+)\)/)
        if (markdownMatch) {
          contactData.social.push({
            platform: markdownMatch[1],
            url: markdownMatch[2]
          })
        } else {
          const plainMatch = trimmedLine.match(/^-\s*([^:]+):\s*(\S+)/)
          if (plainMatch && plainMatch[1] && plainMatch[2]) {
            const platform = plainMatch[1].trim()
            const url = plainMatch[2].trim()
            
            if (!['email', 'linkedin', 'github', 'form', 'contact form'].includes(platform.toLowerCase())) {
              contactData.social.push({
                platform,
                url
              })
            }
          }
        }
      }
    }

    return contactData
  }

  private parseMetadata(_content: string): any {
    return {
      title: 'Portfolio',
      description: 'Software Engineer Portfolio',
      keywords: [],
      author: ''
    }
  }

  /**
   * Load all projects from /public/projects/ folder
   */
  async loadProjectsFromFolder(): Promise<ProjectContent[]> {
    const projects: ProjectContent[] = []
    const projectModules = import.meta.glob('/public/projects/*.md', { as: 'raw', eager: false })
    
    for (const path in projectModules) {
      try {
        const slug = path.replace('/public/projects/', '').replace('.md', '')
        const response = await fetch(`/projects/${slug}.md`)
        
        if (!response.ok) {
          console.warn(`Project file ${slug}.md not found`)
          continue
        }

        const markdown = await response.text()
        const projectData = this.parseProjectMetadata(markdown, slug)
        
        if (projectData) {
          projects.push(projectData)
        }
      } catch (error) {
        console.warn(`Failed to load project:`, error)
      }
    }
    
    projects.sort((a, b) => {
      const dateA = a.dateValue || 0
      const dateB = b.dateValue || 0
      return dateB - dateA
    })
    
    return projects
  }

  private parseProjectMetadata(markdown: string, slug: string): ProjectContent | null {
    try {
      const titleMatch = markdown.match(/^#\s+(.+)$/m)
      const title = titleMatch?.[1]?.trim() || 'Untitled Project'
      
      const techStackMatch = markdown.match(/\*\*Tech Stack\*\*:\s*(.+)$/m)
      const dateMatch = markdown.match(/\*\*(?:Period|Date)\*\*:\s*(.+)$/m)
      
      const techStack = techStackMatch?.[1]?.trim() || ''
      const date = dateMatch?.[1]?.trim() || ''
      
      const overviewSection = this.extractProjectSection(markdown, 'Overview')
      let description = overviewSection
        .split('\n')
        .filter(line => line.trim() && !line.startsWith('#'))
        .join(' ')
        .trim()
      
      if (!description) {
        const executiveSummary = this.extractProjectSection(markdown, 'Executive Summary')
        description = executiveSummary
          .split('\n')
          .filter(line => line.trim() && !line.startsWith('#'))
          .slice(0, 2)
          .join(' ')
          .trim()
        
        if (description.length > 200) {
          description = description.substring(0, 200) + '...'
        }
      }
      
      const technologies = techStack
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)
      
      const dateValue = this.parseDateValue(date)
      
      return {
        id: slug,
        name: title,
        description,
        technologies,
        links: {},
        featured: false,
        slug,
        date,
        dateValue
      }
    } catch (error) {
      console.warn(`Failed to parse project metadata for ${slug}:`, error)
      return null
    }
  }

  private parseDateValue(dateStr: string): number {
    if (!dateStr) return 0
    
    const yearMatch = dateStr.match(/(\d{4})/)
    if (!yearMatch) return 0
    
    const year = parseInt(yearMatch[1] || '0')
    const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
    const monthMatch = dateStr.toLowerCase().match(new RegExp(`(${monthNames.join('|')})`))
    
    if (monthMatch) {
      const monthIndex = monthNames.indexOf(monthMatch[1] || '')
      return year * 100 + monthIndex + 1
    }
    
    return year * 100
  }

  async loadProjectDetail(slug: string): Promise<ProjectDetailContent> {
    try {
      const response = await fetch(`/projects/${slug}.md`)
      
      if (!response.ok) {
        throw new ContentNotFoundError(`Project file ${slug}.md not found`)
      }

      const markdown = await response.text()
      const projectDetail = this.parseProjectDetail(markdown)
      
      return projectDetail
    } catch (error) {
      if (error instanceof ContentNotFoundError) {
        throw error
      }
      throw new ParseError(`Failed to process project detail: ${error}`)
    }
  }

  private parseProjectDetail(markdown: string): ProjectDetailContent {
    const titleMatch = markdown.match(/^#\s+(.+)$/m)
    const title = titleMatch?.[1]?.trim() || 'Untitled Project'
    
    const roleMatch = markdown.match(/\*\*Role\*\*:\s*(.+)$/m)
    const techStackMatch = markdown.match(/\*\*Tech Stack\*\*:\s*(.+)$/m)
    const periodMatch = markdown.match(/\*\*Period\*\*:\s*(.+)$/m)
    
    const role = roleMatch?.[1]?.trim() || ''
    const techStack = techStackMatch?.[1]?.trim() || ''
    const period = periodMatch?.[1]?.trim() || ''
    
    const executiveSummary = this.extractProjectSection(markdown, 'Executive Summary')
    const achievementsSection = this.extractProjectSection(markdown, 'Key Technical Achievements')
    const impact = this.extractProjectSection(markdown, 'Impact & Metrics')
    const duration = this.extractProjectSection(markdown, 'Project Duration')
    const team = this.extractProjectSection(markdown, 'Team & Collaboration')
    const lessonsLearned = this.extractProjectSection(markdown, 'Lessons Learned')
    
    const achievements = this.parseAchievements(achievementsSection)
    const technologiesSection = this.extractProjectSection(markdown, 'Technologies Used')
    const technologies = this.extractTechnologies(techStack, technologiesSection)
    
    return {
      title,
      role,
      techStack,
      period,
      executiveSummary: this.parseMarkdown(executiveSummary),
      achievements,
      impact: this.parseMarkdown(impact),
      technologies,
      duration: duration ? this.parseMarkdown(duration) : undefined,
      team: team ? this.parseMarkdown(team) : undefined,
      lessonsLearned: lessonsLearned ? this.parseMarkdown(lessonsLearned) : undefined
    }
  }

  private extractProjectSection(content: string, sectionName: string): string {
    const sectionRegex = new RegExp(`^##\\s+${sectionName}\\s*$`, 'mi')
    const match = content.match(sectionRegex)
    
    if (!match || match.index === undefined) {
      return ''
    }
    
    const startIndex = match.index + match[0].length
    const remainingContent = content.substring(startIndex)
    const nextSectionMatch = remainingContent.match(/^##\s+/m)
    
    const endIndex = nextSectionMatch && nextSectionMatch.index !== undefined
      ? startIndex + nextSectionMatch.index
      : content.length
    
    return content.substring(startIndex, endIndex).trim()
  }

  private parseAchievements(achievementsSection: string): any[] {
    const achievements: any[] = []
    
    if (!achievementsSection) {
      return achievements
    }
    
    const achievementBlocks = achievementsSection.split(/^###\s+\d+\.\s+/m).filter(s => s.trim())
    
    achievementBlocks.forEach(block => {
      const lines = block.split('\n')
      const title = lines[0]?.trim() || ''
      
      const challengeMatch = block.match(/\*\*Challenge\*\*:\s*(.+?)(?=\*\*Solution\*\*:|$)/s)
      const solutionMatch = block.match(/\*\*Solution\*\*:\s*(.+?)(?=Result:|$)/s)
      const resultMatch = block.match(/Result:\s*(.+?)(?=###|$)/s)
      
      const challenge = challengeMatch?.[1]?.trim() || ''
      const solution = solutionMatch?.[1]?.trim() || ''
      const result = resultMatch?.[1]?.trim() || ''
      
      if (title && (challenge || solution)) {
        achievements.push({
          title,
          challenge,
          solution,
          result
        })
      }
    })
    
    return achievements
  }

  private extractTechnologies(techStack: string, technologiesSection: string): string[] {
    const technologies: string[] = []
    
    if (techStack) {
      const techItems = techStack.split(',').map(t => t.trim())
      technologies.push(...techItems)
    }
    
    if (technologiesSection) {
      const boldMatches = technologiesSection.match(/\*\*([^*]+)\*\*/g)
      if (boldMatches) {
        boldMatches.forEach(match => {
          const tech = match.replace(/\*\*/g, '').replace(/:$/, '').trim()
          if (tech && !technologies.includes(tech)) {
            technologies.push(tech)
          }
        })
      }
    }
    
    return technologies
  }
}

export class ContentNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ContentNotFoundError'
  }
}

export class ParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ParseError'
  }
}
