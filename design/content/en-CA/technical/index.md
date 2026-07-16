---
title: Technical Lead Overview
description: Developer & Tech Lead Hub
---

> **Stop rebuilding identity, payment, and audit layers. Integrate with our vetted, cloud-native services and focus on your application's core logic.**

If your product owner just told you that your new or existing service is onboarding to the Connect Platform, you are in the right place. This hub is designed by developers, for developers, to help you get integrated, configured, and deployed onto our modern, cloud-native infrastructure with minimal friction.

---

## 🛠️ The Tech Stack & Architecture

The Connect Platform is built as a highly scalable, secure, and interoperable public cloud platform. Instead of spinning up isolated silos, your application plugs into a centralized, API-driven network of common capabilities

### 1. Identity & Access: Native BCSC Portal
We handle the identity brokering. The platform acts as a native portal for:
*   **BC Services Card (BCSC):** Full OIDC integration for high-assurance citizen authentication.
*   **BCeID:** SAML/OIDC paths for business and standard logins.
*   **IDIR:** Seamless OAuth2 integration for internal staff and administrator authorization.

### 2. Financial Core: The Pay API
If your application charges fees or collects revenue, do not write custom ledger code. Integrate with our Pay API to automatically inherit:
*   Multi-channel payment handling (Credit Card, PAD, Online Banking, EFT, and BC Online).
*   Automated daily financial reconciliation and audit logs.
*   Automated revenue disbursements via **Electronic Journal Voucher (EJV)** GL coding for internal ministries, or **Corporate Accounting System (CAS)** supplier record routing for broader public sector partners.

### 3. Frontend Architecture: Reusable Nuxt Components
We provide a comprehensive, reusable frontend ecosystem to align directly with the B.C. Government **Digital Code of Practice**:
*   **Nuxt Component Library:** Standardized, highly performant Vue/Nuxt components out of the box (handling layouts, form validation, user profile states, and complex address autocomplete fields).
*   **Familiar Patterns:** Built to maintain high accessibility, responsive design, and rapid render times without bloating your dependencies.

---

## 🏁 Technical Quick-Start Path

Getting your system integrated follows a clean, highly standardized workflow to ensure we stay **"Common by Default"**:

### Step 1: Local Development Setup
1.  **Request Sandbox Client Credentials:** Submit a request to the platform team for OIDC client IDs and API gateway keys.
2.  **Environment Security:** Keep your local runtime secure. Avoid committing plaintext secrets or exposing environment variables in plain `.env` files. We highly recommend using hardware-level process isolation, secure local credential storage, and injecting secrets dynamically via CLI credential managers (such as 1Password CLI) during container start.
3.  **Spin Up Containers:** Use our standard Docker Compose configurations to run lightweight mocks of the platform's core identity and pay gateways locally.

### Step 2: Implement Federated Authentication
*   Configure your application to delegate user session management to our OIDC endpoints.
*   Upon successful BCSC or BCeID handshake, parse the JWT claims locally to establish user context and platform permissions.

### Step 3: Integrate API Call Patterns
*   Route payments, status queries, and data lookup events through our secure API Gateway.
*   Implement standard error-handling, backoff, and retry behaviors using our pre-built HTTP client interceptors.

### Step 4: Configure CI/CD and Observability
*   Integrate our standard deployment templates into your deployment pipelines.
*   Configure standard health check endpoints (`/healthz`, `/livez`) and instrument tracing so our monitoring tools can track your application's Service Level Objectives (SLOs) and runtime performance.

---

## 👥 Developer Help & Community Support

You are not building in a silo. The platform engineering group operates an active, developer-first support network:

*   **Engineering Wiki:** Deep-dives on database schemas, API specifications, Nuxt 4 layout patterns, and cryptographic validation requirements.
*   **Teams Channels:** Real-time, developer-to-developer chat. Drop by `#connect-dev-help` for immediate architectural feedback, pipeline troubleshooting, or to ask questions about API changes.
*   **Weekly Technical Co-Design Sessions:** Every Thursday, platform architects host open co-design hours. Bring your system diagrams, API payloads, or blocking bugs, and we will work through them live.