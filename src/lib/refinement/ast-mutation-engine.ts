/**
 * AST Mutation Engine
 * 
 * Surgical code modification without full regeneration.
 * Uses Abstract Syntax Tree manipulation for precise, error-free edits.
 * 
 * Key Benefits:
 * - Instant modifications (<500ms)
 * - Zero side effects on unrelated code
 * - Preserves user's existing structure
 * - Undo/Redo support via AST snapshots
 */

import { Section, SiteBlueprint } from "@/lib/schemas";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ASTNode {
    id: string;
    type: string;
    properties: Record<string, unknown>;
    children?: ASTNode[];
    parent?: string | null;
}

export interface ASTSnapshot {
    timestamp: number;
    blueprint: SiteBlueprint;
    ast: ASTNode[];
}

export interface MutationCommand {
    type: "UPDATE_STYLE" | "UPDATE_CONTENT" | "UPDATE_LAYOUT" | "DELETE_SECTION" | "ADD_SECTION" | "MOVE_SECTION";
    targetId: string;
    changes: Record<string, unknown>;
    metadata?: {
        undoable: boolean;
        requiresValidation: boolean;
    };
}

export interface MutationResult {
    success: boolean;
    blueprint: SiteBlueprint;
    affectedSections: string[];
    error?: string;
    warning?: string;
}

export interface IntentClassification {
    type: "STYLE" | "CONTENT" | "LAYOUT" | "SEO" | "NAVIGATION" | "UNKNOWN";
    confidence: number;
    targetSection?: string;
    targetProperty?: string;
    suggestedMutation?: MutationCommand;
}

// ============================================================================
// AST BUILDER
// ============================================================================

export class ASTBuilder {
    /**
     * Convert SiteBlueprint to AST for manipulation
     */
    static build(blueprint: SiteBlueprint): ASTNode[] {
        const ast: ASTNode[] = [];

        // Root node
        const rootNode: ASTNode = {
            id: "root",
            type: "SiteBlueprint",
            properties: {
                name: blueprint.name,
                description: blueprint.description,
            },
            children: [],
            parent: null,
        };

        ast.push(rootNode);

        // Convert layout sections to AST nodes
        if (blueprint.layout) {
            blueprint.layout.forEach((section) => {
                const node: ASTNode = {
                    id: section.id,
                    type: section.type,
                    properties: {
                        content: section.content,
                        styles: section.styles,
                        animation: section.animation,
                    },
                    children: [],
                    parent: "root",
                };

                ast.push(node);
                rootNode.children?.push(node.id);
            });
        }

        // Convert navigation
        if (blueprint.navigation) {
            const navNode: ASTNode = {
                id: "navigation",
                type: "Navigation",
                properties: blueprint.navigation,
                children: [],
                parent: "root",
            };

            ast.push(navNode);
            rootNode.children?.push("navigation");
        }

        // Convert footer
        if (blueprint.footer) {
            const footerNode: ASTNode = {
                id: "footer",
                type: "Footer",
                properties: blueprint.footer,
                children: [],
                parent: "root",
            };

            ast.push(footerNode);
            rootNode.children?.push("footer");
        }

        return ast;
    }

    /**
     * Find node by ID
     */
    static findNode(ast: ASTNode[], id: string): ASTNode | null {
        return ast.find((node) => node.id === id) || null;
    }

    /**
     * Find nodes by type
     */
    static findNodesByType(ast: ASTNode[], type: string): ASTNode[] {
        return ast.filter((node) => node.type === type);
    }

    /**
     * Serialize AST back to blueprint
     */
    static serialize(ast: ASTNode[], originalBlueprint: SiteBlueprint): SiteBlueprint {
        const blueprint = { ...originalBlueprint };
        const layout: Section[] = [];

        // Extract sections from AST
        ast.forEach((node) => {
            if (node.parent === "root" && node.type !== "Navigation" && node.type !== "Footer") {
                layout.push({
                    id: node.id,
                    type: node.type as Section["type"],
                    content: node.properties.content as Section["content"],
                    styles: node.properties.styles as Section["styles"],
                    animation: node.properties.animation as Section["animation"],
                });
            }
        });

        // Update navigation
        const navNode = ast.find((n) => n.id === "navigation");
        if (navNode) {
            blueprint.navigation = navNode.properties as SiteBlueprint["navigation"];
        }

        // Update footer
        const footerNode = ast.find((n) => n.id === "footer");
        if (footerNode) {
            blueprint.footer = footerNode.properties as SiteBlueprint["footer"];
        }

        blueprint.layout = layout;

        return blueprint;
    }
}

