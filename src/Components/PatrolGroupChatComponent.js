import { Avatar, Fab, List, ListItem, ListItemIcon, ListItemText, Paper, TextField, createTheme } from "@mui/material";
import { Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import * as React from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase-config.js";
import { addDoc, and, collection, doc, documentId, getDoc, getDocs, getFirestore, onSnapshot, or, where } from "firebase/firestore";
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import SendIcon from '@mui/icons-material/Send';
import { query } from "firebase/database";
import moment from 'moment';
import styled from "@emotion/styled";
import { ThemeProvider } from "@emotion/react";



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

const OutlinedListItemText = styled(ListItemText)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  maxWidth: 'auto',
}));

const PatrolGroupChatComponent = ({ documentData }) => {

  const [isLoaded, setIsLoaded] = React.useState(false);

  const { taskId } = useParams();

  const currentUserId = auth.currentUser.uid

  const [chatList, setChatList] = React.useState([]);

  const [currentChat, setCurrentChat] = React.useState();

  const getChatUsersDataFromFirestore = async () => {
    if (auth.currentUser) {
      const database = getFirestore();
      const collectionRef = collection(database, 'User');
      const documentQuery = query(collectionRef, where(documentId(), 'in', documentData.patrolParticipants));
      const querySnapshot = await getDocs(documentQuery)
      const chatParticipantsData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const participant = {
          userId: data.userId,
          name: data.name,
          surname: data.surname
        };
        chatParticipantsData.push(participant);
      });
      setChatList(chatParticipantsData);
      setCurrentChat(chatParticipantsData[0].userId)
    }
  }

  const [messageList, setMessageList] = React.useState([]);

  const getMessagesFromFirestore = async (taskId, currentUserId, chatParticipantId) => {
    if (auth.currentUser) {
      const database = getFirestore();
      const messagesRef = collection(database, 'Chat')
      const messageQuery = query(messagesRef, where('taskId', '==', taskId),
        or(
          and(
            where('receiverId', '==', currentUserId),
            where('senderId', '==', chatParticipantId)),
          and(
            where('receiverId', '==', chatParticipantId),
            where('senderId', '==', currentUserId))
        )
      );

      const unsubscribe = onSnapshot(messageQuery, (querySnapshot) => {
        const chatMessages = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const messageData = {
            message: data.message,
            senderId: data.senderId,
            receiverId: data.receiverId,
            date: data.date
          };
          chatMessages.push(messageData);
        });
        const sortedMessageData = chatMessages.sort((a, b) => a.date - b.date);
        setMessageList(sortedMessageData);
        setIsLoaded(true);
        // console.log(sortedMessageData);
      })
    }
  };

  const [currentMessage, setCurrentMessage] = React.useState("");
  const handleChatBoxChange = (event) => {
    setCurrentMessage(event.target.value)
    // console.log(event.target.value);
  };

  const handleSendClick = () => {
    const currentDate = new Date();
    sendMessageToFirebase(taskId, currentMessage, currentDate, currentUserId, currentChat);
    handleChatBoxChange({ target: { value: "" } })
  };

  const sendMessageToFirebase = async (taskId, message, date, senderId, receiverId) => {
    if (auth.currentUser) {
      const database = getFirestore();
      const collectionRef = collection(database, 'Chat');
      const docRef = await addDoc(collectionRef, {
        taskId: taskId,
        message: message,
        date: date,
        senderId: senderId,
        receiverId: receiverId
      })
      // console.log("Added new document with ID: ", docRef.id);
    }
  };

  const handleChatItemClick = (personId) => {
    setCurrentChat(personId)
  };

  const listContainerRef = React.useRef(null);

  const scrollToBottom = () => {
    if (listContainerRef.current) {
      // listContainerRef.current.scrollTop = listContainerRef.current.scrollHeight;
      listContainerRef.current.scrollIntoView({ behavior: "smooth"})
    }
  }

  React.useEffect(() => {
    setIsLoaded(false);
    getChatUsersDataFromFirestore();
  }, []);

  React.useEffect(() => {
    getMessagesFromFirestore(taskId, currentUserId, currentChat);
  }, [currentChat]);

  React.useEffect(() => {
    scrollToBottom();
  }, [messageList]);


  return (
    <div>
      <React.Fragment>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }, position: 'relative' }}>
          {isLoaded ? (
            <Grid container component={Paper}>
              <Grid item xs={2}>
                <List>
                  {chatList.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem button onClick={() => handleChatItemClick(item.userId)}>
                        <ListItemText primary={`${item.name} ${item.surname}`} />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid item xs={9}>        
                <List style={{ maxHeight: "600px", overflow: "auto", minHeight: "600px" }}>            
                    {messageList.length === 0 ? (
                      <Grid>
                        <Typography variant="h5" align="center">
                          No messages to/from user yet.
                        </Typography>
                      </Grid>
                    ) : (
                      messageList.map((item, index) => {
                        if (item.senderId === currentUserId) {
                          return (
                            <ListItem key={index}>
                              <Grid container>
                                <Grid item xs={12}>
                                  {/* <OutlinedListItemText align="right" primary={item.message} /> */}
                                  <ListItemText align="right">
                                    <TextField
                                      variant='outlined'
                                      margin="normal"
                                      multiline
                                      value={item.message}
                                      disabled
                                      InputProps={{
                                        style: { backgroundColor: "#A9AC5D" }
                                      }}
                                      sx={{
                                        "& .MuiInputBase-input.Mui-disabled": {
                                          WebkitTextFillColor: "#000000",
                                        },
                                      }}
                                    />
                                  </ListItemText>
                                </Grid>
                                <Grid item xs={12}>
                                  <ListItemText align="right" secondary={moment(item.date.toDate()).format('DD/MM/YYYY HH:mm')} />
                                </Grid>
                              </Grid>
                            </ListItem>
                          );
                        } else {
                          return (
                            <ListItem key={index}>
                              <Grid container>
                                <Grid item xs={12}>
                                  {/* <OutlinedListItemText align="left" primary={item.message} /> */}
                                  <ListItemText align="left">
                                    <TextField
                                      variant='outlined'
                                      margin="normal"
                                      multiline
                                      value={item.message}
                                      disabled
                                      InputProps={{
                                        style: { backgroundColor: "#A9AC5D" }
                                      }}
                                      sx={{
                                        "& .MuiInputBase-input.Mui-disabled": {
                                          WebkitTextFillColor: "#000000",
                                        },
                                      }}
                                    />
                                  </ListItemText>
                                </Grid>
                                <Grid item xs={12}>
                                  <ListItemText align="left" secondary={moment(item.date.toDate()).format('DD/MM/YYYY HH:mm')} />
                                </Grid>
                              </Grid>
                            </ListItem>
                          );
                        }
                      })
                    )}
                  <div ref={listContainerRef}/>
                </List>
                <Divider />
                {/* Text box and send icon */}
                <Grid container style={{ padding: '20px' }}>
                  <Grid item xs={11}>
                    <TextField
                      label="Type Something"
                      fullWidth
                      required
                      id="chatBox"
                      name="chatBox"
                      value={currentMessage}
                      onChange={handleChatBoxChange}
                    >
                    </TextField>
                  </Grid>
                  <Grid item xs={1} align="right">
                    <Fab color="primary" aria-label="add">
                      <SendIcon onClick={() => handleSendClick()} />
                    </Fab>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Typography>
              Loading...
            </Typography>
          )}
        </Paper>
      </React.Fragment>
    </div>
  );
};

export default PatrolGroupChatComponent;

