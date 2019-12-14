import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { green } from '@material-ui/core/colors';

export const useStyles = makeStyles((theme: Theme) =>
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
    },
    progress: {
      width: "100%",
      textAlign: "center",
      "& > * + *": {
        marginTop: theme.spacing(2)
      },
      "& > *": {
        margin: theme.spacing(1)
      }
    },
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    updateWord: {
      color: green[500]
    },
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    dialogInput: {
      width: "100%"
    },
    dialogItem: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    dialogForm: {
      marginRight: theme.spacing(2),
    }
  })
);