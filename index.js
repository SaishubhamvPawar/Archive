//import express onject from "express" module
import express from "express";

//import Body Parser object from "Body Parser" module
import bodyParser from 'body-parser';

//import Axios object from "Axios" module
import axios from "axios";

import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



dotenv.config();

//Create Express Application from express object
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


//Define port number
const port = 3000;

// Serves static files from the "public" folder.
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

//Handles the "/" GET request
app.get("/" , (req,res) =>{
    res.render("index");
});

let mDefHeroes = [620,201,470,346,149,659,332,226,106,717,196,213,107,579,30];
let mDefVillains = [299,391,222,655,443,414,225,687,141,479,162,680,550,35,232];
let dDefHeroes = [70,644,720,265,306,298,38,156,491,546,432,194,643,224,367];
let dDefVillains = [370, 405, 172, 528, 601, 93, 105, 95, 216, 538, 136, 204, 60, 242, 609];
// const api_key = process.env.API_KEY;
// const API_URL = process.env.;
const GITAPI_URL = process.env.GITAPI_URL;
//Handles Marvel.ejs request and Axios get request

// Stores the fetched Marvel heroes in memory.
// This acts as a cache so the API is not called on every page request.
let marvelHeroes = [];
let marvelHeroesImages = [];
// Function to fetch the default Marvel heroes when the server starts.
async function loadMarvelHeroes() {

    const requests = mDefHeroes.map(id =>
        axios.get(`${GITAPI_URL}/id/${id}.json`)
    );

    const responses = await Promise.allSettled(requests);

    marvelHeroes = responses
        .filter(r => r.status === "fulfilled")
        .map(r => r.value.data);

    marvelHeroesImages = marvelHeroes.map(hero => hero.images.lg);

    console.log(`Marvel Heroes Loaded: ${marvelHeroes.length}`);
}


// Fetch the hero data once when the server starts.
// loadMarvelHeroes().catch(console.error);;


let marvelVillains = [];
let marvelVillainsImages = [];
// Function to fetch the default Marvel heroes when the server starts.
async function loadMarvelVillains() {

    const requests = mDefVillains.map(id =>
        axios.get(`${GITAPI_URL}/id/${id}.json`)
    );

    const responses = await Promise.allSettled(requests);

    marvelVillains = responses
        .filter(r => r.status === "fulfilled")
        .map(r => r.value.data);

    marvelVillainsImages = marvelVillains.map(villain => villain.images.lg);

    console.log(`Marvel Villains Loaded: ${marvelVillains.length}`);
}


// Fetch the hero data once when the server starts.
// loadMarvelVillains().catch(console.error);

// Handles requests to the Marvel page.
app.get("/marvel", async (req, res) => {

     try {

        if (marvelHeroes.length === 0) {
            await loadMarvelHeroes();
        }

        if (marvelVillains.length === 0) {
            await loadMarvelVillains();
        }

        res.render("marvel", {
            heroes: marvelHeroes,
            heroImg: marvelHeroesImages,
            villains: marvelVillains,
            villainImg: marvelVillainsImages
        });

    } catch (err) {

        console.error(err);
        res.status(500).send(err.message);

    }

});


app.post("/marvel-character" , async (req,res) =>{
    try {

        const id = req.body.id;

        const [characterRes, imageRes] = await Promise.all([

            axios.get(`${GITAPI_URL}/id/${id}.json`),

            axios.get(`${GITAPI_URL}/id/${id}.json`)

        ]);

        const hero = characterRes.data;

        // Prevent accessing DC or other publishers
        if (!marvelCharacterSet.has(hero.name)) {
            return res.status(404).send("Marvel character not found.");
        }

        hero.images = imageRes.data.images;
        console.log(hero);

        res.render("marvel-character", {
            hero: hero
        });

    }
    catch (err) {

        console.log(err.message);

        res.status(500).send("Unable to load character.");

    }
    
});

let totalChars = new Map();
const marvelPublishers = [
    "Marvel Comics",
    "Archangel",
    "Angel",
    "Giant-Man",
    "Ant-Man",
    "Tempest",
    "Angel Salvadore",
    "Toxin",
    "Anti-Venom",
    "Power Woman",
    "Deadpool",
    "Goliath"
];

