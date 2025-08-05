#!/bin/bash

echo "🔍 Fixing Project Owner Verification Issue"
echo "========================================="
echo ""

echo "The OAuth consent screen shows 'no reachable owners/editors' even though"
echo "jeffreyverlynjohnson@gmail.com is listed as Owner."
echo ""

echo "POSSIBLE CAUSES & FIXES:"
echo "----------------------"
echo ""

echo "1. EMAIL VERIFICATION ISSUE"
echo "   - Is jeffreyverlynjohnson@gmail.com verified?"
echo "   - Can you receive emails at this address?"
echo "   - Check spam folder for Google verification emails"
echo ""

echo "2. ADD SECONDARY OWNER"
echo "   Go to: https://console.cloud.google.com/iam-admin/iam?project=kbe-website"
echo "   - Add another email you control as Owner"
echo "   - This can help bypass the verification issue"
echo ""

echo "3. CHECK OAUTH APP CONFIGURATION"
echo "   Go to: https://console.cloud.google.com/apis/credentials/consent?project=kbe-website"
echo "   - Click 'EDIT APP'"
echo "   - Under 'User support email', select jeffreyverlynjohnson@gmail.com"
echo "   - Under 'Developer contact information', add jeffreyverlynjohnson@gmail.com"
echo "   - Save changes"
echo ""

echo "4. VERIFY BILLING ACCOUNT"
echo "   The OAuth screen shows billing is verified ✓"
echo "   But double-check: https://console.cloud.google.com/billing?project=kbe-website"
echo ""

echo "5. CHECK AUTHORIZED DOMAINS"
echo "   You're missing this domain in Firebase Auth settings:"
echo "   - kbe-website--kbe-website.us-central1.hosted.app"
echo "   "
echo "   Add it here: https://console.firebase.google.com/project/kbe-website/authentication/settings"
echo ""

echo "6. TEMPORARY WORKAROUND - TEST MODE"
echo "   If nothing else works:"
echo "   1. Change OAuth consent to 'Testing' mode"
echo "   2. Add jeffreyverlynjohnson@gmail.com as test user"
echo "   3. This limits to 100 users but unblocks auth"
echo ""

echo "CHECKING CURRENT AUTH STATUS..."
echo "------------------------------"
# Test if the API is responding at all
echo "Testing Identity Toolkit API:"
curl -s -X POST "https://identitytoolkit.googleapis.com/v1/projects/kbe-website/config?key=AIzaSyBhTEs3Uxq_KBLBzbzIL2VB4Ao_DBw9faM" | head -20

echo ""
echo "If you see 'Permission denied' above, the owner verification is the issue."
echo "If you see project config, then auth should be working."