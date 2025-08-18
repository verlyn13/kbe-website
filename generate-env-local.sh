#!/bin/bash

echo "Generating .env.local from Google Cloud secrets..."

# List of secrets to fetch
SECRETS=(
	# Firebase Public Configuration
	"NEXT_PUBLIC_FIREBASE_API_KEY"
	"NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
	"NEXT_PUBLIC_FIREBASE_PROJECT_ID"
	"NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
	"NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
	"NEXT_PUBLIC_FIREBASE_APP_ID"
	
	# Firebase Admin (Server-side)
	"FIREBASE_ADMIN_PROJECT_ID"
	"FIREBASE_ADMIN_CLIENT_EMAIL"
	"FIREBASE_ADMIN_PRIVATE_KEY"
	
	# SendGrid Configuration
	"SENDGRID_API_KEY"
	"SENDGRID_TEMPLATE_ANNOUNCEMENT"
	"SENDGRID_TEMPLATE_MAGIC_LINK"
	"SENDGRID_TEMPLATE_PASSWORD_RESET"
	"SENDGRID_TEMPLATE_REGISTRATION_CONFIRMATION"
	"SENDGRID_TEMPLATE_WELCOME"
	
	# App Configuration
	"NEXT_PUBLIC_APP_URL"
	"NODE_ENV"
	
	# Auth Secrets
	"NEXTAUTH_SECRET"
	"JWT_SECRET"
)

# Create .env.local
echo "# Generated from Google Cloud secrets - DO NOT COMMIT" >.env.local
echo "# Generated on $(date)" >>.env.local
echo "" >>.env.local

for SECRET in "${SECRETS[@]}"; do
	VALUE=$(gcloud secrets versions access latest --secret="$SECRET" --project=kbe-website 2>/dev/null)
	if [ $? -eq 0 ] && [ ! -z "$VALUE" ]; then
		echo "$SECRET=$VALUE" >>.env.local
		echo "✓ Added $SECRET"
	else
		echo "⚠️  Skipped $SECRET (not found)"
	fi
done

echo ""
echo "✅ Created .env.local"
echo "Remember to add .env.local to .gitignore!"
