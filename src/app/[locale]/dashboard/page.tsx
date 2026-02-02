
import { StoreService } from '@/lib/services/store-service';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ExternalLink, Edit, Shield, AlertCircle } from 'lucide-react';
import { AuthService } from '@/lib/services/auth-service';

export default async function DashboardPage({ params }: { params: { locale: string } }) {
    // 1. Verify Auth & Get User
    const user = await AuthService.getCurrentUser();
    if (!user.data) {
        redirect(`/${params.locale}/login`);
    }

    // 2. Fetch User Stores
    const { data: stores, error } = await StoreService.getUserStores();

    // 3. Translations (stub for now, assuming keys exist or fallback)
    const t = await getTranslations('Dashboard');

    return (
        <div className="min-h-screen bg-zinc-950 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Command Center</h1>
                        <p className="text-zinc-400">Manage your sovereign digital assets.</p>
                    </div>
                    <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white font-bold">
                        <Link href={`/${params.locale}/customizer`}>
                            <Plus size={16} className="mr-2" />
                            Launch New Empire
                        </Link>
                    </Button>
                </div>

                {/* ERROR STATE */}
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                        <AlertCircle size={20} />
                        <p>Failed to load assets: {error.message}</p>
                    </div>
                )}

                {/* STORES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stores?.map((store) => (
                        <Card key={store.id} className="bg-white/5 border-white/10 overflow-hidden hover:border-white/20 transition-colors">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge
                                        variant="outline"
                                        className={`
                                            ${store.status === 'deployed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                                            ${store.status === 'draft' ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' : ''}
                                            ${store.status === 'pending_payment' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : ''}
                                            uppercase tracking-widest text-[10px] font-bold px-2 py-0.5
                                        `}
                                    >
                                        {store.status}
                                    </Badge>
                                    <Shield size={14} className="text-zinc-600" />
                                </div>
                                <CardTitle className="text-xl text-white font-bold truncate">{store.name}</CardTitle>
                                <CardDescription className="text-zinc-500 truncate">{store.description || "No description provided."}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-mono">
                                    ID: {store.id.slice(0, 8)}...
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant="outline"
                                        className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300"
                                        asChild
                                    >
                                        <Link href={`/${params.locale}/customizer?id=${store.id}`}>
                                            <Edit size={14} className="mr-2" />
                                            Edit
                                        </Link>
                                    </Button>

                                    {store.status === 'deployed' && store.deployment_url ? (
                                        <Button
                                            className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/20"
                                            asChild
                                        >
                                            <a href={store.deployment_url} target="_blank" rel="noopener noreferrer">
                                                Visit <ExternalLink size={14} className="ml-2" />
                                            </a>
                                        </Button>
                                    ) : store.status === 'draft' ? (
                                        <Button
                                            className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                                            asChild
                                        >
                                            <Link href={`/${params.locale}/customizer?id=${store.id}`}>
                                                Deploy
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button className="w-full" disabled variant="secondary">Processing</Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* EMPTY STATE */}
                    {stores?.length === 0 && (
                        <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-2xl">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-zinc-600" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">No Assets Found</h3>
                            <p className="text-zinc-500 mb-6 max-w-sm mx-auto">You haven't initialized any sovereign infrastructure yet.</p>
                            <Button asChild className="bg-blue-600 hover:bg-blue-500">
                                <Link href={`/${params.locale}/customizer`}>Create First Asset</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
