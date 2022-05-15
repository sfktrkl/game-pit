use wasm_bindgen::prelude::*;
mod zombie_apocalypse;

#[wasm_bindgen]
pub fn get(input: &str) -> String {
    zombie_apocalypse::solve(input)
}
