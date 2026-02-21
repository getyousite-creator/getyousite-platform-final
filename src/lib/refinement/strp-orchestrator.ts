/**
 * Smart Tuning & Refinement Protocol (STRP) Orchestrator
 * 
 * The complete brain for conversational site refinement.
 * Integrates AST Mutation, Dual-Layer Memory, and Live Preview.
 */

import { SiteBlueprint } from "@/lib/schemas";
import {
    ASTMutator,
    IntentClassifier,
    type MutationCommand,
    type IntentClassification,
    type MutationResult,
} from "./ast-mutation-engine";
import {
    DualLayerMemoryManager,
    ContextResolver,
    type Message,
} from "./dual-layer-memory";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface UserInput {
    text: string;
    image?: {
        url: string;
        type: "screenshot" | "inspiration" | "logo" | "other";
    };
    metadata?: Record<string, unknown>;
}

export interface UpdateResult {
    success: boolean;
    blueprint: SiteBlueprint;
    optimisticUpdate?: boolean;
    affectedSections: string[];
    message: string;
    suggestions?: string[];
    error?: string;
}

export interface ChatState {
    isLoading: boolean;
    lastUpdate?: UpdateResult;
    undoAvailable: boolean;
    redoAvailable: boolean;
}

export interface STRPConfig {
    sessionId?: string;
    enableOptimisticUpdates?: boolean;
    enableProactiveSuggestions?: boolean;
    enableVisionAnalysis?: boolean;
}

// ============================================================================
// STRP ORCHESTRATOR
// ============================================================================

export class STRPOrchestrator {
    private memory: DualLayerMemoryManager;
    private contextResolver: ContextResolver;
    private intentClassifier: IntentClassifier;
    private mutator: ASTMutator | null = null;
    private config: Required<STRPConfig>;

    constructor(config?: STRPConfig) {
        this.config = {
            sessionId: config?.sessionId,
            enableOptimisticUpdates: config?.enableOptimisticUpdates ?? true,
            enableProactiveSuggestions: config?.enableProactiveSuggestions ?? true,
            enableVisionAnalysis: config?.enableVisionAnalysis ?? true,
        };

        this.memory = new DualLayerMemoryManager({
            sessionId: this.config.sessionId,
        });

        this.contextResolver = new ContextResolver(this.memory);
        this.intentClassifier = new IntentClassifier();
    }

    /**
     * Initialize with a blueprint
     */
    initialize(blueprint: SiteBlueprint): void {
        this.mutator = new ASTMutator(blueprint);
        this.memory.saveSnapshot(blueprint);

        this.memory.addMessage({
            role: "system",
            content: `Session initialized with site: ${blueprint.name}`,
        });
    }

    /**
     * Process user command through the full STRP pipeline
     */
    async processCommand(input: UserInput): Promise<UpdateResult> {
        console.log("[STRP] Processing command:", input.text);

        // Add user message to memory
        this.memory.addMessage({
            role: "user",
            content: input.text,
        });

        // Check if we have an initialized mutator
        if (!this.mutator) {
            return {
                success: false,
                blueprint: this.memory.getCurrentState()?.blueprint || this.createDefaultBlueprint(),
                affectedSections: [],
                message: "Please initialize STRP with a blueprint first.",
                error: "Not initialized",
            };
        }

        // Step 1: Resolve context (handle "make it bigger" references)
        const context = this.contextResolver.buildContext(input.text);

        // Step 2: Classify intent
        const currentState = this.memory.getCurrentState()?.blueprint;
        if (!currentState) {
            return {
                success: false,
                blueprint: this.createDefaultBlueprint(),
                affectedSections: [],
                message: "No current state found.",
                error: "State not found",
            };
        }

        const intent = this.intentClassifier.classify(context.userInput, currentState);

        // Step 3: Handle special commands
        if (this.isSpecialCommand(input.text)) {
            return this.handleSpecialCommand(input.text, currentState);
        }

        // Step 4: Optimistic UI Update (if enabled)
        if (this.config.enableOptimisticUpdates) {
            // Send optimistic update to UI (< 1 second)
            // This is handled by the frontend via PostMessage
        }

        // Step 5: Execute mutation
        const result = await this.executeMutation(intent, input, currentState);

        // Step 6: Add response to memory
        this.memory.addMessage({
            role: "assistant",
            content: result.message,
            metadata: {
                intent: intent.type,
                affectedSections: result.affectedSections,
            },
        });

        // Step 7: Proactive suggestions (if enabled)
        let suggestions: string[] = [];
        if (this.config.enableProactiveSuggestions) {
            suggestions = await this.generateProactiveSuggestions(
                result.blueprint,
                this.memory.getRecentMessages(10)
            );
        }

        return {
            ...result,
            suggestions,
        };
    }

