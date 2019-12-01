import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
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
import { gql } from "apollo-boost";
import { Languages } from "../entity/Languages";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%"
    },
    tableWrapper: {
      overflow: "auto"
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120
    },
    searchRoot: {
      padding: "2px 4px",
      display: "flex",
      alignItems: "center",
      width: 400
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1
    },
    iconButton: {
      padding: 10
    },
    margin: {
      margin: theme.spacing(1)
    },
    withoutLabel: {
      marginTop: theme.spacing(3)
    },
    textField: {
      width: 200
    }
  })
);

interface SearchParam {
  projectId: ProjectId;
  languages: Array<Language>;
  search: string;
  page: number;
}

type Language = "en" | "ja" | "ko" | "sk" | "cs" | "fr" | "es";
type ProjectId = number;
const allLanguage: Array<Language> = ["en", "ja", "ko", "sk", "cs", "fr", "es"];

const defaultSearchParam: SearchParam = {
  projectId: 2,
  languages: allLanguage.slice(),
  search: "",
  page: 0
};

const languagesMap: Map<string, string> = new Map([
  ["en", "English"],
  ["ja", "Japanese"],
  ["ko", "Korean"],
  ["sk", "Slovak"],
  ["cs", "Czech"],
  ["fr", "French"],
  ["es", "Spanish"]
]);

const LANGQUERY = (param: SearchParam) => gql`
  query language($page: Int, $search: String , $projectId: Int) {
    language(page: $page, search: $search, projectId: $projectId) {
      ${param.languages.join(" ")}
    }
  }
`;

export default function Home() {
  const classes = useStyles();
  const [param, setParam] = React.useState(defaultSearchParam);
  const { loading, error, data } = useQuery<Languages>(LANGQUERY(param), {
    variables: { ...param }
  });

  const handleProject = (event: React.ChangeEvent<{ value: unknown }>) => {
    setParam({ ...param, projectId: event.target.value as number });
  };

  const handleLanguage = (name: Language) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (param.languages.includes(name)) {
      param.languages.splice(param.languages.indexOf(name), 1);
    } else {
      param.languages.splice(allLanguage.indexOf(name), 0, name);
    }
    setParam({
      ...param,
      languages: param.languages
    });
  };

  const handleClearSearch = () => {
    if (param.search != null || param.search != "") {
      setParam({ ...param, search: "" });
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParam({ ...param, search: event.target.value.trim() });
  };

  return (
    <Paper className={classes.root}>
      <FormGroup row>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Project</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={param.projectId}
            onChange={handleProject}
          >
            <MenuItem value={1}>ToC</MenuItem>
            <MenuItem value={2}>ToB_Pad</MenuItem>
            <MenuItem value={3}>ToB_Staff</MenuItem>
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
      <div className={classes.tableWrapper}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {param.languages.map(lang => (
                <TableCell key={"head_"+lang} align="inherit" style={{ minWidth: 170 }}>
                  {languagesMap.get(lang)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.language.map(row => {
                const rowKey = String(row.id);
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={rowKey}>
                    {param.languages.map(column => {
                      const value = row[column];
                      return (
                        <TableCell key={rowKey + column}>{value}</TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </Paper>
  );
}
