//import express onject from "express" module
import express from "express";

//import Body Parser object from "Body Parser" module
import bodyParser from 'body-parser';

//import Axios object from "Axios" module
import axios from "axios";

import dotenv from "dotenv";

dotenv.config();

//Create Express Application from express object
const app = express();

//Define port number
const port = 3000;

// Serves static files from the "public" folder.
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

//Handles the "/" GET request
app.get("/" , (req,res) =>{
    res.render("index.ejs");
});

let mDefHeroes = [620,201,470,346,149,659,332,226,106,717,196,213,107,579,30];
let mDefVillains = [299,391,222,655,443,414,225,687,141,479,162,680,550,35,232];
let dDefHeroes = [70,644,720,265,306,298,38,156,491,546,432,194,643,224,367];
let dDefVillains = [370, 405, 172, 528, 601, 93, 105, 95, 216, 538, 136, 204, 60, 242, 609];
const api_key = process.env.API_KEY;
const API_URL = process.env.API_URL
const GITAPI_URL = process.env.GITAPI_URL;
//Handles Marvel.ejs request and Axios get request

// Stores the fetched Marvel heroes in memory.
// This acts as a cache so the API is not called on every page request.
let marvelHeroes = [];
let marvelHeroesImages = [];
// Function to fetch the default Marvel heroes when the server starts.
async function loadMarvelHeroes() {

    const requests = mDefHeroes.map(id =>
        axios.get(`${API_URL}${api_key}/${id}`)
    ); 
    const requestsImg = mDefHeroes.map(id =>
        axios.get(`${GITAPI_URL}/id/${id}.json`)
    ); 

    
    const responses = await Promise.all(requests);
    const responsesImg = await Promise.all(requestsImg);
   
    marvelHeroes = responses.map(response => response.data);
    marvelHeroesImages = responsesImg.map(response => response.data.images.lg);
   
    console.log("Marvel heroes loaded successfully!");
}


// Fetch the hero data once when the server starts.
loadMarvelHeroes();


let marvelVillains = [];
let marvelVillainsImages = [];
// Function to fetch the default Marvel heroes when the server starts.
async function loadMarvelVillains() {

    const vilrequests = mDefVillains.map(id =>
        axios.get(`${API_URL}${api_key}/${id}`)
    ); 
    const vilrequestsImg = mDefVillains.map(id =>
        axios.get(`${GITAPI_URL}/id/${id}.json`)
    ); 

    
    const vilresponses = await Promise.all(vilrequests);
    const vilresponsesImg = await Promise.all(vilrequestsImg);
   
    marvelVillains = vilresponses.map(response => response.data);
    marvelVillainsImages = vilresponsesImg.map(response => response.data.images.lg);
   
    console.log("Marvel villains loaded successfully!");
}


// Fetch the hero data once when the server starts.
loadMarvelVillains();

