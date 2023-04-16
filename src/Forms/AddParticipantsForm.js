import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Grid} from '@mui/material';
import {TextField} from '@mui/material';
import { useState } from 'react';
import {InputAdornment} from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { DataGrid } from '@mui/x-data-grid';
import { collection, getDocs, getFirestore, query, where} from 'firebase/firestore'
import { auth } from "../firebase-config.js";
import ReplayIcon from '@mui/icons-material/Replay';

const columns = [
  // { field: 'userId', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'First name', width: 180 },
  { field: 'surname', headerName: 'Last name', width: 180 },
  { field: 'supervisor', headerName: 'Supervisor', width: 190 },
];


export function AddParticipantsForm({
  selectedRows,
  handleSelectionModelChange
}) {

  const [rows, setRows] = useState([]);

  const getRowsFromFirestore = async () =>{
    if(auth.currentUser) {
      const database = getFirestore();
      const q = query(collection(database, 'User'));
      const querySnapshot = await getDocs(q);
      const fetchedRows = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedRows.push({
          id: doc.id,
          surname: data.surname,
          name: data.name,
          supervisor: data.supervisor,
        });
      });
      setRows(fetchedRows);
    }
  }

  React.useEffect(() => {
    getRowsFromFirestore();
  }, []);

  const [search, setSearch] = useState("");
  const onSearchChange = (event) => {
    setSearch(event.target.value);
    if (event.key === 'Enter') {
      handleSearchChange(event.target.value);
    }
  }

  const handleSearchChange = async (search) => { 

    if(auth.currentUser) {
      const database = getFirestore();
      // Tutaj zmodyfikować albo kod albo dane w bazie żeby dało się robić query na więcej niż jednym polu
      const q = query(collection(database, 'User'), where("name", "==" , search));
      const querySnapshot = await getDocs(q);
      const fetchedRows = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedRows.push({
          id: doc.id,
          surname: data.surname,
          name: data.name,
          supervisor: data.supervisor,
        });
      });
      setRows(fetchedRows);
  }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <React.Fragment>
        <Grid container spacing={4} justify='center' alignItems='center'>
          <Grid item xs={12} sm={10} margin={10}>
            <TextField
            id="search"
            type="search"
            label="Search"
            fullWidth
            placeholder='Search participants'
            value={search}
            onChange={onSearchChange}
            onKeyDown={onSearchChange}
            InputProps={{
              endAdornment: (
                <React.Fragment>
                <IconButton onClick={() => getRowsFromFirestore()}>
                  <ReplayIcon/>
                </IconButton>
                <IconButton onClick={() => handleSearchChange(search)}>
                  <SearchIcon/>
                </IconButton>
                </React.Fragment>
              ),
            }}
          />
            <div style={{ height: 400, width: '100%' }}>
             <DataGrid
               rows={rows}
               columns={columns}
               pageSize={5}
               rowsPerPageOptions={[5]}
               checkboxSelection
              onRowSelectionModelChange={handleSelectionModelChange}
             />
            </div>
          </Grid>
        </Grid>
      </React.Fragment>
    </Box>
  );
}