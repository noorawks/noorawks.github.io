# Exam Competition Platform - TEKIRO

**Role**: Fullstack Engineer  
**Tech Stack**: Laravel, PHP, Livewire 3, Tailwind CSS, PostgreSQL, Google Apps Script, Github Actions
**Period**: January - April 2026

## Overview

Built the full exam administration platform for TEKIRO Mechanic Competition (TMC) 2026, a national automotive mechanics competition for vocational high schools (SMK) across Indonesia. The system manages the entire competition lifecycle: from participant onboarding and exam form generation to automated scoring, leaderboard management, and digital certificate distribution.

## Executive Summary

The core engineering challenge wasn't building a better exam system, it was making the existing Google Forms infrastructure scale to 80,000+ participants without adding significant server costs. The solution involved building an orchestration layer on top of Google's free infrastructure rather than replacing it, combined with a fully automated data pipeline that eliminated the manual coordination burden on the organizing committee.

## The Architecture Decision: Minimal-Cost Exam Delivery at National Scale

The original brief called for a custom exam engine, a reasonable starting point. The blocking constraint was budget: server infrastructure capable of handling tens of thousands of concurrent exam participants far exceeded what the client could spend.

**The insight that changed the approach**: the previous year's system had failed not because Google Forms couldn't scale, but because 8,000 to 10,000 users simultaneously hitting a single form overwhelmed one endpoint. Google Forms is served by Google's own infrastructure, the platform wasn't the problem. The single-form architecture was.

This reframed the entire engineering problem: instead of building an exam engine, the task became building an *orchestration layer* on top of Google's existing infrastructure.

**How it works**: Google Apps Script auto-generates multiple Form copies from a single master template. The Laravel system calculates how many form copies each school needs based on registered student count, assigns each school a unique set of form URLs, and maps those URLs back to the correct school and participant list. Load is distributed across separate form instances, each served entirely by Google at no cost. The Laravel server handles only orchestration and administration; it never touches exam delivery traffic.

Result: 80,000+ participants served at minimal cost. The entire exam delivery load runs on Google's infrastructure; the Laravel instance handles only the lightweight orchestration layer.

## Key Technical Achievements

### 1. Automated Form Generation Pipeline

**Challenge**: Generating hundreds of unique Google Form copies for schools across Indonesia, each pre-populated with the correct student list, had to happen reliably, at scale, and without blocking the admin UI.

**Solution**: The system calculates how many form copies each school needs based on their registered student count, then handles all generation automatically as a background process. Admins trigger it with a single action and continue working while everything runs behind the scenes.

Result: What would have been a manual duplication process is reduced to one click per school. Failures surface with clear messages rather than going unnoticed.

### 2. Automated Score Retrieval

**Challenge**: After the exam, scores were scattered across hundreds of separate Google Spreadsheets, one per form copy. Manually exporting and consolidating them was the previous workflow, slow, error-prone, and a full-day burden on the organizing team.

**Solution**: Built an automated retrieval pipeline that pulls responses from every spreadsheet, matches them against the registered student database, and consolidates all scores into the admin system. The pipeline handles real-world messiness like duplicate submissions and late entries without throwing errors or requiring manual intervention.

Result: Full score consolidation for all participating schools, previously a multi-hour manual effort, runs in minutes with no human involvement.

### 3. Password-Protected PDF Distribution for Exam Security

**Challenge**: The previous system had a structural security gap, exam links were accessible before the exam window opened, allowing early access to questions.

**Solution**: Exam links are packaged into a password-encrypted PDF per school. The password is managed from the admin panel and withheld from school coordinators until the moment the exam begins, so even if a coordinator receives the PDF in advance, the content stays sealed until authorized.

Result: Exam link confidentiality is enforced at the distribution layer, closing the early-access gap without any changes to the Google Forms setup itself.

### 4. Bulk Data Onboarding via Excel Import

**Challenge**: Onboarding thousands of students across hundreds of schools manually before a national competition would be operationally infeasible.

**Solution**: Built a province-scoped Excel import flow with auto-generated template files. Coordinators fill in student data and upload the file; everything else is handled automatically in the background.

Result: Full school and student registration for an entire province can be completed from a single file upload.

### 5. Real-Time Job Status Notifications

**Challenge**: Background operations like form generation and score retrieval take several minutes per school. Admins needed visibility into whether something was still running, had completed, or had failed.

**Solution**: Every background operation is tracked through a consistent status lifecycle, from queued, to running, to completed or failed with an attached error message. A notification indicator in the admin layout reflects these updates in real time.

Result: Admins always know the state of every background task. No silent failures, no need to guess whether a job finished.

## Impact & Metrics

- **Minimal additional server cost** for 80,000+ participants, entire exam delivery runs on Google's infrastructure
- **Eliminated full-day manual score consolidation**, post-exam pipeline runs in minutes, fully automated
- **Exam link security gap closed**, password-encrypted PDFs with timed password release
- **Bulk onboarding**, thousands of students registered via Excel import, replacing manual entry
- **Nationwide scale**, manages schools across all provinces in Indonesia from a single admin interface

## Technical Values Demonstrated

**Pragmatic Architecture Under Constraint**: Identified that Google Forms' bottleneck was the single-form architecture, not the platform itself, and designed an orchestration layer around that constraint rather than replacing the entire system.

**System Design for Operational Reliability**: Every long-running operation is async, non-blocking, and tracked with explicit success/failure states and error messages. The system surfaces failures clearly rather than hiding them.

**Correctness Under Edge Cases**: The data pipeline handles the messiness of a real competition, duplicate entries, late submissions, rescheduled cohorts, without manual intervention or data loss.
