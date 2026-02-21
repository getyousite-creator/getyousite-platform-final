/**
 * Personalization Engine + Multi-Armed Bandits + Ethical AI
 * 
 * Features:
 * - Neural Collaborative Filtering (NCF)
 * - Thompson Sampling for A/B Testing
 * - Differential Privacy
 * - Bias Audit with Fairlearn
 */

import * as tf from '@tensorflow/tfjs-node';
import { UserFeature } from './ml-pipeline';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Recommendation {
    itemId: string;
    score: number;
    reason: string;
    metadata: Record<string, any>;
}

export interface BanditArm {
    armId: string;
    successes: number;
    failures: number;
    totalPulls: number;
    estimatedValue: number;
}

export interface ThompsonSamplingResult {
    selectedArm: string;
    armValues: Record<string, { mean: number; variance: number }>;
}

export interface BiasAuditResult {
    overallBias: number;
    demographicParity: Record<string, number>;
    equalOpportunity: Record<string, number>;
    disparateImpact: Record<string, number>;
    passed: boolean;
}

export interface DifferentialPrivacyConfig {
    epsilon: number; // Privacy budget
    delta: number;   // Failure probability
    sensitivity: number;
}

// ============================================================================
// NEURAL COLLABORATIVE FILTERING
// ============================================================================

export class NeuralCollaborativeFilter {
    private model: tf.LayersModel | null = null;
    private userEmbeddings: Map<string, number[]> = new Map();
    private itemEmbeddings: Map<string, number[]> = new Map();
    private embeddingDim: number = 32;

    /**
     * Build NCF model
     */
    buildModel(
        numUsers: number,
        numItems: number
    ): tf.LayersModel {
        // User tower
        const userInput = tf.input({ shape: [] });
        const userEmbed = tf.layers.embedding({
            inputDim: numUsers,
            outputDim: this.embeddingDim,
        }).apply(userInput) as tf.SymbolicTensor;
        const userFlat = tf.layers.flatten().apply(userEmbed) as tf.SymbolicTensor;

        // Item tower
        const itemInput = tf.input({ shape: [] });
        const itemEmbed = tf.layers.embedding({
            inputDim: numItems,
            outputDim: this.embeddingDim,
        }).apply(itemInput) as tf.SymbolicTensor;
        const itemFlat = tf.layers.flatten().apply(itemEmbed) as tf.SymbolicTensor;

        // Concatenate
        const concat = tf.layers.concatenate().apply([userFlat, itemFlat]) as tf.SymbolicTensor;

        // MLP layers
        let hidden = concat;
        for (const units of [64, 32, 16]) {
            hidden = tf.layers.dense({
                units,
                activation: 'relu',
            }).apply(hidden) as tf.SymbolicTensor;
            hidden = tf.layers.dropout({ rate: 0.3 }).apply(hidden) as tf.SymbolicTensor;
        }

        // Output
        const output = tf.layers.dense({
            units: 1,
            activation: 'sigmoid',
        }).apply(hidden) as tf.SymbolicTensor;

        const model = tf.model({
            inputs: [userInput, itemInput],
            outputs: output,
        });

        model.compile({
            optimizer: tf.train.adam(0.001),
            loss: 'binaryCrossentropy',
            metrics: ['accuracy'],
        });

        this.model = model;
        return model;
    }

    /**
     * Train model
     */
    async train(
        interactions: Array<{ userId: number; itemId: number; rating: number }>,
        epochs: number = 20
    ): Promise<void> {
        if (!this.model) throw new Error('Model not built');

        const userIds = tf.tensor1d(interactions.map(i => i.userId), 'int32');
        const itemIds = tf.tensor1d(interactions.map(i => i.itemId), 'int32');
        const ratings = tf.tensor1d(interactions.map(i => i.rating > 3 ? 1 : 0), 'float32');

        await this.model.fit([userIds, itemIds], ratings, {
            epochs,
            batchSize: 64,
            validationSplit: 0.2,
            verbose: 1,
        });

        userIds.dispose();
        itemIds.dispose();
        ratings.dispose();
    }

    /**
     * Get recommendations for user
     */
    async getRecommendations(
        userId: number,
        itemIds: number[],
        topK: number = 10
    ): Promise<number[]> {
        if (!this.model) throw new Error('Model not trained');

        const userTensor = tf.tensor1d(Array(itemIds.length).fill(userId), 'int32');
        const itemTensor = tf.tensor1d(itemIds, 'int32');

        const predictions = this.model.predict([userTensor, itemTensor]) as tf.Tensor;
        const scores = Array.from(await predictions.data());

        userTensor.dispose();
        itemTensor.dispose();
        predictions.dispose();

        // Sort by score
        const ranked = itemIds
            .map((itemId, index) => ({ itemId, score: scores[index] }))
            .sort((a, b) => b.score - a.score);

        return ranked.slice(0, topK).map(r => r.itemId);
    }