const marvelCharacters = [
  "A-Bomb",
  "Abomination",
  "Abraxas",
  "Absorbing Man",
  "Agent Bob",
  "Agent Zero",
  "Air-Walker",
  "Ajax",
  "Angel Dust",
  "Angel Salvadore",
  "Annihilus",
  "Ant-Man",
  "Ant-Man II",
  "Anti-Venom",
  "Apocalypse",
  "Arachne",
  "Archangel",
  "Arclight",
  "Ardina",
  "Ares",
  "Ariel",
  "Armor",
  "Atlas",
  "Aurora",
  "Azazel",
  "Banshee",
  "Bantam",
  "Battlestar",
  "Beast",
  "Beta Ray Bill",
  "Beyonder",
  "Big Man",
  "Bird-Brain",
  "Bishop",
  "Black Bolt",
  "Black Cat",
  "Black Knight III",
  "Black Mamba",
  "Black Panther",
  "Black Widow",
  "Blackout",
  "Blackwing",
  "Blackwulf",
  "Blade",
  "Bling!",
  "Blink",
  "Blizzard II",
  "Blob",
  "Bloodaxe",
  "Bloodhawk",
  "Boom-Boom",
  "Bullseye",
  "Cable",
  "Callisto",
  "Cannonball",
  "Captain America",
  "Captain Britain",
  "Captain Marvel",
  "Carnage",
  "Century",
  "Chamber",
  "Changeling",
  "Cloak",
  "Colossus",
  "Copycat",
  "Cottonmouth",
  "Crystal",
  "Cyclops",
  "Dagger",
  "Daredevil",
  "Darkhawk",
  "Darkstar",
  "Dazzler",
  "Deathlok",
  "Demogoblin",
  "Destroyer",
  "Diamondback",
  "Doc Samson",
  "Doctor Doom",
  "Doctor Octopus",
  "Doctor Strange",
  "Domino",
  "Doppelganger",
  "Dormammu",
  "Drax the Destroyer",
  "Ego",
  "Electro",
  "Elektra",
  "Emma Frost",
  "Evil Deadpool",
  "Evilhawk",
  "Exodus",
  "Falcon",
  "Fallen One II",
  "Feral",
  "Fin Fang Foom",
  "Firebird",
  "Firelord",
  "Firestar",
  "Forge",
  "Franklin Richards",
  "Franklin Storm",
  "Frenzy",
  "Galactus",
  "Gambit",
  "Gamora",
  "Ghost Rider",
  "Gladiator",
  "Goblin Queen",
  "Gravity",
  "Green Goblin",
  "Green Goblin II",
  "Groot",
  "Havok",
  "Hawkeye",
  "Hawkeye II",
  "Hela",
  "Hellcat",
  "Hercules",
  "Hope Summers",
  "Hulk",
  "Human Torch",
  "Husk",
  "Hybrid",
  "Hydro-Man",
  "Hyperion",
  "Iceman",
  "Ink",
  "Invisible Woman",
  "Iron Fist",
  "Iron Man",
  "Iron Monger",
  "Jack of Hearts",
  "Jean Grey",
  "Jennifer Kale",
  "Jessica Jones",
  "John Wraith",
  "Jolt",
  "Jubilee",
  "Juggernaut",
  "Junkpile",
  "Justice",
  "Kang",
  "Kingpin",
  "Klaw",
  "Kraven II",
  "Kraven the Hunter",
  "Lady Deathstrike",
  "Leader",
  "Leech",
  "Legion",
  "Living Brain",
  "Living Tribunal",
  "Lizard",
  "Loki",
  "Longshot",
  "Luke Cage",
  "Luna",
  "MODOK",
  "Mach-IV",
  "Machine Man",
  "Magneto",
  "Magus",
  "Man-Thing",
  "Man-Wolf",
  "Mandarin",
  "Mantis",
  "Marvel Girl",
  "Maverick",
  "Medusa",
  "Meltdown",
  "Mephisto",
  "Mimic",
  "Mister Fantastic",
  "Mister Knife",
  "Mister Sinister",
  "Mockingbird",
  "Molten Man",
  "Moon Knight",
  "Moonstone",
  "Morlun",
  "Moses Magnum",
  "Mr Immortal",
  "Ms Marvel II",
  "Multiple Man",
  "Mysterio",
  "Mystique",
  "Namor",
  "Namora",
  "Namorita",
  "Nebula",
  "Negasonic Teenage Warhead",
  "Nick Fury",
  "Nightcrawler",
  "Northstar",
  "Nova",
  "Odin",
  "One-Above-All",
  "Onslaught",
  "Phoenix",
  "Plantman",
  "Polaris",
  "Professor X",
  "Psylocke",
  "Punisher",
  "Purple Man",
  "Pyro",
  "Quicksilver",
  "Quill",
  "Red Hulk",
  "Red Skull",
  "Rhino",
  "Rocket Raccoon",
  "Rogue",
  "Ronin",
  "Sabretooth",
  "Sage",
  "Sandman",
  "Sasquatch",
  "Scarlet Spider",
  "Scarlet Spider II",
  "Scarlet Witch",
  "Scorpia",
  "Scorpion",
  "Sebastian Shaw",
  "Sentry",
  "Shadow King",
  "Shadowcat",
  "Shang-Chi",
  "Shatterstar",
  "She-Hulk",
  "She-Thing",
  "Shocker",
  "Shriek",
  "Sif",
  "Silk",
  "Silver Surfer",
  "Silverclaw",
  "Siryn",
  "Skaar",
  "Snowbird",
  "Songbird",
  "Spider-Girl",
  "Spider-Gwen",
  "Spider-Man",
  "Spider-Woman",
  "Spider-Woman III",
  "Spyke",
  "Star-Lord",
  "Stardust",
  "Storm",
  "Sunspot",
  "Swarm",
  "Synch",
  "Taskmaster",
  "Tempest",
  "Thanos",
  "Thing",
  "Thor",
  "Thor Girl",
  "Thunderbird",
  "Thunderstrike",
  "Thundra",
  "Tiger Shark",
  "Tigra",
  "Tinkerer",
  "Toad",
  "Toxin",
  "Triton",
  "Ultragirl",
  "Ultron",
  "Utgard-Loki",
  "Vanisher",
  "Venom",
  "Venom II",
  "Venom III",
  "Venompool",
  "Vulture",
  "Walrus",
  "War Machine",
  "Warlock",
  "Warpath",
  "Wasp",
  "Watcher",
  "Winter Soldier",
  "Wolfsbane",
  "Wolverine",
  "Wonder Man",
  "Wyatt Wingfoot",
  "X-23",
  "X-Man",
  "Yellowjacket",
  "Yellowjacket II",
  "Ymir"
];

