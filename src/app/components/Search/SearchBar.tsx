import React from "react";
import { MagnifyingGlass as SearchIcon } from "@phosphor-icons/react";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

const SearchBar = () => {
  return (
    <FormControl sx={{ m: 1, width: "60%" }} variant="outlined">
      <InputLabel htmlFor="outlined-adornment-search">
        Find a location
      </InputLabel>
      <OutlinedInput
        id="outlined-adornment-search"
        endAdornment={
          <InputAdornment position="end">
            <IconButton type="submit" aria-label="search-icon">
              <SearchIcon style={{ fill: "blue" }} />
            </IconButton>
          </InputAdornment>
        }
        label="Find a location"
        placeholder="Search..."
      />
    </FormControl>
  );
};

export default SearchBar;