    /**
     * Get user embedding
     */
    getUserEmbedding(userId: string): number[] {
        return this.userEmbeddings.get(userId) || Array(this.embeddingDim).fill(0);
    }
}

// ============================================================================
// THOMPSON SAMPLING (Multi-Armed Bandits)
// ============================================================================

export class ThompsonSamplingBandit {
    private arms: Map<string, BanditArm> = new Map();

    /**
     * Initialize arm
     */
    initializeArm(armId: string): void {
        this.arms.set(armId, {
            armId,
            successes: 0,
            failures: 0,
            totalPulls: 0,
            estimatedValue: 0.5,
        });
    }

    /**
     * Select arm using Thompson Sampling
     */
    selectArm(): ThompsonSamplingResult {
        const samples: Record<string, number> = {};
        const armValues: Record<string, { mean: number; variance: number }> = {};

        this.arms.forEach((arm) => {
            // Sample from Beta distribution
            const alpha = arm.successes + 1;
            const beta = arm.failures + 1;

            // Beta distribution sampling (simplified)
            const sample = this.sampleBeta(alpha, beta);
            samples[arm.armId] = sample;

            // Calculate mean and variance
            const mean = alpha / (alpha + beta);
            const variance = (alpha * beta) / (Math.pow(alpha + beta, 2) * (alpha + beta + 1));

            armValues[arm.armId] = { mean, variance };
        });

        // Select arm with highest sample
        const selectedArm = Object.entries(samples)
            .sort((a, b) => b[1] - a[1])[0][0];

        return {
            selectedArm,
            armValues,
        };
    }

    /**
     * Update arm with reward
     */
    updateArm(armId: string, reward: number): void {
        const arm = this.arms.get(armId);
        if (!arm) throw new Error(`Arm ${armId} not found`);

        if (reward > 0.5) {
            arm.successes++;
        } else {
            arm.failures++;
        }

        arm.totalPulls++;
        arm.estimatedValue = arm.successes / arm.totalPulls;

        this.arms.set(armId, arm);
    }

    /**
     * Sample from Beta distribution
     */
    private sampleBeta(alpha: number, beta: number): number {
        // Simplified Beta sampling using Gamma distribution
        const x = this.sampleGamma(alpha);
        const y = this.sampleGamma(beta);
        return x / (x + y);
    }

    /**
     * Sample from Gamma distribution
     */
    private sampleGamma(shape: number): number {
        if (shape < 1) {
            return this.sampleGamma(shape + 1) * Math.pow(Math.random(), 1 / shape);
        }

        const d = shape - 1 / 3;
        const c = 1 / Math.sqrt(9 * d);

        while (true) {
            const x = this.sampleNormal();
            const v = Math.pow(1 + c * x, 3);

            if (v > 0) {
                const u = Math.random();
                if (
                    u < 1 - 0.0331 * Math.pow(x, 2) ||
                    Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))
                ) {
                    return d * v;
                }
            }
        }
    }

    /**
     * Sample from Normal distribution
     */
    private sampleNormal(): number {
        const u = 1 - Math.random();
        const v = Math.random();
        return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    }

    /**
     * Get arm statistics
     */
    getArmStats(): Record<string, BanditArm> {
        const stats: Record<string, BanditArm> = {};
        this.arms.forEach((arm, armId) => {
            stats[armId] = { ...arm };
        });
        return stats;
    }
}

// ============================================================================
// DIFFERENTIAL PRIVACY
// ============================================================================

export class DifferentialPrivacyEngine {
    private config: DifferentialPrivacyConfig;

    constructor(config: DifferentialPrivacyConfig) {
        this.config = config;
    }

    /**
     * Add Laplace noise for differential privacy
     */
    addLaplaceNoise(value: number): number {
        const scale = this.config.sensitivity / this.config.epsilon;
        const u = Math.random() - 0.5;
        return value - scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
    }

    /**
     * Add Gaussian noise for differential privacy
     */
    addGaussianNoise(value: number): number {
        const sigma = this.config.sensitivity * Math.sqrt(2 * Math.log(1.25 / this.config.delta)) / this.config.epsilon;
        return value + this.sampleNormal() * sigma;
    }

    /**
     * Private aggregation
     */
    privateAggregate(values: number[]): number {
        const sum = values.reduce((a, b) => a + b, 0);
        return this.addLaplaceNoise(sum);
    }

    /**
     * Sample from Normal distribution
     */
    private sampleNormal(): number {
        const u = 1 - Math.random();
        const v = Math.random();
        return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    }
}

