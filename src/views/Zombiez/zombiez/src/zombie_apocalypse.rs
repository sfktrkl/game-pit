use std::collections::BTreeMap;
use std::collections::HashMap;
use std::collections::HashSet;

#[derive(Debug, Eq, Hash, PartialEq, Ord, PartialOrd)]
enum Classification {
    Herbivore,
    Omnivore,
    Carnivore,
    None,
}

#[derive(Debug)]
struct Organism {
    name: String,
    eats: Vec<String>,
    eaten: Vec<String>,
    level: i32,
    classification: Classification,
}

impl Organism {
    fn print_eats(&self, solution: &mut String) {
        if self.eats.len() > 0 {
            // Predator eats ...
            solution.push_str("  ");
            solution.push_str(&self.name);
            solution.push_str(" eats ");
            solution.push_str(&vec_to_string(&self.eats));
            solution.push_str("\n");
        }
    }

    fn print_level(&self, solution: &mut String) {
        solution.push_str("  ");
        solution.push_str(&self.name);
        solution.push_str(": ");
        solution.push_str(&self.level.to_string());
        solution.push_str("\n");
    }
}

fn vec_to_string(vec: &Vec<String>) -> String {
    let mut text = String::new();
    for (i, item) in vec.iter().enumerate() {
        text.push_str(&item);
        match vec.len() {
            x if x == i + 2 => text.push_str(" and "),
            x if x > i + 1 => text.push_str(", "),
            _ => (),
        }
    }
    if vec.len() == 0 {
        text.push_str("(None)");
    }
    text
}

fn arrange_solution(
    solution: &mut String,
    organisms: &HashMap<String, Organism>,
    trophic_levels: &Vec<Vec<String>>,
    classifications: &HashMap<Classification, Vec<String>>,
) {
    // Solution looks like in an alphabetical order.
    // Maybe use an ordered map for organims.
    let mut order = organisms.keys().cloned().collect::<Vec<String>>();
    order.sort_unstable();

    solution.push_str("Predators and Prey");
    solution.push_str(":\n");
    for key in order.iter() {
        if let Some(predator) = organisms.get(key) {
            predator.print_eats(solution);
        }
    }
    solution.push_str("\n");

    let trophic_level_titles = vec![
        "Apex Predators: ",
        "Producers: ",
        "Most Flexible Eaters: ",
        "Tastiest: ",
    ];
    for (level, vec) in trophic_levels.iter().enumerate() {
        solution.push_str(trophic_level_titles[level]);
        solution.push_str(&vec_to_string(vec));
        solution.push_str("\n");
    }
    solution.push_str("\n");

    solution.push_str("Heights");
    solution.push_str(":\n");
    for key in order.iter() {
        if let Some(predator) = organisms.get(key) {
            predator.print_level(solution);
        }
    }
    solution.push_str("\n");

    solution.push_str("For an A+");
    solution.push_str(":\n");
    let classification_titles = BTreeMap::from([
        (Classification::Herbivore, "Herbivores: "),
        (Classification::Omnivore, "Omnivores: "),
        (Classification::Carnivore, "Carnivores: "),
    ]);
    for (classification, title) in classification_titles.iter() {
        solution.push_str("  ");
        solution.push_str(title);
        solution.push_str(&vec_to_string(&classifications[classification]));
        solution.push_str("\n");
    }
}

pub fn solve(input: &str) -> String {
    let mut organisms: HashMap<String, Organism> = HashMap::new();
    find_organisms(input, &mut organisms);

    let mut food_chain: HashMap<i32, HashSet<String>> = HashMap::new();
    create_food_chain(&mut organisms, &mut food_chain);

    let mut classifications: HashMap<Classification, Vec<String>> = HashMap::new();
    classify_organisms(&mut organisms, &mut classifications, &food_chain);

    let mut trophic_levels: Vec<Vec<String>> = Vec::new();
    identify_trophic_levels(&mut organisms, &mut trophic_levels);

    let mut solution = String::new();
    arrange_solution(
        &mut solution,
        &mut organisms,
        &trophic_levels,
        &classifications,
    );
    solution
}

fn create_organism(organism: &str, organisms: &mut HashMap<String, Organism>) {
    organisms.entry(organism.to_string()).or_insert(Organism {
        name: organism.to_string(),
        eats: Vec::new(),
        eaten: Vec::new(),
        level: 0,
        classification: Classification::None,
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
            if let Some(organism) = organisms.get_mut(&organism) {
                organism.eaten.push(predator.clone());
                organism.eaten.sort_unstable();
            }
            if let Some(predator) = organisms.get_mut(&predator) {
                predator.eats.push(organism);
                predator.eats.sort_unstable();
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

fn classify_organisms(
    organisms: &mut HashMap<String, Organism>,
    classifications: &mut HashMap<Classification, Vec<String>>,
    food_chain: &HashMap<i32, HashSet<String>>,
) {
    classifications
        .entry(Classification::Omnivore)
        .or_insert(Vec::new());
    classifications
        .entry(Classification::Carnivore)
        .or_insert(Vec::new());
    classifications
        .entry(Classification::Herbivore)
        .or_insert(Vec::new());
    classifications
        .entry(Classification::None)
        .or_insert(Vec::new());

    for (name, organism) in organisms.iter_mut() {
        let mut herbivore = false;
        let mut carnivore = false;
        for eaten in &organism.eats {
            if let Some(producers) = food_chain.get(&0) {
                if producers.contains(eaten) {
                    herbivore = true;
                } else {
                    carnivore = true;
                }
            }
        }

        if carnivore && herbivore {
            organism.classification = Classification::Omnivore;
        } else if carnivore {
            organism.classification = Classification::Carnivore;
        } else if herbivore {
            organism.classification = Classification::Herbivore;
        } else {
            organism.classification = Classification::None;
        }
        let vec = classifications.get_mut(&organism.classification).unwrap();
        vec.push(name.to_string());
    }
    for (_classification, vec) in classifications {
        vec.sort_unstable();
    }
}

fn identify_trophic_levels(
    organisms: &mut HashMap<String, Organism>,
    trophic_levels: &mut Vec<Vec<String>>,
) {
    trophic_levels.resize(4, Vec::<String>::new());
    let mut eaters_max = 0;
    let mut tastiest_max = 0;
    for (name, organism) in organisms.iter() {
        // Apex predators, have no predators.
        if organism.eaten.len() == 0 {
            trophic_levels[0].push(name.to_string());
        }
        // Producers, make their own food.
        if organism.eats.len() == 0 {
            trophic_levels[1].push(name.to_string());
        }
        // Most flexible eaters.
        if organism.eats.len() >= eaters_max {
            if organism.eats.len() > eaters_max {
                trophic_levels[2].clear();
            }
            trophic_levels[2].push(name.to_string());
            eaters_max = organism.eats.len();
        }
        // Tastiest
        if organism.eaten.len() >= tastiest_max {
            if organism.eaten.len() > tastiest_max {
                trophic_levels[3].clear();
            }
            trophic_levels[3].push(name.to_string());
            tastiest_max = organism.eaten.len();
        }
    }
    for level in trophic_levels {
        level.sort_unstable();
    }
}
