#!/bin/bash

# Script to update the reCAPTCHA Enterprise site key in both gopass and Google Cloud Secrets

set -e

echo "🔧 Fixing reCAPTCHA Enterprise Site Key"
echo "========================================"

CORRECT_KEY="6LeRvaorAAAAAKFB3hEtz28ofFmKTkbwu5-OE8XP"
PROJECT_ID="kbe-website"

echo ""
echo "📝 Correct reCAPTCHA Enterprise Site Key:"
echo "   $CORRECT_KEY"
echo ""

# Update in gopass
echo "1️⃣  Updating in gopass..."
echo ""

# Check if gopass is available
if command -v gopass &> /dev/null; then
    echo "   Updating appcheck/site-key..."
    echo "$CORRECT_KEY" | gopass insert -f kbe-website/appcheck/site-key
    
    echo "   Updating appcheck/site-key-dev..."
    echo "$CORRECT_KEY" | gopass insert -f kbe-website/appcheck/site-key-dev
    
    echo "   Updating appcheck/site-key-preview..."
    echo "$CORRECT_KEY" | gopass insert -f kbe-website/appcheck/site-key-preview
    
    echo "   ✅ gopass updated successfully"
else
    echo "   ⚠️  gopass not found. Please update manually:"
    echo "      gopass insert kbe-website/appcheck/site-key"
    echo "      gopass insert kbe-website/appcheck/site-key-dev"
    echo "      gopass insert kbe-website/appcheck/site-key-preview"
fi

echo ""
echo "2️⃣  Updating in Google Cloud Secret Manager..."
echo ""

# Check if gcloud is available
if command -v gcloud &> /dev/null || [ -f ~/google-cloud-sdk/bin/gcloud ]; then
    GCLOUD_CMD="gcloud"
    if [ -f ~/google-cloud-sdk/bin/gcloud ]; then
        GCLOUD_CMD="~/google-cloud-sdk/bin/gcloud"
    fi
    
    echo "   Creating new secret version for NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY..."
    echo -n "$CORRECT_KEY" | $GCLOUD_CMD secrets versions add NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY \
        --data-file=- \
        --project="$PROJECT_ID"
    
    echo "   ✅ Google Cloud Secret Manager updated successfully"
else
    echo "   ⚠️  gcloud CLI not found. Please update manually in Google Cloud Console:"
    echo "      https://console.cloud.google.com/security/secret-manager/secret/NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY/versions?project=$PROJECT_ID"
fi

echo ""
echo "3️⃣  Updating local .env.local..."
echo ""

if [ -f .env.local ]; then
    # Backup current file
    cp .env.local .env.local.bak
    
    # Update the key
    if grep -q "NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY=" .env.local; then
        sed -i "s/NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY=.*/NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY=$CORRECT_KEY/" .env.local
        echo "   ✅ .env.local updated successfully (backup saved as .env.local.bak)"
    else
        echo "   ⚠️  NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY not found in .env.local"
        echo "   Adding it now..."
        echo "" >> .env.local
        echo "# App Check (reCAPTCHA Enterprise)" >> .env.local
        echo "NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY=$CORRECT_KEY" >> .env.local
        echo "   ✅ Added to .env.local"
    fi
else
    echo "   ⚠️  .env.local not found"
fi

echo ""
echo "4️⃣  Verification Steps:"
echo ""
echo "   To verify the updates:"
echo "   - gopass: gopass show kbe-website/appcheck/site-key"
echo "   - GCP: $GCLOUD_CMD secrets versions access latest --secret=NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY --project=$PROJECT_ID"
echo "   - Local: grep NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY .env.local"

echo ""
echo "5️⃣  Next Steps:"
echo ""
echo "   1. Restart your development server: npm run dev"
echo "   2. Deploy to trigger production update: git push origin main"
echo "   3. Verify in Firebase Console that the key matches:"
echo "      https://console.firebase.google.com/project/$PROJECT_ID/appcheck"

echo ""
echo "✨ Done! The correct reCAPTCHA Enterprise site key has been set."
echo ""
echo "📝 Note: The incorrect key was: 6LdGsaorAAAAAEeIyXtRrHG-9nxqBpZvDqSPFpuA"
echo "   The correct key is: $CORRECT_KEY"