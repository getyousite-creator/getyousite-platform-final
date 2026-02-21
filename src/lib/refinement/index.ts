/**
 * Smart Tuning & Refinement Protocol (STRP) Module
 * 
 * The brain for conversational site refinement.
 * Transforms GetYouSite from a "website generator" into a "creative partner".
 */

// AST Mutation Engine
export {
    ASTBuilder,
    ASTMutator,
    IntentClassifier,
    type ASTNode,
    type ASTSnapshot,
    type MutationCommand,
    type MutationResult,
    type IntentClassification,
} from "./ast-mutation-engine";

// Dual-Layer Memory System
export {
    DualLayerMemoryManager,
    ContextResolver,
    type Message,
    type SessionContext,
    type SiteSchemaHistory,
    type MemorySystem,
} from "./dual-layer-memory";

// STRP Orchestrator (Main)
export {
    STRPOrchestrator,
    createSTRPOrchestrator,
    type UserInput,
    type UpdateResult,
    type ChatState,
    type STRPConfig,
} from "./strp-orchestrator";

// Multi-modal Vision Protocol
export {
    VisionAnalyzer,
    ClientSideColorExtractor,
    type VisionAnalysisRequest,
    type VisionAnalysisResult,
    type ExtractedColorPalette,
    type LayoutAnalysis,
    type TailwindConversion,
} from "./vision-protocol";
