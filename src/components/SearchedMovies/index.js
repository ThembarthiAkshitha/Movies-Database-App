import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'
import SearchContext from '../../context/SearchContext'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

const EachMovieDetails = props => {
  const {details} = props
  const {
    id,
    originalTitle,
    overview,
    posterPath,
    releaseDate,
    title,
    voteAverage,
  } = details
  return (
    <li className="movie-details-container">
      <img src={`${posterPath}`} className="movie-image-of-view-details" />
      <h1>{title}</h1>
      <p>
        <span className="span-element-for-sub-headings">Rating: </span>{' '}
        {voteAverage}
      </p>
      <p>
        <span className="span-element-for-sub-headings">Release Date: </span>{' '}
        {releaseDate}
      </p>
      <p>
        <span className="span-element-for-sub-headings">Over view: </span>
        {overview}
      </p>
    </li>
  )
}

class SearchMovieDetails extends Component {
  static contextType = SearchContext

  state = {
    details: [],
    apiState: apiStatusConstants.loading,
    prevSearchInput: '',
  }

  componentDidMount() {
    this.makingSerachApiCall()
  }

  componentDidUpdate() {
    const {searchInput} = this.context
    const {prevSearchInput} = this.state

    if (prevSearchInput !== searchInput) {
      this.setState(
        {
          prevSearchInput: searchInput,
          apiState: apiStatusConstants.loading,
        },
        this.makingSerachApiCall,
      )
    }
  }

  makingSerachApiCall = async () => {
    const {searchInput} = this.context
    const searchApi = `https://api.themoviedb.org/3/search/movie?api_key=ca3b5add575056b8b5a41eb3701385cb&language=en-US&query=${searchInput}&page=1`
    const response = await fetch(searchApi)
    if (response.ok === true) {
      const data = await response.json()
      console.log('data:', data)
      this.onSuccess(data.results)
    } else {
      this.onFailure()
    }
  }

  onFailure = () => {
    this.setState({
      apiState: apiStatusConstants.failure,
    })
  }

  onSuccess = movieDetailsData => {
    const baseUrl = 'https://image.tmdb.org/t/p/'
    const size = 'w500'
    const updatedMovieDetails = movieDetailsData.map(each => ({
      id: each.id,
      originalTitle: each.original_title,
      posterPath: `${baseUrl}${size}${each.poster_path}`,
      genres: each.genre_ids.map(eachGenre => ({
        genreId: eachGenre.id,
        genreName: eachGenre.name,
      })),
      overview: each.overview,
      releaseDate: each.release_date,
      title: each.title,
      voteAverage: each.vote_average,
    }))

    this.setState({
      apiState: apiStatusConstants.success,
      details: updatedMovieDetails,
    })
  }

  renderFailureView = () => (
    <div className="searched-details-main-bg-container">
      <Header />
      <h1>There is no such movie</h1>
    </div>
  )

  renderLoadingView = () => (
    <div className="searched-details-main-bg-container">
      <Header />
      <div className="products-loader-container">
        <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
      </div>
    </div>
  )

  renderMovieDetailsView = () => {
    console.log()
    const {details} = this.state
    return (
      <div className="searched-details-main-bg-container">
        <Header />
        <ul className="unordered-list">
          {details.map(each => (
            <EachMovieDetails details={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  render() {
    const {apiState} = this.state

    switch (apiState) {
      case apiStatusConstants.loading:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderMovieDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }
}

export default SearchMovieDetails
