import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'

import JobsCard from '../JobsCard'
import Header from '../Header'
import FilterGroup from '../FilterGroup'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    profileList: [],
    apiStatus: apiStatusConstants.initial,
    searchInput: '',
    activeEmpTypeId: '',
    activeSalaryRangeId: '',
  }

  componentDidMount() {
    this.getJobs()
    this.getProfile()
  }

  getProfile = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const profileUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const ProfileResponse = await fetch(profileUrl, options)
    const data = await ProfileResponse.json()
    console.log(data)
    const updateProfileData = {
      name: data.profile_details.name,
      profileImageUrl: data.profile_details.profile_image_url,
      shortBio: data.profile_details.short_bio,
    }

    this.setState({profileList: updateProfileData})
  }

  getJobs = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {searchInput, activeEmpTypeId, activeSalaryRangeId} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeEmpTypeId}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderProfileContainer = () => {
    const {profileList} = this.state
    const {name, shortBio, profileImageUrl} = profileList
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  changeEmpType = activeEmpTypeId => {
    this.setState({activeEmpTypeId}, this.getJobs)
  }

  changeRange = activeSalaryRangeId => {
    this.setState({activeSalaryRangeId}, this.getJobs)
  }

  onClickSearchInput = searchInput => {
    this.setState({searchInput}, this.getJobs)
  }

  renderSearchInput = () => {
    const {searchInput} = this.state
    const onChangeSearchInput = event =>
      this.onClickSearchInput(event.target.value)

    return (
      <div className="search-input-container">
        <input
          type="search"
          value={searchInput}
          className="search-input"
          placeholder="Search"
          onChange={onChangeSearchInput}
        />
        {/* <button className="searchBtn" testid="searchButton" type="button"> */}
        <BsSearch className="search-icon" testid="searchButton" />
        {/* </button> */}
      </div>
    )
  }

  renderJobCard = () => {
    const {jobsList} = this.state
    const shouldShowProductsList = jobsList.length > 0

    return shouldShowProductsList ? (
      <div className="all-jobs-container">
        <ul className="jobs-list">
          {jobsList.map(eachJob => (
            <JobsCard jobsData={eachJob} key={eachJob.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-jobs-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-jobs-img"
          alt="no jobs"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-section">
          <div className="profile-filter-container">
            {this.renderProfileContainer()}
            <FilterGroup
              employmentTypesList={employmentTypesList}
              salaryRangesList={salaryRangesList}
              changeRange={this.changeRange}
              changeEmpType={this.changeEmpType}
            />
          </div>
          <div className="search-job-list-container">
            {this.renderSearchInput()}
            {this.renderJobCard()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
