/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Avatar, Typography } from '@material-ui/core';
import { ProfileInfoFormat } from 'domains/AdminDashboard/types';

const useStyles = makeStyles((theme) => ({
    image: {
        width: 100,
        height: 100,
    },
    typographySpacing: {
        marginLeft: theme.spacing(3),
    },
}));

export interface Props {
    profileInfo: ProfileInfoFormat;
}

const UserInfo = ({ profileInfo }: Props) => {
    const classes = useStyles();

    const formatedInfo = profileInfo.info.map((row) => {
        return (
            <Typography className={classes.typographySpacing} key={row.role}>
                {row.role}:{row.count}
            </Typography>
        );
    });
    return (
        <Grid container spacing={2}>
            <Grid item>
                <Avatar className={classes.image} />
            </Grid>
            <Grid item>
                <Typography variant='body1'>{profileInfo.primary}</Typography>
                {formatedInfo}
            </Grid>
        </Grid>
    );
};

UserInfo.propTypes = {
    profileInfo: PropTypes.shape({
        primary: PropTypes.string.isRequired,
        info: PropTypes.arrayOf(
            PropTypes.shape({
                role: PropTypes.string.isRequired,
                count: PropTypes.number.isRequired,
                active: PropTypes.bool.isRequired,
            }).isRequired
        ),
    }).isRequired,
};

export default UserInfo;
