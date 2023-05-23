import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Button, Paper } from "@mui/material";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { Box } from "@mui/material";
import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
  apiKey: "AIzaSyBRx2VHwF6GZaONNSYekgsUTRZ6vrMN1FA",
});

const mapContainerStyle = {
  margin: 0,
  padding: 0,
  width: "100%",
  height: "80vh",
};

const center = {
  lat: 50.06192492003556,
  lng: 19.93918752197243,
};

let url = "http://maps.google.com/mapfiles/ms/icons/green.png";

export function CheckpointsView({ documentData }) {
  const [disabled, setDisabled] = useState(true);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBRx2VHwF6GZaONNSYekgsUTRZ6vrMN1FA",
  });

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps";

  const handleAddCheckpointsClick = () => { };

  return (
    <React.Fragment>
      <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        <Box display="flex" justifyContent="space-between" marginTop={"2vh"}>
          <Grid>
            <Typography variant="h6" gutterBottom>
              Checkpoints:
            </Typography>
            <Grid container spacing={1}>
              {documentData.checkpoints?.map((checkpoint, index) => {
                var field = (
                  <Grid item xs={12} sm={10}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      width="auto"
                      rows={1}
                      value={`${index}: ${checkpoint._lat}, ${checkpoint._long}`}
                      disabled={disabled}
                      sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#000000",
                        },
                      }}
                    />
                  </Grid>
                );
                return field;
              })}
              <Button
                variant="contained"
                size="large"
                style={{
                  marginTop: "20px",
                  marginLeft: "10px",
                }}
                onClick={() => setDisabled(true)}
              >
                Edit checkpoints
              </Button>
              <Button
                variant="contained"
                size="large"
                style={{
                  marginTop: "20px",
                  marginLeft: "20px",
                }}
                onClick={() => handleAddCheckpointsClick()}
              >
                Add checkpoint
              </Button>
            </Grid>
          </Grid>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={13}
            center={center}
          >
            {documentData.checkpoints?.map((checkpoint, index) => {
              var marker = (
                <Marker
                  icon={{ url: url }}
                  key={index}
                  position={{
                    lat: Number.parseFloat(checkpoint._lat),
                    lng: Number.parseFloat(checkpoint._long),
                  }}
                  opacity={0.9}
                  label={index.toString()}
                />
              );
              return marker;
            })}
          </GoogleMap>
        </Box>
      </Paper>
    </React.Fragment>
  );
}
