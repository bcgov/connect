# ARCHITECTURE.md

## Onboarding Portal — Core Technical & Systems Architecture

> [!IMPORTANT]
> **Agent Execution Context**
> This document's definitions are strictly constrained by the operational bounds established in `AGENTS.md`. Agentic services performing automated scaffolding, generation, or modification of this repository must strictly adhere to the infrastructure patterns, layer composition rules, and Model Context Protocol (MCP) integrations defined below.

---

## 1. System Architecture Overview

The Onboarding Portal is engineered as a highly modular, decoupled, and layer-driven digital platform leveraging the **Nuxt 4** framework structure. It is designed to orchestrate onboarding lifecycles for internal providers by bridging user-facing reactive experiences with upstream orchestrations via agentic automation and secure backend endpoints.

The system operates on three architectural pillars:
1. **Nuxt 4 Content & Layer Topology:** Structural encapsulation of shared state, visual components, logic, and route templates across organizational codebases.
2. **Agentic Services & MCP Interface:** Event-driven interaction models that execute specialized infrastructure workflows via Model Context Protocol tools.
3. **Docs-as-Code Configuration:** High-performance content lifecycle management handled directly within Git through Nuxt Content integrations.

---

## 2. Technical Stack Specification

| Layer / System | Technology Stack | Architectural Role |
| :--- | :--- | :--- |
| **Framework** | Nuxt 4, Vue.js 3, TypeScript | App Shell, SSR/SSG Engine, Server Routes |
| **UI Componentry** | `ui.nuxt.com` (Nuxt UI Suite) | Design Token System, Primitive Wrappers |
| **Content Engine** | Nuxt Content v3 (Markdown-driven) | Documentation, Step Manifests, Validation Schema |
| **Automation Integration** | Model Context Protocol (MCP) Services | External Tool Execution & Infrastructure Provisioning |
| **Layer Pattern** | Nuxt Layers Configuration (`extends`) | Upstream Services & Core UI Inheritance |
| **Database & ORM** | PostgreSQL, Drizzle ORM, `pg` | Relational Persistence, Type-Safe Schema Mapping & Querying |

---

## 3. Application Structure & Layer Topology

The portal minimizes repository bloat by extending specialized upstream layers. This provides functional isolation and ensures global architectural updates cascade smoothly into the Onboarding App.

```text
.
├── AGENTS.md             # Constraints and operational parameters for AI tools
├── ARCHITECTURE.md       # Systems architecture blueprints (This Document)
├── hub/                    # application directory
    ├── nuxt.config.ts        # Inherits and overrides base structural layers
    ├── content/              # Nuxt Content v3 markdown datasets
    │   ├── index.md          # Portal landing manifest
    │   └── onboarding/       # Documented onboarding playbooks and multi-step validation
    ├── server/               # Minimal orchestration endpoints
    │   ├── api/
    │   ├── db/               # Centralized Drizzle schema definitions and connection context
    │   └── routes/
    └── app/                  # Application runtime structures
        ├── pages/            # View compositions mapped cleanly to endpoints
        └── components/       # Target layout structures composed using Nuxt UI Primitives
```

---

## 4. Database & Persistence Layer

The platform utilizes a containerized **PostgreSQL** database managed programmatically using **Drizzle ORM** for lightweight, type-safe data access.

