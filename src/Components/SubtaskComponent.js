import { useParams } from "react-router-dom";
import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, IconButton, InputLabel, List, ListItem, ListItemText, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { auth } from "../firebase-config.js";
import { addDoc, collection, doc, documentId, getDoc, getDocs, getFirestore, where } from "firebase/firestore";
import { query } from "firebase/database";
import { CheckBox } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


const mdTheme = createTheme({
  palette: {
    primary: {
      main: "#A9AC5D",
    },
    secondary: {
      main: "#E8E1DB",
    },
    tertiary: {
      default: "#3A3C26",
    },
    background: {
      default: "#E8E1DB",
    },
  },
});

export const SubtaskComponent = ({ documentData }) => {

  const { taskId } = useParams();
  const [isLoaded, setIsLoaded] = React.useState(false);

  const [selectedCheckpoint, setSelectedCheckpoint] = React.useState("");
  const [selectedCheckpointSubtasks, setSelectedCheckpointSubtasks] = React.useState([]);
  const [parsedGeopoints, setParsedGeopoints] = React.useState([]);
  const [patrolParticipants, setPatrolParticipants] = React.useState([]);

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddSubtask = () => {
    addSubtaskToFireCheckpoint();
    setOpen(false);
    setSelectedParticipant(null);
    setSubtaskName('');
    setSubtaskDescription('');
    setIsLoaded(false)
    getSubtasksFromFirestore(selectedCheckboxIndex);
  };

  const [subtaskName, setSubtaskName] = React.useState("");
  const handleSubtaskNameChange = (event) => {
    setSubtaskName(event.target.value);
  };

  const [subtaskDescription, setSubtaskDescription] = React.useState("");
  const handleSubtaskDescriptionChange = (event) => {
    setSubtaskDescription(event.target.value);
  };


  const [selectedParticipant, setSelectedParticipant] = React.useState("");
  const handleParticipantChange = (event) => {
    setSelectedParticipant(event.target.value);
  };

  const [selectedCheckboxIndex, setSelectedCheckboxIndex] = React.useState();

  const handleCheckpointSelectionChange = (event) => {
    setSelectedCheckpoint(event.target.value)
    const checkpointArray = Object.values(parsedGeopoints);
    const checkpointIndex = checkpointArray.indexOf(event.target.value);

    setSelectedCheckboxIndex(checkpointIndex);
    getSubtasksFromFirestore(checkpointIndex);
  };

  const addSubtaskToFireCheckpoint = async () => {
    if (auth.currentUser) {
      const checkpointIndex = parsedGeopoints.indexOf(selectedCheckpoint);
      const checkpoint = documentData.checkpoints[checkpointIndex];

      const database = getFirestore();
      const collectionRef = collection(database, 'CheckpointSubtasks');
      const docRef = await addDoc(collectionRef, {
        task: taskId,
        subtaskName: subtaskName,
        description: subtaskDescription,
        checkpoint: checkpoint,
        participant: selectedParticipant
      })
      // console.log("Added new document with ID: ", docRef.id);
    }
  };

  const getParticipantNamesFromFirestore = async (subtaskList) => {
    const database = getFirestore();
    const participantRef = collection(database, "User")
    const participantQuery = query(participantRef, where(documentId(), "in", documentData.patrolParticipants))
    const paritcipantSnapshot = await getDocs(participantQuery);
    const participantList = [];

    paritcipantSnapshot.forEach((doc) => {
      const data = doc.data();
      const participant = {
        userId: data.userId,
        name: data.name,
        surname: data.surname
      };
      participantList.push(participant);
    });

    setPatrolParticipants(participantList)

    const subtaskListWithNames = subtaskList.map((item) => {
      const user = participantList.find((user) => user.userId === item.participant)
      const updatedsubtaskList = { ...item, participantName: user.name + " " + user.surname }
      return updatedsubtaskList
    })

    setSelectedCheckpointSubtasks(subtaskListWithNames);
    setIsLoaded(true);
  }

  const getSubtasksFromFirestore = async (index) => {
    const database = getFirestore();
    const subtaskRef = collection(database, "CheckpointSubtasks")
    const subtaskQuery = query(subtaskRef, where("task", "==", taskId), where("checkpoint", "==", documentData.checkpoints[index]))
    const subtaskSnapshot = await getDocs(subtaskQuery);
    const subtaskList = [];

    subtaskSnapshot.forEach((doc) => {
      const data = doc.data();
      const subtask = {
        subtaskName: data.subtaskName,
        description: data.description,
        participant: data.participant
      };
      subtaskList.push(subtask);
    });

    // appendParticipantNameFromFirestore(subtaskList);

    getParticipantNamesFromFirestore(subtaskList);
  }

  // Tu do sprawdzenia co się dzieje jak checkpointy ulegną zmianie
  // ------------------------------------------------------------------------------------------------------

  React.useEffect(() => {
    setParsedGeopoints(documentData.checkpoints.map((point) => `${point._lat}, ${point._long}`));
  }, [documentData.checkpoints]);

  React.useEffect(() => {
    if (documentData.checkpoints[0] !== null) {
      setSelectedCheckpoint(parsedGeopoints[0]);
      getSubtasksFromFirestore(0);
    }
  }, [parsedGeopoints])


  // ------------------------------------------------------------------------------------------------------


  return (
    <React.Fragment>
      <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }, position: 'relative', height: 750, }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} container justifyContent={"center"}>
            <Typography variant="h5">
              Choose checkpoint to view assigned subtasks:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={2} sx={{ position: 'absolute', top: 0, right: 0 }}>
            <Button
              variant='contained'
              size='large'
              style={{ marginRight: '35px' }}
              onClick={() => handleClickOpen()}
            >
              Add subtask
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth>
              <DialogTitle>
                Add subtask to current checkpoint:
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Subtask name..."
                      fullWidth
                      variant="outlined"
                      value={subtaskName}
                      onChange={handleSubtaskNameChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Subtask description..."
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={3}
                      value={subtaskDescription}
                      onChange={handleSubtaskDescriptionChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {/* <Divider orientation='horizontal' /> */}
                    <InputLabel id="participant-label" shrink={selectedParticipant !== ''}>
                      Choose subtask participant:
                    </InputLabel>
                    <Select
                      value={selectedParticipant}
                      onChange={handleParticipantChange}
                      fullWidth
                    // label={"Choose subtask participant"}
                    >
                      {patrolParticipants.map((item, index) => (
                        <MenuItem key={index} value={item.userId}>
                          {item.name} {item.surname}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleAddSubtask} variant='contained'>
                  Add subtask
                </Button>
                <Button onClick={handleClose}>
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
          {isLoaded ? (
            <React.Fragment>
              <Grid item xs={12} sm={12} container justifyContent={"center"}>
                <Select
                  value={selectedCheckpoint}
                  onChange={handleCheckpointSelectionChange}
                  style={{ width: '500px', textAlign: 'center' }}
                >
                  {parsedGeopoints.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      Checkpoint {index}: {option}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Divider orientation='horizontal' />
                {selectedCheckpointSubtasks.length > 0 ? (
                  <div style={{ height: "550px", overflowY: "scroll" }}>
                    <List>
                      {selectedCheckpointSubtasks.map((item, index) => (
                        <React.Fragment key={index}>
                          <ListItem >
                            <ListItemText>
                              <Typography variant="h6" noWrap>Subtask: {item.subtaskName}</Typography>
                              <Typography variant="body1" noWrap>Paritcipant: {item.participantName}</Typography>
                              <Typography variant="body2" noWrap>Description: {item.description}</Typography>
                            </ListItemText>
                            <IconButton>
                              <ArrowDropDownIcon />
                            </IconButton>
                            <IconButton>
                              <DeleteIcon />
                            </IconButton>
                          </ListItem>
                          <Divider orientation='horizontal' />
                        </React.Fragment>
                      ))}
                    </List>
                  </div>
                ) : (
                  <React.Fragment>
                    <Grid container justifyContent={"center"}>
                      <Typography variant="h5">
                        No subtasks declared for this checkpoint
                      </Typography>
                    </Grid>
                  </React.Fragment>
                )}
              </Grid>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Grid container justifyContent={"center"}>
                <Typography>
                  Loading...
                </Typography>
              </Grid>
            </React.Fragment>
          )}
        </Grid>
      </Paper>
    </React.Fragment>
  );
}
