# School-Management-System
This project is a full-stack web application built with ASP.NET Core, Entity Framework and Angular.
The application has two interfaces, the one is used by the Parents, Students and outside peoples, the other interface is used by Teachers, Accountants and Admin of the school for the day to day activities of the school.

## Technologies
Backend: ASP.NET Core Web API (.NET 7)
Frontend: Angular (14)
Database (Optional): [Specify database if used, e.g. Entity Framework Core with SQL Server]
Features (Optional)
List some key features of your application here.
Getting Started
Prerequisites:

.NET Core SDK (7 or later): https://dotnet.microsoft.com/download
Node.js and npm (or yarn): https://nodejs.org/
Running the Application:

Clone this repository.

## Backend (ASP.NET Core):
Open a terminal window in the project root directory.
Restore dependencies: dotnet restore
Build the application: dotnet build
Run the application: dotnet watch run (This will automatically rebuild and restart the application on changes)

## Frontend (Angular):
Open a separate terminal window in the Client directory.
Install dependencies: npm install (or yarn install)
Start the development server: ng serve (This will serve the Angular application on http://localhost:4200 by default)
Building the application for production:

### Frontend:
In the client directory, run: ng build --prod (This will generate optimized production build)

### Backend:
You may need additional configuration for production deployment depending on your chosen hosting solution. Refer to the ASP.NET Core documentation for details.

## Folder Structure

├── client (Angular application)
│   ├── ... (Angular application files)
├── API (ASP.NET Core project)
│   ├── Controllers (API controllers)
│   ├── Entities (Data models)
│   ├── Program.cs (Application configuration)
│   ├── ... (Other ASP.NET Core project files)
├── README.md (This file)
