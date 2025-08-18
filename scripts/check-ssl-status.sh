#!/bin/bash

echo "🔒 SSL/TLS Diagnostic for homerenrichment.com"
echo "========================================="
echo ""

echo "1. DNS Resolution:"
echo "-----------------"
echo "Current A record:"
dig homerenrichment.com A +short
echo ""

echo "2. SSL Certificate Status:"
echo "-------------------------"
echo | openssl s_client -servername homerenrichment.com -connect homerenrichment.com:443 2>/dev/null | openssl x509 -noout -text 2>/dev/null | grep -E "(Subject:|Issuer:|Not Before:|Not After:)" | head -6
echo ""

echo "3. HTTPS Response:"
echo "-----------------"
curl -I -s https://homerenrichment.com | head -5
echo ""

echo "4. Certificate Chain:"
echo "--------------------"
echo | openssl s_client -servername homerenrichment.com -connect homerenrichment.com:443 -showcerts 2>/dev/null | grep -E "(s:|i:)" | head -6
echo ""

echo "5. Browser Troubleshooting:"
echo "--------------------------"
echo "If you see 'Not Secure' in your browser, try:"
echo "- Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)"
echo "- Clear browser cache and cookies for homerenrichment.com"
echo "- Open in incognito/private window"
echo "- Check browser console for mixed content warnings"
echo ""

echo "6. Test Direct App Hosting URL:"
echo "-------------------------------"
echo "If homerenrichment.com shows issues, test the direct URL:"
echo "https://kbe-website--kbe-website.us-central1.hosted.app"
echo ""
echo "This should always have valid SSL."