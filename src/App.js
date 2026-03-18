import './App.css'
import {Switch, Route, BrowserRouter} from 'react-router-dom'
import {Component} from 'react'
import Home from './components/Home'
import TopRated from './components/TopRated'
import Upcoming from './components/Upcoming'
import ViewDetails from './components/ViewDetails'
import SearchMovieDetails from './components/SearchedMovies'
import SearchContext from './context/SearchContext'

// write your code here

class App extends Component {
  state = {
    searchInputValue: '',
  }
  // this is for on change of search input

  onSearchInputChange = searchMovieName => {
    this.setState({
      searchInputValue: searchMovieName,
    })
  }

  render() {
    const {searchInputValue} = this.state
    return (
      <SearchContext.Provider
        value={{
          searchInput: searchInputValue,
          onSearchChange: this.onSearchInputChange,
        }}
      >
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/top-rated" component={TopRated} />
            <Route exact path="/upcoming" component={Upcoming} />
            <Route exact path="/movie/:id/" component={ViewDetails} />
            <Route
              exact
              path="/searchedMovieDetails/"
              component={SearchMovieDetails}
            />
          </Switch>
        </BrowserRouter>
      </SearchContext.Provider>
    )
  }
}

export default App