const marvelCharacterSet = new Set(marvelCharacters);

const neutralMarvelClassification = new Map([

    // Neutral Heroes / Anti-Heroes
    ["Deadpool", "hero"],
    ["Venom", "hero"],
    ["Silver Surfer", "hero"],
    ["Sentry", "hero"],
    ["Cable", "hero"],
    ["X-23", "hero"],
    ["Elektra", "hero"],
    ["Namor", "hero"],
    ["Prowler", "hero"],
    ["Red Hulk", "hero"],

    // Neutral Villains / Anti-Villains
    ["Anti-Venom", "villain"],
    ["Bullseye", "villain"],
    ["Copycat", "villain"],
    ["Mystique", "villain"],
    ["Omega Red", "villain"],
    ["Sabretooth", "villain"],
    ["Venompool", "villain"],
    ["Carnage", "villain"],
    ["Black Cat", "villain"],
    ["Onslaught", "villain"]
]);

const dcPublishers = [
    "DC Comics",
    "Robin",
    "Batgirl",
    "Spoiler",
    "Superman",
    "Superboy",
    "Batwoman",
    "Red Robin",
    "Nightwing",
    "Oracle",
    "Red Hood",
    "Impulse",
    "Superman Prime One-Million",
    "Black Racer"
];

const dcCharacters = [
  "Abin Sur",
  "Adam Strange",
  "Alan Scott",
  "Alfred Pennyworth",
  "Amazo",
  "Animal Man",
  "Anti-Monitor",
  "Aquababy",
  "Aqualad",
  "Aquaman",
  "Atlas",
  "Atom Girl",
  "Atom II",
  "Azrael",
  "Bane",
  "Batgirl",
  "Batgirl IV",
  "Batgirl VI",
  "Batman",
  "Batman II",
  "Batwoman V",
  "Beast Boy",
  "Big Barda",
  "Bizarro",
  "Black Adam",
  "Black Canary",
  "Black Flash",
  "Black Lightning",
  "Black Manta",
  "Blue Beetle III",
  "Brainiac",
  "Brainiac 5",
  "Bumblebee",
  "Bushido",
  "Captain Atom",
  "Captain Cold",
  "Captain Marvel",
  "Captain Marvel II",
  "Catwoman",
  "Cheetah",
  "Cheetah III",
  "Citizen Steel",
  "Clock King",
  "Cyborg",
  "Cyborg Superman",
  "Darkseid",
  "Deadman",
  "Deadshot",
  "Deathstroke",
  "Doctor Fate",
  "Doomsday",
  "Dr Manhattan",
  "Elongated Man",
  "Enchantress",
  "Etrigan",
  "Faora",
  "Firestorm",
  "Flash",
  "Flash II",
  "Flash III",
  "Flash IV",
  "General Zod",
  "Giganta",
  "Gog",
  "Gorilla Grodd",
  "Green Arrow",
  "Guy Gardner",
  "Hal Jordan",
  "Harley Quinn",
  "Hawk",
  "Hawkgirl",
  "Heat Wave",
  "Huntress",
  "Indigo",
  "Impulse",
  "Isis",
  "Jessica Cruz",
  "John Constantine",
  "Joker",
  "Kid Flash",
  "Killer Croc",
  "Killer Frost",
  "Kilowog",
  "King Shark",
  "Krypto",
  "Kyle Rayner",
  "Lex Luthor",
  "Light Lass",
  "Lightning Lad",
  "Lightning Lord",
  "Lobo",
  "Magog",
  "Man-Bat",
  "Martian Manhunter",
  "Match",
  "Maxima",
  "Mera",
  "Metallo",
  "Metron",
  "Micro Lad",
  "Misfit",
  "Miss Martian",
  "Mister Freeze",
  "Mister Mxyzptlk",
  "Mister Zsasz",
  "Nightwing",
  "Offspring",
  "Oracle",
  "Osiris",
  "Ozymandias",
  "Parademon",
  "Penguin",
  "Phantom Girl",
  "Plastic Man",
  "Plastique",
  "Poison Ivy",
  "Power Girl",
  "Professor Zoom",
  "Question",
  "Ra's Al Ghul",
  "Raven",
  "Ray",
  "Red Arrow",
  "Red Hood",
  "Red Robin",
  "Red Tornado",
  "Rick Flag",
  "Riddler",
  "Rip Hunter",
  "Robin",
  "Robin II",
  "Robin III",
  "Robin V",
  "Robin VI",
  "Rorschach",
  "Scarecrow",
  "Shadow Lass",
  "Simon Baz",
  "Sinestro",
  "Siren",
  "Sobek",
  "Solomon Grundy",
  "Space Ghost",
  "Spectre",
  "Speedy",
  "Starfire",
  "Stargirl",
  "Static",
  "Steel",
  "Steppenwolf",
  "Superboy",
  "Superboy-Prime",
  "Supergirl",
  "Superman",
  "Swamp Thing",
  "The Comedian",
  "Triplicate Girl",
  "Two-Face",
  "Vibe",
  "Vixen",
  "Warp",
  "White Canary",
  "Wildfire",
  "Wonder Girl",
  "Wonder Woman",
  "Zatanna",
  "Zoom"
];

