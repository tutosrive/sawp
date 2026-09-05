# Stargazers Actions With Postgres

> [!WARNING]
> I don't filter private repositories in this version ([v0.2.0](https://github.com/tutosrive/sawp/releases/tag/v0.2.0)), use it with precaution ...

> [!IMPORTANT]
> You can use any postgres server provider, like supabase, azure, any but one that support connection string IPV4 (This repo don't support IPV6 right now)

## Requirements:

1. Just get your postgres "Connection String" (postgres format: `postgresql://postgres...`)
2. Github Token (Repo Scope and User Scope for read repositories data and user data as ADMIN)
3. Github User Name

> [!NOTE]
> If you use Supabase on FREE plan pause your project if don't get requests for 7 days or more,
> So, you can try [Supabase Keep DB Live](https://github.com/juansebsol/supabase-keep-db-live)

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

My Stargazer supabase is alive?: [![Stargazers](https://github.com/tutosrive/supabase-keep-db-live/actions/workflows/stargazers.yml/badge.svg?branch=main)](https://github.com/tutosrive/supabase-keep-db-live/actions/workflows/stargazers.yml)