// Handles requests to the Marvel page.
app.get("/marvel", async (req, res) => {

    // Log whenever the route is accessed.
    console.log("Marvel route hit");

    try {

        // Render the Marvel page using the cached hero data.
        // Since the data is already stored in memory,
        // no additional API requests are required,
        // resulting in much faster page loading.
        
        res.render("marvel.ejs", {
            heroes: marvelHeroes , heroImg: marvelHeroesImages , villains: marvelVillains , villainImg: marvelVillainsImages
        });

    } catch (error) {

        // Handle any unexpected errors while rendering the page.
        res.status(404).send(error.response?.data || error.message);
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

        res.render("marvel-character.ejs", {
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

fetchAllChars();




// marvel-heroes.ejs request
app.get("/marvel-heroes" , (req,res) =>{
    try {

       

        const page = parseInt(req.query.page) || 1;
        
        const limit = 10;
        
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const heroes = totalMarvelHeroes.slice(startIndex, endIndex);

        const totalPages = Math.ceil(totalMarvelHeroes.length / limit);

        res.render("marvel-heroes.ejs" , {heroes:heroes , currentPage :page , totalPages : totalPages});

    } catch (error) {

        
        res.status(404).send(error.response?.data || error.message);
    }
    
});

// marvel-villains.ejs request 
app.get("/marvel-villains" , (req,res) =>{
    try {
        

        const page = parseInt(req.query.page) || 1;
        
        const limit = 10;
        
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const villains = totalMarvelVillains.slice(startIndex, endIndex);

        const totalPages = Math.ceil(totalMarvelVillains.length / limit);

        res.render("marvel-villains.ejs" , {heroes:villains , currentPage :page , totalPages : totalPages});

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
        axios.get(`${API_URL}${api_key}/${id}`)
    ); 
    const requestsImg = dDefHeroes.map(id =>
        axios.get(`${GITAPI_URL}/id/${id}.json`)
    ); 

    
    const responses = await Promise.all(requests);
    const responsesImg = await Promise.all(requestsImg);
   
    dcHeroes = responses.map(response => response.data);
    dcHeroesImages = responsesImg.map(response => response.data.images.lg);
   
    console.log("DC heroes loaded successfully!");
}


// Fetch the hero data once when the server starts.
loadDCHeroes();


let dcVillains = [];
let dcVillainsImages = [];
// Function to fetch the default Marvel heroes when the server starts.
async function loadDCVillains() {

    const vilrequests = dDefVillains.map(id =>
        axios.get(`${API_URL}${api_key}/${id}`)
    ); 
    const vilrequestsImg = dDefVillains.map(id =>
        axios.get(`${GITAPI_URL}/id/${id}.json`)
    ); 

    
    const vilresponses = await Promise.all(vilrequests);
    const vilresponsesImg = await Promise.all(vilrequestsImg);
   
    dcVillains = vilresponses.map(response => response.data);
    dcVillainsImages = vilresponsesImg.map(response => response.data.images.lg);
   
    console.log("DC villains loaded successfully!");
}


// Fetch the hero data once when the server starts.
loadDCVillains();

app.get("/dc" , (req,res)=>{
     // Log whenever the route is accessed.
    console.log("DC route hit");

    try {

        // Render the Marvel page using the cached hero data.
        // Since the data is already stored in memory,
        // no additional API requests are required,
        // resulting in much faster page loading.
        
        res.render("dc.ejs", {
            heroes: dcHeroes , heroImg: dcHeroesImages , villains: dcVillains , villainImg: dcVillainsImages
        });

    } catch (error) {

        // Handle any unexpected errors while rendering the page.
        res.status(404).send(error.response?.data || error.message);
    }
});

// marvel-heroes.ejs request
app.get("/dc-heroes" , (req,res) =>{
    try {

       

        const page = parseInt(req.query.page) || 1;
        
        const limit = 10;
        
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const heroes = totalDCHeroes.slice(startIndex, endIndex);

        const totalPages = Math.ceil(totalDCHeroes.length / limit);
        

        res.render("dc-heroes.ejs" , {heroes:heroes , currentPage :page , totalPages : totalPages});

    } catch (error) {

        
        res.status(404).send(error.response?.data || error.message);
    }
    
});

// dc-villains.ejs request 
app.get("/dc-villains" , (req,res) =>{
    try {
        

        const page = parseInt(req.query.page) || 1;
        
        const limit = 10;
        
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const villains = totalDCVillains.slice(startIndex, endIndex);

        const totalPages = Math.ceil(totalDCVillains.length / limit);

        res.render("dc-villains.ejs" , {heroes:villains , currentPage :page , totalPages : totalPages});

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

        res.render("dc-character.ejs", {
            hero: hero
        });

    }
    catch (err) {

        console.log(err.message);

        res.status(500).send("Unable to load character.");

    }
    
});

app.post("/search", (req, res) => {

    const search = req.body["search-content"].trim().toLowerCase();

    const results = idList
        .filter(hero =>
            hero.name.toLowerCase().includes(search) ||
            hero.biography.fullName.toLowerCase().includes(search)
        )
        .map(hero => {

            let theme = "dc-card";
            let route = "/dc-character";

            if (marvelCharacterSet.has(hero.name)) {

                theme = "marvel-card";
                route = "/marvel-character";

            }
            else if (dcCharacterSet.has(hero.name)) {

                theme = "dc-card";
                route = "/dc-character";

            }

            return {
                ...hero,
                theme,
                route
            };

        });

    res.render("search.ejs", {
        query: req.body["search-content"],
        results
    });

});
//Start server
if (process.env.VERCEL !== "1") {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

export default app;





