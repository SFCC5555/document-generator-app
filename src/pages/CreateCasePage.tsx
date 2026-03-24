import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment"
import { AppBar, Toolbar } from "@mui/material"
import type { CaseData } from "../types/report.types"
import { getCasesUrl } from "../lib/api"

type CreateCasePayload = Omit<CaseData, "id">

function extractCreatedId(json: unknown): string | null {
  if (!json || typeof json !== "object") return null
  const obj = json as Partial<CaseData> & { id?: unknown }
  if (typeof obj.id === "string" && obj.id) return obj.id
  if (Array.isArray(json)) {
    const first = json[0] as any
    if (first && typeof first === "object" && typeof first.id === "string") return first.id
  }
  return null
}

export default function CreateCasePage() {
  const navigate = useNavigate()

  const [caseNumber, setCaseNumber] = useState("")
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [agency, setAgency] = useState("")
  const [investigator, setInvestigator] = useState("")
  const [location, setLocation] = useState("")

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit =
    caseNumber.trim() &&
    title.trim() &&
    date.trim() &&
    agency.trim() &&
    investigator.trim() &&
    location.trim()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setSubmitting(true)
    setError(null)

    try {
      const payload: CreateCasePayload = {
        caseNumber: caseNumber.trim(),
        title: title.trim(),
        date: date.trim(),
        agency: agency.trim(),
        investigator: investigator.trim(),
        location: location.trim(),
        sections: [],
        photos: [],
      }

      const res = await fetch(getCasesUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(text ? `Failed to create case: ${text}` : `Failed to create case (HTTP ${res.status})`)
      }

      const json: unknown = await res.json().catch(() => null)
      const createdId = extractCreatedId(json)

      if (createdId) {
        navigate(`/cases/${createdId}`)
        return
      }

      // If backend doesn't return the created case id, fallback to list.
      navigate("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create case")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box className="min-h-screen bg-gray-100">
      <AppBar position="static" color="primary">
        <Toolbar>
          <LocalFireDepartmentIcon className="mr-2" />
          <Typography variant="h6" className="font-bold flex-1">
            Create Case
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            color="inherit"
            onClick={() => navigate("/")}
          >
            Cases
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" className="py-6">
        <Paper elevation={0} className="p-6">
          <Typography variant="h5" className="font-bold mb-4">
            Basic Information
          </Typography>

          <Box component="form" onSubmit={handleSubmit} className="space-y-4">
            <TextField
              label="Case Number"
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              required
              type="date"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Agency"
              value={agency}
              onChange={(e) => setAgency(e.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Investigator"
              value={investigator}
              onChange={(e) => setInvestigator(e.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
              required
              multiline
              minRows={3}
            />

            {error && (
              <Typography variant="body2" color="error" className="mt-2">
                {error}
              </Typography>
            )}

            <Box className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outlined" onClick={() => navigate("/")}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={!canSubmit || submitting}>
                {submitting ? <CircularProgress size={20} className="mr-2" /> : null}
                Create
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

