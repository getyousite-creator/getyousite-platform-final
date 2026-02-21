/**
 * Dual-Layer Memory System
 * 
 * Implements Session Context (short-term) and Site Schema History (long-term)
 * for continuous conversation flow and Undo/Redo capabilities.
 */

import { SiteBlueprint } from "@/lib/schemas";
import { ASTSnapshot } from "./ast-mutation-engine";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Message {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: number;
    metadata?: {
        intent?: string;
        affectedSections?: string[];
        snapshotId?: string;
    };
}

export interface SessionContext {
    sessionId: string;
    messages: Message[];
    maxMessages: number; // Default: 10 (as per requirement)
    createdAt: number;
    lastActivity: number;
}

export interface SiteSchemaHistory {
    snapshots: ASTSnapshot[];
    currentIndex: number;
    maxSnapshots: number; // Default: 50
}

export interface MemorySystem {
    session: SessionContext;
    history: SiteSchemaHistory;
}

// ============================================================================
// DUAL-LAYER MEMORY MANAGER
// ============================================================================

export class DualLayerMemoryManager {
    private session: SessionContext;
    private history: SiteSchemaHistory;

    constructor(options?: {
        sessionId?: string;
        maxMessages?: number;
        maxSnapshots?: number;
    }) {
        this.session = {
            sessionId: options?.sessionId || `session-${Date.now()}`,
            messages: [],
            maxMessages: options?.maxMessages || 10,
            createdAt: Date.now(),
            lastActivity: Date.now(),
        };

        this.history = {
            snapshots: [],
            currentIndex: -1,
            maxSnapshots: options?.maxSnapshots || 50,
        };
    }

    // ========================================================================
    // SESSION CONTEXT (Short-term Memory)
    // ========================================================================

    /**
     * Add message to session context
     */
    addMessage(message: Omit<Message, "id" | "timestamp">): Message {
        const newMessage: Message = {
            ...message,
            id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
        };

        this.session.messages.push(newMessage);
        this.session.lastActivity = Date.now();

        // Trim to maxMessages (maintain last 10)
        if (this.session.messages.length > this.session.maxMessages) {
            this.session.messages = this.session.messages.slice(
                -this.session.maxMessages
            );
        }

        return newMessage;
    }

    /**
     * Get recent messages for context
     */
    getRecentMessages(count: number = 10): Message[] {
        return this.session.messages.slice(-count);
    }

    /**
     * Get conversation context for AI
     */
    getConversationContext(): string {
        const recent = this.getRecentMessages(10);

        return recent
            .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
            .join("\n");
    }

    /**
     * Find reference in conversation (for "make it bigger" type requests)
     */
    findReference(query: string): Message | null {
        const keywords = query.toLowerCase().split(/\s+/);

        // Search through recent messages
        for (let i = this.session.messages.length - 1; i >= 0; i--) {
            const message = this.session.messages[i];

            // Check if message contains relevant context
            for (const keyword of keywords) {
                if (
                    keyword.length > 3 &&
                    message.content.toLowerCase().includes(keyword)
                ) {
                    return message;
                }
            }
        }

        return null;
    }

    /**
     * Clear session context
     */
    clearSession(): void {
        this.session.messages = [];
        this.session.lastActivity = Date.now();
    }

    // ========================================================================
    // SITE SCHEMA HISTORY (Long-term Memory)
    // ========================================================================

    /**
     * Save snapshot to history
     */
    saveSnapshot(blueprint: SiteBlueprint, ast?: ASTSnapshot["ast"]): string {
        const snapshot: ASTSnapshot = {
            timestamp: Date.now(),
            blueprint: { ...blueprint },
            ast: ast || [],
        };

        // Remove any forward snapshots (for redo after undo)
        this.history.snapshots = this.history.snapshots.slice(
            0,
            this.history.currentIndex + 1
        );

        // Add new snapshot
        this.history.snapshots.push(snapshot);
        this.history.currentIndex = this.history.snapshots.length - 1;

        // Trim to maxSnapshots
        if (this.history.snapshots.length > this.history.maxSnapshots) {
            this.history.snapshots.shift();
            this.history.currentIndex--;
        }

        return `snapshot-${snapshot.timestamp}`;
    }

    /**
     * Undo to previous state
     */
    undo(): ASTSnapshot | null {
        if (this.history.currentIndex <= 0) {
            return null;
        }

        this.history.currentIndex--;
        return this.history.snapshots[this.history.currentIndex];
    }

