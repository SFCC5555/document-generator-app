export type DocumentFormat = 'docx' | 'pdf'

export type GenerationStatus = 
  | 'idle' 
  | 'processing' 
  | 'completed' 
  | 'error'

export interface Photo {
  id: string
  url: string
  caption: string
  metadata: {
    date: string
    location: string
    photographer: string
  }
}

export interface ReportSection {
  id: string
  title: string
  enabled: boolean
  content: string
}

export interface CaseData {
  id: string
  caseNumber: string
  title: string
  date: string
  agency: string
  investigator: string
  location: string
  sections: ReportSection[]
  photos: Photo[]
}

export interface GenerationConfig {
  format: DocumentFormat
  includePhotos: boolean
  includeTableOfContents: boolean
  photosPerPage: 1 | 2 | 4
}

export interface GenerationState {
  status: GenerationStatus
  progress: number
  message: string
  downloadUrl?: string
}