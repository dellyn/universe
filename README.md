# GitHub Projects CRM

This project includes 
1. Client side 
2. Server side
3. Automation testing
4. Dockerization

Hi, and thanks again for the technical task!

### Installation

1. Start the application with Docker:
   ```
   docker-compose up --build -d
   ```

2. Access the application: http://localhost:3000


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

Hi! I have a quick note regarding styles and components — I used pure MUI in this task, but to be honest, I’m not a big fan of relying on it directly, as it comes with its own set of limitations.

In an ideal setup, the UI layer should be scalable and decoupled from MUI. To achieve that, I usually structure components in layers and apply SOLID principles to ensure the UI library can be replaced easily and safely at scale:

The goal is to streamline the component API using an adaptor pattern — making it backward-compatible and easily swappable. That way, we could replace MUI with another library by adjusting the adaptor layer without affecting the rest of the app.

Every MUI component would be wrapped to align with our internal API. 

This approach allows for better scaling and theming flexibility. I didn’t fully implement it here due to time constraints, but I’d be happy to explain the reasoning behind it or dive deeper into specific decisions if needed

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
│   │   └── apiInterfaces  # Interfaces to communicate between client and servers
│   ├── server/            
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── interfaces/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
```

## Demo
![Area2](https://github.com/user-attachments/assets/6b98c91e-889b-418b-8030-047728fff841)