### Database Connection and Initialization
- **Driver**: Node-postgres (`pg` client pool).
- **Configuration**: DB parameters are configured via environment variables (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`).
- **Initialization**: Managed via **Drizzle Kit**. On application startup, the Nitro startup plugin (`db-init.ts`) resolves the migrations path dynamically and executes all pending versioned SQL migrations automatically.

### Schema Management
- Database tables and relations are declared using Drizzle's TypeScript schema definitions under `hub/server/db/schema.ts`.
- Migrations are versioned and generated via Drizzle Kit CLI (`drizzle-kit generate`) and saved under `hub/server/db/migrations/` as SQL statements.
- Drizzle ORM's native `migrate()` utility runs these migrations during container startup, matching local development and serverless execution environments.
- Server routes query the database using the type-safe `db` context exported from `hub/server/db/index.ts`.

### GCP Cloud Run & IAM Database Authentication
- In production, connections to Cloud SQL (Postgres) are established securely using the `@google-cloud/cloud-sql-connector` library.
- Credentials are managed dynamically using GCP IAM Service Accounts (`sa-api@gtksf3-dev.iam.gserviceaccount.com`), eliminating the need to store or rotate database passwords in runtime environments.
- **Database & Schema Privileges**: The Service Account user requires connection access, `CREATE` privileges on the `hub` database, and full read/write privileges on both the `hub` and `drizzle` schemas (where the application tables and migrations logs are created). These privileges are provisioned via `hub/scripts/grant-sa-access.sh`.

### Database Seeding
- **Partner Services**: Seeding is handled via `hub/scripts/seed-partner-services.cjs`, which parses standard partner services from CSV (`hub/test-data/partner-services.csv`) and seeds them under Account `1999` (Ministry of Citizens' Services).
- **Platform Services**: Seeding is handled via `hub/scripts/seed-platform-services.cjs`, which parses platform core components and services from CSV (`hub/test-data/platform-services.csv`) and seeds them under the same Account `1999`.
- **Execution**: Can be run on-demand using:
  ```bash
  node hub/scripts/seed-partner-services.cjs
  node hub/scripts/seed-platform-services.cjs
  ```

---

## 5. Security & Authentication Architecture

To ensure data integrity and prevent unauthorized cross-organization access, the API endpoints utilize a defense-in-depth security approach.

### Cryptographic JWT Verification (JWKS)
- **Local Verification**: Incoming bearer tokens are verified locally using the `jose` library against Keycloak's JSON Web Key Set (JWKS) endpoint.
- **Rules Enforced**: Signature authenticity, issuer verification (`JWT_OIDC_ISSUER`), audience alignment (`JWT_OIDC_AUDIENCE`), and token expiration checks are performed cryptographically on every request.

### Keycloak OIDC Client Configuration
- **Redirection & Origins**: To allow secure authentication, Keycloak registers the application's local and remote hosting URLs.
- **Automation**: Sourcing variables from `env.sh`, running `hub/scripts/print-keycloak-config.sh` prints the exact "Valid Redirect URIs" and "Web Origins" required by Keycloak.

### Multi-Tenant / Organization Isolation
- **Active Org Association**: Interactive UI pages pass the user's active `Account-Id` alongside the `Authorization` token in the request headers.
- **Upstream Settings Validation**: The backend queries the Connect Auth Service (`/users/settings`) using the client's token to confirm that the user has an active membership inside the requested organization `accountId`.
- **API Gateway Key Forwarding**: Requests sent to the upstream Connect Auth Service forward the credentials key `API_GW_KEY` under the `x-apikey` header to pass Apigee authentication.
- **Query Partitioning**: Database operations are filtered strictly using the verified `accountId` to isolate records and prevent multi-tenant data leakages.

### Role-Based Access Control (RBAC)
- Endpoints enforce that only users holding administrative roles (such as `GOV_ACCOUNT_ADMIN`, `connect-admin`, or `admin`) are permitted to read or mutate organization applications.

### Developer Offline Support
- During local development or Playwright E2E test runs where Keycloak or Auth services might be offline or blocked by sandbox networking constraints, the server automatically defaults to safe mock credentials if the network call fails (constrained strictly to `process.env.NODE_ENV !== 'production'`).

---

## 6. Hosting & Frontend Deployment (Firebase Hosting)

The frontend client assets are deployed to **Firebase Hosting** and mapped to the target site `hub-connect-dev` (GCP Project: `gtksf3-dev`).

### Routing & API Gateway Reverse Proxy
- **Static Assets**: Client-side pages, styling, and modules are served directly from Firebase Hosting via the public directory `.output/public`.
- **API Routing**: Requests matching `/api/**` are rewritten and proxy-forwarded to the Cloud Run backend service `connect-hub-api-dev` in the `northamerica-northeast1` region.
- **Single Page App Routing**: All remaining routes (`**`) fall back to `/index.html` to support client-side SPA routing (vue-router).

### Hosting Deployment
- **Script**: `hub/scripts/deploy-hosting.sh`
- **Execution**: Can be run locally using `bash hub/scripts/deploy-hosting.sh` to trigger client building and static deployment.

---

## 7. Centralized Configuration Management

All scripts inside the `hub/scripts/` directory load environment-specific parameters from a single centralized configuration file to keep deployments modular and allow simple promotions (e.g. dev to prod).

- **Script**: `hub/scripts/env.sh`
- **Purpose**: Defines common environment variables (`PROJECT_ID`, `REGION`, `SERVICE_NAME`, `SERVICE_ACCOUNT`, `DB_INSTANCE_NAME`, `DB_NAME`, `DB_USER`) as a single source of truth.
- **Integration**: Sourced dynamically inside the following utility scripts:
  - `deploy-hosting.sh` (builds and uploads static assets)
  - `deploy-api.sh` (builds and runs Cloud Run container)
  - `grant-sa-access.sh` (outputs Database & IAM permission grants)