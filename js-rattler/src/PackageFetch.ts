import {
    fetchAboutJson as _fetchAboutJson,
    fetchIndexJson as _fetchIndexJson,
    fetchPathsJson as _fetchPathsJson,
    fetchRawPackageFile as _fetchRawPackageFile,
} from "../pkg/";


export type IndexJson = {
    /** Build string, e.g. `"py311h1234567_0"`. */
    build: string;
    /** Build number (non-negative integer). */
    build_number: number;
    /** Lowercase package name, e.g. `"numpy"`. */
    name: string;
    /** Version string, e.g. `"2.1.0"`. */
    version: string;
    /** Conda sub-directory platform, e.g. `"linux-64"` or `"noarch"`. */
    subdir: string;
    /** Runtime dependency specs. */
    depends: string[];
    /** Run-export / pin constraints. */
    constrains?: string[];
    /** Optional target architecture e.g. `"x86_64"`. */
    arch?: string;
    /** Optional target OS e.g. `"linux"`. */
    platform?: string;
    /** No-arch mode: `"python"` | `"generic"` | `null`. */
    noarch?: "python" | "generic" | null;
    /** Optional SPDX license identifier. */
    license?: string;
    /** Optional license family. */
    license_family?: string;
    /** Optional features string (deprecated). */
    features?: string;
    /** Optional package URL list. */
    purls?: string[];
    /** Optional path to the site-packages directory inside the env. */
    python_site_packages_path?: string;
    /** Optional build timestamp in milliseconds since the Unix epoch. */
    timestamp?: number;
    /** Optional extra dependency groups. */
    extra_depends?: Record<string, string[]>;
};

/**
 * Parsed representation of `info/about.json`.
 */
export type AboutJson = {
    /** Free-form description of the package. */
    description?: string;
    /** SPDX license identifier. */
    license?: string;
    /** License file relative path inside the package. */
    license_file?: string | string[];
    /** Homepage URL(s). */
    home?: string[];
    /** Documentation URL(s). */
    doc_url?: string[];
    /** Development / source URL(s). */
    dev_url?: string[];
    /** Channels used during the build. */
    channels?: string[];
    /** Arbitrary extra key/value pairs added during the build. */
    extra?: Record<string, unknown>;
    /** Build summary / short description. */
    summary?: string;
    /** Tags attached to this package. */
    tags?: string[];
};

/**
 * Path type of a file inside `info/paths.json`.
 */
export type PathType = "hardlink" | "softlink" | "directory";

export type PathsEntry = {
    /** Relative path of the file inside the installed environment. */
    _path: string;
    /** SHA-256 hash of the file hex string, absent for directories. */
    sha256?: string;
    /** File size in bytes, absent for directories. */
    size_in_bytes?: number;
    /** How the file should be linked when installing. */
    path_type: PathType;
    /** Whether the file contains a build-time prefix that must be replaced. */
    prefix_placeholder?: string;
    /** Whether the prefix is binary (vs text). */
    file_mode?: "binary" | "text";
    /** Whether the file should not be linked (legacy field). */
    no_link?: boolean;
};

/**
 * Parsed representation of `info/paths.json`.
 */
export type PathsJson = {
    /** The `paths.json` format version (currently always `1`). */
    paths_version: number;
    /** All path entries in sorted order. */
    paths: PathsEntry[];
};


/**
 * Fetch the raw bytes of a single file from a remote conda package archive.
 */
export async function fetchRawPackageFile(
    url: string,
    filePath: string,
): Promise<Uint8Array | undefined> {
    return _fetchRawPackageFile(url, filePath);
}

/**
 * Fetch and parse `info/index.json` from a remote conda package archive.
 */
export async function fetchIndexJson(url: string): Promise<IndexJson> {
    return _fetchIndexJson(url) as Promise<IndexJson>;
}

/**
 * Fetch and parse `info/about.json` from a remote conda package archive.
 */
export async function fetchAboutJson(url: string): Promise<AboutJson> {
    return _fetchAboutJson(url) as Promise<AboutJson>;
}

/**
 * Fetch and parse `info/paths.json` from a remote conda package archive.
 */
export async function fetchPathsJson(url: string): Promise<PathsJson> {
    return _fetchPathsJson(url) as Promise<PathsJson>;
}
