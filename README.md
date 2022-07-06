## Installation

- clone repository
- `npm install`
- add `.env` file generated in Commerce Tools during creation of new API Client (use `mobile & single-page-app client` template and `Sunrise SPA` env vars output option; important: Sunrise shop doesn't expect too wide scope / roles, so admin won't work ;-) )
- consider importing test data into the Commerce Tools https://docs.commercetools.com/sdk/sunrise-data
  please note, when running import from commercetools-SUNRISE-data repo, it expects slightly different env variables: instead of `VUE_APP_CT` prefix use `CTP` prefix and for variables with `HOST` suffix use `CTP_AUTH_URL` / `CTP_API_URL` variables
- `npm run start`