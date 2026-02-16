import { z } from "zod";
import { SiteBlueprint, Section } from "@/lib/schemas";

const HexColorSchema = z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);

const PatchOperationSchema = z.object({
    type: z.enum([
        "theme.primary",
        "theme.secondary",
        "theme.backgroundColor",
        "theme.textColor",
        "section.add",
        "section.remove",
        "section.style.backgroundColor",
    ]),
    value: z.string().optional(),
    sectionType: z.string().optional(),
});

export type PatchOperation = z.infer<typeof PatchOperationSchema>;

function cloneBlueprint(blueprint: SiteBlueprint): SiteBlueprint {
    return JSON.parse(JSON.stringify(blueprint)) as SiteBlueprint;
}

function createCustomSection(id: string, title: string): Section {
    return {
        id,
        type: "custom",
        animation: "fade-in",
        styles: {
            backgroundColor: "#ffffff",
            padding: "80px 24px",
        },
        content: {
            title,
            description: "Custom section generated from command palette.",
            cta: "Learn more",
        },
    };
}

export function buildPatchOperations(command: string): PatchOperation[] {
    const cmd = command.trim().toLowerCase();
    const ops: PatchOperation[] = [];

    const colorMatch = cmd.match(/#([0-9a-f]{3}|[0-9a-f]{6})/i);
    const color = colorMatch ? `#${colorMatch[1]}` : undefined;

    if (color && /(primary|brand main)/.test(cmd)) {
        ops.push({ type: "theme.primary", value: color });
    }
    if (color && /(secondary|accent)/.test(cmd)) {
        ops.push({ type: "theme.secondary", value: color });
    }
    if (color && /(background|bg)/.test(cmd)) {
        ops.push({ type: "theme.backgroundColor", value: color });
    }
    if (color && /(text|font color)/.test(cmd)) {
        ops.push({ type: "theme.textColor", value: color });
    }
    if (!color && /(make.*dark|dark mode)/.test(cmd)) {
        ops.push({ type: "theme.backgroundColor", value: "#0b1220" });
        ops.push({ type: "theme.textColor", value: "#f8fafc" });
    }
    if (!color && /(make.*light|light mode)/.test(cmd)) {
        ops.push({ type: "theme.backgroundColor", value: "#ffffff" });
        ops.push({ type: "theme.textColor", value: "#0f172a" });
    }

    const addSectionMatch = cmd.match(/add section\s+([a-z0-9 _-]+)/i);
    if (addSectionMatch?.[1]) {
        ops.push({ type: "section.add", value: addSectionMatch[1].trim() });
    }

    const removeTypeMatch = cmd.match(/remove section\s+([a-z0-9 _-]+)/i);
    if (removeTypeMatch?.[1]) {
        ops.push({ type: "section.remove", sectionType: removeTypeMatch[1].trim() });
    }

    const sectionBgMatch = cmd.match(/section\s+([a-z0-9 _-]+).*(background|bg).*(#([0-9a-f]{3}|[0-9a-f]{6}))/i);
    if (sectionBgMatch?.[1] && sectionBgMatch?.[3]) {
        ops.push({
            type: "section.style.backgroundColor",
            sectionType: sectionBgMatch[1].trim(),
            value: sectionBgMatch[3],
        });
    }

    return ops.filter((op) => PatchOperationSchema.safeParse(op).success);
}

export function applyValidatedCommandPatch(blueprint: SiteBlueprint, command: string) {
    const operations = buildPatchOperations(command);
    if (operations.length === 0) {
        return {
            handled: false,
            blueprint,
            operations: [],
        };
    }

    const next = cloneBlueprint(blueprint);
    const indexPage = next.pages?.index;
    const layout = indexPage?.layout || next.layout || [];

    for (const op of operations) {
        if (op.type === "theme.primary" && op.value && HexColorSchema.safeParse(op.value).success) {
            next.theme.primary = op.value;
        }
        if (op.type === "theme.secondary" && op.value && HexColorSchema.safeParse(op.value).success) {
            next.theme.secondary = op.value;
        }
        if (op.type === "theme.backgroundColor" && op.value && HexColorSchema.safeParse(op.value).success) {
            next.theme.backgroundColor = op.value;
        }
        if (op.type === "theme.textColor" && op.value && HexColorSchema.safeParse(op.value).success) {
            next.theme.textColor = op.value;
        }
        if (op.type === "section.add" && op.value) {
            const id = `custom-${Date.now()}`;
            layout.push(createCustomSection(id, op.value));
        }
        if (op.type === "section.remove" && op.sectionType) {
            const normalizedType = op.sectionType.toLowerCase().replace(/\s+/g, "_");
            const idx = layout.findIndex((section) => section.type.toLowerCase() === normalizedType);
            if (idx >= 0) layout.splice(idx, 1);
        }
        if (op.type === "section.style.backgroundColor" && op.sectionType && op.value) {
            if (!HexColorSchema.safeParse(op.value).success) continue;
            const normalizedType = op.sectionType.toLowerCase().replace(/\s+/g, "_");
            const section = layout.find((item) => item.type.toLowerCase() === normalizedType);
            if (section) {
                section.styles = { ...(section.styles || {}), backgroundColor: op.value };
            }
        }
    }

    next.layout = layout;
    if (next.pages?.index) {
        next.pages.index.layout = layout;
    }

    return {
        handled: true,
        blueprint: next,
        operations,
    };
}

