// WASM bindings for fetching individual files from remote conda package archives.
// These bindings expose the high-level fetch API from `rattler_package_streaming`,
// which streams the full package body and extracts the requested file on the fly.

use rattler_conda_types::package::{AboutJson, IndexJson, PathsJson};
use rattler_package_streaming::reqwest::fetch::{
    fetch_file_from_remote_url, fetch_package_file_from_remote_url,
};
use reqwest::Client;
use reqwest_middleware::ClientWithMiddleware;
use url::Url;
use wasm_bindgen::prelude::*;

use crate::JsResult;

fn default_client() -> ClientWithMiddleware {
    ClientWithMiddleware::from(Client::new())
}

/// Fetch the raw bytes of a single file from a remote conda package archive.
#[wasm_bindgen(js_name = "fetchRawPackageFile")]
pub async fn fetch_raw_package_file(
    url: &str,
    file_path: &str,
) -> JsResult<Option<Vec<u8>>> {
    let url = Url::parse(url)?;
    let path = std::path::Path::new(file_path);
    Ok(fetch_file_from_remote_url(default_client(), url, path).await?)
}

/// Fetch and parse the `info/index.json` from a remote conda package archive.
#[wasm_bindgen(js_name = "fetchIndexJson")]
pub async fn fetch_index_json(url: &str) -> JsResult<JsValue> {
    let url = Url::parse(url)?;
    let index_json: IndexJson =
        fetch_package_file_from_remote_url(default_client(), url).await?;
    Ok(serde_wasm_bindgen::to_value(&index_json)?)
}

/// Fetch and parse the `info/about.json` from a remote conda package archive.
#[wasm_bindgen(js_name = "fetchAboutJson")]
pub async fn fetch_about_json(url: &str) -> JsResult<JsValue> {
    let url = Url::parse(url)?;
    let about_json: AboutJson =
        fetch_package_file_from_remote_url(default_client(), url).await?;
    Ok(serde_wasm_bindgen::to_value(&about_json)?)
}

/// Fetch and parse the `info/paths.json` from a remote conda package archive.
#[wasm_bindgen(js_name = "fetchPathsJson")]
pub async fn fetch_paths_json(url: &str) -> JsResult<JsValue> {
    let url = Url::parse(url)?;
    let paths_json: PathsJson =
        fetch_package_file_from_remote_url(default_client(), url).await?;
    Ok(serde_wasm_bindgen::to_value(&paths_json)?)
}
