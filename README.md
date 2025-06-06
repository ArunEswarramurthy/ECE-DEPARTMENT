# ECE Department Portal Web Application

A React.js web application for managing faculty details, feedback, notes, and ECE department achievements.

## Features

- Public front page with faculty details, feedback form, notes, and achievements
- Admin dashboard for managing all content
- Faculty management (add, edit, delete)
- Feedback form with student verification
- Feedback analytics with charts and export options
- Notes upload and management
- Department achievements tracking

## Admin Credentials

- Admin ID: 732722106004
- Password: E22EC018

## How to Run the Application

1. Make sure you have Node.js installed on your computer
2. Open a terminal/command prompt
3. Navigate to the project directory:
   ```
   cd formdepart
   ```
4. Install dependencies:
   ```
   npm install
   ```
5. Start the development server:
   ```
   npm start
   ```
6. Open your browser and go to:
   ```
   http://localhost:3000
   ```

## Technologies Used

- React.js
- React Router for navigation
- Chart.js for analytics
- Formik/Yup for form handling
- jsPDF for PDF export
- XLSX for Excel export

## Project Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Page components
- `/src/pages/Admin` - Admin dashboard pages
- `/src/assets` - Static assets like images
- `/src/utils` - Utility functions

## Data Storage

This application uses browser localStorage for data persistence. In a production environment, this would be replaced with a proper backend database.