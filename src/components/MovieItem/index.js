import './index.css'
import {Link} from 'react-router-dom'

const MovieItem = props => {
  const {details} = props
  const {id, title, voteAverage, imageUrl} = details
  return (
    <li className="movie-item-main-bg-container">
      <img src={imageUrl} className="movie-image" alt={title} />
      <div className="details-container">
        <h1 className="heading">{title}</h1>
        <p className="rating-para">Rating: {voteAverage}</p>
        <Link to={`/movie/${id}`}>
          <button className="button" type="button">
            View Details
          </button>
        </Link>
      </div>
    </li>
  )
}

export default MovieItem
