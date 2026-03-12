import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import MovieItem from '../MovieItem'
import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class Upcoming extends Component {
  state = {
    apiState: apiStatusConstants.loading,
    listOfMovies: [],
    page: 1,
    totalPages: 0,
  }

  componentDidMount() {
    this.getPopularMovies()
  }

  onSuccess = data => {
    const baseUrl = 'https://image.tmdb.org/t/p/'
    const size = 'w500'
    const totalPages = parseInt(data.total_pages)
    const updatedData = data.results.map(each => ({
      id: each.id,
      title: each.title,
      voteAverage: each.vote_average,
      posterPath: each.poster_path,
      imageUrl: `${baseUrl}${size}${each.poster_path}`,
    }))
    this.setState({
      apiState: apiStatusConstants.success,
      listOfMovies: updatedData,
      totalPages,
    })
  }

  onFailure = () => {
    this.setState({
      apiState: apiStatusConstants.failure,
    })
  }

  getPopularMovies = async () => {
    const {page} = this.state
    const pageNumber = parseInt(page)
    const popularApi = `https://api.themoviedb.org/3/movie/upcoming?api_key=ca3b5add575056b8b5a41eb3701385cb&language=en-US&page=${pageNumber}`
    const response = await fetch(popularApi)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      this.onSuccess(data)
    } else {
      this.onFailure()
    }
  }

  onPrevious = () => {
    const {page} = this.state
    if (page > 1) {
      this.setState(
        prevState => ({
          page: prevState.page - 1,
          apiState: apiStatusConstants.loading,
        }),
        this.getPopularMovies,
      )
    }
  }

  onNext = () => {
    const {page, totalPages} = this.state
    if (page < totalPages) {
      this.setState(
        prevState => ({
          page: prevState.page + 1,
          apiState: apiStatusConstants.loading,
        }),
        this.getPopularMovies,
      )
    }
  }

  renderUpcomingView = () => {
    const {listOfMovies} = this.state
    console.log(listOfMovies)
    return (
      <div className="upcoming-main-bg-container">
        <h1 className="main-heading">Upcoming</h1>
        <ul className="unordered-list">
          {listOfMovies.map(each => (
            <MovieItem details={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div>
      <h1>Failure</h1>
    </div>
  )

  renderLoadingView = () => (
    <>
      <div className="products-loader-container">
        <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
      </div>
    </>
  )

  render() {
    const {apiState, page} = this.state
    let renderView
    switch (apiState) {
      case apiStatusConstants.failure:
        renderView = this.renderFailureView()
        break
      case apiStatusConstants.success:
        renderView = this.renderUpcomingView()
        break
      case apiStatusConstants.loading:
        renderView = this.renderLoadingView()
        break
      default:
        return null
    }

    return (
      <div className="top-rated-main-bg-container">
        <Header />
        <div>{renderView}</div>
        <div className="top-rated-prev-and-next-btn-container">
          <button
            className="top-rated-previous-button"
            onClick={this.onPrevious}
            type="button"
          >
            Prev
          </button>
          <p>{page}</p>
          <button
            className="top-rated-next-button"
            onClick={this.onNext}
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    )
  }
}

export default Upcoming
