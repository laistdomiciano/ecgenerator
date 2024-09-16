# EC-Generator

https://ecgenerator.onrender.com/

# Employment Contract Generator API

## Overview:
The Employment Contract Generator is a Flask-based API designed to streamline the process of creating employment contracts for different job roles. This application allows users to generate customized contracts by selecting from pre-defined templates for Full-Time, Part-Time, or Freelance employment agreements. The generated contracts are personalized based on user input and can be downloaded in PDF format.

The API is built with a focus on secure authentication, data management, and ease of contract generation. It integrates with PostgreSQL for data storage, employs JWT (JSON Web Tokens) for secure user authentication, and utilizes AWS S3 for storing and retrieving generated contract PDFs.

## Key Features:

### User Authentication: 
Users can register, log in, and receive JWT tokens for accessing secure endpoints.
### Contract Generation: 
Provides three contract templates (Full-Time, Part-Time, and Freelance). These templates are dynamically populated based on input from the user.
### PDF Export: 
After generating the contract, users can download the contract as a PDF document, which is also stored in AWS S3.
### User & Employee Management: 
The application allows users to manage employees and track which employees have active contracts.
### Input Validation: 
Ensures all required fields are filled out accurately before generating a contract.
### Secure Endpoints: 
Only authenticated users with valid JWT tokens can access contract generation and employee management functionalities.
### Database Migrations: 
Built-in support for database migration using Flask-Migrate to handle schema changes smoothly.
### Cross-Origin Resource Sharing (CORS): 
Configured to handle cross-origin requests securely, allowing integration with various front-end clients.

## Detailed Functionality:

### User Registration & Login:
Users sign up and provide their name, email, username, and password. The passwords are securely hashed and stored in the database.
After registration, users can log in and receive a JWT token. This token is required for accessing protected routes like contract generation and employee management.

### Employee Management:
Users can create employee profiles by providing details such as the employee's name, position, department, job responsibilities, salary, and benefits.
Employees are linked to contracts, and the system tracks whether an employee has an active contract.

### Contract Templates:
The system comes with three pre-configured contract templates: Full-Time, Part-Time, and Freelance. These templates contain placeholders for essential information such as job title, salary, work hours, and company details.
Users can select a template, fill out required details, and generate a contract tailored to the employee’s role.

### Contract Creation & PDF Generation:
The API generates contracts using the selected template and the provided data. After generation, a PDF version of the contract is created.
The generated PDF is uploaded to AWS S3 for persistent storage and is accessible via a public URL. The API returns this URL, allowing users to download or share the document.

### Secure Access with JWT:
JWT is used to authenticate users, ensuring that sensitive operations (like contract creation) are only accessible to logged-in users. This enhances the security of the platform.

### Database & Storage:
The application uses PostgreSQL as the database to store user information, employees, contract types, and generated contracts.
All generated PDFs are stored in an AWS S3 bucket, ensuring they are safely stored and easily retrievable.
This application is designed to be highly scalable, allowing businesses to manage employees and their contracts efficiently. It integrates various technologies like Flask, PostgreSQL, AWS S3, and JWT for a robust and secure user experience.

## Features
- User registration and authentication
- Three types of contract templates
- Generate contracts based on user input
- Input validation and sanitization
- Secure endpoints with JWT
- Deployment configuration for Vercel/Render
- Unit testing with pytest
- API documentation with Swagger

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/contract-generator.git
    cd contract-generator
    ```

2. Create and activate a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate
    ```

3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Set up the environment variables:
    ```bash
    cp .env.example .env
    ```
   Update `.env` with your configuration.

5. Run the application:
    ```bash
    flask run
    ```

## Endpoints

- `/auth/register` - Register a new user
- `/auth/login` - Login and receive a JWT
- `/contract/generate` - Generate a contract based on selected type and user input (Authenticated)

## Deployment

To deploy the application to Vercel or Render, follow the respective platform's deployment instructions. Ensure to set the environment variables on the deployment platform.

## Testing

Run unit tests using pytest:
```bash
pytest


//////
Explanation of Each File and Directory
app/
__init__.py: Initializes the Flask application, sets up extensions like SQLAlchemy, Migrate, and JWT, and registers the blueprint for routes.
models.py: Defines the database models (User, Employee, ContractType).
routes.py: Contains the route definitions for the API endpoints.
config.py: Configuration file for the application, including database URI and secret keys.
utils.py: Utility functions, such as input sanitization.
migrations/
Directory for database migration files managed by Flask-Migrate.
tests/
test_app.py: Contains unit tests for the application.
static/
swagger.json: Swagger documentation file for API documentation.
seed.py
Script to seed the database with initial data (users, employees, contract types).
run.py
Entry point to run the Flask application.
requirements.txt
Lists the Python dependencies required for the project.
Procfile
Specifies the commands that are executed by the app on the platform (for deployment purposes).
.env
Environment variables file containing sensitive information like database URI and secret keys.
.gitignore
Specifies files and directories that should be ignored by Git (e.g., venv/, .env, __pycache__/).


Project Directories Strucure:

/myGenerator
├── .github/
│   ├── workflows/  
│   │   ├── ci.yml
├── backend/
│   ├── app/  
│   │   ├── static/
│   │   │   ├── swagger.yaml  
│   │   ├── auth.py  
│   │   ├── backend_app.py   
│   │   ├── conftest.py         
│   │   ├── models.py           
│   │   ├── routes.py  
│   │   ├── test_routes.py                
│   │   ├── utils.py            
│   ├── migrations/                        
│   ├── .env                               
│   └── seed.py                 
├── frontend/                    
│   ├── public/  
│   │   ├── create_contract.html    
│   │   ├── create_employee.html      
│   │   ├── dashboard.html    
│   │   ├── home.html     
│   │   ├── login.html
│   │   ├── signup.html
│   │   └── update_user.html
│   ├── static/
│   │   ├── home.png          
│   │   ├── script.js
│   │   └── styles.css
│   ├── frontend_app.py 
├── venv/
├── .gitignore
├── README.md
└── requirements.txt 

