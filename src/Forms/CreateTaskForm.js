// import * as React from 'react';
// import Grid from '@mui/material/Grid';
// import Typography from '@mui/material/Typography';
// import TextField from '@mui/material/TextField';
// import { useState } from 'react';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DateTimePicker } from '@mui/x-date-pickers';
// import 'dayjs/locale/pl';


// export function CreateTaskForm({
//   taskName,
//   locationName,
//   taskDescription,
//   taskStartDate,
//   taskEndDate,
//   onTaskNameChange,
//   onLocationChange,
//   onTaskDescriptionChange,
//   onTaskStartDateChange,
//   onTaskEndDateChange,
// }) {

//   return (
//     <React.Fragment>
//       <Typography variant="h6" gutterBottom>
//         Enter task details: 
//       </Typography>
//       <Grid container spacing={4}>
//         <Grid item xs={12} sm={10}>
//           <TextField
//             required
//             id="taskName"
//             name="taskName"
//             label="Task name"
//             fullWidth
//             variant="standard"
//             value={taskName}
//             onChange={onTaskNameChange}
//           />
//         </Grid>
//         <Grid item xs={12} sm={10}>
//           <TextField
//             required
//             id="locationName"
//             name="locationName"
//             label="Location name"
//             fullWidth
//             variant="standard"
//             value={locationName}
//             onChange={onLocationChange}
//           />
//         </Grid>
//         <Grid item xs={12} sm={10}>
//           <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='pl'>
//             <DateTimePicker
//               required
//               label='Task start time *'
//               slotProps={{ textField: { size: 'small' } }}
//               ampm={false}
//               format='DD/MM/YYYY HH:mm'
//               // value={selectedDate}
//               // onChange={handleDateChange}

//               // value={value} onChange={(newValue) => {
//               //   setValue(newValue); 
//               //   onTaskStartDateChange(newValue);
//               // }}
//               value={taskStartDate}
//               onChange={onTaskStartDateChange}
//             />
//           </LocalizationProvider>
//         </Grid>
//         <Grid item xs={12} sm={10}>
//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <DateTimePicker
//               required
//               label='Task end time *'
//               slotProps={{ textField: { size: 'small' } }}
//               ampm={false}
//               format='DD/MM/YYYY HH:mm'
//               // value={taskEndDate} onChange={onTaskEndDateChange}
//             />
//           </LocalizationProvider>
//         </Grid>
//         <Grid item xs={12} sm={12}>
//           <TextField
//             variant='outlined'
//             label='Task description'
//             fullWidth
//             multiline
//             value={taskDescription}
//             onChange={onTaskDescriptionChange}
//             />
//         </Grid>
//       </Grid>
//     </React.Fragment>
//   );
// }