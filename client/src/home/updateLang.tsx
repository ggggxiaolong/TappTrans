import React, { useContext } from "react";
import { useStyles } from "./styles";
import { allLanguage, languagesMap } from "./config";
import { Dialog, AppBar, Toolbar, Typography, TextField, List, ListItem, Divider, IconButton, Button, FormGroup, FormControl, LinearProgress, Select, MenuItem, InputLabel } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import LanguageIcon from '@material-ui/icons/Language';

export default function UpdateLang(){
    const classes = useStyles();
    const [openDialog, setOpenDialog] = React.useState(false);
    return(
    <Dialog fullWidth maxWidth="md" scroll="paper" open={openDialog}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => setOpenDialog(false)} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Sound
              </Typography>
            <Button autoFocus color="inherit" onClick={() => setOpenDialog(false)}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <List className={classes.dialogItem}>
          {allLanguage.map(l => {
            return <>
              <ListItem button>{languagesMap.get(l)}</ListItem>
              <ListItem>
                <TextField className={classes.dialogInput} />
                {l === 'en' && <IconButton><LanguageIcon /></IconButton>}
              </ListItem>
              <Divider />
            </>
          })}
          <ListItem>
            <FormGroup row>
              <FormControl className={classes.dialogForm}>
                <InputLabel id="demo-simple-select-label">Project</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={1}
                >
                  <MenuItem value={1}>ToC</MenuItem>
                  <MenuItem value={2}>ToB_Pad</MenuItem>
                  <MenuItem value={3}>ToB_Staff</MenuItem>
                </Select>
              </FormControl>
              <FormControl className={classes.dialogForm}>
                <TextField label="Model name" />
              </FormControl>
              <FormControl className={classes.dialogForm}>
                <TextField label="Label name" />
              </FormControl>
            </FormGroup>
          </ListItem>
        </List>
        <LinearProgress />
      </Dialog>
      );
}