const dcCharacterSet = new Set(dcCharacters);

const neutralDCClassification = new Map([
    ["Raven", "hero"],
    ["Red Hood", "hero"],
    ["Lobo", "hero"],
    ["Catwoman", "hero"],
    ["Huntress", "hero"],
    ["John Constantine", "hero"],
    ["Etrigan", "hero"],
    ["Orion", "hero"],
    ["Rorschach", "hero"],
    ["Spectre", "hero"],
    ["Swamp Thing", "hero"],

    ["Bizarro", "villain"],
    ["Sinestro", "villain"],
    ["Captain Cold", "villain"],
    ["Harley Quinn", "villain"],
    ["Killer Frost", "villain"],
    ["Poison Ivy", "villain"]
]);

const excludedDCCharacters = [78, 170, 382];

let idList = []
let totalMarvelHeroes = []
let totalMarvelVillains = []
let totalDCHeroes = [];
let totalDCVillains = [];
async function fetchAllChars(){
    
        const charRequest = await axios.get(`${GITAPI_URL}/all.json`)
        idList = charRequest.data;
        console.log("All Characters Fetched");

        totalMarvelHeroes = idList.filter(hero =>
            marvelCharacterSet.has(hero.name) &&
            (
                hero.biography.alignment === "good" ||
                neutralMarvelClassification.get(hero.name) === "hero"
            )
        );

        totalMarvelVillains = idList.filter(vil =>
            marvelCharacterSet.has(vil.name) &&
            (
                vil.biography.alignment === "bad" ||
                neutralMarvelClassification.get(vil.name) === "villain"
            )
        );

        totalDCHeroes = idList.filter(hero =>
            dcCharacterSet.has(hero.name) &&
            (
                hero.biography.alignment === "good" ||
                neutralDCClassification.get(hero.name) === "hero"
            ) &&
            !excludedDCCharacters.includes(hero.id)
        );

        totalDCVillains = idList.filter(vil =>
            dcCharacterSet.has(vil.name) &&
            (
                vil.biography.alignment === "bad" ||
                neutralDCClassification.get(vil.name) === "villain"
            ) &&
            !excludedDCCharacters.includes(vil.id)
        );
}

