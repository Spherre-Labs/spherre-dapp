## Spherre Backend
This is the official backend for the spherre multisig

## Installation

### Prerequisites

- Python 3.8 or higher
- Make

### Steps
1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/spherre-dapp.git
    cd spherre-dapp/backend/
    ```
3. **Create a virtual environment and initialize it**
    ```bash
    virtualenv env
    source env/bin/activate # for linux
    ```
2. **Install dependencies**:
    ```bash
    make build
    ```
3. **Start the Application**:
    ```bash
    make start
    ```
    or 
    ```bash
    chmod +x ./start
    ./start
    ```

## Contributing
1. Fork this repository
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   or 
   ```bash
   git checkout -b fix/issue-number
   ```


3. Make your changes

4. Commit your changes:
    ```bash
   git commit -m "feat: Description of changes"
   ```

### Linting and Formatting
Before submitting your changes, ensure:

1. Code is linted:

   ```bash
   make lint
   ```

2. Code is formatted:

   ```bash
   make format
   ```