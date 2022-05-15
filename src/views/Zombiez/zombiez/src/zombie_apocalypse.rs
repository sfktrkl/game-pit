use std::collections::HashMap;

#[derive(Debug)]
struct Organism {
    name: String,
    eats: Vec<String>,
}

fn get_predators_and_prey(
    solution: &mut String,
    organisms: &HashMap<String, Organism>,
    order: &Vec<String>,
) {
    solution.push_str("Predators and Prey:\n");
    for key in order {
        if let Some(predator) = organisms.get(key) {
            if predator.eats.len() > 0 {
                solution.push_str(&predator.name);
                solution.push_str(" eats ");
                for (i, organism) in predator.eats.iter().enumerate() {
                    solution.push_str(&organism);
                    if i + 2 == predator.eats.len() {
                        solution.push_str(" and ");
                    } else if i + 1 < predator.eats.len() {
                        solution.push_str(", ");
                    }
                }
                solution.push_str("\n");
            }
        }
    }
}

fn get_order(organisms: &HashMap<String, Organism>) -> Vec<String> {
    let mut vec: Vec<String> = Vec::new();
    for key in organisms.keys() {
        vec.push(key.clone());
    }
    vec.sort_unstable();
    vec
}

pub fn solve(input: &str) -> String {
    let mut organisms: HashMap<String, Organism> = HashMap::new();
    find_organisms(input, &mut organisms);

    // Solution looks like in an alphabetical order.
    let order = get_order(&organisms);

    let mut solution = String::from("");
    get_predators_and_prey(&mut solution, &organisms, &order);
    solution
}

fn create_organism(organism: &str, organisms: &mut HashMap<String, Organism>) {
    if !organisms.contains_key(organism) {
        organisms.insert(
            organism.to_string(),
            Organism {
                name: organism.to_string(),
                eats: Vec::new(),
            },
        );
    }
}

fn find_organisms(input: &str, organisms: &mut HashMap<String, Organism>) {
    let lines = input.split("\n");
    for line in lines {
        let words = line.split(",");
        let mut vec = words.collect::<Vec<&str>>();

        let predator = String::from(vec[0]);
        create_organism(&predator, organisms);

        for organism in &mut vec[1..] {
            let organism = String::from(organism.to_string());
            create_organism(&organism, organisms);
            if let Some(predator) = organisms.get_mut(&predator) {
                predator.eats.push(organism);
            }
        }
    }
}
