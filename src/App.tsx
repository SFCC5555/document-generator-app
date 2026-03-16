import { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
} from '@mui/material'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import ArticleIcon from '@mui/icons-material/Article'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'
import SendIcon from '@mui/icons-material/Send'

import ReportConfig from './components/ReportConfig/ReportConfig'
import PhotoLog from './components/PhotoLog/PhotoLog'
import GenerationStatus from './components/GenerationStatus/GenerationStatus'
import { mockCaseData } from './data/mockData'
import { useDocumentGeneration } from './hooks/useDocumentGeneration'
import type { GenerationConfig } from './types/report.types'

const DEFAULT_CONFIG: GenerationConfig = {
  format: 'docx',
  includePhotos: true,
  includeTableOfContents: true,
  photosPerPage: 2,
}

export default function App() {
  const [tab, setTab] = useState(0)
  const [config, setConfig] = useState<GenerationConfig>(DEFAULT_CONFIG)
  const [caseData, setCaseData] = useState(mockCaseData)
  const { state, generateDocument, reset } = useDocumentGeneration()

  const handleSectionToggle = (sectionId: string) => {
    setCaseData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, enabled: !s.enabled } : s
      ),
    }))
  }

  const handleGenerate = () => {
    generateDocument(caseData, config)
  }

  return (
    <Box className="min-h-screen bg-gray-100">
      {/* Header */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <LocalFireDepartmentIcon className="mr-2" />
          <Typography variant="h6" className="font-bold flex-1">
            Blazestack — Document Generator
          </Typography>
          <Typography variant="caption" color="inherit" className="opacity-70">
            Case: {caseData.caseNumber}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Tabs */}
      <Box className="bg-white shadow">
        <Container maxWidth="lg">
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            <Tab icon={<ArticleIcon />} label="Report Config" iconPosition="start" />
            <Tab icon={<PhotoLibraryIcon />} label="Photo Log" iconPosition="start" />
          </Tabs>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="lg" className="py-6">
        <Typography variant="h5" className="font-bold mb-2">
          {caseData.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="mb-6">
          {caseData.location} · {caseData.date} · {caseData.investigator}
        </Typography>

        {/* Tab Content */}
        {tab === 0 && (
          <ReportConfig
            caseData={caseData}
            config={config}
            onConfigChange={setConfig}
            onSectionToggle={handleSectionToggle}
          />
        )}

        {tab === 1 && (
          <PhotoLog
            photos={caseData.photos}
            photosPerPage={config.photosPerPage}
          />
        )}

        {/* Generation Status */}
        <GenerationStatus state={state} onReset={reset} />

        {/* Generate Button */}
        {state.status === 'idle' && (
          <Box className="mt-6 flex justify-end">
            <Button
              variant="contained"
              size="large"
              startIcon={<SendIcon />}
              onClick={handleGenerate}
              color="primary"
            >
              Generate {config.format.toUpperCase()} Report
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  )
}