import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  AppBar,
  Box,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Button,
} from "@mui/material"
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment"
import type { CaseData } from "../types/report.types"
import { getCasesUrl } from "../lib/api"

function normalizeCasesResponse(json: unknown): CaseData[] {
  if (Array.isArray(json)) return json as CaseData[]
  if (json && typeof json === "object") {
    const maybe = json as { cases?: unknown }
    if (Array.isArray(maybe.cases)) return maybe.cases as CaseData[]
    if ("caseNumber" in (json as Record<string, unknown>)) return [json as CaseData]
  }
  return []
}

export default function CasesListPage() {
  const [cases, setCases] = useState<CaseData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryToken, setRetryToken] = useState(0)

  useEffect(() => {
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
  }, [retryToken])

  return (
    <Box className="min-h-screen bg-gray-100">
      <AppBar position="static" color="primary">
        <Toolbar>
          <LocalFireDepartmentIcon className="mr-2" />
          <Typography variant="h6" className="font-bold flex-1">
            Document Generator
          </Typography>
          <Button variant="contained" component={Link} to="/cases/new">
            Create case
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" className="py-6">
        {loading ? (
          <Box className="py-12 flex flex-col items-center">
            <CircularProgress />
            <Typography variant="body2" color="text.secondary" className="mt-3">
              Loading cases...
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
        ) : (
          <>
            <Typography variant="h5" className="font-bold mb-4">
              Cases
            </Typography>
            <List>
              {cases.map((c) => (
                <ListItem key={c.id} disablePadding>
                  <ListItemButton component={Link} to={`/cases/${c.id}`}>
                    <ListItemText
                      primary={c.caseNumber}
                      secondary={`${c.title} · ${c.investigator}`}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Container>
    </Box>
  )
}

