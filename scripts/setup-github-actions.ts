/**
 * GitHub Actions Setup Script
 * 
 * This script helps configure GitHub Actions for the GetYouSite platform.
 * Run with: npx tsx scripts/setup-github-actions.ts
 */

import * as dotenv from 'dotenv';

dotenv.config();

// GitHub Token from user
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

const REPO_OWNER = 'your-username'; // Change this
const REPO_NAME = 'getyousite-platform';

interface Secret {
    name: string;
    value: string;
    description: string;
}

const REQUIRED_SECRETS: Secret[] = [
    {
        name: 'NEXT_PUBLIC_SUPABASE_URL',
        value: '',
        description: 'Supabase Project URL'
    },
    {
        name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        value: '',
        description: 'Supabase Anonymous Key'
    },
    {
        name: 'SUPABASE_SERVICE_ROLE_KEY',
        value: '',
        description: 'Supabase Service Role Key'
    },
    {
        name: 'DATABASE_URL',
        value: '',
        description: 'PostgreSQL Database URL'
    },
    {
        name: 'DIRECT_URL',
        value: '',
        description: 'PostgreSQL Direct URL (for Prisma)'
    },
    {
        name: 'OPENAI_API_KEY',
        value: '',
        description: 'OpenAI API Key for AI generation'
    },
    {
        name: 'PAYPAL_CLIENT_ID',
        value: '',
        description: 'PayPal Client ID'
    },
    {
        name: 'PAYPAL_CLIENT_SECRET',
        value: '',
        description: 'PayPal Client Secret'
    },
    {
        name: 'NEXT_PUBLIC_PAYPAL_CLIENT_ID',
        value: '',
        description: 'Public PayPal Client ID'
    },
    {
        name: 'VERCEL_TOKEN',
        value: '',
        description: 'Vercel Deployment Token'
    },
    {
        name: 'AWS_ACCESS_KEY_ID',
        value: '',
        description: 'AWS Access Key for Backups'
    },
    {
        name: 'AWS_SECRET_ACCESS_KEY',
        value: '',
        description: 'AWS Secret Key for Backups'
    },
    {
        name: 'AWS_S3_BUCKET',
        value: '',
        description: 'S3 Bucket for Backups'
    },
    {
        name: 'SLACK_WEBHOOK_URL',
        value: '',
        description: 'Slack Webhook URL for Notifications'
    },
    {
        name: 'LHCI_GITHUB_APP_TOKEN',
        value: '',
        description: 'Lighthouse CI GitHub App Token'
    },
];

async function setupGitHubActions() {
    console.log('🚀 Setting up GitHub Actions for GetYouSite...\n');

    try {
        // Check if GitHub CLI is available
        if (!GITHUB_TOKEN) {
            console.log('⚠️  GitHub Token not found in environment.\n');
        } else {
            console.log('✅ GitHub Token configured\n');
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📋 Required GitHub Secrets');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        console.log('Please add the following secrets to your GitHub repository:');
        console.log('   1. Go to: https://github.com/' + REPO_OWNER + '/' + REPO_NAME + '/settings/secrets/actions\n');
        console.log('   2. Add the following secrets:\n');

        REQUIRED_SECRETS.forEach((secret, index) => {
            console.log(`   ${index + 1}. ${secret.name}`);
            console.log(`      Description: ${secret.description}\n`);
        });

        // Environment file template
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📄 Environment File Template (.env.local)');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        console.log('Copy this to your .env.local file:\n');

        console.log('# Database');
        console.log('DATABASE_URL=postgresql://user:password@host:5432/getyousite');
        console.log('DIRECT_URL=postgresql://user:password@host:5432/getyousite\n');

        console.log('# Supabase');
        console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
        console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
        console.log('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key\n');

        console.log('# OpenAI');
        console.log('OPENAI_API_KEY=sk-your-openai-key\n');

        console.log('# PayPal');
        console.log('PAYPAL_CLIENT_ID=your-paypal-client-id');
        console.log('PAYPAL_CLIENT_SECRET=your-paypal-client-secret');
        console.log('NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-public-client-id\n');

        console.log('# Vercel');
        console.log('VERCEL_TOKEN=your-vercel-token\n');

        // GitHub CLI commands
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔧 GitHub CLI Commands');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        console.log('If you have GitHub CLI installed, run:\n');

        console.log('# Set secrets');
        console.log(`gh secret set NEXT_PUBLIC_SUPABASE_URL --body "your-url"`);
        console.log(`gh secret set NEXT_PUBLIC_SUPABASE_ANON_KEY --body "your-key"`);
        console.log(`gh secret set SUPABASE_SERVICE_ROLE_KEY --body "your-key"`);
        console.log(`gh secret set DATABASE_URL --body "your-db-url"`);
        console.log(`gh secret set OPENAI_API_KEY --body "your-api-key"`);
        console.log(`gh secret set PAYPAL_CLIENT_ID --body "your-client-id"`);
        console.log(`gh secret set PAYPAL_CLIENT_SECRET --body "your-secret"`);
        console.log(`gh secret set NEXT_PUBLIC_PAYPAL_CLIENT_ID --body "your-public-id"`);
        console.log(`gh secret set VERCEL_TOKEN --body "your-token"\n`);

        console.log('# Enable GitHub Actions');
        console.log(`gh api repos/${REPO_OWNER}/${REPO_NAME}/actions/permissions -X PUT -f enabled=true\n`);

        // CI/CD Pipeline Steps
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 CI/CD Pipeline Steps');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        console.log('The GitHub Actions pipeline includes:\n');

        console.log('1. 📝 Lint & Type Check');
        console.log('   - ESLint');
        console.log('   - TypeScript Compiler');
        console.log('   - Prettier\n');

        console.log('2. 🧪 Unit Tests');
        console.log('   - Vitest');
        console.log('   - Coverage Report\n');

        console.log('3. 🔒 Security Audit');
        console.log('   - npm Audit');
        console.log('   - TruffleHog (Secrets Detection)\n');

        console.log('4. 🏗️  Build');
        console.log('   - Next.js Build');
        console.log('   - Prisma Generate\n');

        console.log('5. 🗄️  Database Migration');
        console.log('   - Prisma Migrate');
        console.log('   - Schema Push\n');

        console.log('6. 🚀 Deploy to Vercel');
        console.log('   - Preview Deployment');
        console.log('   - Production Deployment\n');

        console.log('7. ⚡ Performance Testing');
        console.log('   - Lighthouse CI\n');

        console.log('8. 💾 Backup');
        console.log('   - Database Backup to S3\n');

        // Verification steps
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ Verification Steps After Setup');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        console.log('1. Push changes to main branch');
        console.log('2. Check Actions tab for CI/CD pipeline');
        console.log('3. Verify build passes');
        console.log('4. Check Vercel deployment');
        console.log('5. Test the application\n');

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('🎉 Setup complete! Follow the instructions above.\n');

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// Export for use in other scripts
export { REQUIRED_SECRETS, setupGitHubActions };

// Run if executed directly
if (require.main === module) {
    setupGitHubActions().catch(console.error);
}
