import type { CaseData, GenerationConfig, DocumentFormat } from '../../types/report.types'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import DescriptionIcon from '@mui/icons-material/Description'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'

interface ReportConfigProps {
  caseData: CaseData
  config: GenerationConfig
  onConfigChange: (config: GenerationConfig) => void
  onSectionToggle: (sectionId: string) => void
}

export default function ReportConfig({ 
  caseData, 
  config, 
  onConfigChange,
  onSectionToggle 
}: ReportConfigProps) {

  const handleFormatChange = (_: React.MouseEvent<HTMLElement>, format: DocumentFormat) => {
    if (format) onConfigChange({ ...config, format })
  }

  return (
    <Box className="space-y-4">
      {/* Case Info */}
      <Card>
        <CardContent>
          <Typography variant="h6" className="font-bold mb-2">
            Case Information
          </Typography>
          <Divider className="mb-3" />
          <Box className="grid grid-cols-2 gap-2">
            <Typography variant="body2" color="text.secondary">Case Number:</Typography>
            <Typography variant="body2">{caseData.caseNumber}</Typography>
            <Typography variant="body2" color="text.secondary">Investigator:</Typography>
            <Typography variant="body2">{caseData.investigator}</Typography>
            <Typography variant="body2" color="text.secondary">Agency:</Typography>
            <Typography variant="body2">{caseData.agency}</Typography>
            <Typography variant="body2" color="text.secondary">Date:</Typography>
            <Typography variant="body2">{caseData.date}</Typography>
            <Typography variant="body2" color="text.secondary">Location:</Typography>
            <Typography variant="body2">{caseData.location}</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Format Selection */}
      <Card>
        <CardContent>
          <Typography variant="h6" className="font-bold mb-3">
            Output Format
          </Typography>
          <ToggleButtonGroup
            value={config.format}
            exclusive
            onChange={handleFormatChange}
            fullWidth
          >
            <ToggleButton value="docx">
              <DescriptionIcon className="mr-2" />
              Word (.docx)
            </ToggleButton>
            <ToggleButton value="pdf">
              <PictureAsPdfIcon className="mr-2" />
              PDF
            </ToggleButton>
          </ToggleButtonGroup>
        </CardContent>
      </Card>

      {/* Sections */}
      <Card>
        <CardContent>
          <Typography variant="h6" className="font-bold mb-3">
            Report Sections
          </Typography>
          <FormGroup>
            {caseData.sections.map(section => (
              <FormControlLabel
                key={section.id}
                control={
                  <Checkbox
                    checked={section.enabled}
                    onChange={() => onSectionToggle(section.id)}
                  />
                }
                label={section.title}
              />
            ))}
          </FormGroup>
        </CardContent>
      </Card>

      {/* Photo Options */}
      <Card>
        <CardContent>
          <Typography variant="h6" className="font-bold mb-3">
            Photo Options
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={config.includePhotos}
                onChange={(e) => onConfigChange({ 
                  ...config, 
                  includePhotos: e.target.checked 
                })}
              />
            }
            label="Include Photo Log"
          />
          {config.includePhotos && (
            <FormControl fullWidth className="mt-3">
              <InputLabel>Photos per page</InputLabel>
              <Select
                value={config.photosPerPage}
                label="Photos per page"
                onChange={(e) => onConfigChange({ 
                  ...config, 
                  photosPerPage: e.target.value as 1 | 2 | 4 
                })}
              >
                <MenuItem value={1}>1 photo per page</MenuItem>
                <MenuItem value={2}>2 photos per page</MenuItem>
                <MenuItem value={4}>4 photos per page</MenuItem>
              </Select>
            </FormControl>
          )}
          <FormControlLabel
            className="mt-2"
            control={
              <Checkbox
                checked={config.includeTableOfContents}
                onChange={(e) => onConfigChange({ 
                  ...config, 
                  includeTableOfContents: e.target.checked 
                })}
              />
            }
            label="Include Table of Contents"
          />
        </CardContent>
      </Card>
    </Box>
  )
}