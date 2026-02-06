# FarmLokal Backend

A Node.js/Express backend API for FarmLokal, a platform connecting local farmers with consumers. Features OAuth authentication, product management with pagination, caching via Redis, and rate limiting.

### Hosted backend: https://farmlokal-backend-p1e6.onrender.com/
Hosted Frontend: https://farmlokal.netlify.app/
## Tech Stack

- **Runtime**: Node.js 22
- **Framework**: Express.js 5.x
- **Language**: TypeScript
- **Database**: MySQL (Railway)
- **Cache**: Redis (Upstash)
- **Authentication**: OAuth (custom implementation)
- **Rate Limiting**: express-rate-limit
- **API Documentation**: Auto-health checks & metrics endpoints

## Project Structure

```
src/
├── app.ts                    # Express app setup, CORS, middleware
├── config/
│   ├── mysql.ts             # MySQL connection pool (supports both env vars & URLs)
│   └── redis.ts             # Redis client (Upstash)
├── controllers/
│   ├── productController.ts # Product endpoint handlers
│   ├── externalController.ts
│   └── webHookController.ts
├── middleware/
│   └── rateLimiter.ts       # Rate limiting (100 req/min per user)
├── repositories/
│   └── productRepository.ts # Database queries with cursor pagination
├── routes/
│   ├── productRoutes.ts
│   ├── oauthRoutes.ts
│   ├── externalRoutes.ts
│   └── webhookRoutes.ts
├── services/
│   ├── productService.ts    # Business logic (caching, filtering)
│   ├── oauthService.ts
│   └── externalApiService.ts
├── utils/
│   ├── seedProducts.ts      # Seed 10k dummy products
│   └── initDb.ts            # Create tables & indexes
└── types/
    └── opossum.d.ts
```

## Quick Start

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Docker containers** (MySQL + Redis):
   ```bash
   docker-compose up -d
   ```

3. **Initialize database**:
   ```bash
   npm run db:init
   ```

4. **Seed sample data**:
   ```bash
   npm run seed
   ```

5. **Start dev server**:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Environment Variables

**Local (.env)**:
```dotenv
PORT=5000
MYSQL_HOST=localhost
MYSQL_PORT=3307
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DB=farmlokal
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL=redis://localhost:6379
```

**Production (Render env vars)**:
```
PORT=10000
MYSQL_PUBLIC_URL=mysql://root:PASSWORD@host:port/database
REDIS_URL=redis://default:PASSWORD@host:port
CORS_ORIGIN=https://farmlokal.netlify.app
```

## API Endpoints

### Health & Monitoring
- `GET /` - Server health check
- `GET /health` - Detailed health (MySQL + Redis status)
- `GET /metrics` - Redis metrics
- `GET /db-check` - Database connection details (debug endpoint)

### Products
- `GET /products?cursor=0&limit=20&category=milk&search=milk&sort=price`
  - Cursor-based pagination
  - Full-text search on name & description
  - Category filtering (milk, vegetables, fruits, grocery)
  - Sort by: id, price, createdAt, name
  - Rate limited: 100 req/min per user

### OAuth
- `GET /oauth/token` - Generate OAuth token (for testing)

### External & Webhooks
- See routes files for webhook/external API endpoints

## Database Schema

### Products Table
```sql
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  price DECIMAL(10,2),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE FULLTEXT INDEX ft_products_name_desc ON products (name, description);
```

## Deployment (Render)

1. **Connect GitHub repo** to Render
2. **Set environment variables** on Render dashboard
3. **Deploy**:
   - Build: `npm install && npm run build`
   - Start: `npm run start`
4. **Verify**:
   - Test `/health` endpoint
   - Check logs for errors

### Build & Start Commands
```bash
npm install && npm run build
node dist/app.js
```

## Key Features

 **Cursor-based pagination** - Efficient for large datasets  
 **Full-text search** - Fast product search  
 **Redis caching** - Cache product responses (60s TTL)  
 **Rate limiting** - Prevent abuse (100 req/min)  
 **Trust proxy** - Accurate IP detection behind reverse proxies  
 **CORS enabled** - Production-ready cross-origin support  
 **Health checks** - Monitor MySQL & Redis connections  
 **Flexible DB config** - Support for env vars and connection URLs  

## Scripts

```bash
npm run dev      # Dev server with auto-reload
npm run build    # Compile TypeScript
npm run start    # Run production build
npm run db:init  # Create tables & indexes
npm run seed     # Insert 10,000 test products
```

## Error Handling

- **500 errors**: Check backend logs (`Render → service → logs`)
- **CORS errors**: Verify `CORS_ORIGIN` env var matches frontend URL
- **Database errors**: Run `npm run db:check` and check MySQL connectivity
- **Rate limit**: Wait 1 minute or adjust `max` in `rateLimiter.ts`

## Notes

- **MySQL connection**: Automatically uses `MYSQL_PUBLIC_URL` if available, falls back to individual env vars
- **Redis**: Optional for health checks (server continues if Redis unavailable)
- **FULLTEXT search**: Requires spaces in search term (e.g., "organic milk" works, "organicmilk" won't)

## Support

For issues:
1. Check `/health` endpoint for MySQL/Redis status
2. Review Render deploy logs
3. Ensure Railway MySQL is accessible from Render
4. Verify CORS_ORIGIN matches your frontend URL exactly

---

