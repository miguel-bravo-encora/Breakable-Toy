import React, { Component } from 'react'

// COMMENT: Hay que terminar de implementar ésto, e igual separarlo por componentes, quizás implementarlo usando context
export default class StatsTab extends Component {
  render() {
    return (
      <div className='stats-container'>
        <h1>Stats</h1>
        <div className='divided-container'>
            <div className='first-half'>
                <p>Average time to finish tasks</p>
                <p>22.15 minutes</p>
            </div>
            <div className='second-half'>
                <p>Average time to finish task by priority:</p>
                <p>Low: 10:25 minutes</p>
                <p>Medium: 10:25 minutes</p>
                <p>High: 10:25 minutes</p>
            </div>
        </div>
      </div>
    )
  }
}
