#!/bin/bash
set -e

echo "🔐 Migrating environment variables to Vercel..."
echo "📋 Project: kbe-website"
echo "🏢 Org: jeffrey-johnsons-projects-4efd9acb"
echo ""

# Helper function to add environment variable
add_env_var() {
    local name=$1
    local value=$2
    local env=${3:-"production"}
    
    echo "Adding $name to $env environment..."
    echo "$value" | vercel env add "$name" "$env" --force > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ $name"
    else
        echo "❌ Failed to add $name"
        return 1
    fi
}

# Firebase Core Configuration
echo "🔥 Adding Firebase Core Configuration..."

# Get current values from Google Secret Manager (fallback to placeholders)
echo "📡 Fetching secrets from Google Cloud Secret Manager..."

# Try to get Firebase secrets - if not available, will need manual input
FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY:-"$(gcloud secrets versions access latest --secret=NEXT_PUBLIC_FIREBASE_API_KEY --project=kbe-website 2>/dev/null || echo 'PLACEHOLDER_API_KEY')"}
FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:-"$(gcloud secrets versions access latest --secret=NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET --project=kbe-website 2>/dev/null || echo 'kbe-website.firebasestorage.app')"}
FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:-"$(gcloud secrets versions access latest --secret=NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID --project=kbe-website 2>/dev/null || echo 'PLACEHOLDER_SENDER_ID')"}
FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID:-"$(gcloud secrets versions access latest --secret=NEXT_PUBLIC_FIREBASE_APP_ID --project=kbe-website 2>/dev/null || echo 'PLACEHOLDER_APP_ID')"}

# Auth secrets
NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-"$(gcloud secrets versions access latest --secret=NEXTAUTH_SECRET --project=kbe-website 2>/dev/null || echo 'PLACEHOLDER_NEXTAUTH_SECRET')"}
JWT_SECRET=${JWT_SECRET:-"$(gcloud secrets versions access latest --secret=JWT_SECRET --project=kbe-website 2>/dev/null || echo 'PLACEHOLDER_JWT_SECRET')"}

# SendGrid secrets
SENDGRID_API_KEY=${SENDGRID_API_KEY:-"$(gcloud secrets versions access latest --secret=SENDGRID_API_KEY --project=kbe-website 2>/dev/null || echo 'PLACEHOLDER_SENDGRID_KEY')"}
SENDGRID_TEMPLATE_MAGIC_LINK=${SENDGRID_TEMPLATE_MAGIC_LINK:-"$(gcloud secrets versions access latest --secret=SENDGRID_TEMPLATE_MAGIC_LINK --project=kbe-website 2>/dev/null || echo 'PLACEHOLDER_TEMPLATE_ID')"}
SENDGRID_TEMPLATE_WELCOME=${SENDGRID_TEMPLATE_WELCOME:-"$(gcloud secrets versions access latest --secret=SENDGRID_TEMPLATE_WELCOME --project=kbe-website 2>/dev/null || echo 'PLACEHOLDER_TEMPLATE_ID')"}
SENDGRID_TEMPLATE_PASSWORD_RESET=${SENDGRID_TEMPLATE_PASSWORD_RESET:-"$(gcloud secrets versions access latest --secret=SENDGRID_TEMPLATE_PASSWORD_RESET --project=kbe-website 2>/dev/null || echo 'PLACEHOLDER_TEMPLATE_ID')"}
SENDGRID_TEMPLATE_ANNOUNCEMENT=${SENDGRID_TEMPLATE_ANNOUNCEMENT:-"$(gcloud secrets versions access latest --secret=SENDGRID_TEMPLATE_ANNOUNCEMENT --project=kbe-website 2>/dev/null || echo 'PLACEHOLDER_TEMPLATE_ID')"}
SENDGRID_TEMPLATE_REGISTRATION_CONFIRMATION=${SENDGRID_TEMPLATE_REGISTRATION_CONFIRMATION:-"$(gcloud secrets versions access latest --secret=SENDGRID_TEMPLATE_REGISTRATION_CONFIRMATION --project=kbe-website 2>/dev/null || echo 'PLACEHOLDER_TEMPLATE_ID')"}

# Add Firebase Core Variables
add_env_var "NEXT_PUBLIC_FIREBASE_API_KEY" "$FIREBASE_API_KEY"
add_env_var "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" "kbe-website.firebaseapp.com"
add_env_var "NEXT_PUBLIC_FIREBASE_PROJECT_ID" "kbe-website"
add_env_var "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" "$FIREBASE_STORAGE_BUCKET"
add_env_var "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" "$FIREBASE_MESSAGING_SENDER_ID"
add_env_var "NEXT_PUBLIC_FIREBASE_APP_ID" "$FIREBASE_APP_ID"

echo ""
echo "🔐 Adding Security Configuration..."
add_env_var "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET"
add_env_var "JWT_SECRET" "$JWT_SECRET"

echo ""
echo "🌍 Adding App Configuration..."
add_env_var "NEXT_PUBLIC_APP_URL" "https://homerenrichment.com"
add_env_var "NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY" "6LeRvaorAAAAAKFB3hEtz28ofFmKTkbwu5-OE8XP"
add_env_var "NODE_ENV" "production"

echo ""
echo "📧 Adding SendGrid Configuration..."
add_env_var "SENDGRID_API_KEY" "$SENDGRID_API_KEY"
add_env_var "SENDGRID_TEMPLATE_MAGIC_LINK" "$SENDGRID_TEMPLATE_MAGIC_LINK"
add_env_var "SENDGRID_TEMPLATE_WELCOME" "$SENDGRID_TEMPLATE_WELCOME"
add_env_var "SENDGRID_TEMPLATE_PASSWORD_RESET" "$SENDGRID_TEMPLATE_PASSWORD_RESET"
add_env_var "SENDGRID_TEMPLATE_ANNOUNCEMENT" "$SENDGRID_TEMPLATE_ANNOUNCEMENT"
add_env_var "SENDGRID_TEMPLATE_REGISTRATION_CONFIRMATION" "$SENDGRID_TEMPLATE_REGISTRATION_CONFIRMATION"

echo ""
echo "✅ Environment variables migration complete!"
echo "🔍 Verifying variables..."
vercel env ls