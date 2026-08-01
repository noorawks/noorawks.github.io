# Enterprise SCM Portal - Erajaya Group

**Role**: Fullstack Engineer
**Tech Stack**: Odoo 17, PostgreSQL, Docker, Python, Jenkins, Nginx
**Period**: 2024 - Present

## Overview

Developed a custom Supply Chain Management (SCM) system for Erajaya Group, one of Indonesia's largest consumer electronics and lifestyle groups (Erafone, iBox, JD Sports). The system serves as the operational backbone managing stock flow across 5,000+ warehouses nationwide, processing hundreds of daily transactions with hundreds of concurrent users, plus an async pipeline handling 300-500K daily delivery order records ingested from Kafka.

## Executive Summary

Built the highest-complexity Odoo project I've ever handled: a national-scale SCM portal for Erajaya Group. The system integrates six interconnected state machines, connects to 5+ external services, enforces 25+ granular security groups with multi-company data isolation, and handles massive data throughput (300-500K Kafka records/day) while keeping the UI responsive for hundreds of concurrent warehouse users.

## Key Technical Achievements

### 1. Rapid Learning and Production-Ready Deployment

**Challenge**: Started the project with zero Odoo experience and no prior knowledge of optimized Docker deployment for enterprise systems.

**Solution**: Conducted intensive self-learning and research to master Odoo framework and Docker optimization within tight deadlines. Implemented production-ready deployment with optimized container resource management and Nginx configuration.

Result: Successfully delivered a stable, production-ready system despite starting from zero knowledge, demonstrating strong learning agility and problem-solving skills.

### 2. Six Interconnected State Machines (End-to-End Workflows)

**Challenge**: SCM operations required tight coupling between six distinct business workflows. Each workflow needed to trigger downstream actions in other modules automatically.

**Solution**: Designed and integrated six state machines covering the complete supply chain lifecycle: inter-warehouse transfers, claims management, billing, pickup orders, vendor returns, and issue reporting.

Result: A fully automated end-to-end workflow where claims trigger billing, transfers connect to pickup status, and vendor returns source data from external APIs, all without manual handoffs.

### 3. Database Optimization: ~50% RDS Reduction

**Challenge**: Query performance degraded under growing data volume. Odoo's default ILIKE operator triggered full table scans by ignoring indexes. Both custom-built and inherited legacy modules suffered from unoptimized queries and accumulating unused data, causing daily RDS usage to creep up.

**Solution**: Overrode Odoo's default search by replacing ILIKE with exact match (=) operators on critical columns to force B-tree index usage. Audited all module queries, added B-tree indexes on frequently used filter and join columns, and eliminated N+1 patterns through prefetch and batch reading. Implemented Materialized Views for dashboards, moving complex summary calculations (joining 5+ tables) from real-time ORM queries to PostgreSQL Materialized Views refreshed via scheduled cron. Set up automated cron-based cleanup of stale data, PostgreSQL VACUUM to prevent table bloat, and log rotation to protect disk capacity. Built scheduled reminder system (H+3, H+7, H+14) for follow-up actions and used pandas for efficient bulk data processing.

Result: Maintained daily RDS usage consistently around 50%, preventing degradation from legacy modules while keeping dashboard reports instant, without requiring hardware upgrades.

### 4. Multi-Service Integration with Async Queue

**Challenge**: The system depends on 5+ external services with varying latency (up to tens of seconds per call). Additionally, Kafka streams 300-500K delivery order records daily, creating race condition risks and potential data duplication.

**Solution**: Implemented OCA Queue Job to handle all Kafka data consumption and external API calls asynchronously. Configured dedicated channel workers to isolate high-intensity workloads from standard operations. Applied identity keys based on unique record IDs to guarantee queue integrity and prevent duplicate processing. All REST API calls use token-based authentication with auto-refresh on 401 errors. External integrations include Message Queue and Kafka processing 300-500K records per day async via dedicated channels, Logistics API for real-time delivery status tracking from shipping aggregators, Pricing Service for automated sync of material values for invoice generation, and SSO through Keycloak as a custom authentication module replacing Odoo's default login.

Result: Main thread stays responsive regardless of external service latency. Eliminated data duplication issues even during peak transaction surges.

### 5. Multi-Project Hub Architecture with CI/CD Pipeline

**Challenge**: The system needed to serve as a central hub for multiple independent projects managed by different teams within a single Odoo instance, without dependency conflicts or cross-module interference.

**Solution**: Designed multi-repo architecture with isolated addons-path configuration via Docker volume mounts. Configured independent Jenkins CI/CD pipelines per project repository. Implemented auto-build triggers on push, assimilating all modules into a single container automatically.

Result: Squads can develop and deploy independently while running in one stable ecosystem. No dependency conflicts between projects like the delivery tracking system and core SCM.

### 6. Pure From-Scratch Module Development

**Challenge**: Erajaya's highly specific SCM business processes could not be accommodated by Odoo's standard modules (stock, sale) without major modifications.

**Solution**: Built all modules from scratch with no inheritance from standard Odoo modules. This ensured the database schema is truly lean, storing only necessary data and enabling faster indexing.

Result: Optimized performance with custom-tailored data structures free from standard module technical debt.

### 7. Multi-Layer Security Architecture

**Challenge**: The system must serve multiple subsidiary companies under one group while strictly isolating data per business unit. Each warehouse and company needs independent access boundaries.

**Solution**: Configured 25+ security groups with granular, role-based permissions across all modules. Implemented record rules based on warehouse and company assignment. Applied dynamic domain filters at the Python level to filter material and warehouse data in real time. Each user can hold multiple role combinations across modules, but only sees data scoped to their assigned warehouses and companies.

Result: Secure multi-tenancy with strict data isolation across business entities. One platform, many companies, zero data leakage.

## Impact & Metrics

- **National Scale** manages supply chain flow for 5,000+ distribution points nationwide
- **High Throughput** processes 300-500K Kafka delivery order records daily alongside hundreds of concurrent warehouse users
- **~50% RDS Usage** database optimization kept daily consumption consistently under control despite growing transaction volume
- **Developer Friendly** multi-repo CI/CD architecture enabling cross-team parallel development
- **Enterprise Security** 25+ granular role-based access groups with multi-company data isolation

## Technologies Used

- **Backend**: Odoo 17, Python, pandas
- **Database**: PostgreSQL (Materialized Views, B-tree Indexing, VACUUM)
- **Infrastructure**: Docker, Multi-Project Repository, Jenkins CI/CD
- **Integration**: REST API, Message Queue
- **Architecture**: Multi-Addons Path, Isolated Repository Management, 6 State Machines
