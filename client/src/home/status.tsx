import React from "react";
import BookmarkBorder from "@material-ui/icons/BookmarkBorder";
import Cached from "@material-ui/icons/Autorenew";
import Check from "@material-ui/icons/CheckCircleOutline";
import { green } from '@material-ui/core/colors';
import Tooltip from '@material-ui/core/Tooltip';

const statusName = (status: number): string => {
    switch (status) {
        case 2: return 'New';
        case 1: return 'Update';
        default: return "Sync";
    }
};

const statusIcon = (status: number): JSX.Element => {
    switch (status) {
        case 2: return <BookmarkBorder style={{ color: green[500] }} />;
        case 1: return <Cached style={{ color: green[800] }} />;
        default: return <Check color='primary' />;
    }
};

type Props = {
    status: number
}

export default function Status(prop: Props) {
    const { status } = prop
    return <Tooltip title={statusName(status)} placement="right-start">
        {statusIcon(status)}
    </Tooltip>
}