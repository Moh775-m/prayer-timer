import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";


export default function Prayer({ name, time, image }) {
  return (
    <Card
      sx={{
        backgroundColor:"bisque",
        flex: 1,
        minWidth: 0,
        textAlign: "center",
        borderRadius: 3,
        boxShadow: "0 4px 15px rgba(0,0,0,0.12)",
        transition: "0.3s",

        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
        },
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={image}
      
      />

      <CardContent>
        <Typography
          variant="h5"
          sx={{
            
            fontWeight: "bold",
            marginBottom: 2,
          }}
        >
          {name}
        </Typography>

        <Typography variant="h6" color="text.secondary">
          {time}
        </Typography>
      </CardContent>
    </Card>
  );
}