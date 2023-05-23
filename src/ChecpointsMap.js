import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { Box } from "@mui/material";
import { Loader } from "@googlemaps/js-api-loader";
import {
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  GeoPoint,
} from "firebase/firestore";
import { useParams } from "react-router-dom";

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

export function CheckpointsView({ documentData, setSignal }) {
  const [disabled, setDisabled] = useState(true);
  const [enabledMap, setEnabledMap] = useState(false);
  const [newMarker, setNewMarker] = useState(null);
  const { taskId } = useParams();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBRx2VHwF6GZaONNSYekgsUTRZ6vrMN1FA",
  });

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps";

  const disableMapAndSaveCheckpoint = async () => {
    setEnabledMap(false);

    const database = getFirestore();
    const docRef = doc(database, "Tasks", taskId);

    updateDoc(docRef, {
      checkpoints: arrayUnion(new GeoPoint(newMarker._lat, newMarker._long)),
    }).then(() => {
      console.log("Zmodyfikowano pomyślnie");
      setNewMarker(null);
      setSignal({});
    });
  };

  return (
    <React.Fragment>
      <Box display="flex" justifyContent="space-between" marginTop={"2vh"}>
        <Grid>
          <Typography variant="h6" gutterBottom>
            Checkpoints:
          </Typography>
          <Grid container spacing={1}>
            {/* checkpoints data  */}
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
            {/* // added checkpoints data  */}
            {newMarker !== null ? (
              <Grid item xs={12} sm={10}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  width="auto"
                  rows={1}
                  value={`N: ${newMarker._lat.toFixed(
                    6
                  )}, ${newMarker._long.toFixed(6)}`}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#000000",
                    },
                  }}
                />
              </Grid>
            ) : null}
            <Grid>
              <Button
                variant="contained"
                size="small"
                style={{
                  marginTop: "20px",
                  marginLeft: "20px",
                }}
                onClick={() => setEnabledMap(true)}
              >
                Add
              </Button>
              <Button
                variant="contained"
                size="small"
                style={{
                  marginTop: "20px",
                  marginLeft: "20px",
                }}
                disabled={newMarker === null}
                onClick={() => disableMapAndSaveCheckpoint()}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={13}
          center={center}
          onClick={(event) => {
            if (enabledMap) {
              setNewMarker({
                _lat: parseFloat(event.latLng.lat().toFixed(6)),
                _long: parseFloat(event.latLng.lng().toFixed(6)),
              });
            }
          }}
        >
          {/* // checkpoints on map*/}
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
          {/* // added checkpoint on map*/}
          {newMarker !== null ? (
            <Marker
              icon={{ url: url }}
              position={{
                lat: newMarker._lat,
                lng: newMarker._long,
              }}
              opacity={0.9}
            />
          ) : null}
        </GoogleMap>
      </Box>
    </React.Fragment>
  );
}
