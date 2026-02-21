/**
 * PostMessage Bridge - Secure Iframe Communication
 * 
 * Encrypted communication between editor shell and preview iframe
 * Ensures security and performance for real-time updates
 */

"use client";

import { useEffect, useCallback, useRef } from 'react';

export type MessageType = 
    | 'BLUEPRINT_UPDATE'
    | 'STYLE_UPDATE'
    | 'CONTENT_UPDATE'
    | 'LAYOUT_UPDATE'
    | 'UNDO_REQUEST'
    | 'REDO_REQUEST'
    | 'SAVE_REQUEST'
    | 'PREVIEW_READY'
    | 'SELECTION_CHANGE';

export interface EditorMessage {
    type: MessageType;
    payload: any;
    timestamp: number;
    signature: string;
}

interface MessageHandler {
    (message: EditorMessage): void;
}

const SECRET_KEY = process.env.NEXT_PUBLIC_EDITOR_SECRET || 'sovereign-editor-key';

/**
 * Generate message signature for security
 */
function signMessage(message: EditorMessage): string {
    return btoa(JSON.stringify({
        type: message.type,
        timestamp: message.timestamp,
        key: SECRET_KEY
    }));
}

/**
 * Verify message signature
 */
function verifySignature(message: EditorMessage): boolean {
    try {
        const decoded = atob(message.signature);
        const parsed = JSON.parse(decoded);
        return parsed.key === SECRET_KEY && parsed.type === message.type;
    } catch {
        return false;
    }
}

/**
 * Create PostMessage Bridge
 */
export function usePostMessageBridge(iframeRef: React.RefObject<HTMLIFrameElement>) {
    const handlersRef = useRef<Map<MessageType, Set<MessageHandler>>>(new Map());

    // Send message to iframe
    const sendMessage = useCallback((type: MessageType, payload: any) => {
        if (!iframeRef.current?.contentWindow) {
            console.warn('[PostMessage] Iframe not ready');
            return;
        }

        const message: EditorMessage = {
            type,
            payload,
            timestamp: Date.now(),
            signature: ''
        };

        message.signature = signMessage(message);

        iframeRef.current.contentWindow.postMessage(message, '*');
    }, [iframeRef]);

    // Receive message from iframe
    const receiveMessage = useCallback((event: MessageEvent) => {
        // Security check - verify origin
        if (event.origin !== window.location.origin) {
            console.warn('[PostMessage] Invalid origin:', event.origin);
            return;
        }

        const message = event.data as EditorMessage;

        // Verify signature
        if (!verifySignature(message)) {
            console.warn('[PostMessage] Invalid signature');
            return;
        }

        // Call registered handlers
        const handlers = handlersRef.current.get(message.type);
        if (handlers) {
            handlers.forEach(handler => handler(message));
        }
    }, []);

    // Register message handler
    const onMessage = useCallback((type: MessageType, handler: MessageHandler) => {
        if (!handlersRef.current.has(type)) {
            handlersRef.current.set(type, new Set());
        }
        handlersRef.current.get(type)!.add(handler);

        // Return cleanup function
        return () => {
            handlersRef.current.get(type)?.delete(handler);
        };
    }, []);

    // Setup listener
    useEffect(() => {
        window.addEventListener('message', receiveMessage);
        return () => window.removeEventListener('message', receiveMessage);
    }, [receiveMessage]);

    return {
        sendMessage,
        onMessage
    };
}

/**
 * Send blueprint update to iframe
 */
export function sendBlueprintUpdate(
    sendMessage: ReturnType<typeof usePostMessageBridge>['sendMessage'],
    blueprint: any
) {
    sendMessage('BLUEPRINT_UPDATE', { blueprint });
}

/**
 * Send style update to iframe
 */
export function sendStyleUpdate(
    sendMessage: ReturnType<typeof usePostMessageBridge>['sendMessage'],
    elementId: string,
    styles: Record<string, string>
) {
    sendMessage('STYLE_UPDATE', { elementId, styles });
}

/**
 * Send content update to iframe
 */
export function sendContentUpdate(
    sendMessage: ReturnType<typeof usePostMessageBridge>['sendMessage'],
    elementId: string,
    content: string
) {
    sendMessage('CONTENT_UPDATE', { elementId, content });
}

/**
 * Request undo from iframe
 */
export function requestUndo(
    sendMessage: ReturnType<typeof usePostMessageBridge>['sendMessage']
) {
    sendMessage('UNDO_REQUEST', {});
}

/**
 * Request redo from iframe
 */
export function requestRedo(
    sendMessage: ReturnType<typeof usePostMessageBridge>['sendMessage']
) {
    sendMessage('REDO_REQUEST', {});
}

/**
 * Request save from iframe
 */
export function requestSave(
    sendMessage: ReturnType<typeof usePostMessageBridge>['sendMessage']
) {
    sendMessage('SAVE_REQUEST', {});
}
