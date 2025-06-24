# Spherre DApp

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black)](https://nextjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1.0-green)](https://flask.palletsprojects.com/)
[![StarkNet](https://img.shields.io/badge/StarkNet-6.24.1-orange)](https://starknet.io/)

## 📖 Overview

**Spherre** is a next-generation platform for secure, collaborative, multi-user crypto wallet and treasury management. Built specifically for DAOs, startups, and organizations, it provides a modern way to manage crypto wallets with teams through a sophisticated multisig system.

### Key Features

- 🔐 **Multisig Wallet Management** - Secure collaborative wallet operations
- 👥 **Member Management** - Add, remove, and manage team members with role-based permissions
- 💰 **Treasury Management** - Comprehensive treasury oversight and control
- 📊 **Transaction Monitoring** - Real-time transaction tracking and history
- 🎯 **Smart Will** - Automated inheritance and succession planning
- 🔄 **Staking Integration** - DeFi staking capabilities (coming soon)
- 📱 **Modern UI/UX** - Intuitive interface built with Next.js and Tailwind CSS

## 🏗️ Architecture

### Tech Stack

#### Frontend
- **Framework**: Next.js 15.1.6 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Context API
- **Blockchain Integration**: StarkNet with @starknet-react/core
- **UI Components**: Radix UI, Material-UI, Lucide React icons
- **Charts**: Chart.js with react-chartjs-2
- **Forms**: React Hook Form with Zod validation

#### Backend
- **Framework**: Flask 3.1.0 with Python 3.12
- **Database**: SQLAlchemy with PostgreSQL/SQLite
- **Authentication**: JWT with Flask-JWT-Extended
- **API**: RESTful with Flask-RESTful
- **Blockchain**: StarkNet integration with starknet-py
- **Code Quality**: Ruff for linting and formatting

#### Infrastructure
- **Containerization**: Docker support
- **Database Migrations**: Flask-Migrate
- **CORS**: Cross-origin resource sharing enabled
- **Environment**: Configurable for development, testing, and production

### Project Structure

```
spherre-dapp/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App router pages and components
│   │   ├── dapp/           # Main DApp interface
│   │   │   ├── members/    # Member management
│   │   │   ├── transactions/ # Transaction history
│   │   │   ├── treasury/   # Treasury management
│   │   │   ├── settings/   # User settings
│   │   │   └── ...
│   │   ├── onboarding/     # User onboarding flow
│   │   └── components/     # Shared UI components
│   ├── components/         # Global components
│   ├── context/           # React context providers
│   ├── lib/              # Utility functions
│   └── public/           # Static assets
├── backend/               # Flask backend API
│   ├── spherre/          # Main application package
│   │   ├── app/          # Flask application
│   │   │   ├── models/   # Database models
│   │   │   ├── views/    # API endpoints
│   │   │   ├── service/  # Business logic
│   │   │   └── utils/    # Utility functions
│   │   └── tests/        # Test suite
│   └── requirements.txt  # Python dependencies
└── docker-compose.yml    # Container orchestration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** 8+
- **Python** 3.12+
- **Git**
- **Docker** (optional, for containerized deployment)

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   NEXT_PUBLIC_STARKNET_CHAIN_ID=SN_GOERLI
   NEXT_PUBLIC_RPC_URL=your_starknet_rpc_url
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   ```bash
   export FLASK_CONFIG=development
   export SECRET_KEY=your_secret_key
   export JWT_SECRET_KEY=your_jwt_secret
   export DATABASE_URL=sqlite:///db.sqlite3
   ```

5. **Initialize database**:
   ```bash
   make db_init
   make makemigration command="Initial migration"
   make migrate
   ```

6. **Start the server**:
   ```bash
   make run
   ```

   The API will be available at `http://localhost:5000`

### Docker Setup (Alternative)

1. **Build and run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

## 🧭 Developer Navigation Guide

### Frontend Development

#### Key Directories

- **`frontend/app/dapp/`** - Main DApp interface
  - `page.tsx` - Dashboard overview
  - `members/` - Member management system
  - `transactions/` - Transaction history and details
  - `treasury/` - Treasury management interface
  - `settings/` - User preferences and security

- **`frontend/app/onboarding/`** - User onboarding flow
  - Multi-step setup process
  - Wallet connection and verification
  - Initial configuration

- **`frontend/components/`** - Reusable UI components
  - `ui/` - Base UI components (buttons, inputs, etc.)
  - `modals/` - Modal components for various actions
  - `shared/` - Shared components across pages

#### Key Components

1. **Providers** (`frontend/app/components/Providers.tsx`)
   - StarkNet wallet connection
   - Theme and context providers

2. **Sidebar** (`frontend/app/dapp/Sidebar.tsx`)
   - Main navigation component
   - Collapsible sidebar with hover effects

3. **Navigation** (`frontend/app/dapp/navigation.ts`)
   - Route definitions and page mapping
   - Active route detection

#### Development Workflow

1. **Component Development**:
   ```bash
   # Create new component
   touch frontend/app/components/NewComponent.tsx
   
   # Use TypeScript for type safety
   # Follow existing patterns in similar components
   ```

2. **Page Development**:
   ```bash
   # Create new page
   mkdir frontend/app/dapp/new-feature
   touch frontend/app/dapp/new-feature/page.tsx
   
   # Add to navigation.ts if needed
   ```

3. **Styling**:
   - Use Tailwind CSS classes
   - Follow existing design patterns
   - Use CSS variables for theming

### Backend Development

#### Key Directories

- **`backend/spherre/app/models/`** - Database models
- **`backend/spherre/app/views/`** - API endpoints
- **`backend/spherre/app/service/`** - Business logic
- **`backend/spherre/app/utils/`** - Utility functions

#### API Development

1. **Create new model**:
   ```python
   # backend/spherre/app/models/new_model.py
   from spherre.app.extensions import db
   
   class NewModel(db.Model):
       id = db.Column(db.Integer, primary_key=True)
       # Add fields as needed
   ```

2. **Create new service**:
   ```python
   # backend/spherre/app/service/new_service.py
   class NewService:
       @staticmethod
       def create_new_item(data):
           # Business logic here
           pass
   ```

3. **Create new view**:
   ```python
   # backend/spherre/app/views/new_view.py
   from flask import Blueprint, request
   from spherre.app.service.new_service import NewService
   
   new_bp = Blueprint('new', __name__)
   
   @new_bp.route('/new-endpoint', methods=['POST'])
   def new_endpoint():
       # API logic here
       pass
   ```

#### Database Operations

```bash
# Create new migration
make makemigration command="Add new feature"

# Apply migrations
make migrate

# Reset database (development only)
rm backend/spherre/db.sqlite3
make db_init
make makemigration command="Initial setup"
make migrate
```

### Testing

#### Frontend Testing
```bash
cd frontend
npm run lint          # ESLint
npm run prettier      # Format code
```

#### Backend Testing
```bash
cd backend
make lint            # Ruff linting
make format          # Code formatting
pytest               # Run tests
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_STARKNET_CHAIN_ID=SN_GOERLI
NEXT_PUBLIC_RPC_URL=https://alpha4.starknet.io
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Spherre
```

#### Backend
```env
FLASK_CONFIG=development
SECRET_KEY=your_secret_key_here
JWT_SECRET_KEY=your_jwt_secret_here
DATABASE_URL=sqlite:///db.sqlite3
STARKNET_PRIVATE_KEY=your_starknet_private_key
```

### Database Configuration

- **Development**: SQLite (default)
- **Production**: PostgreSQL
- **Testing**: In-memory SQLite

## 📱 DApp Features & Navigation

### Main Sections

1. **Dashboard** (`/dapp/`)
   - Overview of wallet balance and recent activity
   - Quick actions for common operations
   - Charts and analytics

2. **Members** (`/dapp/members`)
   - Add/remove team members
   - Manage roles and permissions
   - View member activity

3. **Transactions** (`/dapp/transactions`)
   - Complete transaction history
   - Transaction details and status
   - Filtering and search capabilities

4. **Treasury** (`/dapp/treasury`)
   - Asset management
   - Portfolio overview
   - Investment tracking

5. **Settings** (`/dapp/settings`)
   - Profile management
   - Security settings
   - Preferences and notifications

### Coming Soon Features

- **Trade** - DEX integration for token swapping
- **Stake** - DeFi staking capabilities
- **Smart Will** - Automated inheritance planning
- **Payments** - Recurring payment management
- **Apps** - Third-party integrations
- **Support** - Help and documentation

## 🔒 Security Considerations

- JWT-based authentication
- Role-based access control
- Secure wallet connection handling
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 🚀 Deployment

### Production Build

#### Frontend
```bash
cd frontend
npm run build
npm start
```

#### Backend
```bash
cd backend
export FLASK_CONFIG=production
export DATABASE_URL=postgresql://user:pass@host/db
make run
```

### Docker Deployment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- **Frontend**: ESLint + Prettier
- **Backend**: Ruff (PEP 8 compliance)
- **TypeScript**: Strict mode enabled
- **Python**: Type hints encouraged

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the code comments and inline documentation
- **Issues**: Create an issue on GitHub for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

## 🔗 Links

- **Website**: [spherre.xyz](https://spherre.xyz)
- **Documentation**: [docs.spherre.xyz](https://docs.spherre.xyz)
- **StarkNet**: [starknet.io](https://starknet.io)

---

**Built with ❤️ for the StarkNet ecosystem by Spherre Labs**
