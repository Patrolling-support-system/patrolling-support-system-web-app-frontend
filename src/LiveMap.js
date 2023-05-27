import { Loader } from "@googlemaps/js-api-loader";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Polyline,
  infowindow,
} from "@react-google-maps/api";
import * as React from "react";
import { auth } from "./firebase-config.js";
import { collection, getDocs, getFirestore, GeoPoint,} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { push } from "firebase/database";
import { InfoWindow } from "@react-google-maps/api";

let url = "http://maps.google.com/mapfiles/ms/icons/green.png";

const loader = new Loader({
  apiKey: "AIzaSyBRx2VHwF6GZaONNSYekgsUTRZ6vrMN1FA",
});

const mapContainerStyle = {
  top: "5vh",
  margin: 0,
  padding: 0,
  width: "100%",
  height: "80vh",
};

const center = {
  lat: 50.06192492003556,
  lng: 19.93918752197243,
};

const seededRandom = (input) => Math.sin((input + 1) / Math.PI);
// const number = (word) => {
//   var sum = 0;
//   for( var i=0; i<word.lenght; i++){
//     sum += word.charCodeAt(i);
//   }
//   console.log(number)
//   console.log(number%10)
//   // return number%10
// }

const randomColor = (index) =>
  "hsl(" + Math.floor(seededRandom(index) * 0xff) + ", 50%, 50%)";

export function MapView({ documentData }) {
  // load routes data from firebase
  const [patrolRouteData, setPatrolRouteData] = React.useState(new Map());
  const [patrolMembers, setPatrolMembers] = React.useState(new Map());
  const [checkpintsSubtasks, setCheckpintsSubtasks] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const [selectedSubtaskName, setSelectedSubtaskName] = React.useState(null);
  const { taskId } = useParams();

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const getCheckpointsSubtasks = async () => {
    if (auth.currentUser) {
      const database = getFirestore();
      const docRef = collection(database, "CheckpointSubtasks");
      const docSnap = await getDocs(docRef);

      if (docSnap) {
        var map = [];
        docSnap.forEach((doc) => {
          if (doc.data().task == taskId) {
            const d = {
              point: new GeoPoint(Number.parseFloat(doc.data().checkpoint._lat), Number.parseFloat(doc.data().checkpoint._long)),
              name: doc.data().subtaskName
            }
            map.push(d);
          }
        });
        setCheckpintsSubtasks(map);
      } else {
        console.log("No such document!");
      }
    }
  };

  const setSubtaskName = async (checkpoint) => {

    var str = [];

    checkpintsSubtasks?.map((subtask) => {
      if(subtask.point._lat == checkpoint._lat && subtask.point._long == checkpoint._long){
        str.push(subtask.name)
      } 
    });
    setSelectedSubtaskName(str);
  };

  const getPatrolRouteDetails = async () => {
    if (auth.currentUser) {
      const database = getFirestore();
      const docRef = collection(database, "Point");
      const docSnap = await getDocs(docRef);

      if (docSnap) {
        var map = new Map();
        docSnap.forEach((doc) => {
          if (doc.data().taskId == taskId) {
            if (map.get(doc.data().patrolingMemberId)) {
              map.set(doc.data().patrolingMemberId, [
                doc.data(),
                ...map.get(doc.data().patrolingMemberId),
              ]);
            } else {
              map.set(doc.data().patrolingMemberId, [doc.data()]);
            }
          }
        });

        setPatrolRouteData(map);
      } else {
        console.log("No such document!");
      }
    }
  };

  const getPatrolMembersDetails = async () => {
    if (auth.currentUser) {
      const database = getFirestore();
      const docRef = collection(database, "User");
      const docSnap = await getDocs(docRef);

      if (docSnap) {
        var map = new Map();
        docSnap.forEach((doc) => {
          if (documentData.patrolParticipants.includes(doc.data().userId)) {
            map.set(
              doc.data().userId,
              doc.data().name + " " + doc.data().surname
            );
          }
        });
        setPatrolMembers(map);
      } else {
        console.log("No such document!");
      }
    }
  };

  React.useEffect(() => {
    getCheckpointsSubtasks();
    getPatrolRouteDetails();
    getPatrolMembersDetails();
  }, []);

  // load map
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBRx2VHwF6GZaONNSYekgsUTRZ6vrMN1FA",
  });

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps";

  return (
    <div>
      <h4>{documentData.name}</h4>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={center}
        onLoad={onMapLoad}
      >
        {documentData.checkpoints?.map((checkpoint, index) => {
          const lat = Number.parseFloat(checkpoint._lat);
          const long = Number.parseFloat(checkpoint._long);
          var marker = (
            <Marker
              icon={{ url: url }}
              key={index}
              position={{
                lat: lat,
                lng: long,
              }}
              opacity={0.9}
              onClick={() => {
                setSelected(checkpoint);
                setSubtaskName(checkpoint);
              }}
              label={index.toString()}
            />
          );
          return marker;
        })}

        {selected ? (
          <InfoWindow
            position={{ lat: selected._lat, lng: selected._long }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
              {selectedSubtaskName.map((name) => {
                return <p>{name}</p>
              })}
            </div>
          </InfoWindow>
        ) : null}

        {Array.from(patrolRouteData).map(([_, patrolRoute]) => (
          <Polyline
            path={patrolRoute
              .sort((a, b) => a.time.seconds - b.time.seconds)
              .map(
                (route) =>
                  new window.google.maps.LatLng(
                    route.location._lat,
                    route.location._long
                  )
              )}
            options={{ strokeColor: randomColor(patrolRoute.length) }}
          />
        ))}

        {Array.from(patrolRouteData).map(([_, patrolRoute]) => {
          var index = patrolRoute.length - 1;
          return (
            <Marker
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: randomColor(patrolRoute.length),
                fillOpacity: 1,
                scale: 6,
                strokeColor: randomColor(patrolRoute.length),
                strokeWeight: 0.5,
              }}
              position={{
                lat: patrolRoute[index].location._lat,
                lng: patrolRoute[index].location._long,
              }}
              label={patrolMembers.get(patrolRoute[index].patrolingMemberId)}
            />
          );
        })}
      </GoogleMap>
    </div>
  );
}
