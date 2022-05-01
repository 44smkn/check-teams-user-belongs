import {describe, expect, it} from '@jest/globals'
import {isTeamsBeIncluded} from '../src/github-client'

describe('check if team user belongs', () => {
  it('team user belongs is included in candidate teams', () => {
    const teamsUserBelongs = ['sre', 'engineer', 'department']
    const candidateTeams = ['sre', 'admin']
    expect(isTeamsBeIncluded(teamsUserBelongs, candidateTeams)).toBe(true)
  })

  it('team user belongs is not included in candidate teams', () => {
    const teamsUserBelongs = ['sre', 'engineer', 'department']
    const candidateTeams = ['admin']
    expect(isTeamsBeIncluded(teamsUserBelongs, candidateTeams)).toBe(false)
  })
})
