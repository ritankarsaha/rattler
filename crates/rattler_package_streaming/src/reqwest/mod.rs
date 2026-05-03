//! Functionality to stream and extract packages directly from a [`reqwest::Url`].
pub mod fetch;
pub mod full_download;

/// Sparse HTTP range-request access to individual files inside remote `.conda` archives.
#[cfg(feature = "reqwest")]
pub mod sparse;

/// Streaming extraction of full remote packages to disk using tokio I/O.
#[cfg(feature = "reqwest")]
pub mod tokio;

#[cfg(test)]
mod test_server;