// fetchAllChars().catch(console.error);




// marvel-heroes.ejs request
app.get("/marvel-heroes" , async (req,res) =>{
    try {

        if (totalMarvelHeroes.length === 0) {
        await fetchAllChars();
}

       

        const page = parseInt(req.query.page) || 1;
        
        const limit = 10;
        
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const heroes = totalMarvelHeroes.slice(startIndex, endIndex);

        const totalPages = Math.ceil(totalMarvelHeroes.length / limit);

        res.render("marvel-heroes" , {heroes:heroes , currentPage :page , totalPages : totalPages});

    } catch (error) {

        
        res.status(404).send(error.response?.data || error.message);
    }
    
});

// marvel-villains.ejs request 
app.get("/marvel-villains" , async (req,res) =>{
    try {

        if (totalMarvelVillains.length === 0) {
            await fetchAllChars();
        }
        

        const page = parseInt(req.query.page) || 1;
        
        const limit = 10;
        
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const villains = totalMarvelVillains.slice(startIndex, endIndex);

        const totalPages = Math.ceil(totalMarvelVillains.length / limit);

        res.render("marvel-villains" , {heroes:villains , currentPage :page , totalPages : totalPages});

    } catch (error) {

        
        res.status(404).send(error.response?.data || error.message);
    }
});

//Handles DC.ejs request and Axios get request

// Stores the fetched Marvel heroes in memory.
// This acts as a cache so the API is not called on every page request.
let dcHeroes = [];
let dcHeroesImages = [];
// Function to fetch the default Marvel heroes when the server starts.
async function loadDCHeroes() {

    const requests = dDefHeroes.map(id =>
        axios.get(`${GITAPI_URL}/id/${id}.json`)
    );

    const responses = await Promise.allSettled(requests);

    dcHeroes = responses
        .filter(r => r.status === "fulfilled")
        .map(r => r.value.data);

    dcHeroesImages = dcHeroes.map(hero => hero.images.lg);

    console.log(`DC Heroes Loaded: ${dcHeroes.length}`);
}


// Fetch the hero data once when the server starts.
// loadDCHeroes().catch(console.error);


