# API Documentation - GigFlow

## Base URL
`http://localhost:5000/api`

## Authentication
All protected routes require a JWT token in the `Authorization` header as a Bearer token:
`Authorization: Bearer <your_token>`

---

### Auth Endpoints

#### POST /auth/register
Register a new user.
- **Body**: `{ name, email, password, role? }` (role defaults to 'sales')
- **Response**: `201 Created` with token and user data.

#### POST /auth/login
Login existing user.
- **Body**: `{ email, password }`
- **Response**: `200 OK` with token and user data.

#### GET /auth/me
Get current logged-in user.
- **Auth Required**: Yes
- **Response**: `200 OK` with user data.

---

### Leads Endpoints

#### GET /leads
Get all leads with filtering, search, and pagination.
- **Auth Required**: Yes
- **Query Params**:
  - `status`: New | Contacted | Qualified | Lost
  - `source`: Website | Instagram | Referral
  - `search`: String (searches name and email)
  - `sortBy`: latest | oldest
  - `page`: Number (default 1)
  - `limit`: Number (default 10)
- **Response**: `200 OK` with leads array and pagination metadata.

#### POST /leads
Create a new lead.
- **Auth Required**: Yes
- **Body**: `{ name, email, status?, source }`
- **Response**: `201 Created` with new lead data.

#### GET /leads/:id
Get single lead details.
- **Auth Required**: Yes
- **Response**: `200 OK` with lead data.

#### PUT /leads/:id
Update an existing lead.
- **Auth Required**: Yes
- **Body**: `{ name?, email?, status?, source? }`
- **Response**: `200 OK` with updated lead data.

#### DELETE /leads/:id
Delete a lead.
- **Auth Required**: Yes (Admin only)
- **Response**: `200 OK` message.

#### GET /leads/export
Export leads to CSV.
- **Auth Required**: Yes
- **Query Params**: Same as GET /leads
- **Response**: `200 OK` with CSV file download.