    /**
     * Execute mutation based on intent
     */
    private async executeMutation(
        intent: IntentClassification,
        input: UserInput,
        blueprint: SiteBlueprint
    ): Promise<UpdateResult> {
        if (!this.mutator) {
            return {
                success: false,
                blueprint,
                affectedSections: [],
                message: "Mutator not initialized.",
                error: "Not initialized",
            };
        }

        // If we have a suggested mutation from intent classification
        if (intent.suggestedMutation) {
            const result = this.mutator.execute(blueprint, intent.suggestedMutation);

            if (result.success) {
                // Save to history
                this.memory.saveSnapshot(result.blueprint, this.mutator.getAST());

                return {
                    success: true,
                    blueprint: result.blueprint,
                    optimisticUpdate: true,
                    affectedSections: result.affectedSections,
                    message: `Updated ${result.affectedSections.length} section(s) successfully.`,
                };
            } else {
                return {
                    success: false,
                    blueprint,
                    affectedSections: [],
                    message: result.error || "Mutation failed.",
                    error: result.error,
                };
            }
        }

        // For complex requests, use AI to generate mutation command
        // This would call the AI engine in production
        return await this.handleComplexRequest(input, blueprint);
    }

    /**
     * Handle complex requests that need AI processing
     */
    private async handleComplexRequest(
        input: UserInput,
        blueprint: SiteBlueprint
    ): Promise<UpdateResult> {
        // In production, this would call the AI engine
        // For now, return a placeholder response

        return {
            success: true,
            blueprint,
            optimisticUpdate: false,
            affectedSections: [],
            message: `Processing: "${input.text}". This requires AI analysis.`,
        };
    }

    /**
     * Handle special commands (undo, redo, reset, etc.)
     */
    private handleSpecialCommand(
        command: string,
        blueprint: SiteBlueprint
    ): UpdateResult {
        const lowerCommand = command.toLowerCase().trim();

        // Undo
        if (lowerCommand.includes("undo") || lowerCommand.includes("تراجع")) {
            const previous = this.memory.undo();
            if (previous && this.mutator) {
                this.mutator.undo();
                return {
                    success: true,
                    blueprint: previous.blueprint,
                    affectedSections: [],
                    message: "Undone successfully.",
                };
            }
            return {
                success: false,
                blueprint,
                affectedSections: [],
                message: "Nothing to undo.",
            };
        }

        // Redo
        if (lowerCommand.includes("redo") || lowerCommand.includes("إعادة")) {
            const next = this.memory.redo();
            if (next && this.mutator) {
                this.mutator.redo();
                return {
                    success: true,
                    blueprint: next.blueprint,
                    affectedSections: [],
                    message: "Redone successfully.",
                };
            }
            return {
                success: false,
                blueprint,
                affectedSections: [],
                message: "Nothing to redo.",
            };
        }

        // Reset
        if (lowerCommand.includes("reset") || lowerCommand.includes("إعادة تعيين")) {
            this.mutator = new ASTMutator(blueprint);
            this.memory.clearHistory();
            this.memory.saveSnapshot(blueprint);

            return {
                success: true,
                blueprint,
                affectedSections: [],
                message: "Reset to original state.",
            };
        }

        return {
            success: false,
            blueprint,
            affectedSections: [],
            message: "Unknown command.",
        };
    }

