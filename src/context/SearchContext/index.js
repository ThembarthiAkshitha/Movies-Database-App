import React from 'react'

const SearchContext = React.createContext({
  searchInput: '',
  onSearchChange: () => {},
})

export default SearchContext
