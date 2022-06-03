use super::zombie_apocalypse;
use std::fs;

fn run_test(file: &str) {
    let input_file = String::from("src/tests/files/") + file + ".txt";
    let input = fs::read_to_string(input_file).unwrap();
    let mut result = zombie_apocalypse::solve(&input);
    result.retain(|c| !c.is_whitespace());

    let output_file = String::from("src/tests/files/") + file + "_Output.txt";
    let mut output = fs::read_to_string(output_file).unwrap();
    output.retain(|c| !c.is_whitespace());

    assert_eq!(result, output);
}

#[test]
fn simple_food_web() {
    run_test("SimpleFoodWeb");
}

#[test]
fn aquatic_food_web() {
    run_test("AquaticFoodWeb");
}

#[test]
fn grassland_food_web() {
    run_test("GrasslandFoodWeb");
}

#[test]
fn mixed_food_web() {
    run_test("MixedFoodWeb");
}

#[test]
fn another_food_web() {
    run_test("AnotherFoodWeb");
}

#[test]
fn terrestrial_food_web() {
    run_test("TerrestrialFoodWeb");
}
