# Environment Variables Setup

This project now uses environment variables for API URLs instead of hardcoded values.

## Setup Instructions

1. **Create Environment File**
   Create a `.env.local` file in the root directory of your project:

   ```bash
   # API Configuration
   NEXT_PUBLIC_API_BASE_URL=https://mapacultural.saojosedobonfim.pb.gov.br/api
   ```

2. **Environment Variables**
   - `NEXT_PUBLIC_API_BASE_URL`: The base URL for all API calls
   - The `NEXT_PUBLIC_` prefix is required for Next.js to expose the variable to the client-side

## Usage in Components

Each component now uses the environment variable directly:

```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://mapacultural.saojosedobonfim.pb.gov.br/api';

// Use the base URL directly
const response = await fetch(`${API_BASE_URL}/endpoint`);
```

## Files Updated

The following files have been updated to use environment variables directly:

### Auth Contexts
- `src/app/painel/authContex.js`
- `src/app/superadmin/dashboard/authContex.js`

### Agent Components
- `src/app/agent/painel/components/login.js`
- `src/app/agent/painel/components/header.js`
- `src/app/agent/painel/components/profile.js`
- `src/app/agent/painel/components/account-selector.js`
- `src/app/agent/components/cpf.js`

### Superadmin Components
- `src/app/superadmin/dashboard/components/login.js`
- `src/app/superadmin/dashboard/components/tenants.js`

## Implementation Pattern

Each component now follows this pattern:

```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://mapacultural.saojosedobonfim.pb.gov.br/api';

// Example usage
const response = await fetch(`${API_BASE_URL}/agent/profile/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});
```

## Benefits

1. **Environment-specific URLs**: Easy to switch between development, staging, and production
2. **Security**: API URLs are not hardcoded in the source code
3. **Simplicity**: No need for centralized config files
4. **Flexibility**: Each component can have its own fallback URL if needed

## Notes

- The `.env.local` file is already in `.gitignore` to prevent committing sensitive information
- The fallback URL ensures the app works even if the environment variable is not set
- All API calls now use the environment variable directly
- No centralized configuration file needed 