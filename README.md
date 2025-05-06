# GitHub Projects CRM

This project includes 
1. Client side 
2. Server side
3. Automation testing
4. Dockerization

Hi, and thanks again for the technical task!

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
    MONGODB_USER_PASSWORD=
    MONGODB_USER_NAME=
    MONGODB_URI=
    JWT_ACCESS_SECRET=
    JWT_REFRESH_SECRET=
    RESEND_TOKEN=

    DB_NAME=universeApp
    SERVER_PORT=3000
    TEST_USER_EMAIL="testuser@gmail.com"
    TEST_USER_PASSWORD="testuserPassword123"
   ```

3. Start the application with Docker:
   ```
   docker-compose up -d
   ```
   
4. Access the application:
   - Frontend: http://localhost:3001
   - API: http://localhost:3000/api

## API Documentation

### Authentication
- API base url - /api/v1/   
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login into account
- `POST /auth/refresh` - Generate new refresh token
- `POST /auth/verify-email-code` - Verify code from email
- `POST /auth/resend-verification` - Resend email with new code

### Repositories
- `GET /repositories` - List all repositories
- `POST /repositories` - Add a new repository
- `PUT /repositories/:id` - Update repository data
- `DELETE /repositories/:id` - Delete a repository


## Notes

Hi. So the note regarding styles - I have used pure MUI. But I don't like it and it goes with it's disadvantages.
In an ideal setup, the UI layer should be scalable and decoupled from MUI. To achieve that, I usually structure components in layers and use SOLID principles to make sure I can easily replace ui library at scale:

The goal is to streamline the component API using an adaptor pattern — making it backward-compatible and easily swappable. That way, we could replace MUI with another library by adjusting the adaptor layer without affecting the rest of the app.

Every MUI component would be wrapped to align with our internal API. 

This approach allows scaling and theming flexibility. I didn't fully implement it here due to time constraints, but would be happy to discuss the reasoning or dive deeper into specific decisions.

## Project Structure

```
├── assets/               # Static assets
├── dist/                 # Build output
├── node_modules/        
├── src/                 
│   ├── @libraries/       # Company hared libraries, utils, interfaces
│   │   └── node/
│   │   └── interfaces/
│   ├── @packages/        # Company shared packages

│   │
│   ├── client/       
│   │   ├── tests/        # Client tests
│   │   ├── api/
│   │   ├── components/
│   │   │   └── ui-Library/ # Adapter for UI library. Needs to wrap components of the MUI or any other library in ideal app
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── state/
│   │   ├── theme/
│   ├── data/            
│   │   └── types          # Core data of the Application. User, Repositories
│   │   └── apiInterfaces  # Interface to communicate between clien and servers
│   ├── server/            
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── interfaces/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/