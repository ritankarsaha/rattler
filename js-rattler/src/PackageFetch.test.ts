import { describe, expect, it } from "@jest/globals";
import {
    fetchAboutJson,
    fetchIndexJson,
    fetchPathsJson,
    fetchRawPackageFile,
} from "./PackageFetch";

// A small, stable noarch package on conda-forge that supports HTTP range requests.
const TZDATA_URL =
    "https://conda.anaconda.org/conda-forge/noarch/tzdata-2024b-hc8b5060_0.conda";

describe("fetchRawPackageFile", () => {
    it("returns raw bytes for an existing file", async () => {
        const bytes = await fetchRawPackageFile(TZDATA_URL, "info/index.json");
        expect(bytes).toBeInstanceOf(Uint8Array);
        expect(bytes!.length).toBeGreaterThan(0);
        // Should be valid UTF-8 JSON
        const text = new TextDecoder().decode(bytes);
        const parsed = JSON.parse(text);
        expect(parsed.name).toBe("tzdata");
    });

    it("returns undefined for a non-existent file path", async () => {
        const bytes = await fetchRawPackageFile(
            TZDATA_URL,
            "info/does_not_exist.json",
        );
        expect(bytes).toBeUndefined();
    });

    it("throws on an invalid URL", async () => {
        await expect(
            fetchRawPackageFile("not-a-url", "info/index.json"),
        ).rejects.toThrow();
    });
});

describe("fetchIndexJson", () => {
    it("returns a parsed IndexJson object", async () => {
        const index = await fetchIndexJson(TZDATA_URL);
        expect(index.name).toBe("tzdata");
        expect(index.version).toBe("2024b");
        expect(typeof index.build).toBe("string");
        expect(typeof index.build_number).toBe("number");
        expect(Array.isArray(index.depends)).toBe(true);
        expect(index.subdir).toBe("noarch");
    });

    it("throws on an invalid URL", async () => {
        await expect(fetchIndexJson("not-a-url")).rejects.toThrow();
    });

    it("throws on a URL that is not a conda package", async () => {
        await expect(
            fetchIndexJson("https://conda.anaconda.org/conda-forge/"),
        ).rejects.toThrow();
    });
});

describe("fetchAboutJson", () => {
    it("returns a parsed AboutJson object", async () => {
        const about = await fetchAboutJson(TZDATA_URL);
        // about.json may have varying fields but should be an object
        expect(about).toBeDefined();
        expect(typeof about).toBe("object");
        // tzdata always ships a license
        if (about.license) {
            expect(typeof about.license).toBe("string");
        }
    });

    it("throws on an invalid URL", async () => {
        await expect(fetchAboutJson("not-a-url")).rejects.toThrow();
    });
});

describe("fetchPathsJson", () => {
    it("returns a parsed PathsJson object", async () => {
        const paths = await fetchPathsJson(TZDATA_URL);
        expect(paths).toBeDefined();
        expect(typeof paths.paths_version).toBe("number");
        expect(Array.isArray(paths.paths)).toBe(true);
        expect(paths.paths.length).toBeGreaterThan(0);
        // Each entry should have a relative path
        for (const entry of paths.paths) {
            expect(typeof entry._path).toBe("string");
        }
    });

    it("throws on an invalid URL", async () => {
        await expect(fetchPathsJson("not-a-url")).rejects.toThrow();
    });
});
