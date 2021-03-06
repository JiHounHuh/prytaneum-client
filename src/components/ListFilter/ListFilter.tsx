import React from 'react';
import {
    IconButton,
    Grid,
    Menu,
    MenuItem,
    ListItemText,
    InputAdornment,
    Badge,
    Checkbox,
    Typography,
    Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FilterIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';

import TextField from 'components/TextField';
import { FilterFunc } from 'utils/filters';

interface Props<T> {
    onSearch: (s: string) => void;
    length: number;
    filterMap: {
        [index: string]: (t: T[]) => T[];
    };
    onFilterChange: (f: FilterFunc<T>[]) => void;
}

interface OptionalProps {
    menuIcons?: JSX.Element[];
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2, 0, 0, 0),
    },
    resultsText: {
        padding: theme.spacing(1, 0),
    },
    search: {
        flexBasis: 'content',
        flexGrow: 4,
    },
    icons: {
        flexBasis: 'content',
        flexGrow: 1,
    },
}));

type Filters = Set<string>;
type Op = (s: Filters) => void;

export default function ListFilter<T>({
    filterMap,
    onSearch,
    length,
    onFilterChange,
    menuIcons,
}: Props<T> & OptionalProps) {
    const classes = useStyles();
    const [filters, setFilters] = React.useState<Filters>(new Set());
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const [search, setSearch] = React.useState('');

    const immutableTransform = (op: Op) => (prevFilters: Filters) => {
        const copy = new Set(prevFilters);
        op(copy);
        const filterFuncs = Array.from(copy).map(
            (filterKey) => filterMap[filterKey]
        );
        onFilterChange(filterFuncs);
        return copy;
    };

    const toggleFilter = (filter: string) => {
        if (filters.has(filter)) {
            setFilters(immutableTransform((set) => set.delete(filter)));
        } else {
            setFilters(immutableTransform((set) => set.add(filter)));
        }
    };

    React.useEffect(() => {
        const cache = search.slice(0);
        const handle = setTimeout(() => {
            if (search === cache) onSearch(search);
        }, 300);
        return () => {
            clearTimeout(handle);
        };
    }, [search, onSearch]);

    //  TODO: cancel button, pressing escape will clear the search instantly rather than waiting for that delay
    return (
        <div className={classes.root}>
            <Grid container alignItems='center'>
                <Grid item xs='auto' className={classes.search}>
                    <TextField
                        label='Search'
                        value={search}
                        onChange={(e) => {
                            e.preventDefault();
                            const copy = e.target.value;
                            setSearch(copy);
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid
                    item
                    container
                    justify='space-evenly'
                    xs='auto'
                    alignItems='center'
                    className={classes.icons}
                >
                    <Grid item xs='auto'>
                        <Tooltip title='Filter'>
                            <IconButton
                                color='inherit'
                                onClick={({ currentTarget }) =>
                                    setAnchorEl(currentTarget)
                                }
                            >
                                <Badge
                                    badgeContent={filters.size}
                                    color='secondary'
                                >
                                    <FilterIcon />
                                </Badge>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    {menuIcons?.map((icon, idx) => (
                        <Grid key={idx} item xs='auto'>
                            {icon}
                        </Grid>
                    ))}
                </Grid>
                <Grid item xs={12} className={classes.resultsText}>
                    <Typography variant='body2' color='textSecondary'>
                        {`${length} Results Displayed`}
                    </Typography>
                </Grid>
            </Grid>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                {Object.keys(filterMap).map((option) => (
                    <MenuItem
                        key={option}
                        button
                        onClick={() => toggleFilter(option)}
                    >
                        <Checkbox checked={filters.has(option)} />
                        <ListItemText primary={option} />
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}

ListFilter.defaultProps = {
    menuIcons: [],
};
