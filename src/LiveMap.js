import { Loader } from "@googlemaps/js-api-loader";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import * as React from "react";
import { auth } from "./firebase-config.js";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { Paper, Typography, Grid } from "@mui/material";

let url = "http://maps.google.com/mapfiles/ms/icons/green.png";

const loader = new Loader({
  apiKey: "AIzaSyBRx2VHwF6GZaONNSYekgsUTRZ6vrMN1FA",
});

const mapContainerStyle = {
  top: "5vh",
  margin: 0,
  padding: 0,
  width: "100%",
  height: "605px",
};

const center = {
  lat: 50.06192492003556,
  lng: 19.93918752197243,
};

const seededRandom = (input) => Math.sin((input + 1) / Math.PI);
const randomColor = (index) =>
  "hsl(" + Math.floor(seededRandom(index) * 0xff) + ", 50%, 50%)";

export function MapView({ documentData }) {
  // load routes data from firebase
  const [patrolRouteData, setPatrolRouteData] = React.useState([]);

  const getPatrolRouteDetails = async () => {
    if (auth.currentUser) {
      const database = getFirestore();
      const docRef = collection(database, "PatrolRoute");
      const docSnap = await getDocs(docRef);
      if (docSnap) {
        var r = [];
        docSnap.forEach((doc) => {
          r.push(doc.data());
        });
        setPatrolRouteData(r);
      } else {
        console.log("No such document!");
      }
    }
  };

  React.useEffect(() => {
    getPatrolRouteDetails();
  }, []);

  // load map
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBRx2VHwF6GZaONNSYekgsUTRZ6vrMN1FA",
  });

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps";

  return (
    <div>
      <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }, position: 'relative', height: 750, }}>
        
        <Typography sx={{ textAlign: 'center', fontSize: '2rem' }}>
          {documentData.name}
        </Typography>
        <Grid item xs={12}>
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

            {patrolRouteData.map((patrolRoute, index) => (
              <Polyline
                key={index}
                path={patrolRoute.route.map(
                  (route) => new window.google.maps.LatLng(route._lat, route._long)
                )}
                options={{ strokeColor: randomColor(index) }}
              />
            ))}

            {patrolRouteData.map((patrolRoute, index) => (
              <Marker
                key={index}
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  fillColor: randomColor(index),
                  fillOpacity: 1,
                  scale: 6,
                  strokeColor: randomColor(index),
                  strokeWeight: 0.5,
                }}
                position={{
                  lat: patrolRoute.route[patrolRoute.route.length - 1]._lat,
                  lng: patrolRoute.route[patrolRoute.route.length - 1]._long,
                }}
              />
            ))}
          </GoogleMap>
        </Grid>
      </Paper>
    </div>
  );
}
