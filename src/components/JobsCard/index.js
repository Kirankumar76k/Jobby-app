import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {GoLocation} from 'react-icons/go'

import './index.css'

const JobsCard = props => {
  const {jobsData} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobsData

  return (
    //   Wrap with Link from react-router-dom
    <li className="job-item">
      <Link to={`/jobs/${id}`} className="web-link-item">
        <div className="img-title-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="title-rating-container">
            <h1 className="title">{title}</h1>
            <p className="rating">
              <AiFillStar className="star-icon" /> {rating}
            </p>
          </div>
        </div>
        <div className="loc-pack-container">
          <div className="loc-emp-continer">
            <p className="location">
              <GoLocation className="icon" />
              {location}
            </p>
            <p className="emp-type">
              <BsFillBriefcaseFill className="icon" />
              {employmentType}
            </p>
          </div>
          <p className="package">{packagePerAnnum}</p>
        </div>
        <hr />
        <h1 className="desc-head">Description</h1>
        <p className="desc-text">{jobDescription}</p>
      </Link>
    </li>
  )
}
export default JobsCard
