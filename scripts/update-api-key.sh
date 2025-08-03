#!/bin/bash

echo "🔧 Updating API Keys in .env.local"
echo "=================================="

# Check if .env.local exists
if [[ ! -f .env.local ]]; then
	echo "❌ .env.local not found!"
	exit 1
fi

# Backup current .env.local
cp .env.local .env.local.backup
echo "✅ Backed up .env.local to .env.local.backup"

# Ask for the new Firebase API Key
echo -e "\n📝 Enter your new Firebase API Key:"
echo "   (This is the key you just created with Identity Toolkit API access)"
read -r NEW_FIREBASE_KEY

# Update the Firebase API key in .env.local
if grep -q "NEXT_PUBLIC_FIREBASE_API_KEY=" .env.local; then
	# On macOS, sed requires an empty string after -i
	sed -i '' "s/NEXT_PUBLIC_FIREBASE_API_KEY=.*/NEXT_PUBLIC_FIREBASE_API_KEY=${NEW_FIREBASE_KEY}/" .env.local
	echo "✅ Updated NEXT_PUBLIC_FIREBASE_API_KEY"
else
	echo "NEXT_PUBLIC_FIREBASE_API_KEY=${NEW_FIREBASE_KEY}" >>.env.local
	echo "✅ Added NEXT_PUBLIC_FIREBASE_API_KEY"
fi

# Ensure the GenKit key remains unchanged
echo -e "\n✅ Keeping GOOGLE_GENAI_API_KEY unchanged for GenKit"

# Display the updated keys
echo -e "\n📋 Current API Key Configuration:"
echo "=================================="
if grep "FIREBASE_API_KEY\|GENAI_API_KEY" .env.local >/dev/null; then
	grep "FIREBASE_API_KEY\|GENAI_API_KEY" .env.local | sed 's/=.*$/=<hidden>/' || true
else
	echo "No API keys found in .env.local"
fi

echo -e "\n🚀 Next Steps:"
echo "1. Restart your dev server: npm run dev"
echo "2. Test magic links: npm run debug:magic-link"
echo "3. If it works, update the secrets in Google Cloud Secret Manager"

echo -e "\n💡 Remember to update these secrets in production:"
echo "   firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_API_KEY"
