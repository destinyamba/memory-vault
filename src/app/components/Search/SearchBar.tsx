import React, { useState } from "react";
import { MagnifyingGlass as SearchIcon } from "@phosphor-icons/react";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    onSearch(searchQuery);
  };
  return (
    <FormControl sx={{ m: 1, width: "60%" }} variant="outlined">
      <InputLabel htmlFor="outlined-adornment-search">
        Find a location
      </InputLabel>
      <OutlinedInput
        onChange={handleInputChange}
        id="outlined-adornment-search"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              type="submit"
              aria-label="search-icon"
              onClick={handleSearchSubmit}
            >
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
