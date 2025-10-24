# Generate secure secrets
NEXTAUTH_SECRET=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)

# Update the file with generated secrets
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/NEXTAUTH_SECRET=GENERATE/NEXTAUTH_SECRET=$NEXTAUTH_SECRET/" secrets.txt
    sed -i '' "s/JWT_SECRET=GENERATE/JWT_SECRET=$JWT_SECRET/" secrets.txt
else
    # Linux
    sed -i "s/NEXTAUTH_SECRET=GENERATE/NEXTAUTH_SECRET=$NEXTAUTH_SECRET/" secrets.txt
    sed -i "s/JWT_SECRET=GENERATE/JWT_SECRET=$JWT_SECRET/" secrets.txt
fi

echo "✅ Generated secure secrets for NEXTAUTH_SECRET and JWT_SECRET"
