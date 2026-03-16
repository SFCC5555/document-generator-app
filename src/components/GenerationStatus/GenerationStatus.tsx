import type { GenerationState } from "../../types/report.types";
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Button,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DownloadIcon from "@mui/icons-material/Download";
import AutorenewIcon from "@mui/icons-material/Autorenew";

interface GenerationStatusProps {
  state: GenerationState;
  onReset: () => void;
}

export default function GenerationStatus({
  state,
  onReset,
}: GenerationStatusProps) {
  if (state.status === "idle") return null;

  return (
    <Card className="mt-4">
      <CardContent>
        <Typography variant="h6" className="font-bold mb-3">
          Generation Status
        </Typography>

        {/* Processing */}
        {state.status === "processing" && (
          <Box>
            <Box className="flex items-center gap-2 mb-2">
              <AutorenewIcon className="animate-spin text-blue-500" />
              <Typography variant="body2" color="text.secondary">
                {state.message}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={state.progress}
              className="mb-2"
            />
            <Typography variant="caption" color="text.secondary">
              {state.progress}% complete
            </Typography>
          </Box>
        )}

        {/* Completed */}
        {state.status === "completed" && (
          <Box>
            <Alert
              icon={<CheckCircleIcon />}
              severity="success"
              className="mb-3"
            >
              {state.message}
            </Alert>
            <Box className="flex gap-2">
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                href={state.downloadUrl ?? "#"}
                component="a"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Document
              </Button>
              <Button variant="outlined" onClick={onReset}>
                Generate Another
              </Button>
            </Box>
          </Box>
        )}

        {/* Error */}
        {state.status === "error" && (
          <Box>
            <Alert icon={<ErrorIcon />} severity="error" className="mb-3">
              {state.message}
            </Alert>
            <Button variant="outlined" onClick={onReset}>
              Try Again
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
