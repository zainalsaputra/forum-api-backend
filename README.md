# Forum API

## Project Description
Forum API is a discussion platform API developed using **Node.js (Hapi)**, designed with **Clean Architecture** and **Test-Driven Development (TDD)** principles. It includes robust testing and deployment workflows with CI/CD pipelines.

---

## Features
- **User Authentication**: Secure user registration and login with **JWT**.  
- **Thread Management**: Create, read, and delete discussion threads.  
- **Comment System**: Manage comments and replies to threads.  
- **Testing**: Implement unit, integration, and functional tests.  
- **Documentation**: Generate API documentation using **Hapi Swagger**.  
- **CI/CD Workflows**: Automate testing and deployment using **GitHub Actions**.  
- **Security**: Rate limiting with **NGINX** and HTTPS setup using **Certbot**.  

---

## Tech Stack
- **Backend Framework**: Node.js with Hapi.js  
- **Database**: Amazon RDS  
- **Testing**: Jest for TDD  
- **CI/CD**: GitHub Actions  
- **Web Server**: NGINX  
- **Deployment**: Amazon EC2  

---
## Database Setup
1. Open postgres cli
    ```bash
    psql --username postgres
    ```
2. Create database
    ```bash
    CREATE DATABASE <database_name>; 
    CREATE DATABASE <database_testing_name>;
    ```
3. Grant database access to database user
    ```bash
    GRANT ALL ON DATABASE <database_name> TO <database_user>;
    GRANT ALL ON DATABASE <database_testing_name> TO <database_user>;
    ```
    ```bash
    ALTER DATABASE <database_name> OWNER TO <database_user>;
    ALTER DATABASE <database_testing_name> OWNER TO <database_user>;
    ```

## Installation
1. Clone this repository:
    ```bash
    git clone <repository-url>
    ```
2. Navigate to the project directory:
    ```bash
    cd forum-api
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Copy .env.example then change to .env and fill it
5. Run database migrations for testing and production:
    ```bash
    npm run migrate up; 
    npm run migrate:test up;
    ```
6. Start the development server:
    ```bash
    npm run start:dev
    ```

---

## Testing
Run all tests using:
```bash
npm run test:watch
```

---

## Deployment
### Deploy App via EC2
1. Access the EC2 instance via SSH:
    ```bash
    ssh -i "<key>.pem" <user>@<EC2-instance-address>
    ```
2. Download Node.js:
    ```bash
    curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
    ```
3. Install Node.js:
    ```bash
    sudo apt-get install -y nodejs
    ```
4. Install production manager package PM2:
    ```bash
    sudo npm install pm2 -g
    ```
5. Clone the repository:
    ```bash
    git clone <repository-url>
    ```
6. Install project dependencies:
    ```bash
    npm install
    ```
7. Create a `.env` file:
    ```bash
    touch .env
    ```
8. Edit the `.env` file:
    ```bash
    vim .env
    ```

### Configure Database in RDS
1. Connect to RDS via `psql`:
    ```bash
    psql --host <endpoint> --username <username>
    ```
2. Create the required databases:
    ```sql
    CREATE DATABASE forumapi;
    CREATE DATABASE forumapi_test;
    ```

### Additional Configuration
1. Create a database configuration folder:
    ```bash
    mkdir -p config/database
    ```
2. Create the database configuration file:
    ```bash
    touch config/database/test.json
    ```
3. Edit the database configuration file:
    ```bash
    vim config/database/test.json
    ```
4. Run database migrations:
    ```bash
    npm run migrate up; npm run migrate:test up;
    ```
5. Run tests:
    ```bash
    npm run test
    ```
6. Start the HTTP server using PM2:
    ```bash
    pm2 start npm --name "forum-api" -- run "start"
    ```

---
