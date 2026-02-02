import { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';

export const metadata: Metadata = {
    title: 'Login | GetYouSite',
    description: 'Access your GetYouSite dashboard',
};

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/">
                        <Logo className="inline-block" />
                    </Link>
                </div>

                {/* Login Form */}
                <LoginForm />

                {/* Footer Links */}
                <div className="mt-6 text-center space-y-3">
                    <p className="text-sm text-zinc-500">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-blue-500 hover:text-blue-400 font-semibold">
                            Sign up
                        </Link>
                    </p>
                    <Link
                        href="/"
                        className="block text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}
