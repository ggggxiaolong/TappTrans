import React, { useContext, useState } from "react";
import { useStyles } from "./styles";
import { allLanguage, languagesMap, allProject, QUERY_TRANS, MUTATION_ADD_LANG } from "./config";
import { Dialog, AppBar, Toolbar, Typography, TextField, List, ListItem, Divider, IconButton, Button, FormGroup, FormControl, Select, MenuItem, InputLabel } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import LanguageIcon from '@material-ui/icons/Language';
import { AddLang } from "../entity/addLang";
import { useQuery, useApolloClient } from "@apollo/react-hooks";
import { TokenContext } from "../config/clinetProvicer";
import { TransReturn } from "../entity/TransReturn";

const defaultLang = new AddLang();

interface Props {
  open: boolean;
  projectId: number;
  onSuccess(): void;
  onFail(message: string): void;
  onClose(): void;
}

export default function AddLangDialog(prop: Props) {
  const classes = useStyles();
  const [lang, setLang] = useState(defaultLang);
  const refreshToken = useContext(TokenContext);
  const [skip, setSkip] = useState(true);

  useQuery<TransReturn>(QUERY_TRANS, {
    variables: { en: lang.en },
    onCompleted: result => {
      const data = result.trans
      const newLang = { ...lang, cs: data.cs, ja: data.ja, ko: data.ko, sk: data.sk, fr: data.fr, es: data.es }
      setLang(newLang)
      setSkip(true)
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
      setSkip(true)
    },
    skip: skip
  })

  const transLang = () => {
    if (lang.en) {
      setSkip(false)
    }
  };

  const client = useApolloClient();

  function onSave() {
    client.mutate({
      mutation: MUTATION_ADD_LANG,
      variables: {add: {...lang, project_id: prop.projectId}}
    }).then(r => {console.log(r)})
    .catch(e => {console.log(e)})
  };

  const handleInput = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    const newLang = { ...lang, [key]: value };
    console.log(newLang)
    setLang(newLang)
  };

  return (
    <Dialog fullWidth maxWidth="md" scroll="paper" open={prop.open} >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={prop.onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Add Langguage
              </Typography>
          <Button autoFocus color="inherit" onClick={onSave}>
            save
            </Button>
        </Toolbar>
      </AppBar>
      <List className={classes.dialogItem}>
        {allLanguage.map(l => {
          return <>
            <ListItem button>{languagesMap.get(l)}</ListItem>
            <ListItem>
              <TextField className={classes.dialogInput} value={lang[l]} onChange={handleInput(l)} />
              {l === 'en' && <IconButton onClick={transLang}><LanguageIcon /></IconButton>}
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
                {allProject.filter(p => p.id === prop.projectId).map(project => <MenuItem value={project.id} key={`project_menu_${project.id}`}>{project.name}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl className={classes.dialogForm}>
              <TextField label="Model name" value={lang.mode_name} onChange={handleInput('mode_name')}/>
            </FormControl>
            <FormControl className={classes.dialogForm}>
              <TextField label="Label name"  value={lang.label} onChange={handleInput('label')}/>
            </FormControl>
          </FormGroup>
        </ListItem>
      </List>
    </Dialog>
  );
}