import React, { useContext, useState } from "react";
import { useStyles } from "./styles";
import { Transition, allLanguage, languagesMap } from "./config";
import { Dialog, AppBar, Toolbar, Typography, TextField, List, ListItem, Divider, IconButton, Button, FormGroup, FormControl, LinearProgress, Select, MenuItem, InputLabel } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import LanguageIcon from '@material-ui/icons/Language';
import { AddLang } from "../entity/addLang";
import { useQuery } from "@apollo/react-hooks";
import { QUERY_TRANS } from './config';
import { Trans } from "../entity/trans";
import { onError } from "apollo-link-error";
import { TokenContext } from "../config/clinetProvicer";

const defaultLang = new AddLang();

interface Props {
  open: boolean;
  projectId: number;
  onSuccess(): void;
  onFail(message: string): void
}




export default function AddLangDialog(prop: Props) {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState(false);
  const [lang, setLang] = useState(defaultLang);
  const refreshToken = useContext(TokenContext)

  const transLang = () => {
    if (lang.en) {
      useQuery<Trans>(QUERY_TRANS, {
        variables: { en: lang.en },
        onCompleted: result => {
          setLang({ ...lang, en: result.en, cs: result.cs, ja: result.ja, ko: result.ko, sk: result.sk, fr: result.fr, es: result.es })
        },
        onError: error => {
          const message = error.graphQLErrors[0].message
          if (message === "CODE_TOKEN_EXPIRE") {
            refreshToken.refresh().then(r => {
              if (!r) {
                prop.onFail(message)
              }
            }).catch(e => {
              prop.onFail(e.graphQLErrors[0].message)
            })
          }
        }
      })
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLang({...lang, en:event.target.value.trim()})
  };

  return (
    <Dialog fullWidth maxWidth="md" scroll="paper" open={openDialog} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setOpenDialog(false)} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Add Langguage
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
              <TextField className={classes.dialogInput} value={lang[l]} />
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
                value={prop.projectId}
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