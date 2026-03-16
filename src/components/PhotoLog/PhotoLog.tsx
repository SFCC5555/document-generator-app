import type { Photo } from "../../types/report.types";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

interface PhotoLogProps {
  photos: Photo[];
  photosPerPage: 1 | 2 | 4;
}

export default function PhotoLog({ photos, photosPerPage }: PhotoLogProps) {
  const getGridSize = () => {
    switch (photosPerPage) {
      case 1:
        return 12;
      case 2:
        return 6;
      case 4:
        return 3;
      default:
        return 6;
    }
  };

  return (
    <Box>
      <Typography variant="h6" className="font-bold mb-4">
        Photo Log ({photos.length} photos)
      </Typography>
      <Grid container spacing={2}>
        {photos.map((photo) => (
          <Grid size={{ xs: 12, md: getGridSize() }} key={photo.id}>
            <Card className="h-full">
              <CardMedia
                component="img"
                height="200"
                image={photo.url}
                alt={photo.caption}
                className="object-cover"
              />
              <CardContent>
                <Typography variant="body2" className="font-semibold mb-2">
                  {photo.caption}
                </Typography>
                <Box className="flex items-center gap-1 mb-1">
                  <CalendarTodayIcon fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    {photo.metadata.date}
                  </Typography>
                </Box>
                <Box className="flex items-center gap-1 mb-1">
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    {photo.metadata.location}
                  </Typography>
                </Box>
                <Box className="flex items-center gap-1">
                  <PhotoCameraIcon fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    {photo.metadata.photographer}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
