# Delivery Checklist

## Environment and setup

- local web, API, Redis, database, and storage services are documented and reproducible
- environment variables are documented for dev, staging, and production classes
- frontend and backend can run independently against mocked or real dependencies where intended

## Frontend quality

- route-level lazy loading is in place for heavy screens
- design tokens and typography match `MASTER_PROMPT.md`
- all major screens have loading, empty, active, success, and failure states
- agent panel behaves consistently across screen contexts

## Contract quality

- frontend mocks use the same shapes as planned API responses
- shared types exist for core domain entities
- WebSocket event names and payloads are frozen
- artifact key conventions are documented and used consistently

## Backend and worker quality

- API request validation is present for every implemented route
- job status transitions are explicit and test-covered
- worker failures publish clear error events and persist failure context
- result artifacts and metadata remain aligned

## Testing gates

- frontend route and component smoke tests
- Zustand store tests
- query and mock adapter tests
- API integration tests for implemented routes
- worker pipeline tests for the Vina-first path
- end-to-end demo-path tests from input to results

## Security and compliance

- secrets are never committed to the repo
- agent tools are allow-listed and typed
- uploads and user-scoped data are validated and access-controlled
- third-party license restrictions are reviewed before commercial release

## Observability

- error reporting plan exists for web, API, and workers
- basic structured logging plan exists for API and workers
- job lifecycle metrics and failure counters are defined before production rollout

## Production readiness

- staging deployment path is documented
- production secret management strategy is documented
- rollback and smoke-test expectations are documented
- bundle size and route performance budgets are defined
- realtime behavior is tested under reconnect and failure scenarios
