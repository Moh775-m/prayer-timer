import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import "./Prayer.css"; // ربط ملف الـ CSS

export default function Prayer({ name, time, image }) {
  return (
    <Card className="prayer-card">
      <CardMedia
        component="img"
        className="prayer-card-media"
        image={image}
        alt={name}
      />
      <CardContent className="prayer-card-content">
        <Typography variant="h5" className="prayer-name">
          {name}
        </Typography>

        <Typography variant="h6" color="text.secondary" className="prayer-time">
          {time}
        </Typography>
      </CardContent>
    </Card>
  );
}