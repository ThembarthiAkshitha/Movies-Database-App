import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}
const CastItem = props => {
  const {details} = props
  const {profilePath, character, originalName} = details
  return (
    <li className="cast-list-item-container">
      <img src={profilePath} className="caste-image-item" />
      <p>
        <span className="span-element-for-sub-headings">Original Name: </span>
        {originalName}
      </p>
      <p>
        <span className="span-element-for-sub-headings">Character Name: </span>
        {character}
      </p>
    </li>
  )
}

class ViewDetails extends Component {
  state = {
    details: [],
    apiState: apiStatusConstants.loading,
    movieDetails: [],
    casteDetails: [],
  }

  componentDidMount() {
    this.getMovieDetails()
  }

  onSuccess = (movieDetailsData, movieCastDetailsData) => {
    // console.log(movieDetailsData, movieCastDetailsData)
    const baseUrl = 'https://image.tmdb.org/t/p/'
    const size = 'w500'
    const updatedMovieDetails = {
      id: movieDetailsData.id,
      originalTitle: movieDetailsData.original_title,
      posterPath: `${baseUrl}${size}${movieDetailsData.poster_path}`,
      budget: movieDetailsData.budget,
      genres: movieDetailsData.genres.map(each => ({
        genreId: each.id,
        genreName: each.name,
      })),
      homepage: `${baseUrl}${size}${movieDetailsData.homepage}`,
      overview: movieDetailsData.overview,
      releaseDate: movieDetailsData.release_date,
      status: movieDetailsData.status,
      title: movieDetailsData.title,
      voteAverage: movieDetailsData.vote_average,
      spokenLanguages: movieDetailsData.spoken_languages.map((each, index) => ({
        id: index,
        language: each.name,
      })),
    }
    console.log(updatedMovieDetails.spokenLanguages)

    const updatedCasteDetails = movieCastDetailsData.cast.map(each => ({
      id: each.id,
      character: each.character,
      originalName: each.original_name,
      profilePath: `${baseUrl}${size}${each.profile_path}`,
    }))
    this.setState({
      apiState: apiStatusConstants.success,
      movieDetails: updatedMovieDetails,
      casteDetails: updatedCasteDetails,
    })
  }

  onFailure = () => {
    this.setState({
      apiState: apiStatusConstants.failure,
    })
  }

  getMovieDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const movieDetailsApi = `https://api.themoviedb.org/3/movie/${id}?api_key=ca3b5add575056b8b5a41eb3701385cb&language=en-US`
    const movieCastDetailsApi = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=ca3b5add575056b8b5a41eb3701385cb&language=en-US`
    const movieDetailsResponse = await fetch(movieDetailsApi)
    const casteRespone = await fetch(movieCastDetailsApi)
    if (movieDetailsResponse.ok === true) {
      const movieDetailsData = await movieDetailsResponse.json()
      const movieCastDetailsData = await casteRespone.json()
      console.log(movieDetailsData, movieCastDetailsData)
      this.onSuccess(movieDetailsData, movieCastDetailsData)
    } else {
      this.onFailure()
    }
  }

  renderMovieDetailsView = () => {
    const {casteDetails, movieDetails} = this.state
    const {
      id,
      title,
      posterPath,
      budget,
      genres,
      homepage,
      overview,
      releaseDate,
      status,
      voteAverage,
      spokenLanguages,
    } = movieDetails

    const lengthOfSpokenLanguages = spokenLanguages.length
    console.log('movie details:', movieDetails)
    console.log('movie caste details:', casteDetails)
    return (
      <div>
        <Header />
        <div className="movie-details-image-container">
          <img
            src={`${posterPath}`}
            className="movie-image-of-view-details-page"
          />
          <div className="movie-details-container-of-view-details">
            <h1>{title}</h1>
            <p>
              <span className="span-element-for-sub-headings">Rating: </span>{' '}
              {voteAverage}
            </p>
            <div className="spoken-languages-div">
              <p className="span-element-for-sub-headings">Spoken Languages:</p>
              <ul className="unordered-list-spoken-language">
                {spokenLanguages.map((each, index) => {
                  if (index === lengthOfSpokenLanguages - 1) {
                    return <li key={each.id}>{each.language}</li>
                  }
                  return <li key={each.id}>{each.language},</li>
                })}
              </ul>
            </div>
            <p>
              <span className="span-element-for-sub-headings">Budget: </span>{' '}
              {budget}
            </p>
            <p>
              <span className="span-element-for-sub-headings">
                Release Date:{' '}
              </span>{' '}
              {releaseDate}
            </p>
            <p>
              <span className="span-element-for-sub-headings">
                Overi view:{' '}
              </span>
              {overview}
            </p>
          </div>
        </div>
        <div className="caste-details-container">
          <h1>Caste Details</h1>
          <ul className="character-unordered-list">
            {casteDetails.map(each => (
              <CastItem details={each} key={each.id} />
            ))}
          </ul>
        </div>
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
    const {apiState} = this.state
    let renderView 
    switch (apiState) {
      case apiStatusConstants.loading:
        renderView = this.renderLoadingView()
        break
      case apiStatusConstants.success:
        renderView = this.renderMovieDetailsView()
        break
      case apiStatusConstants.failure:
        renderView = this.renderFailureView()
        break
      default:
        return null
    }

    return (
      <div className="details-main-bg-container">
        <Header />
        <div>
          {renderView}
        </div>
      </div>
    )
  }
}

export default ViewDetails