// ============================================================================
// AST MUTATOR
// ============================================================================

export class ASTMutator {
    private ast: ASTNode[];
    private snapshotStack: ASTSnapshot[] = [];
    private redoStack: ASTSnapshot[] = [];

    constructor(blueprint: SiteBlueprint) {
        this.ast = ASTBuilder.build(blueprint);
        this.saveSnapshot(blueprint);
    }

    /**
     * Save current state to snapshot stack
     */
    private saveSnapshot(blueprint: SiteBlueprint): void {
        this.snapshotStack.push({
            timestamp: Date.now(),
            blueprint: { ...blueprint },
            ast: JSON.parse(JSON.stringify(this.ast)),
        });

        // Limit stack to 10 snapshots (Session Context requirement)
        if (this.snapshotStack.length > 10) {
            this.snapshotStack.shift();
        }

        // Clear redo stack on new action
        this.redoStack = [];
    }

    /**
     * Execute mutation command
     */
    execute(blueprint: SiteBlueprint, command: MutationCommand): MutationResult {
        console.log("[AST Mutator] Executing command:", command.type, "on", command.targetId);

        // Save snapshot for undo
        this.saveSnapshot(blueprint);

        const node = ASTBuilder.findNode(this.ast, command.targetId);

        if (!node && command.type !== "ADD_SECTION") {
            return {
                success: false,
                blueprint,
                affectedSections: [],
                error: `Target node not found: ${command.targetId}`,
            };
        }

        try {
            let affectedSections: string[] = [];

            switch (command.type) {
                case "UPDATE_STYLE":
                    affectedSections = this.updateStyle(node!, command.changes);
                    break;

                case "UPDATE_CONTENT":
                    affectedSections = this.updateContent(node!, command.changes);
                    break;

                case "UPDATE_LAYOUT":
                    affectedSections = this.updateLayout(node!, command.changes);
                    break;

                case "DELETE_SECTION":
                    affectedSections = this.deleteSection(node!);
                    break;

                case "ADD_SECTION":
                    affectedSections = this.addSection(command.changes);
                    break;

                case "MOVE_SECTION":
                    affectedSections = this.moveSection(node!, command.changes);
                    break;
            }

            // Serialize back to blueprint
            const updatedBlueprint = ASTBuilder.serialize(this.ast, blueprint);

            return {
                success: true,
                blueprint: updatedBlueprint,
                affectedSections,
            };
        } catch (error) {
            // Rollback on error
            this.undo();

            return {
                success: false,
                blueprint,
                affectedSections: [],
                error: error instanceof Error ? error.message : "Mutation failed",
            };
        }
    }

    /**
     * Update style properties
     */
    private updateStyle(node: ASTNode, changes: Record<string, unknown>): string[] {
        if (!node.properties.styles) {
            node.properties.styles = {};
        }

        const styles = node.properties.styles as Record<string, unknown>;

        Object.entries(changes).forEach(([key, value]) => {
            // Handle Tailwind class updates
            if (key === "className" || key === "class") {
                styles[key] = value;
            }
            // Handle color updates
            else if (key.includes("color") || key.includes("bg") || key.includes("text")) {
                styles[key] = value;
            }
            // Handle other style properties
            else {
                styles[key] = value;
            }
        });

        return [node.id];
    }

    /**
     * Update content properties
     */
    private updateContent(node: ASTNode, changes: Record<string, unknown>): string[] {
        if (!node.properties.content) {
            node.properties.content = {};
        }

        const content = node.properties.content as Record<string, unknown>;

        Object.entries(changes).forEach(([key, value]) => {
            content[key] = value;
        });

        return [node.id];
    }