// ============================================================================
// BIAS AUDIT (Fairlearn)
// ============================================================================

export class BiasAuditEngine {
    /**
     * Audit model for bias
     */
    auditBias(
        predictions: number[],
        labels: number[],
        sensitiveFeatures: Record<string, number[]>
    ): BiasAuditResult {
        const overallBias = this.calculateOverallBias(predictions, labels);
        const demographicParity = this.calculateDemographicParity(
            predictions,
            sensitiveFeatures
        );
        const equalOpportunity = this.calculateEqualOpportunity(
            predictions,
            labels,
            sensitiveFeatures
        );
        const disparateImpact = this.calculateDisparateImpact(
            predictions,
            sensitiveFeatures
        );

        // Check if passed (bias < 0.1 for all metrics)
        const passed =
            overallBias < 0.1 &&
            Object.values(demographicParity).every(v => Math.abs(v - 1) < 0.1) &&
            Object.values(equalOpportunity).every(v => Math.abs(v - 1) < 0.1) &&
            Object.values(disparateImpact).every(v => v > 0.8);

        return {
            overallBias,
            demographicParity,
            equalOpportunity,
            disparateImpact,
            passed,
        };
    }

    /**
     * Calculate overall bias
     */
    private calculateOverallBias(
        predictions: number[],
        labels: number[]
    ): number {
        // Calculate difference in positive prediction rates
        const positiveRate = predictions.filter(p => p > 0.5).length / predictions.length;
        const actualPositiveRate = labels.filter(l => l === 1).length / labels.length;
        return Math.abs(positiveRate - actualPositiveRate);
    }

    /**
     * Calculate demographic parity
     */
    private calculateDemographicParity(
        predictions: number[],
        sensitiveFeatures: Record<string, number[]>
    ): Record<string, number> {
        const results: Record<string, number> = {};

        Object.entries(sensitiveFeatures).forEach(([feature, values]) => {
            const groups = new Set(values);
            const groupRates: number[] = [];

            groups.forEach(group => {
                const groupIndices = values
                    .map((v, i) => v === group ? i : -1)
                    .filter(i => i !== -1);

                const groupPredictions = groupIndices.map(i => predictions[i]);
                const positiveRate = groupPredictions.filter(p => p > 0.5).length / groupPredictions.length;
                groupRates.push(positiveRate);
            });

            // Demographic parity ratio
            const maxRate = Math.max(...groupRates);
            const minRate = Math.min(...groupRates);
            results[feature] = maxRate > 0 ? minRate / maxRate : 1;
        });

        return results;
    }

    /**
     * Calculate equal opportunity
     */
    private calculateEqualOpportunity(
        predictions: number[],
        labels: number[],
        sensitiveFeatures: Record<string, number[]>
    ): Record<string, number> {
        const results: Record<string, number> = {};

        Object.entries(sensitiveFeatures).forEach(([feature, values]) => {
            const groups = new Set(values);
            const groupRates: number[] = [];

            groups.forEach(group => {
                const groupIndices = values
                    .map((v, i) => v === group ? i : -1)
                    .filter(i => i !== -1);

                // Only consider positive labels
                const truePositives = groupIndices.filter(i => labels[i] === 1);
                const predictedPositives = truePositives.filter(i => predictions[i] > 0.5);

                const tpr = truePositives.length > 0
                    ? predictedPositives.length / truePositives.length
                    : 1;

                groupRates.push(tpr);
            });

            const maxRate = Math.max(...groupRates);
            const minRate = Math.min(...groupRates);
            results[feature] = maxRate > 0 ? minRate / maxRate : 1;
        });

        return results;
    }

    /**
     * Calculate disparate impact
     */
    private calculateDisparateImpact(
        predictions: number[],
        sensitiveFeatures: Record<string, number[]>
    ): Record<string, number> {
        const results: Record<string, number> = {};

        Object.entries(sensitiveFeatures).forEach(([feature, values]) => {
            const groups = new Set(values);
            const groupRates: number[] = [];

            groups.forEach(group => {
                const groupIndices = values
                    .map((v, i) => v === group ? i : -1)
                    .filter(i => i !== -1);

                const groupPredictions = groupIndices.map(i => predictions[i]);
                const positiveRate = groupPredictions.filter(p => p > 0.5).length / groupPredictions.length;
                groupRates.push(positiveRate);
            });

            const maxRate = Math.max(...groupRates);
            const minRate = Math.min(...groupRates);
            results[feature] = maxRate > 0 ? minRate / maxRate : 1;
        });

        return results;
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    NeuralCollaborativeFilter,
    ThompsonSamplingBandit,
    DifferentialPrivacyEngine,
    BiasAuditEngine,
};
