import {Component} from 'react'
import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import {AiFillStar} from 'react-icons/ai'
import {HiExternalLink} from 'react-icons/hi'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {GoLocation} from 'react-icons/go'

import Header from '../Header'

import './index.css'

const constantApiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}
class JobDetails extends Component {
  state = {
    jobDetailsList: {},
    similarJobList: [],
    lifeAtCompanyList: {},
    skillsList: [],
    apiStatus: constantApiStatus.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getFormattedJobDetails = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    companyWebsiteUrl: data.company_website_url,
    id: data.id,
    jobDescription: data.job_description,
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
    skills: data.skills.map(eachSkill => ({
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    })),
  })

  getSimilarJobsData = Similar => ({
    companyLogoUrl: Similar.company_logo_url,
    employmentType: Similar.employment_type,
    id: Similar.id,
    jobDescription: Similar.job_description,
    location: Similar.location,
    rating: Similar.rating,
    title: Similar.title,
  })

  getJobDetails = async () => {
    const token = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedJobDetails = this.getFormattedJobDetails(data.job_details)
      const updatedSimilarJobList = data.similar_jobs.map(eachJob =>
        this.getSimilarJobsData(eachJob),
      )

      this.setState({
        jobDetailsList: updatedJobDetails,
        lifeAtCompanyList: updatedJobDetails.lifeAtCompany,
        skillsList: updatedJobDetails.skills,
        similarJobList: updatedSimilarJobList,
        apiStatus: constantApiStatus.success,
      })
    } else {
      this.setState({apiStatus: constantApiStatus.failure})
    }
  }

  renderJobDetailsCard = () => {
    const {jobDetailsList, skillsList, lifeAtCompanyList} = this.state
    const {
      companyLogoUrl,
      employmentType,
      companyWebsiteUrl,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetailsList

    return (
      <div className="job-details-container">
        <div className="job-item">
          <div className="img-title-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
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
            <div className="loc-emp-container">
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
          <div className="link-container">
            <h1 className="desc-head">Description</h1>
            <a href={companyWebsiteUrl} className="visit-link">
              Visit
              <HiExternalLink />
            </a>
          </div>
          <p className="desc-text">{jobDescription}</p>
          <h1 className="desc-head">skills</h1>
          <ul className="skill-list">
            {skillsList.map(eachSkill => (
              <li className="skill-item">
                <img
                  src={eachSkill.imageUrl}
                  className="skill-image"
                  alt={eachSkill.name}
                />
                <p className="skill-name">{eachSkill.name}</p>
              </li>
            ))}
          </ul>
          <div className="life-container">
            <div className="life-desc-container">
              <h1 className="desc-head">Life at Company</h1>
              <p className="desc-text ">{lifeAtCompanyList.description}</p>
            </div>
            <img
              src={lifeAtCompanyList.imageUrl}
              alt="life at company"
              className="life-img"
            />
          </div>
        </div>
        <h1 className="sim-head">Similar Jobs</h1>
        {this.renderSimilarJobsView()}
      </div>
    )
  }

  renderSimilarJobsView = () => {
    const {similarJobList} = this.state

    return (
      <ul className="sim-list">
        {similarJobList.map(eachSim => (
          <li className="sim-item">
            <div className="img-title-container">
              <img
                src={eachSim.companyLogoUrl}
                alt="similar job company logo"
                className="company-logo"
              />
              <div className="title-rating-container">
                <h1 className="title">{eachSim.title}</h1>
                <p className="rating">
                  <AiFillStar className="star-icon" /> {eachSim.rating}
                </p>
              </div>
            </div>

            <h1 className="desc-head">Description</h1>
            <p className="desc-text">{eachSim.jobDescription}</p>
            <div className="loc-emp-container">
              <p className="location">
                <GoLocation className="icon" />
                {eachSim.location}
              </p>
              <p className="emp-type">
                <BsFillBriefcaseFill className="icon" />
                {eachSim.employmentType}
              </p>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  renderLoader = () => (
    <div testid="loader" className="loader-container">
      <Loader type="ThreeDots" width={80} height={80} color="#ffffff" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-image"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <Link to="/jobs">
        <button type="button" className="retry-button">
          Retry
        </button>
      </Link>
    </div>
  )

  renderApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case constantApiStatus.success:
        return this.renderJobDetailsCard()
      case constantApiStatus.failure:
        return this.renderFailureView()
      case constantApiStatus.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }
  //  <img src={eachSkill.imageUrl} alt={eachSkill.name} className='skill-img'/>
  //  <p className='skill-name'>{eachSkill.name}</p>

  render() {
    return (
      <>
        <Header />
        <div>{this.renderApiStatus()}</div>
      </>
    )
  }
}
export default JobDetails