    /**
     * Update layout properties
     */
    private updateLayout(node: ASTNode, changes: Record<string, unknown>): string[] {
        Object.entries(changes).forEach(([key, value]) => {
            node.properties[key] = value;
        });

        return [node.id];
    }

    /**
     * Delete a section
     */
    private deleteSection(node: ASTNode): string[] {
        // Find parent and remove from children
        const parent = this.ast.find((n) => n.id === node.parent);
        if (parent && parent.children) {
            parent.children = parent.children.filter((id) => id !== node.id);
        }

        // Remove node from AST
        this.ast = this.ast.filter((n) => n.id !== node.id);

        return [node.id];
    }

    /**
     * Add a new section
     */
    private addSection(changes: Record<string, unknown>): string[] {
        const newSection: Section = {
            id: (changes.id as string) || `section-${Date.now()}`,
            type: (changes.type as Section["type"]) || "custom",
            content: (changes.content as Section["content"]) || {},
            styles: (changes.styles as Section["styles"]) || {},
            animation: (changes.animation as Section["animation"]) || "fade-in",
        };

        const newNode: ASTNode = {
            id: newSection.id,
            type: newSection.type,
            properties: {
                content: newSection.content,
                styles: newSection.styles,
                animation: newSection.animation,
            },
            children: [],
            parent: "root",
        };

        this.ast.push(newNode);

        // Add to root children
        const rootNode = this.ast.find((n) => n.id === "root");
        if (rootNode && rootNode.children) {
            rootNode.children.push(newNode.id);
        }

        return [newSection.id];
    }

    /**
     * Move a section
     */
    private moveSection(node: ASTNode, changes: Record<string, unknown>): string[] {
        const { position, targetId } = changes as { position?: number; targetId?: string };

        if (position !== undefined) {
            // Reorder within same parent
            const parent = this.ast.find((n) => n.id === node.parent);
            if (parent && parent.children) {
                // Remove from current position
                parent.children = parent.children.filter((id: string) => id !== node.id);
                // Insert at new position
                parent.children.splice(position, 0, node.id);
            }
        }

        if (targetId) {
            // Move to different parent
            const oldParent = this.ast.find((n) => n.id === node.parent);
            const newParent = this.ast.find((n) => n.id === targetId);

            if (oldParent && oldParent.children) {
                oldParent.children = oldParent.children.filter((id: string) => id !== node.id);
            }

            if (newParent) {
                node.parent = targetId;
                if (!newParent.children) {
                    newParent.children = [];
                }
                newParent.children.push(node.id);
            }
        }

        return [node.id];
    }

    /**
     * Undo last mutation
     */
    undo(): SiteBlueprint | null {
        if (this.snapshotStack.length <= 1) {
            return null;
        }

        // Pop current state
        const current = this.snapshotStack.pop();
        if (current) {
            this.redoStack.push(current);
        }

        // Restore previous state
        const previous = this.snapshotStack[this.snapshotStack.length - 1];
        if (previous) {
            this.ast = JSON.parse(JSON.stringify(previous.ast));
            return previous.blueprint;
        }

        return null;
    }

    /**
     * Redo last undone mutation
     */
    redo(): SiteBlueprint | null {
        if (this.redoStack.length === 0) {
            return null;
        }

        const next = this.redoStack.pop();
        if (next) {
            this.snapshotStack.push(next);
            this.ast = JSON.parse(JSON.stringify(next.ast));
            return next.blueprint;
        }

        return null;
    }

    /**
     * Get current AST
     */
    getAST(): ASTNode[] {
        return [...this.ast];
    }

    /**
     * Get snapshot history (for Site Schema History)
     */
    getHistory(): ASTSnapshot[] {
        return [...this.snapshotStack];
    }
}

// ============================================================================
// INTENT CLASSIFIER
// ============================================================================

export class IntentClassifier {
    private readonly styleKeywords = [
        "color",
        "style",
        "theme",
        "background",
        "font",
        "size",
        "spacing",
        "shadow",
        "border",
        "gradient",
        "لون",
        "ستايل",
        "خلفية",
        "خط",
        "حجم",
    ];

