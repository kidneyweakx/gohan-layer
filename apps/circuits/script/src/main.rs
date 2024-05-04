use sp1_sdk::{utils, ProverClient, SP1Stdin};

const ELF: &[u8] = include_bytes!("../../program/elf/riscv32im-succinct-zkvm-elf");

use reqwest::{StatusCode, Client};
use serde::{Deserialize, Serialize};
use serde_json::json;
use base64::{Engine as _, engine::{self, general_purpose}};
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
    // let input = convert(proof.clone())

    let submit_url = format!("{LIGHT_CLIENT_URL}/v2/submit");

    // Send proof to available light client.
    let rpcClient = Client::new();
    let file = std::fs::read_to_string("proof-with-pis.json").unwrap();
    let data = general_purpose::STANDARD.encode(file); // Example base64 encoded data
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
}
