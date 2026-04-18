#!/bin/bash
# setup-env.sh - Helper script to set up .env from .env.example
# Usage: ./setup-env.sh

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔐 Omio Studio Security Setup${NC}"
echo "========================================"
echo ""

# Check if .env already exists
if [ -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file already exists${NC}"
    read -p "Overwrite? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipped."
        exit 0
    fi
fi

# Copy template
cp .env.example .env
echo -e "${GREEN}✅ Created .env from .env.example${NC}"
echo ""

# Verify .gitignore
if grep -q "^\.env$" .gitignore; then
    echo -e "${GREEN}✅ Verified: .env is in .gitignore${NC}"
else
    echo -e "${RED}❌ ERROR: .env not in .gitignore${NC}"
    echo "Add this line to .gitignore:"
    echo "  .env"
    exit 1
fi

echo ""
echo "📝 Next steps:"
echo "  1. Edit .env with your credentials"
echo "  2. Run: npm install"
echo "  3. Run: npm start"
echo ""
echo "📌 Credentials needed:"
echo "  • Twilio: https://www.twilio.com/console"
echo "  • Gmail: https://myaccount.google.com/apppasswords"
echo "  • JWT Secret: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
echo ""
echo -e "${GREEN}Ready to go! Edit .env and add your credentials.${NC}"
