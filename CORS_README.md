# CORS Configuration

The application now includes Cross-Origin Resource Sharing (CORS) handling to allow or restrict API access from different domains.

## Configuration

The CORS configuration uses an array of allowed origins defined directly in the application:

```javascript
// Define allowed origins
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'];

// CORS Configuration
const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // 24 hours
};
```

### Options Explained

- `origin`: Array of domains that can access your API
  - Each domain must be specified exactly (including protocol and port if applicable)
  - Example: `['http://localhost:3000', 'https://your-app.com']`
- `methods`: HTTP methods allowed
- `allowedHeaders`: HTTP headers clients can send
- `credentials`: Allows authenticated requests (cookies, authorization headers)
- `maxAge`: Caches preflight request results for 24 hours

## Security Considerations

- For production, always specify exact domains in the `allowedOrigins` array
- The `credentials: true` option allows authenticated requests, which requires specific origins
- Review and adjust allowed methods and headers based on your API requirements
- Consider implementing environment-specific origin lists (e.g., different arrays for development vs. production)

## How to Add New Origins

To add a new allowed origin, modify the `allowedOrigins` array in `src/index.ts`:

```javascript
// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'https://your-new-domain.com'  // Add new origins here
];
``` 