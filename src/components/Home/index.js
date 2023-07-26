import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import ProjectItem from '../ProjectItem'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    activeCategory: categoriesList[0].id,

    projectsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjectsData()
  }

  getProjectsData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {activeCategory} = this.state

    const projectsApiUrl = `https://apis.ccbp.in/ps/projects?category=${activeCategory}`

    const response = await fetch(projectsApiUrl)
    if (response.ok) {
      const data = await response.json()
      const {projects} = data
      const formattedData = projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        projectsList: [...formattedData],
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSelect = event => {
    this.setState({activeCategory: event.target.value}, this.getProjectsData)
  }

  renderSelect = () => (
    <select className="select" onChange={this.onChangeSelect}>
      {categoriesList.map(eachCategory => (
        <option key={eachCategory.id} value={eachCategory.id}>
          {eachCategory.displayText}
        </option>
      ))}
    </select>
  )

  renderLoader = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#0BFF" height={50} width={50} />
    </div>
  )

  renderResult = () => {
    const {projectsList} = this.state

    return (
      <ul className="project-list-container">
        {projectsList.map(eachProject => (
          <ProjectItem key={eachProject.id} projectDetails={eachProject} />
        ))}
      </ul>
    )
  }

  renderFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        type="button"
        className="retry-button"
        onClick={this.getProjectsData}
      >
        Retry
      </button>
    </div>
  )

  renderTheApiResultView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderResult()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="content-container">
          {this.renderSelect()}
          {this.renderTheApiResultView()}
        </div>
      </>
    )
  }
}

export default Home
