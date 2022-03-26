import * as core from '@actions/core'
import {getSdk, TeamsUserBelongsQuery} from './generated/graphql'
import {GraphQLClient} from 'graphql-request'

async function run(): Promise<void> {
  try {
    const organization = core.getInput('organization')
    const username = core.getInput('username')
    const teams = core.getMultilineInput('teams').map(t => t.trim())
    core.info(
      `Starting to check if ${username} belongs to ${teams} in ${organization} ...`
    )

    const githubToken = core.getInput('token')
    const client = new GraphQLClient('https://api.github.com/graphql', {
      headers: {
        authorization: `token ${githubToken}`
      }
    })
    const sdk = getSdk(client)

    let after: string | null | undefined = null
    let response: TeamsUserBelongsQuery
    do {
      response = await sdk.TeamsUserBelongs({
        first: 20,
        after: after,
        userLogins: [username],
        organization: organization
      })
      core.debug(JSON.stringify(response))

      const userBelongs = response.organization?.teams.edges?.some(e => {
        const team = e?.node?.name
        core.debug(`team: ${team}`)
        return team != null && teams.includes(team)
      })
      if (userBelongs) {
        core.setOutput('userBelongsToGivenTeams', true)
        return
      }
      after = response.organization?.teams.pageInfo.endCursor
    } while (response.organization?.teams.pageInfo.hasNextPage)

    core.setOutput('userBelongsToGivenTeams', false)
    if (core.getBooleanInput('failIfuserNotBelongs')) {
      core.setFailed(`${username} doesn't belong to ${teams}`)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
