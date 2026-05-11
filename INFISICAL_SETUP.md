# Infisical Integration Guide

## Status
- ✅ Infisical CLI installed (v0.43.84)
- ✅ .infisical.json configured
- ✅ package.json scripts updated to use `infisical run`
- ✅ Stripe client updated to validate STRIPE_SECRET_KEY
- ⏳ Pending: User authentication via browser

## Setup Checklist

### 1. Authenticate with Infisical
```bash
cd /Users/diego/hitl/projects/tiatendeai/dev/x1-mercado-contingencia/saas
infisical login
# Browser opens → sign in with Ruptur Cloud account
# Returns to terminal when done
```

### 2. Test Infisical Integration
```bash
# Test if secrets load correctly
infisical run --env=dev -- node scripts/infisical-test.mjs

# Expected output:
# ✅ STRIPE_SECRET_KEY
# ✅ STRIPE_PUBLISHABLE_KEY (when added to Infisical)
# ✅ STRIPE_WEBHOOK_SECRET (when added to Infisical)
```

### 3. Verify Development Server
```bash
# Run with secrets from Infisical dev environment
npm run saas:dev

# Should start with env vars injected from Infisical
# PORT_API=3001
# STRIPE_SECRET_KEY=sk_test_... (from Infisical)
# SUPABASE_URL=... (from Infisical)
# etc.
```

## Secrets to Add in Infisical Web UI

**Environment: Development (dev)**
- [x] STRIPE_SECRET_KEY (sk_test_...)
- [ ] STRIPE_PUBLISHABLE_KEY (pk_test_...)
- [ ] STRIPE_WEBHOOK_SECRET (whsec_...)

**Environment: Production (prod)**
- [ ] STRIPE_SECRET_KEY (sk_live_..., should use restricted key)
- [ ] STRIPE_PUBLISHABLE_KEY (pk_live_...)
- [ ] STRIPE_WEBHOOK_SECRET (whsec_...)

## Scripts Updated

```json
{
  "start": "infisical run --env=dev -- node modules/warmup-core/server.mjs",
  "saas:dev": "infisical run --env=dev -- sh -c 'PORT_API=3001 node api/gateway.mjs'",
  "saas": "infisical run --env=prod -- node api/gateway.mjs"
}
```

## Files Changed
- `.infisical.json` - Project configuration (workspace ID, default env)
- `.gitignore` - Added .env.*, .infisical-secrets.json
- `package.json` - Wrapped scripts with `infisical run`
- `integrations/stripe/client.js` - Added validation for STRIPE_SECRET_KEY
- `scripts/infisical-test.mjs` - Test script to verify secrets are loaded

## Machine Identity Setup (Optional, for CI/CD)

When ready for automated deployments, create a Machine Identity:
1. Go to Infisical web → Access Control → Identities
2. Create new Identity (Universal Auth)
3. Generate Client ID + Client Secret
4. Store in CI/CD provider as INFISICAL_CLIENT_ID and INFISICAL_CLIENT_SECRET
5. Use in pipeline:
```bash
export INFISICAL_TOKEN=$(infisical login \
  --method=universal-auth \
  --client-id=$INFISICAL_CLIENT_ID \
  --client-secret=$INFISICAL_CLIENT_SECRET \
  --plain --silent)
infisical run --env=prod -- npm start
```

## Next Steps

1. **Run `infisical login`** in terminal
2. **Add remaining Stripe keys** in Infisical web UI:
   - STRIPE_PUBLISHABLE_KEY (pk_test_...)
   - STRIPE_WEBHOOK_SECRET (whsec_...)
3. **Test with `npm run saas:dev`**
4. **Add to other environments** (staging, prod) as needed

## References

- [Infisical CLI Docs](https://infisical.com/docs/cli/overview)
- [Infisical Environments](https://infisical.com/docs/projects/environments)
- [Machine Identity](https://infisical.com/docs/identity-and-access-control/machine-identities)
