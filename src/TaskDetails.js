import { useParams } from "react-router-dom";
import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListItemText from '@mui/material/ListItemText';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase-config.js";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import TaskDetailsComponent from "./Components/TaskDetailsComponent.js";
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import MapIcon from '@mui/icons-material/Map';
import ChatIcon from '@mui/icons-material/Chat';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme({
  palette: {
    primary: {
      main: "#A9AC5D"
    },
    secondary: {
      main: "#E8E1DB"
    },
    tertiary: {
      default: "#3A3C26"
    },
    background: {
      default: "#E8E1DB"
    },
  },
});


const MapComponent = () => {
  return (
    <div>
      MapComponent
    </div>
  )
}

const ChatComponent = () => {
  return (
    <div>
      ChatComponent
    </div>
  )
}

export function TaskDetails() {
  const { taskId } = useParams();
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const navigate = useNavigate();

  const handleReturnClick = () => {
    navigate("/home");
  }

  const [documentData, setDocumentData] = React.useState(null);

  const getDocumentDetails = async () => {
    const user = await new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });

    if (user) {
      const database = getFirestore();
      const docRef = doc(database, 'Tasks', `${taskId}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        setDocumentData(docSnap.data());
        setIsLoaded(true);
      } else {
        console.log("No such document!");

      }
    };
  }

  React.useEffect(() => {
    getDocumentDetails();
  }, [])

  React.useEffect(() => {
    if (documentData) {
      setSelectedComponent(<TaskDetailsComponent documentData={documentData} />);
    }
  }, [documentData]);


  const [isLoaded, setIsLoaded] = React.useState(false);

  const [selectedComponent, setSelectedComponent] = React.useState(null);
  const handleItemClick = (component) => {
    setSelectedComponent(component);
  };

  const mainListItems = (
    <React.Fragment>
      <ListItemButton onClick={() => handleItemClick(<TaskDetailsComponent documentData={documentData} />)}>
        <ListItemIcon>
          <ListAltIcon />
        </ListItemIcon>
        <ListItemText primary="Task details" />
      </ListItemButton>
      <ListItemButton onClick={() => handleItemClick(MapComponent)}>
        <ListItemIcon>
          <MapIcon />
        </ListItemIcon>
        <ListItemText primary="View map" />
      </ListItemButton>
      <ListItemButton onClick={() => handleItemClick(ChatComponent)}>
        <ListItemIcon>
          <ChatIcon />
        </ListItemIcon>
        <ListItemText primary="Patrol group chat" />
      </ListItemButton>
      {/* <List>
          {menuItems.map(item => (
            <ListItem
              key={item.id}
              button
              onClick={() => handleItemClick(item.id)}
            >
              <ListItemText primary={item.label} />
            </ListItem>
          ))}  
        </List> */}
    </React.Fragment>
  );

  const secondaryListItems = (
    <React.Fragment>
      <ListItemButton onClick={() => handleReturnClick()}>
        <ListItemIcon>
          <KeyboardReturnIcon />
        </ListItemIcon>
        <ListItemText primary="Return to home" />
      </ListItemButton>
    </React.Fragment>
  )

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px',
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            {/* To do przeróbki */}
            {isLoaded ? (
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                Task details
              </Typography>
            ) : (
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                Loading data...
              </Typography>
            )}
            {/* <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton> */}
            {/* <IconButton color="inherit"  onClick={() => handleReturnClick()}>
                <Typography
                      component="h1"
                      variant="h6"
                      color="inherit"
                      noWrap
                      sx={{ flexGrow: 1, marginRight: '4px'}}
                    >
                      Return
                  </Typography>
                  <Badge>
                  <ExitToAppIcon />
                </Badge>
              </IconButton> */}
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {isLoaded ? (
              <div className="render-container">
                {selectedComponent}
              </div>
            ) : (
              <Typography>
                Loading...
              </Typography>
            )}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}