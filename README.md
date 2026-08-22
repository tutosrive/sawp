# Stargazers with Supabase

> [!IMPORTANT]
> Supabase on FREE plan pause your project if don't get requests for 7 days or more,
> So, you can try still alive it with a Cron Job, sending requests to your supabase `"http link" + "/auth/v1/health"` with this cron expresion "0 0 */5 * *"

Requirements:
1. Create a [Supabase](https://supabase.com) account (can be 100% FREE)
2. Just get your "Connection String" (postgres format)
3. Github Token
4. And finally, the Github User Name

# How use?

You can use this action using a action file (`.yml` or `.yaml`) like this:

```yaml
name: stargazers-action-supabase

on:
  schedule:
    - cron: '0 0 */30 * *' # Every 30 days

  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: actions/checkout@v2

      # Process all Starred Repositoties from an User
      - name: Create star list
        id: stargazers-action-supabase
        uses: tutosrive/stargazers-action-supabase@v0.2.0
        with:
          github_user: ${{ github.actor }} # Or any GitHub Username
          github_token: ${{ secrets.GITHUB_TOKEN }}
          db_connection_url: ${{ secrets.DB_CONN_URL }} # Supabase connection string "postgresql://postgres..."
```

# Still Alive Supabase

My Stargazer supabase is alive?: [check](https://zxl40pkp.status.cron-job.org/