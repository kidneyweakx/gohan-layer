use sp1_sdk::{utils, ProverClient, SP1Stdin};
use sp1_recursion_gnark_ffi::{convert, verify};
const ELF: &[u8] = include_bytes!("../../program/elf/riscv32im-succinct-zkvm-elf");
use std::io;
use std::io::prelude::*;

use reqwest::{StatusCode, Client};
use serde::{Deserialize, Serialize};
use serde_json::json;
use base64::{Engine as _, engine::{self, general_purpose}};
use flate2::write::GzEncoder;

fn compress(data: &[u8]) -> Vec<u8> {
    let mut encoder = GzEncoder::new(Vec::new(), flate2::Compression::default());
    encoder.write_all(data).unwrap();
    encoder.finish().unwrap()
}
// use sp1_recursion_gnark_ffi::convert;
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Confidence {
    pub block: u32,
    pub confidence: f64,
    pub serialised_confidence: Option<String>,
}
#[derive(Debug, Serialize, Deserialize)]
struct SubmitResponse {
    block_number: u32,
    block_hash: String,
    hash: String,
    index: u32,
}
const LIGHT_CLIENT_URL: &str = "http://127.0.0.1:7000";

#[tokio::main]
async fn main() {
    // Generate proof.
    // utils::setup_tracer();
    utils::setup_logger();

    let stdin = SP1Stdin::new();
    let client = ProverClient::new();
    let (pk, vk) = client.setup(ELF);
    let proof = client.prove(&pk, stdin).expect("proving failed");
    // Verify proof.
    client.verify(&proof, &vk).expect("verification failed");

    // Save proof.
    proof
        .save("proof-with-pis.json")
        .expect("saving proof failed");
    println!("proof saved to proof-with-pis.json");
    println!("successfully generated and verified proof for the program!");
    // from this proof to groth16

    let submit_url = format!("{LIGHT_CLIENT_URL}/v2/submit");
    
    // let temp_dir = tempfile::tempdir().unwrap();
    // let build_dir = temp_dir.into_path();
    // let solidityProof = convert(&proof.proof, &build_dir);
    // println!("Solidity proof: {:?}", solidityProof);

    // Send proof to available light client.
    let rpcClient = Client::new();
    let serialProof = serde_json::to_vec(&proof).expect("Failed to serialize proof");
    // list the serialProof length
    println!("serialProof length: {:?}", serialProof.len());
    // let compress = compress(&serialProof);
    // println!("compress length: {:?}", compress.len());
    let data = general_purpose::STANDARD.encode(&serialProof[0..1000]); // Example base64 encoded data
    let response = rpcClient.post(&submit_url)
        .header("Content-Type", "application/json")
        .body(json!({ "data": data }).to_string())
        .send()
        .await
        .unwrap();
 
    match response.status() {
        StatusCode::OK => {
            let submit_response: SubmitResponse = serde_json::from_str(&response.text().await.unwrap()).unwrap();
            println!("Submit response: {:?}", submit_response);
        }
        StatusCode::NOT_FOUND => {
            println!("App mode not active or signing key not configured.");
        }
        _ => {
            eprintln!("Failed to submit data: {}", response.status());
        }
    }

    // let data = "dGVzdAo=";
    // let response = rpcClient.post(&submit_url)
    // .header("Content-Type", "application/json")
    // .body(json!({ "data": data }).to_string())
    // .send()
    // .await
    // .unwrap();

    // match response.status() {
    //     StatusCode::OK => {
    //         let submit_response: SubmitResponse = serde_json::from_str(&response.text().await.unwrap()).unwrap();
    //         println!("Submit response: {:?}", submit_response);
    //     }
    //     StatusCode::NOT_FOUND => {
    //         println!("App mode not active or signing key not configured.");
    //     }
    //     _ => {
    //         eprintln!("Failed to submit data: {}", response.status());
    //     }
    // }
}