    /**
     * Redo to next state
     */
    redo(): ASTSnapshot | null {
        if (this.history.currentIndex >= this.history.snapshots.length - 1) {
            return null;
        }

        this.history.currentIndex++;
        return this.history.snapshots[this.history.currentIndex];
    }

    /**
     * Get current state
     */
    getCurrentState(): ASTSnapshot | null {
        if (this.history.currentIndex < 0) {
            return null;
        }

        return this.history.snapshots[this.history.currentIndex];
    }

    /**
     * Get snapshot by ID
     */
    getSnapshot(snapshotId: string): ASTSnapshot | null {
        return (
            this.history.snapshots.find(
                (s) => `snapshot-${s.timestamp}` === snapshotId
            ) || null
        );
    }

    /**
     * Get history timeline
     */
    getTimeline(): Array<{
        id: string;
        timestamp: number;
        blueprintName: string;
    }> {
        return this.history.snapshots.map((s) => ({
            id: `snapshot-${s.timestamp}`,
            timestamp: s.timestamp,
            blueprintName: s.blueprint.name,
        }));
    }

    /**
     * Clear history
     */
    clearHistory(): void {
        this.history.snapshots = [];
        this.history.currentIndex = -1;
    }

    // ========================================================================
    // MEMORY SYSTEM EXPORT
    // ========================================================================

    /**
     * Export complete memory system state
     */
    export(): MemorySystem {
        return {
            session: { ...this.session },
            history: {
                snapshots: [...this.history.snapshots],
                currentIndex: this.history.currentIndex,
                maxSnapshots: this.history.maxSnapshots,
            },
        };
    }

    /**
     * Import memory system state
     */
    import(state: MemorySystem): void {
        this.session = { ...state.session };
        this.history = {
            snapshots: [...state.history.snapshots],
            currentIndex: state.history.currentIndex,
            maxSnapshots: state.history.maxSnapshots,
        };
    }

    /**
     * Get memory stats
     */
    getStats(): {
        sessionMessages: number;
        historySnapshots: number;
        canUndo: boolean;
        canRedo: boolean;
    } {
        return {
            sessionMessages: this.session.messages.length,
            historySnapshots: this.history.snapshots.length,
            canUndo: this.history.currentIndex > 0,
            canRedo:
                this.history.currentIndex < this.history.snapshots.length - 1,
        };
    }
}

// ============================================================================
// CONTEXT RESOLVER
// ============================================================================

export class ContextResolver {
    private memory: DualLayerMemoryManager;

    constructor(memory: DualLayerMemoryManager) {
        this.memory = memory;
    }

    /**
     * Resolve ambiguous references in user input
     * e.g., "make it bigger" → what is "it"?
     */
    resolve(input: string): {
        resolvedInput: string;
        context: string | null;
        confidence: number;
    } {
        // Check for pronouns and ambiguous references
        const pronouns = ["it", "this", "that", "these", "those", "he", "she", "they"];
        const arabicPronouns = ["هو", "هي", "هذا", "هذه", "هؤلاء", "ذلك", "تلك"];

        const words = input.toLowerCase().split(/\s+/);
        const hasPronoun = words.some(
            (w) => pronouns.includes(w) || arabicPronouns.includes(w)
        );

        if (!hasPronoun) {
            return {
                resolvedInput: input,
                context: null,
                confidence: 1.0,
            };
        }

        // Find reference in conversation
        const reference = this.memory.findReference(input);

        if (reference) {
            return {
                resolvedInput: `${input} (referring to: ${reference.content})`,
                context: reference.content,
                confidence: 0.8,
            };
        }

        // No reference found, use recent context
        const recent = this.memory.getRecentMessages(3);
        if (recent.length > 0) {
            const lastUserMessage = recent
                .filter((m) => m.role === "user")
                .pop();

            if (lastUserMessage) {
                return {
                    resolvedInput: `${input} (context: ${lastUserMessage.content})`,
                    context: lastUserMessage.content,
                    confidence: 0.5,
                };
            }
        }

        return {
            resolvedInput: input,
            context: null,
            confidence: 0.3,
        };
    }

    /**
     * Build full context for AI processing
     */
    buildContext(input: string): {
        userInput: string;
        conversationHistory: string;
        currentState: SiteBlueprint | null;
        resolvedReferences: string;
    } {
        const resolved = this.resolve(input);
        const conversationHistory = this.memory.getConversationContext();
        const currentState = this.memory.getCurrentState()?.blueprint || null;

        return {
            userInput: resolved.resolvedInput,
            conversationHistory,
            currentState,
            resolvedReferences: resolved.context || "No specific reference",
        };
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    DualLayerMemoryManager,
    ContextResolver,
};
