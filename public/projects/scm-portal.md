# Enterprise SCM Portal – Erajaya Group

**Role**: Odoo Developer
**Tech Stack**: Odoo 17, PostgreSQL, Docker, Python  
**Period**: 2024 - Present

## Overview

Developed a custom Supply Chain Management (SCM) system for Erajaya Group, one of Indonesia's largest distribution and retail companies. The system serves as the operational backbone managing stock flow across thousands of warehouses with thousands of daily transactions.

## Executive Summary

Built a custom SCM system for Erajaya Group handling massive-scale logistics operations. The system manages thousands of warehouses with thousands of daily transactions, designed with optimized architecture to run efficiently on standard infrastructure while supporting future scalability.

## Key Technical Achievements

### 1. Rapid Learning & Production-Ready Deployment
**Challenge**: Started the project with zero Odoo experience and no prior knowledge of optimized Docker deployment for enterprise systems.

**Solution**: Conducted intensive self-learning and research to master Odoo framework and Docker optimization within tight deadlines. Implemented production-ready deployment with optimized container resource management and Nginx configuration.

Result: Successfully delivered a stable, production-ready system despite starting from zero knowledge, demonstrating strong learning agility and problem-solving skills.

### 2. High-Scale Optimization on Standard Infrastructure
**Challenge**: Handling massive data volume (thousands of transactions/day) and coordinating thousands of warehouses, while keeping the system responsive on standard server specifications.

**Solution**: Implemented PostgreSQL Materialized Views for cross-module Summary features (upstream-to-downstream). This strategy moves complex query calculation loads (more than 5 tables) to background processes, keeping the system lightweight (OLTP) despite limited server resources.

Result: Dashboard reports remain instant without expensive hardware upgrades, saving infrastructure operational costs.

### 3. Multi-Project Hub Architecture (Scalability & Clean Code)
**Challenge**: System designed to be a "home" for various future internal projects. Required clean code management so teams don't interfere with each other.

**Solution**: Designed Odoo architecture supporting Multi-Project Repository. Used isolated addons-path configuration and Docker management allowing integration of various independent repos into one SCM Odoo instance.

Result: Enables development scalability where other teams can place their projects in the same ecosystem without breaking existing core SCM.

### 4. Pure From-Scratch Module Development
**Challenge**: Erajaya's highly specific SCM business processes couldn't be accommodated by Odoo's standard modules without major modifications.

**Solution**: Built all modules from scratch (no-inheritance). By building from scratch, ensured database schema is truly efficient, storing only necessary data and speeding up indexing processes.

Result: Optimized performance with lean, custom-tailored data structures.

### 5. Asynchronous Resilience for Legacy Integration
**Challenge**: Data synchronization to external legacy applications often hampered by high latency (5-10 seconds per hit), risking main system freezing.

**Solution**: Integrated Job Queue to handle all API calls asynchronously. This ensures warehouse operations continue smoothly without being affected by unoptimized third-party application performance.

Result: System remains responsive regardless of external API performance.

## Impact & Metrics

- **Proven at National Scale**: Successfully manages supply chain flow for thousands of Erajaya distribution points nationwide
- **Optimized Cost**: System performance remains stable on standard servers thanks to query optimization and Materialized Views usage
- **Developer Friendly**: Multi-repo architecture facilitates cross-departmental collaboration in future feature development

## Technologies Used

- **Backend**: Odoo 17, Python
- **Database**: PostgreSQL (Materialized Views)
- **Infrastructure**: Docker, Multi-Project Repository
- **Integration**: Job Queue, REST API
- **Architecture**: Multi-Addons Path, Isolated Repository Management