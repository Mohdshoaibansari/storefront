# Gemini Project Instructions: Medusa V2 Next.js Storefront

This project is a high-performance, localized e-commerce storefront built with Next.js 15, integrated with Medusa V2.

## Project Overview
- **Purpose:** Next.js Starter to be used with Medusa V2.
- **Main Technologies:**
    - **Framework:** Next.js 15 (App Router)
    - **Language:** TypeScript
    - **Styling:** Tailwind CSS, Radix UI, Headless UI
    - **Backend Integration:** @medusajs/js-sdk (V2)
    - **State Management:** React Context (Modal Context)
    - **Icons:** @medusajs/icons

## Building and Running

### Prerequisites
- Node.js (version 18+ recommended)
- Medusa Backend (V2) running

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Starts the development server on `http://localhost:8000`.

### Production
```bash
npm run build
npm start
```
Builds the project for production and starts it on `http://localhost:8000`.

### Linting
```bash
npm run lint
```

## Workflow & Deployment
This project follows a Local-First development cycle with GitHub as the central synchronization point:

1.  **Local Development:** All features and fixes are developed and tested locally.
2.  **Version Control (GitHub):** Changes are pushed to the GitHub repository.
3.  **EC2 Deployment:** The live environment on the EC2 instance is updated by pulling the latest changes from GitHub (`git pull`).

---

## Key Directories
- `src/app/`: Contains the Next.js App Router routes. Note the `[countryCode]` dynamic segment for localization.
- `src/lib/`: Core utilities, SDK configuration (`config.ts`), and data fetching logic (`data/`).
- `src/modules/`: Component-based architecture. Logic and UI for specific domains (account, cart, checkout, products, etc.).
- `src/styles/`: Global CSS and Tailwind configurations.
- `src/types/`: Global TypeScript type definitions.

## Development Conventions
- **Localization:** The storefront uses localized routing based on the `[countryCode]` segment. Middleware (`src/middleware.ts`) handles region detection via cookies, headers (Vercel/Cloudflare), or defaults.
- **Modules Pattern:** UI components are organized into modules (e.g., `src/modules/products`) rather than a flat `components` folder.
- **Import Aliases:**
    - `@lib`: `lib/` (aliased in `tsconfig.json` as `@lib/*`)
    - `@modules`: `modules/` (aliased in `tsconfig.json` as `@modules/*`)
    - `@pages`: `pages/` (aliased in `tsconfig.json` as `@pages/*`)
- **Data Fetching:** Prefer using the Medusa JS SDK (`sdk` from `@lib/config`) for interacting with the backend.

## Environment Variables
Create a `.env` file in the root directory:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | URL of the Medusa server | `http://localhost:9000` |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | **Required** Medusa Publishable API Key | - |
| `NEXT_PUBLIC_BASE_URL` | Base URL of the storefront | `https://localhost:8000` |
| `NEXT_PUBLIC_DEFAULT_REGION` | Default region ISO 2 code | `dk` |

## Testing
- **TODO:** Implement automated tests. The project currently has a basic structure but lacks comprehensive testing.