let dcVillains = [];
let dcVillainsImages = [];
// Function to fetch the default Marvel heroes when the server starts.
async function loadDCVillains() {

    const requests = dDefVillains.map(id =>
        axios.get(`${GITAPI_URL}/id/${id}.json`)
    );

    const responses = await Promise.allSettled(requests);

    dcVillains = responses
        .filter(r => r.status === "fulfilled")
        .map(r => r.value.data);

    dcVillainsImages = dcVillains.map(villain => villain.images.lg);

    console.log(`DC Villains Loaded: ${dcVillains.length}`);
}


// Fetch the hero data once when the server starts.
// loadDCVillains().catch(console.error);

app.get("/dc" , async (req,res)=>{
     // Log whenever the route is accessed.
    console.log("DC route hit");

    try {

        if (dcHeroes.length === 0) {
            await loadDCHeroes();
        }

        if (dcVillains.length === 0) {
            await loadDCVillains();
        }

        console.log("DC Heroes:", dcHeroes.length);
    console.log("DC Hero Images:", dcHeroesImages.length);
    console.log("DC Villains:", dcVillains.length);
    console.log("DC Villain Images:", dcVillainsImages.length);

        

        res.render("dc", {
            heroes: dcHeroes,
            heroImg: dcHeroesImages,
            villains: dcVillains,
            villainImg: dcVillainsImages
        });

    } catch (err) {

        console.error(err);
        res.status(500).send(err.message);

    }
});

// marvel-heroes.ejs request
app.get("/dc-heroes" , async (req,res) =>{
    try {
        if (totalDCHeroes.length === 0) {
            await fetchAllChars();
        }
       

        const page = parseInt(req.query.page) || 1;
        
        const limit = 10;
        
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const heroes = totalDCHeroes.slice(startIndex, endIndex);

        const totalPages = Math.ceil(totalDCHeroes.length / limit);
        

        res.render("dc-heroes" , {heroes:heroes , currentPage :page , totalPages : totalPages});

    } catch (error) {

        
        res.status(404).send(error.response?.data || error.message);
    }
    
});

// dc-villains.ejs request 
app.get("/dc-villains" , async (req,res) =>{
    try {
        
        if (totalDCVillains.length === 0) {
            await fetchAllChars();
        }

        const page = parseInt(req.query.page) || 1;
        
        const limit = 10;
        
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const villains = totalDCVillains.slice(startIndex, endIndex);

        const totalPages = Math.ceil(totalDCVillains.length / limit);

        res.render("dc-villains" , {heroes:villains , currentPage :page , totalPages : totalPages});

    } catch (error) {

        
        res.status(404).send(error.response?.data || error.message);
    }
});

//Dc Character Request Handling
app.post("/dc-character" , async (req,res) =>{
    try {

        const id = req.body.id;

        const [characterRes, imageRes] = await Promise.all([

            axios.get(`${GITAPI_URL}/id/${id}.json`),

            axios.get(`${GITAPI_URL}/id/${id}.json`)

        ]);

        const hero = characterRes.data;

        // Prevent accessing DC or other publishers
        if (!dcCharacterSet.has(hero.name)) {
            return res.status(404).send("DC character not found.");
        }

        hero.images = imageRes.data.images;
        console.log(hero);

        res.render("dc-character", {
            hero: hero
        });

    }
    catch (err) {

        console.log(err.message);

        res.status(500).send("Unable to load character.");

    }
    
});

app.post("/search", async (req, res) => {

    if (idList.length === 0) {
        await fetchAllChars();
    }

    const search = req.body["search-content"].trim().toLowerCase();

    // Only allow characters that belong to your Marvel or DC collections
    const allowedCharacters = idList.filter(hero =>
        marvelCharacterSet.has(hero.name) ||
        dcCharacterSet.has(hero.name)
    );
    console.log("SEARCH ROUTE HIT");

    const results = allowedCharacters
    
        .filter(hero =>
            hero.name.toLowerCase().includes(search) ||
            hero.biography.fullName.toLowerCase().includes(search)
        )
        .map(hero => {

            const theme = marvelCharacterSet.has(hero.name)
                ? "marvel-card"
                : "dc-card";

            const route = marvelCharacterSet.has(hero.name)
                ? "/marvel-character"
                : "/dc-character";

            return {
                ...hero,
                theme,
                route
            };

        });

    res.render("search", {
        query: req.body["search-content"],
        results
    });

});
//Start server
if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

export default app;





