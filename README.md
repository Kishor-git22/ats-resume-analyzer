# ATS Resume Analyzer

A modern web application that helps job seekers optimize their resumes using AI-powered analysis. Get instant feedback on your resume's ATS (Applicant Tracking System) compatibility and improve your chances of landing interviews.

## Table of Contents

- [Introduction](#introduction)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development](#development)
- [License](#license)

## Introduction

ATS Resume Analyzer is designed to help job seekers understand how their resumes perform in modern ATS (Applicant Tracking System) software. The application provides detailed analysis and scores across various aspects of your resume, helping you optimize it for better visibility and higher ranking in job applications.

## Tech Stack

### Frontend

- **React 19** - A JavaScript library for building user interfaces
- **TypeScript** - For type-safe JavaScript development
- **React Router** - For client-side routing
- **Tailwind CSS** - For modern, utility-first styling
- **Zustand** - For state management
- **React Dropzone** - For file upload functionality
- **React Hot Toast** - For user notifications
- **PDF.js** - For PDF processing in the browser

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework for building RESTful APIs
- **MongoDB** - NoSQL database for storing user data and resume information
- **Mongoose** - MongoDB object modeling for Node.js
- **JWT** - For secure authentication and authorization

### Development Tools

- **Vite** - Next Generation Frontend Tooling
- **TypeScript** - Type checking and better developer experience
- **ESLint** - For code linting
- **Prettier** - For code formatting

## Features

- **Resume Upload**: Drag and drop or select your resume in PDF format
- **ATS Compatibility Score**: Get an overall ATS compatibility score
- **Detailed Analysis**: Breakdown of resume components and their scores
- **Visual Feedback**: Interactive gauges and charts to visualize your resume's performance
- **Responsive Design**: Works on desktop and mobile devices
- **Secure Processing**: Your resume is processed in the browser, ensuring privacy

## Quick Start

1. **Prerequisites**
   - Node.js (v18 or later)
   - npm or yarn

2. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/ats-resume-analyzer.git
   cd ats-resume-analyzer
   ```

3. **Install dependencies**

   ```bash
   npm install
   # or
   yarn
   ```

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Visit `http://localhost:3000` to see the application in action.

## Project Structure

```
/
├── app/
│   ├── components/      # Reusable UI components
│   ├── lib/            # Utility functions and libraries
│   ├── routes/         # Application routes
│   ├── app.css         # Global styles
│   └── root.tsx        # Root application component
├── public/             # Static assets
├── types/              # TypeScript type definitions
└── package.json        # Project dependencies and scripts
```

## Development

- **Type Checking**:

  ```bash
  npm run typecheck
  ```

- **Building for Production**:

  ```bash
  npm run build
  ```

- **Starting Production Server**:
  ```bash
  npm start
  ```
