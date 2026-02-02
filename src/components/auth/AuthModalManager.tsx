"use client";

import { useAuthModal } from "@/hooks/use-auth-modal";
import AuthModal from "./AuthModal";

export default function AuthModalManager() {
    const { isOpen, onClose } = useAuthModal();
    return <AuthModal isOpen={isOpen} onClose={onClose} />;
}
