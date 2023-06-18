# check-teams-user-belongs

<a href="https://github.com/44smkn/check-teams-user-belongs?query=workflow%3Atest"><img alt="test status" src="https://github.com/44smkn/check-teams-user-belongs/workflows/test/badge.svg"></a> 

This action provides the following functionality for GitHub Actions users:

- Check if given user belongs to given teams in an organization
- Optionally, action is able to fail if given user doesn't belong to given teams

## Usage

See [action.yml](action.yml)

The `token` is reqiuired because buitin `GITHUB_TOKEN`'s scope is insufficient.
You should pass token that has `read:org` scope.

### Check if actor belongs to a certain team

```yaml
steps:
- uses: 44smkn/check-teams-user-belongs@v1
  with:
    username: ${{ github.actor }}
    teams: admin
    token: ${{ secrets.PAT_ONLY_READ_ORG }}
```

### Check if actor belongs to one of several teams, and action will fail if actor doesn't

```yaml
steps:
- uses: 44smkn/check-teams-user-belongs@v1
  with:
    username: ${{ github.actor }}
    organization: company
    teams: |
      admin
      owners
    token: ${{ secrets.PAT_ONLY_READ_ORG }}
    failIfUserNotBelongs: true
```