    /**
     * Generate proactive optimization suggestions
     */
    private async generateProactiveSuggestions(
        blueprint: SiteBlueprint,
        recentMessages: Message[]
    ): Promise<string[]> {
        const suggestions: string[] = [];

        // Analyze recent activity
        const userMessages = recentMessages.filter((m) => m.role === "user");

        // Suggestion 1: Too many text edits → suggest bullet points
        const textEdits = userMessages.filter(
            (m) =>
                m.content.toLowerCase().includes("text") ||
                m.content.toLowerCase().includes("content") ||
                m.content.includes("نص") ||
                m.content.includes("محتوى")
        );

        if (textEdits.length >= 3) {
            suggestions.push(
                "I noticed you've made several text edits. Would you like me to convert some sections to bullet points for better readability?"
            );
        }

        // Suggestion 2: Color changes → check contrast
        const colorEdits = userMessages.filter(
            (m) =>
                m.content.toLowerCase().includes("color") ||
                m.content.toLowerCase().includes("background") ||
                m.content.includes("لون") ||
                m.content.includes("خلفية")
        );

        if (colorEdits.length >= 2) {
            suggestions.push(
                "The new colors look great! Would you like me to verify they meet WCAG accessibility standards for contrast?"
            );
        }

        // Suggestion 3: Layout changes → check responsiveness
        const layoutEdits = userMessages.filter(
            (m) =>
                m.content.toLowerCase().includes("layout") ||
                m.content.toLowerCase().includes("move") ||
                m.content.includes("ترتيب") ||
                m.content.includes("موضع")
        );

        if (layoutEdits.length >= 2) {
            suggestions.push(
                "Should I test the new layout on mobile, tablet, and desktop to ensure it looks great on all devices?"
            );
        }

        // Suggestion 4: SEO check after content changes
        const hasContentChanges = blueprint.layout?.some(
            (section) => section.content.headline || section.content.title
        );

        if (hasContentChanges && userMessages.length >= 5) {
            suggestions.push(
                "Your content is looking polished! Would you like me to optimize the headings (H1, H2, H3) for SEO?"
            );
        }

        return suggestions;
    }

    /**
     * Check if input is a special command
     */
    private isSpecialCommand(input: string): boolean {
        const specialCommands = [
            "undo",
            "redo",
            "reset",
            "تراجع",
            "إعادة",
            "إعادة تعيين",
            "حذف",
            "delete",
        ];

        return specialCommands.some((cmd) =>
            input.toLowerCase().includes(cmd)
        );
    }

    /**
     * Create default blueprint for fallback
     */
    private createDefaultBlueprint(): SiteBlueprint {
        return {
            id: "default",
            name: "Default Site",
            description: "Default description",
            navigation: {
                logo: "Logo",
                links: [],
                transparent: true,
            },
            theme: {
                primary: "#000000",
                secondary: "#ffffff",
                accent: "#0000ff",
                fontFamily: "Inter",
                backgroundColor: "#ffffff",
                textColor: "#000000",
                mode: "light",
            },
            pages: {},
            layout: [],
            footer: {
                copyright: "© 2026",
                links: [],
                social: {},
            },
            metadata: {},
            economic_impact: {
                estimated_savings: "$0",
                valuation: 0,
                logic_verified: true,
            },
            timestamp: new Date().toISOString(),
        };
    }

    // ========================================================================
    // GETTERS
    // ========================================================================

    /**
     * Get current chat state
     */
    getChatState(): ChatState {
        const stats = this.memory.getStats();

        return {
            isLoading: false,
            lastUpdate: undefined,
            undoAvailable: stats.canUndo,
            redoAvailable: stats.canRedo,
        };
    }

    /**
     * Get current blueprint
     */
    getCurrentBlueprint(): SiteBlueprint | null {
        return this.memory.getCurrentState()?.blueprint || null;
    }

    /**
     * Get memory stats
     */
    getMemoryStats(): ReturnType<DualLayerMemoryManager["getStats"]> {
        return this.memory.getStats();
    }

    /**
     * Export session for persistence
     */
    exportSession(): string {
        return JSON.stringify(this.memory.export());
    }

    /**
     * Import session from persistence
     */
    importSession(sessionData: string): void {
        try {
            const state = JSON.parse(sessionData);
            this.memory.import(state);
        } catch (error) {
            console.error("[STRP] Failed to import session:", error);
        }
    }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Create and initialize STRP orchestrator
 */
export function createSTRPOrchestrator(
    blueprint: SiteBlueprint,
    config?: STRPConfig
): STRPOrchestrator {
    const orchestrator = new STRPOrchestrator(config);
    orchestrator.initialize(blueprint);
    return orchestrator;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    STRPOrchestrator,
    createSTRPOrchestrator,
};
