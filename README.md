# Stargazers Actions With Postgres

> [!NOTE]
> You can use any postgres server provider, like supabase, azure, any but one that support connection string IPV4 (This repo don't support IPV6 right now)

> [!NOTE]
> If you use Supabase on FREE plan pause your project if don't get requests for 7 days or more,
> So, you can try still alive it with a Cron Job, sending requests to your supabase `"http link" + "/auth/v1/health"` with this cron expresion "0 0 _/5 _ \*"

Requirements:

1. Just get your postgres "Connection String" (postgres format: `postgresql://postgres...`)
2. Github Token (Repo Scope and User Scope for read repositories data and user data as ADMIN)
3. Github User Name

# How use?

You can use this action using a action file (`.yml` or `.yaml`) like this:

```yaml
name: SAWP

on:
    workflow_dispatch:

jobs:
    build:
        runs-on: ubuntu-latest

        steps:
            # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
            - uses: actions/checkout@v7

            # Process all Starred Repositoties from an User
            - name: Create star list
              id: sawp-job
              uses: tutosrive/sawp@v0.2.0
              with:
                  github-user: ${{ github.actor }} # Or any GitHub Username
                  github-token: ${{ secrets.GITHUB_TOKEN }}
                  db-connection-url: ${{ secrets.DB_CONN_URL }} # Supabase connection string "postgresql://postgres..."
```

# Still Alive Supabase

My Stargazer supabase is alive?: [check](https://zxl40pkp.status.cron-job.org/)
