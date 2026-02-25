import { redirect } from 'next/navigation';

export default function RootPage() {
    // Sovereign Guard: Force redirect to default locale if middleware fails to intercept
    redirect('/ar');
}
