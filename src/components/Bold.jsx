import React from 'react';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

/**
 *
 * @description Bolds the children, while keeping typography intact
 * @arg {Object} props
 * @arg {PropTypes.ReactNodeArray|PropTypes.ReactNodeLike} props.children
 */
export default function Bold({ children }) {
    return (
        <Typography component='div'>
            <Box fontWeight='fontWeightBold'>{children}</Box>
        </Typography>
    );
}

Bold.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.array]).isRequired,
};