    private readonly contentKeywords = [
        "text",
        "content",
        "copy",
        "headline",
        "title",
        "description",
        "نص",
        "محتوى",
        "عنوان",
        "وصف",
    ];

    private readonly layoutKeywords = [
        "layout",
        "position",
        "move",
        "reorder",
        "section",
        "grid",
        "layout",
        "ترتيب",
        "موضع",
        "قسم",
    ];

    private readonly seoKeywords = [
        "seo",
        "meta",
        "title",
        "keywords",
        "description",
        "heading",
        "h1",
        "h2",
        "optimization",
        "سيو",
        "عنوان",
        "وصف",
    ];

    /**
     * Classify user input intent
     */
    classify(input: string, currentBlueprint: SiteBlueprint): IntentClassification {
        const lowerInput = input.toLowerCase();

        // Score each category
        const scores = {
            STYLE: this.scoreKeywords(lowerInput, this.styleKeywords),
            CONTENT: this.scoreKeywords(lowerInput, this.contentKeywords),
            LAYOUT: this.scoreKeywords(lowerInput, this.layoutKeywords),
            SEO: this.scoreKeywords(lowerInput, this.seoKeywords),
        };

        // Find highest score
        let maxScore = 0;
        let maxType: IntentClassification["type"] = "UNKNOWN";

        Object.entries(scores).forEach(([type, score]) => {
            if (score > maxScore) {
                maxScore = score;
                maxType = type as IntentClassification["type"];
            }
        });

        // Calculate confidence
        const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
        const confidence = totalScore > 0 ? maxScore / totalScore : 0;

        // Try to identify target section
        const targetSection = this.identifyTargetSection(lowerInput, currentBlueprint);

        // Generate suggested mutation
        const suggestedMutation = this.generateSuggestedMutation(
            maxType,
            input,
            targetSection,
            currentBlueprint
        );

        return {
            type: maxType,
            confidence,
            targetSection,
            suggestedMutation,
        };
    }

    /**
     * Score input against keywords
     */
    private scoreKeywords(input: string, keywords: string[]): number {
        return keywords.reduce((score, keyword) => {
            if (input.includes(keyword)) {
                return score + 1;
            }
            return score;
        }, 0);
    }

    /**
     * Identify target section from input
     */
    private identifyTargetSection(input: string, blueprint: SiteBlueprint): string | undefined {
        // Look for section type mentions
        const sectionTypes = blueprint.layout?.map((s) => s.type.toLowerCase()) || [];

        for (const type of sectionTypes) {
            if (input.includes(type)) {
                const section = blueprint.layout?.find((s) => s.type.toLowerCase() === type);
                return section?.id;
            }
        }

        // Look for section ID mentions
        if (blueprint.layout) {
            for (const section of blueprint.layout) {
                if (input.includes(section.id)) {
                    return section.id;
                }
            }
        }

        return undefined;
    }

    /**
     * Generate suggested mutation from intent
     */
    private generateSuggestedMutation(
        type: IntentClassification["type"],
        input: string,
        targetSection: string | undefined,
        blueprint: SiteBlueprint
    ): MutationCommand | undefined {
        if (!targetSection) return undefined;

        // Extract changes from input (simplified - would use AI in production)
        const changes: Record<string, unknown> = {};

        // Color extraction (simplified)
        const colorMatch = input.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/);
        if (colorMatch) {
            changes.color = colorMatch[0];
        }

        // Tailwind class extraction (simplified)
        const twMatch = input.match(/(?:bg|text|border)-[a-z0-9-]+/g);
        if (twMatch) {
            changes.className = twMatch.join(" ");
        }

        if (Object.keys(changes).length === 0) {
            return undefined;
        }

        return {
            type: type === "STYLE" ? "UPDATE_STYLE" : "UPDATE_CONTENT",
            targetId: targetSection,
            changes,
            metadata: {
                undoable: true,
                requiresValidation: true,
            },
        };
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    ASTBuilder,
    ASTMutator,
    IntentClassifier,
};
