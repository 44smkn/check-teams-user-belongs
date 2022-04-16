import * as core from '@actions/core'
import {GithubClient} from './github-client'

async function run(): Promise<void> {
  try {
    // Get inputs
    const username = core.getInput('username')
    const teams = core.getMultilineInput('teams').map(t => t.trim())
    const githubToken = core.getInput('token')
    const organization = core.getInput('organization')
    const failIfuserNotBelongs = core.getBooleanInput('failIfuserNotBelongs')

    core.info(
      `Starting to check if ${username} belongs to ${teams} in ${organization} ...`
    )

    const githubClient = new GithubClient(githubToken)
    const userBelongs = await githubClient.isUserBelongsToTeams(
      username,
      organization,
      teams
    )
    if (userBelongs) {
      core.info(
        `Results of confirmation, ${username} belongs to ${teams} in ${organization}`
      )
      core.setOutput('userBelongsToGivenTeams', true)
      return
    }

    core.setOutput('userBelongsToGivenTeams', false)
    if (failIfuserNotBelongs) {
      core.setFailed(`${username} doesn't belong to ${teams}`)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
