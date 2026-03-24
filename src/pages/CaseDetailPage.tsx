import { useEffect, useMemo, useState } from "react"
import { useParams, Link } from "react-router-dom"
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment"
import ArticleIcon from "@mui/icons-material/Article"
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary"
import SendIcon from "@mui/icons-material/Send"
import type { CaseData, GenerationConfig } from "../types/report.types"
import { getCasesUrl } from "../lib/api"
import ReportConfig from "../components/ReportConfig/ReportConfig"
import PhotoLog from "../components/PhotoLog/PhotoLog"
import GenerationStatus from "../components/GenerationStatus/GenerationStatus"
import { useDocumentGeneration } from "../hooks/useDocumentGeneration"

const DEFAULT_CONFIG: GenerationConfig = {
  format: "docx",
  includePhotos: true,
  includeTableOfContents: true,
  photosPerPage: 2,
}

function normalizeCasesResponse(json: unknown): CaseData[] {
  if (Array.isArray(json)) return json as CaseData[]
  if (json && typeof json === "object") {
    const maybe = json as { cases?: unknown }
    if (Array.isArray(maybe.cases)) return maybe.cases as CaseData[]
    if ("caseNumber" in (json as Record<string, unknown>)) return [json as CaseData]
  }
  return []
}

export default function CaseDetailPage() {
  const { caseId } = useParams<{ caseId: string }>()
  const [tab, setTab] = useState(0)
  const [config, setConfig] = useState<GenerationConfig>(DEFAULT_CONFIG)

  const [cases, setCases] = useState<CaseData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryToken, setRetryToken] = useState(0)

  const { state, generateDocument, reset } = useDocumentGeneration()

  const caseData = useMemo(() => {
    if (!caseId) return null
    return cases.find((c) => c.id === caseId) ?? null
  }, [caseId, cases])

  useEffect(() => {
    reset()
    setTab(0)
    setConfig(DEFAULT_CONFIG)
  }, [caseId, reset])

  useEffect(() => {
    if (!caseId) return

    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(getCasesUrl())
        if (!res.ok) throw new Error(`Failed to fetch cases (HTTP ${res.status})`)

        const json: unknown = await res.json()
        const loadedCases = normalizeCasesResponse(json)

        if (!loadedCases.length) throw new Error("No cases found in response")
        if (cancelled) return

        setCases(loadedCases)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Failed to load cases")
        setCases([])
      } finally {
        if (cancelled) return
        setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [caseId, retryToken])

  const handleSectionToggle = (sectionId: string) => {
    if (!caseId) return
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c
        return {
          ...c,
          sections: c.sections.map((s) =>
            s.id === sectionId ? { ...s, enabled: !s.enabled } : s,
          ),
        }
      }),
    )
  }

  const handleGenerate = () => {
    if (!caseData) return
    generateDocument(caseData, config)
  }

  return (
    <Box className="min-h-screen bg-gray-100">
      <AppBar position="static" color="primary">
        <Toolbar>
          <LocalFireDepartmentIcon className="mr-2" />
          <Typography variant="h6" className="font-bold flex-1">
            Document Generator
          </Typography>
          {caseData && (
            <Button
              component={Link}
              to="/"
              variant="text"
              color="inherit"
              startIcon={<ArrowBackIcon />}
            >
              Cases
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" className="py-6">
        {loading ? (
          <Box className="py-12 flex flex-col items-center">
            <CircularProgress />
            <Typography variant="body2" color="text.secondary" className="mt-3">
              Loading case...
            </Typography>
          </Box>
        ) : error ? (
          <Box className="py-12">
            <Typography variant="body1" color="error" className="mb-3">
              {error}
            </Typography>
            <Button variant="contained" onClick={() => setRetryToken((t) => t + 1)}>
              Retry
            </Button>
          </Box>
        ) : caseData ? (
          <>
            <Typography variant="h5" className="font-bold mb-2">
              {caseData.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" className="mb-6">
              {caseData.location} · {caseData.date} · {caseData.investigator}
            </Typography>

            {/* Tabs */}
            <Box className="bg-white shadow">
              <Container maxWidth="lg">
                <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                  <Tab
                    icon={<ArticleIcon />}
                    label="Report Config"
                    iconPosition="start"
                  />
                  <Tab
                    icon={<PhotoLibraryIcon />}
                    label="Photo Log"
                    iconPosition="start"
                  />
                </Tabs>
              </Container>
            </Box>

            <Box className="py-6">
              {tab === 0 && (
                <ReportConfig
                  caseData={caseData}
                  config={config}
                  onConfigChange={setConfig}
                  onSectionToggle={handleSectionToggle}
                />
              )}

              {tab === 1 && (
                <PhotoLog photos={caseData.photos} photosPerPage={config.photosPerPage} />
              )}
            </Box>

            {/* Generation Status */}
            <GenerationStatus state={state} onReset={reset} />

            {/* Generate Button */}
            {state.status === "idle" && (
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
          </>
        ) : (
          <Box className="py-12">
            <Typography variant="h6" className="mb-2">
              Case not found
            </Typography>
            <Button component={Link} to="/" variant="outlined">
              Back to cases
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  )
}

