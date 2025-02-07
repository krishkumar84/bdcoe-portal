# Trainee Portal - 2nd Year Probation Period

This is a web application developed for managing the probation period of 2nd-year trainees. The platform allows trainees to track their attendance, submit individual and group projects, view their attendance statistics, and interact with an admin dashboard. The application is built using Next.js, TypeScript, and is managed with pnpm for efficient package management.

## Features

- **Trainee Attendance Tracking**: 
  - Trainees can mark their attendance within a specified time window. 
  - Admin can control the opening and closing of attendance windows.
  - Attendance statistics and history are viewable to trainees.

- **Project Submission**:
  - Trainees can submit projects both individually and in groups.
  - Admins can view and manage project submissions.

- **Admin Dashboard**:
  - Admins have control over attendance windows.
  - Ability to flag students for issues such as incorrect attendance or rule violations.
  - View and manage project submissions from all trainees.

- **Attendance Window Control**: 
  - Admin can open and close the attendance window, ensuring that trainees only mark their attendance within a set time period.

## Tech Stack

- **Frontend**: Next.js, TypeScript
- **Backend**: Server Actions
- **Package Manager**: pnpm (for efficient package management)
- **ShadCN**: Used for UI components to create a sleek, modern design.
- **Uploadcare**: Integrated for media management, enabling trainees to upload and manage images and files for project submissions.
- **RateLimiter**: Used for rate-limiting, ensuring fair use and protecting the application from abuse, particularly for attendance marking and project submissions.
- 
## 🚀 some snapshots 
![App Demo](https://ucarecdn.com/c3144aad-5afb-4bc1-94c0-3463f47e01bc/)

![App Demo](https://ucarecdn.com/0e1b6abd-23f4-4cd1-bc33-c7d78822913c/)

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v21 or later)
- [pnpm](https://pnpm.io/) (v9 or later)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/trainee-portal.git
   cd trainee-portal

2. **Install the dependencies**:
   ```bash
    pnpm install
 
3. **Run the project**:
   ```bash
   pnpm run dev
