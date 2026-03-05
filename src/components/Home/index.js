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

class Home extends Component {
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
    console.log('consoling for pages:', data)
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
    const popularApi = `https://api.themoviedb.org/3/movie/popular?api_key=ca3b5add575056b8b5a41eb3701385cb&language=en-US&page=${pageNumber}`
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

  renderPopularView = () => {
    const {listOfMovies, page, totalPages} = this.state
    console.log(listOfMovies)
    return (
      <div className='home-main-bg-container'>
        <Header />
        <h1 className='main-heading'>Popular</h1>
        <ul className='unordered-list'>
          {listOfMovies.map(each => (
            <MovieItem details={each} key={each.id} />
          ))}
        </ul>
        <div className='prev-and-next-btn-container'>
          <button className='previous-button' onClick={this.onPrevious}>
            Prev
          </button>
          <p>{page}</p>
          <button className='next-button' onClick={this.onNext}>
            Next
          </button>
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div>
      <Header />
      <h1>Failure</h1>
    </div>
  )

  renderLoadingView = () => (
    <>
      <Header />
      <div className='products-loader-container'>
        <Loader type='ThreeDots' color='#0b69ff' height='50' width='50' />
      </div>
    </>
  )

  render() {
    const {apiState} = this.state
    switch (apiState) {
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.success:
        return this.renderPopularView()
      case apiStatusConstants.loading:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default Home
