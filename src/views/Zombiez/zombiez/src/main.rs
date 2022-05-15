mod zombie_apocalypse;

fn main() {
    //let input = "Lion,Zebra\nZebra,Grass";
    let input = "Grasshopper,Terrestrial plants\nHarvest mouse,Grasshopper,Terrestrial plants\nHawk,Harvest mouse,Rat,Shrew,Vole\nHeron,Shrimp,Smelt\nMallard,Grasshopper,Terrestrial plants,Shrimp\nOwl,Rat,Sparrow,Mallard,Sandpiper\nRat,Grasshopper,Terrestrial plants,Sparrow\nSandpiper,Shrimp\nShrew,Grasshopper\nShrimp,Aquatic plants\nSmelt,Aquatic plants,Shrimp\nSparrow,Grasshopper,Terrestrial plants\nVole,Terrestrial plants,Grasshopper\n";
    println!("{}", zombie_apocalypse::solve(input));
}
