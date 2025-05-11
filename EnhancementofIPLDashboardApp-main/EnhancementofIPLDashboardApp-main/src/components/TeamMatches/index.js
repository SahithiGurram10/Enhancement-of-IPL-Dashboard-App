// Write your code here
import {Link} from 'react-router-dom'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import LatestMatch from '../LatestMatch'
import MatchCard from '../MatchCard'
import PieChart from '../PieChart'

import './index.css'

const teamMatchesApiUrl = 'https://apis.ccbp.in/ipl/'

class TeamMatches extends Component {
  state = {
    isLoading: true,
    teamMatchesData: [],
  }

  componentDidMount() {
    this.getTeamMatches()
  }

  getFormattedData = data => ({
    umpires: data.umpires,
    result: data.result,
    manOfTheMatch: data.man_of_the_match,
    id: data.id,
    date: data.date,
    venue: data.venue,
    competingTeam: data.competing_team,
    competingTeamLogo: data.competing_team_logo,
    firstInnings: data.first_innings,
    secondInnings: data.second_innings,
    matchStatus: data.match_status,
  })

  getTeamMatches = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const response = await fetch(`${teamMatchesApiUrl}${id}`)
    const fetchedData = await response.json()
    console.log(fetchedData, 'fetched')
    const formattedData = {
      teamBannerURL: fetchedData.team_banner_url,
      latestMatchDetails: this.getFormattedData(
        fetchedData.latest_match_details,
      ),
      recentMatches: fetchedData.recent_matches.map(eachMatch =>
        this.getFormattedData(eachMatch),
      ),
    }
    this.setState({teamMatchesData: formattedData, isLoading: false})
  }

  getNoOfMatches = value => {
    const {teamMatchesData} = this.state
    const {latestMatchDetails, recentMatches} = teamMatchesData
    const currentMatch = value === latestMatchDetails.matchStatus ? 1 : 0
    console.log(value, latestMatchDetails.matchStatus, currentMatch)
    const result =
      recentMatches.filter(match => match.matchStatus === value).length +
      currentMatch
    console.log(result)
    return result
  }

  generatePieChartData = () => [
    {name: 'Won', value: this.getNoOfMatches('Won')},
    {name: 'Lost', value: this.getNoOfMatches('Lost')},
    {name: 'Drawn', value: this.getNoOfMatches('Drawn')},
  ]

  renderRecentMatchesList = () => {
    const {teamMatchesData} = this.state
    const {recentMatches} = teamMatchesData
    return (
      <ul className="recent-matches-list">
        {recentMatches.map(recentMatch => (
          <MatchCard matchDetails={recentMatch} key={recentMatch.id} />
        ))}
      </ul>
    )
  }

  renderTeamMatches = () => {
    const {teamMatchesData} = this.state
    const {teamBannerURL, latestMatchDetails} = teamMatchesData
    return (
      <div className="responsive-container">
        <img src={teamBannerURL} alt="team banner" className="team-banner" />
        <LatestMatch latestMatchData={latestMatchDetails} />
        <PieChart data={this.generatePieChartData()} />
        {this.renderRecentMatchesList()}
        <Link to="/">
          <button type="button" className="back-button">
            Back
          </button>
        </Link>
      </div>
    )
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="TailSpin" color="#ffffff" height={80} width={80} />
    </div>
  )

  getRouteClassName = () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    switch (id) {
      case 'RCB':
        return 'rcb'
      case 'KKR':
        return 'kkr'
      case 'KXP':
        return 'kxp'
      case 'CSK':
        return 'csk'
      case 'RR':
        return 'rr'
      case 'MI':
        return 'mi'
      case 'SH':
        return 'srh'
      case 'DC':
        return 'dc'
      default:
        return ''
    }
  }

  render() {
    const {isLoading} = this.state

    return (
      <div className={`team-matches-container ${this.getRouteClassName()}`}>
        {isLoading ? this.renderLoader() : this.renderTeamMatches()}
      </div>
    )
  }
}

export default TeamMatches
