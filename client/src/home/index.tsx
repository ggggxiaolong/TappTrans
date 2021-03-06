import React, { useContext } from "react";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import Button from "@material-ui/core/Button";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import FormGroup from "@material-ui/core/FormGroup";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import Clear from "@material-ui/icons/Clear";
import Search from "@material-ui/icons/Search";
import { useQuery } from "@apollo/react-hooks";
import { Languages } from "../entity/Languages";
import LinearProgress from "@material-ui/core/LinearProgress";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { TokenContext } from "../config/clinetProvicer";
import { Redirect } from "react-router-dom";
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import { Dialog, AppBar, Toolbar, Typography, TextField, List, ListItem, Divider } from "@material-ui/core";
import LanguageIcon from '@material-ui/icons/Language';
import { useStyles } from "./styles";
import { Language, Result, defaultResult, defaultSearchParam, LANGQUERY, firstPageNum, SearchParam, allLanguage, languagesMap, updateLangMap, allProject } from "./config";
import AddLangDialog from "./addLangDialog";

export default function Home() {
  const classes = useStyles();
  const [result, setResult] = React.useState<Result>(defaultResult);
  const [loading, setLoading] = React.useState(false);
  const [param, setParam] = React.useState(defaultSearchParam);
  const refreshToken = useContext(TokenContext)
  const [redirect, setRedirect] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);

  useQuery<Languages>(LANGQUERY(param), {
    variables: { ...param },
    onCompleted: data => {
      const hasMore = data.language.length >= param.pageSize;
      if (param.page === firstPageNum) {
        setResult({ param: param, data: data.language, hasMore: hasMore, error: null });
      } else {
        result.data.push(...data.language);
        setResult({ param: param, data: result.data, hasMore: hasMore, error: null });
      }
      setParam(param)
      setLoading(false)
    },
    onError: error => {
      const message = error.graphQLErrors[0].message
      if (message === "CODE_TOKEN_EXPIRE") {
        refreshToken.refresh().then(r => {
          if (r) {
            const lastParam = result.param
            lastParam.page = lastParam.page === firstPageNum ? firstPageNum : lastParam.page - 1;
            setResult({ ...result, error: error, param: { ...lastParam } })
            setParam(lastParam)
            setLoading(false)
          } else {
            setRedirect(true)
          }
        }).catch(e => {
          setRedirect(true)
        })
      }
    }
  });

  const handleProject = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newParam = { ...param, projectId: event.target.value as number, page: firstPageNum }
    feachData(newParam);
  };

  const nextPage = () => {
    if (!loading) {
      const newParam = { ...param, page: param.page + 1 }
      feachData(newParam);
    }
  };

  const handleLanguage = (name: Language) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (param.languages.includes(name)) {
      param.languages.splice(param.languages.indexOf(name), 1);
    } else {
      param.languages.splice(allLanguage.indexOf(name), 0, name);
    }
    const newParam = {
      ...param,
      page: firstPageNum,
      languages: param.languages
    }
    feachData(newParam);
  };

  const handleClearSearch = () => {
    if (param.search != null || param.search !== "") {
      const newParam = { ...param, search: "", page: firstPageNum }
      feachData(newParam);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newParam = { ...param, search: event.target.value.trim(), page: firstPageNum }
    feachData(newParam);
  };

  const feachData = (param: SearchParam) => {
    setParam(param);
    setLoading(true);
  };

  if (redirect) return <Redirect to="/" />
  return (
    <Paper className={classes.root} key="home_root">
      <FormGroup row>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Project</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={param.projectId}
            onChange={handleProject}
          >
            {allProject.map(project => <MenuItem key={`project_menu_${project.id}`} value={project.id} >{project.name}</MenuItem>)}
          </Select>
        </FormControl>
        {allLanguage.map(lang => (
          <FormControlLabel
            key={"row" + lang}
            control={
              <Checkbox
                checked={param.languages.includes(lang)}
                onChange={handleLanguage(lang)}
                value={lang}
                color="primary"
              />
            }
            label={languagesMap.get(lang)}
          />
        ))}

        <FormControl>
          <InputLabel htmlFor="standard-adornment-password">Search</InputLabel>
          <Input
            id="standard-adornment-password"
            type="text"
            value={param.search}
            onChange={handleSearch}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClearSearch}
                >
                  {param.search ? <Clear /> : <Search />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </FormGroup>
      <Fab color="primary" aria-label="add" className={classes.fab} onClick={() => setOpenDialog(true)}>
        <AddIcon />
      </Fab>
      <div className={classes.tableWrapper} key="table_root">
        <Table stickyHeader aria-label="sticky table" key="table">
          <TableHead key="table_head">
            <TableRow>
            <TableCell
                key={`head_status`}
                align="inherit"
                style={{ minWidth: 30 }}
              >
                Label
              </TableCell>
              {param.languages.map(lang => (
                <TableCell
                  key={`head_${lang}`}
                  align="inherit"
                  style={{ minWidth: 170 }}
                >
                  {languagesMap.get(lang)}
                </TableCell>
              ))}
              <TableCell
                key={`head_action`}
                align="inherit"
                style={{ minWidth: 30 }}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.data.map(row => {
              const rowKey = `${param.projectId}_${row.id}`;
              const status = row['status'] as number;
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={rowKey}>
                  <TableCell key={`${rowKey}_label`}>{row['label']}</TableCell>
                  {
                    param.languages.map(column => {
                      const updateKey = updateLangMap.get(column);
                      if (status === 1 && updateKey) {
                        const value = row[column];
                        const updateValue = row[updateKey]
                        return <TableCell key={`${rowKey}_${column}`}>{value}<br /><span className={classes.updateWord}>{updateValue}</span></TableCell>;
                      } else if (status === 2) {
                        const value = row[column];
                        return <TableCell key={`${rowKey}_${column}`}><span className={classes.updateWord}>{value}</span></TableCell>;
                      } else {
                        const value = row[column];
                        return <TableCell key={`${rowKey}_${column}`}>{value}</TableCell>;
                      }
                    })
                  }
                  <TableCell key={`${rowKey}_action`}>
                    <IconButton onClick={() => setOpenDialog(true)}><EditIcon /></IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className={classes.progress}>
        {loading ? (
          <LinearProgress />
        ) : result.hasMore ? (
          <Button variant="contained" color="primary" onClick={nextPage}>
            Load more
          </Button>
        ) : (
              <hr />
            )}
      </div>
      <AddLangDialog open={openDialog} projectId={param.projectId} onFail={(message)=>{}} onSuccess={()=>{}} onClose={ () => setOpenDialog(false)}/>
    </Paper>
  );
}
