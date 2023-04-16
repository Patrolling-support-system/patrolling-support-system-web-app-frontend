// import * as React from 'react';
// import { styled, alpha } from '@mui/material/styles';
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import InputBase from '@mui/material/InputBase';
// import MenuIcon from '@mui/icons-material/Menu';
// import SearchIcon from '@mui/icons-material/Search';
// import { Grid} from '@mui/material';
// import {TextField} from '@mui/material';
// import { useState } from 'react';
// import {InputAdornment} from '@mui/material';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import InputLabel from '@mui/material/InputLabel';
// import FormControl from '@mui/material/FormControl';
// import { DataGrid } from '@mui/x-data-grid';
// import { collection, getDocs, getFirestore, query, where} from 'firebase/firestore'
// import { auth } from "../firebase-config.js";



// export function ReviewTaskForm({
//     taskName,
//     locationName,
//     taskDescription,
//     taskStartDate,
//     taskEndDate,
//     selectedParticipants,
// }) {


//   return (
// <React.Fragment>
//           <Typography variant="h6" gutterBottom>
//             Enter task details: 
//           </Typography>
//           <Grid container spacing={4}>
//             <Grid item xs={12} sm={10}>
//                 <Typography>
//                     Task name: {taskName}
//                 </Typography>
//             </Grid>
//             <Grid item xs={12} sm={10}>
//                 <Typography>
//                     Location name: {locationName}
//                 </Typography>
//             </Grid>
//             <Grid item xs={12} sm={10}>
//                 <Typography>
//                     Task Participants: {selectedParticipants}
//                 </Typography>
//             </Grid>
//             <Grid item xs={12} sm={10}>
//                 <Typography>
//                     Task start date: {taskStartDate}
//                 </Typography>
//             </Grid>
//             <Grid item xs={12} sm={10}>
//                 <Typography>
//                     Task end date: {taskEndDate}
//                 </Typography>
//             </Grid>
//             <Grid item xs={12} sm={10}>
//                 <Typography>
//                     Task description: {taskDescription}
//                 </Typography>
//             </Grid>
//           </Grid>
//         </React.Fragment>
//       );
// }