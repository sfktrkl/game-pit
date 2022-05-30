use std::collections::HashMap;
use std::collections::HashSet;

#[derive(Debug)]
struct Organism {
    name: String,
    eats: Vec<String>,
    level: i32,
}

impl Organism {
    fn print_eats(&mut self, solution: &mut String) {
        if self.eats.len() > 0 {
            // Predator eats ...
            solution.push_str("  ");
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

    fn print_level(&mut self, solution: &mut String) {
        solution.push_str("  ");
        solution.push_str(&self.name);
        solution.push_str(": ");
        solution.push_str(&self.level.to_string());
        solution.push_str("\n");
    }
}

fn arrange_solution(
    title: &str,
    solution: &mut String,
    organisms: &mut HashMap<String, Organism>,
    order: &Vec<String>,
) {
    solution.push_str(title);
    solution.push_str(":\n");
    for key in order {
        if let Some(predator) = organisms.get_mut(key) {
            if title.eq("Predators and Prey") {
                predator.print_eats(solution);
            } else if title.eq("Heights") {
                predator.print_level(solution);
            }
        }
    }
    solution.push_str("\n");
}

pub fn solve(input: &str) -> String {
    let mut organisms: HashMap<String, Organism> = HashMap::new();
    find_organisms(input, &mut organisms);

    // Solution looks like in an alphabetical order.
    // Maybe use an ordered map instead,
    let mut order = organisms.keys().cloned().collect::<Vec<String>>();
    order.sort_unstable();

    let mut food_chain: HashMap<i32, HashSet<String>> = HashMap::new();
    create_food_chain(&mut organisms, &mut food_chain);

    let mut solution = String::new();
    arrange_solution("Predators and Prey", &mut solution, &mut organisms, &order);
    arrange_solution("Heights", &mut solution, &mut organisms, &order);
    solution
}

fn create_organism(organism: &str, organisms: &mut HashMap<String, Organism>) {
    organisms.entry(organism.to_string()).or_insert(Organism {
        name: organism.to_string(),
        eats: Vec::new(),
        level: 0,
    });
}

fn find_organisms(input: &str, organisms: &mut HashMap<String, Organism>) {
    let lines = input.split("\n");
    for line in lines {
        if line.is_empty() {
            continue;
        }

        let words = line.trim().split(",");
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

fn create_food_chain(
    organisms: &mut HashMap<String, Organism>,
    food_chain: &mut HashMap<i32, HashSet<String>>,
) {
    let mut end = true;
    let level = food_chain.len() as i32;
    let mut set = HashSet::<String>::new();
    for (name, organism) in organisms.iter() {
        if level == 0 {
            if organism.eats.len() == 0 {
                // If organism doesn't eat anything, add it as a
                // producer to the first level in the food_chain.
                set.insert(name.to_string());
                end = false;
            }
        } else {
            if let Some(eaten) = food_chain.get_mut(&(level - 1)) {
                for eat in eaten.iter() {
                    if organism.eats.contains(&eat) {
                        // Store organism to add to the current level.
                        set.insert(name.to_string());
                        end = false;
                    }
                }
            }
        }
    }
    if set.len() > 0 {
        // If any organism which needs to be added to this level
        // in the food_chain also exists in the previous level,
        // remove it from the previous level. promote.
        if let Some(eaten) = food_chain.get_mut(&(level - 1)) {
            for organism in set.iter() {
                eaten.remove(organism);
            }
        }
        // Add organisms to the food_chain.
        food_chain.insert(level, set);
    }

    // Recurse further to the next level.
    if !end {
        create_food_chain(organisms, food_chain);
    }
    // Store information in the organisms.
    else {
        for (level, consumers) in food_chain {
            for consumer in consumers.iter() {
                if let Some(organism) = organisms.get_mut(consumer) {
                    organism.level = *level;
                }
            }
        }
    }
}
