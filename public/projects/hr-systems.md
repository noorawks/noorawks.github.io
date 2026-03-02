# Integrated HR Management System (National Group)

**Role**: Backend & System Engineer  
**Tech Stack**: PHP, Laravel, MySQL, Vue.js, Axios, Nwidart Modules  
**Period**: 2018 - 2020

## Overview

Built a centralized HR platform for a national corporate group with complex organizational structure. The system digitizes critical functions such as Succession Planning, KPI Management, and automated overtime reporting for thousands of employees across multiple subsidiary companies.

## Executive Summary

Developed an enterprise-scale HR management system serving a national corporate group with multiple subsidiaries. The platform handles succession planning, KPI management, and automated reporting for thousands of employees, built with modular architecture for scalability and team collaboration.

## Key Technical Achievements

### 1. Rapid Mastery & Implementation (The Early Hustle)
**Challenge**: Developing an enterprise-scale system with less than one year of Laravel framework experience.

**Solution**: Self-taught intensive learning to master MVC architecture, Eloquent ORM, and RESTful API design. This project became proof of rapid adaptation capability in adopting new technologies for urgent business needs.

Result: Successfully delivered enterprise system despite limited framework experience.

### 2. Pioneering Modular Architecture (Before It Was Cool)
**Challenge**: In the Laravel 5.4 era (around 2017-2018), standard monolithic architecture often complicated team collaboration due to overlapping code (file conflicts).

**Solution**: Implemented Modular Programming concept using nwidart/laravel-modules package. By dividing the system into standalone modules (Successor, Overtime, KPI), teams could work in parallel on different features without disrupting main code integrity.

Result: Enabled parallel development without code conflicts.

### 3. Multi-Subsidiary Data Orchestration
**Challenge**: System must serve multiple subsidiary companies in one platform, but each employee data and HR policy must be strictly isolated per company (Multi-Company Code).

**Solution**: Designed database schema and middleware logic to ensure data isolation based on company code. This concept is similar to multi-tenancy architecture that guarantees data security and privacy between business entities within one group.

Result: Secure data isolation across multiple subsidiaries.

### 4. Modernizing UX with Vue.js Transition
**Challenge**: Traditional HR applications often feel rigid and slow. Interactive KPI dashboard requirements needed more responsive UI.

**Solution**: Integrated Vue.js with Axios to handle data interactions asynchronously. This provided a more modern, dynamic, and faster user experience compared to full-page reload applications of that era.

Result: Modern, responsive user experience.

### 5. Automated Enterprise Reporting
**Challenge**: Management needs to obtain performance and overtime reports in physical format (PDF) and raw data (Excel) accurately.

**Solution**: Built custom report generator engine capable of processing large transaction data into structured PDF and Excel documents, facilitating HR in audit processes and decision making.

Result: Automated accurate reporting for management.

## Impact & Metrics

- **Organizational Efficiency**: Eliminated manual processes in KPI calculation and overtime at corporate group level
- **Scalability**: Modular architecture enables future feature additions without total system overhaul
- **Data Integrity**: Successfully managed thousands of employee data from various subsidiaries with high access security level

## Technologies Used

- **Backend**: PHP 5.6, Laravel 5.4
- **Frontend**: Vue.js, Axios
- **Database**: MySQL
- **Architecture**: Nwidart Modules (Modular Programming)
- **Reporting**: PDF & Excel Generation