use std::collections::HashMap;

#[derive(Debug)]
struct Organism {
    name: String,
    eats: Vec<String>,
}

impl Organism {
    fn get_predators_and_prey(&mut self, solution: &mut String) {
        if self.eats.len() > 0 {
            // Predator eats ...
            solution.push_str(&self.name);
            solution.push_str(" eats ");

            // Solution should be in an alphabetical order.
            // Sort it just in place.
            self.eats.sort_unstable();
            for (i, organism) in self.eats.iter().enumerate() {
                // ... eats something
                solution.push_str(&organism);
                match self.eats.len() {
                    // ... something and something
                    x if x == i + 2 => solution.push_str(" and "),
                    // ... eats something, something ...
                    x if x > i + 1 => solution.push_str(", "),
                    _ => (),
                }
            }
            solution.push_str("\n");
        }
    }
}

fn get_predators_and_prey(
    solution: &mut String,
    organisms: &mut HashMap<String, Organism>
) {
    solution.push_str("Predators and Prey:\n");

    // Solution looks like in an alphabetical order.
    // Maybe use an ordered map instead,
    let mut order = organisms.keys().cloned().collect::<Vec<String>>();
    order.sort_unstable();

    for key in order {
        if let Some(predator) = organisms.get_mut(&key) {
            predator.get_predators_and_prey(solution);
        }
    }
}

pub fn solve(input: &str) -> String {
    let mut organisms: HashMap<String, Organism> = HashMap::new();
    find_organisms(input, &mut organisms);

    let mut solution = String::new();
    get_predators_and_prey(&mut solution, &mut organisms);
    solution
}

fn create_organism(organism: &str, organisms: &mut HashMap<String, Organism>) {
    organisms.entry(organism.to_string()).or_insert(Organism {
        name: organism.to_string(),
        eats: Vec::new(),
    });
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
