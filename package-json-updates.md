# Manual Update Required for package.json

Add the following "engines" field after "version":

```json
  "engines": {
    "node": ">=22.0.0",
    "npm": ">=11.0.0"
  },
```

This ensures consistent runtime versions across environments.
