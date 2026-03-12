import './index.css'
import {Link} from 'react-router-dom'
import {Component} from 'react'
import SearchContext from '../../context/SearchContext'

class Header extends Component {
  state = {
    searchInputValue: '',
  }

  onSearchChange = event => {
    this.setState({
      searchInputValue: event.target.value,
    })
  }

  render() {
    const {searchInputValue} = this.state
    return (
      <SearchContext.Consumer>
        {value => {
          const {onSearchChange} = value
          const onSearch = () => {
            onSearchChange(searchInputValue)
          }
          return (
            <nav className="header-main-bg-container">
              <h1>movieDB</h1>
              <Link to="/" className="link-style">
                <li>Popular</li>
              </Link>
              <Link to="/top-rated" className="link-style">
                <li>Top Rated</li>
              </Link>
              <Link to="/upcoming" className="link-style">
                <li>Upcoming</li>
              </Link>
              <div className="search-input-container">
                <input
                  type="text"
                  value={searchInputValue}
                  onChange={this.onSearchChange}
                  className="search-input"
                  placeholder="Search movie name here"
                />
                <Link to="/searchedMovieDetails/">
                  <button className="button" onClick={onSearch} type="button">
                    Search
                  </button>
                </Link>
              </div>
            </nav>
          )
        }}
      </SearchContext.Consumer>
    )
  }
}

export default Header
