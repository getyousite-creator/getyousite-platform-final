# Seedream Integration Runbook

## Truth First
- Official Seedream API usage requires an API key (`ARK_API_KEY`) from BytePlus ModelArk.
- "No-login" website usage does not equal "no-auth API" for backend integration.
- In this project, Seedream is integrated as an optional image provider with safe fallback logic.

## Provider Selection
- `IMAGE_PROVIDER=seedream`: force Seedream only.
- `IMAGE_PROVIDER=openai`: force DALL-E only.
- `IMAGE_PROVIDER=auto`: prefer Seedream if configured, otherwise OpenAI.

## Required Environment Variables
- `ARK_API_KEY`: BytePlus ModelArk API key.
- `SEEDREAM_BASE_URL`: default `https://ark.ap-southeast.bytepluses.com/api/v3`.
- `SEEDREAM_MODEL_ID`: default `seedream-3-0-t2i-250415`.
- `SEEDREAM_IMAGE_SIZE`: default `1024x1024`.

## Fallback Behavior
1. Try Seedream (if configured and allowed by mode).
2. Fallback to OpenAI image generation.
3. If both unavailable, existing Unsplash fallback remains active in generation flow.

## Validation
- Build check: `npm run build:vercel`
- Route check: `npm run audit:routes`
- SEO check: `npm run audit:seo`
- Link check: `npm run audit:links`
- UI check: `npm run audit:ui`
- Visual E2E: `npm run e2e:prod`

