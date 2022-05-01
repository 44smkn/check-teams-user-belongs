import * as core from '@actions/core'
import {Sdk, TeamsUserBelongsQuery, getSdk} from './generated/graphql'
import {GraphQLClient} from 'graphql-request'

export class GithubClient {
  private sdk: Sdk

  constructor(token: string, endpoint = 'https://api.github.com/graphql') {
    const client = new GraphQLClient(endpoint, {
      headers: {
        authorization: `token ${token}`
      }
    })
    this.sdk = getSdk(client)
  }

  async isUserBelongsToTeams(
    username: string,
    organization: string,
    candidateTeams: string[]
  ): Promise<boolean> {
    let after: string | null | undefined
    let response: TeamsUserBelongsQuery
    do {
      core.info(`Requesting to GitHub API...`)
      response = await this.sdk.TeamsUserBelongs({
        first: 20,
        after,
        userLogins: [username],
        organization
      })
      core.debug(JSON.stringify(response))

      const teamsUserBelongs = response.organization?.teams.edges?.map(
        e => e?.node?.name
      )
      const userBelongs = isTeamsBeIncluded(teamsUserBelongs, candidateTeams)
      if (userBelongs) {
        return true
      }

      after = response.organization?.teams.pageInfo.endCursor
    } while (response.organization?.teams.pageInfo.hasNextPage)

    return false
  }
}

export function isTeamsBeIncluded(
  teamsUserBelongs: (string | undefined)[] | undefined,
  candidateTeams: string[]
): boolean {
  if (teamsUserBelongs == null) {
    return false
  }
  return candidateTeams.some(e => {
    core.debug(`candidate: ${e}, teams: ${teamsUserBelongs}`)
    return teamsUserBelongs.includes(e)
  })
}
