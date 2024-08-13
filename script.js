// Variables from html
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');
const HighAndLowestEl = document.getElementById('HighAndLowest')
const hourlyForecastEl = document.getElementById('hourly-forecast');
const container = document.getElementById('container');
var all = document.getElementsByTagName('*');
//const tempMetric = document.getElementById('togBtn').value;

let units = 'Imperial';

//var allElements = document.querySelectorAll('*');

// Days of the week list
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Months of the year list
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// API key
const API_KEY = '75dd295c1c823ffe3f77dcfdfa77098d';

// This function is to get the user's current location weather data,
// it only works when the user enter the app for the first time and allows the API to track it's location.
// It works using the Latitude and Longitude that the users allows to use. It gets the weather data,
// then using the Latitude and Location a second API cathes the local hour , date and other information that the first API does not provide.
// The third fetch uses the Latitude and Longitude again to track the geolocation Data , this only provides the City Name and state.


function getWeatherData() {

    // console.log("Units " + units);
    navigator.geolocation.getCurrentPosition((success) => {

        let { latitude, longitude } = success.coords;

        // connects to the API // calls for the latitude & longitude // exclude information  Hour & minutes //  provides the temp in Imperial Units (F)
        fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&units=${units}&appid=${API_KEY}`).then(res => res.json()).then(data => {

            // Displays the data in the console // Displaying the data in the console to then use it in the front end. 
            console.log(data);

            // This second API connection finds the local time using the lat and lon variables
            fetch(`https://api.ipgeolocation.io/timezone?apiKey=57636760429244f78be9410273312537&lat=${latitude}&long=${longitude}`)
                .then(res => res.json())
                .then(locationData => {
                    console.log(locationData)

                    fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`)
                        .then(res => res.json())
                        .then(geolocationData => {

                            // Display the geolocation data in the console
                            console.log(geolocationData[0]);
                            showWeatherData(data, geolocationData, locationData);
                        })

                })

        })
    })

};

// Call the function to get the user's current location weather data.
getWeatherData();

//This ensures that the script runs only after the entire HTML document has been loaded and parsed. It waits until the DOM is fully ready before executing the contained code.
document.addEventListener('DOMContentLoaded', function () {
    const searchBtn = document.getElementById("search-Btn");
    const searchBar = document.getElementById("search-bar");

// List of some world cities *could be done with a city API* 
    var cities = [
        "Tokyo","Havana", "Delhi", "Shanghai", "Sao Paulo", "Mumbai", "Cairo", "Beijing",
        "Dhaka", "Mexico City", "Osaka", "Karachi", "Chongqing", "Istanbul",
        "Buenos Aires", "Kolkata", "Lagos", "Kinshasa", "Manila", "Tianjin",
        "Guangzhou", "Rio de Janeiro", "Lahore", "Bangalore", "Moscow",
        "Shenzhen", "Chennai", "Bogota", "Jakarta", "Lima", "Bangkok",
        "Seoul", "Hyderabad", "London", "Tehran", "Chicago", "Chengdu",
        "Nanjing", "Wuhan", "Ho Chi Minh City", "Luanda", "Ahmedabad",
        "Kuala Lumpur", "Hong Kong", "Xian", "Dongguan", "Hangzhou",
        "Foshan", "Shenyang", "Riyadh", "Baghdad", "Santiago", "Surat",
        "Madrid", "Suzhou", "Pune", "Harbin", "Houston", "Dallas",
        "Toronto", "Dar es Salaam", "Miami", "Belo Horizonte", "Singapore",
        "Philadelphia", "Atlanta", "Fukuoka", "Khartoum", "Barcelona",
        "Johannesburg", "Saint Petersburg", "Qingdao", "Dalian",
        "Washington D.C.", "Yangon", "Alexandria", "Jinan", "Guadalajara",
        "Boston", "Melbourne", "Phoenix", "Nairobi", "Brasilia", "Cape Town",
        "Jeddah", "Monterrey", "Recife", "Medellin", "Boulder", "Denver",
        "Tel Aviv", "Fort Collins", "Tampa", "Vancouver", "Montreal", "Sydney",
        "Berlin", "Paris", "Rome", "Amsterdam", "Vienna", "Prague",
        "Budapest", "Warsaw", "Athens", "Dubai", "Copenhagen", "Stockholm",
        "Helsinki", "Lisbon", "Oslo", "Reykjavik", "Dublin", "Edinburgh",
        "Manchester", "Bristol", "New York", "Los Angeles", "Chicago",
        "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego",
        "Dallas", "San Jose", "Austin", "Jacksonville", "San Francisco",
        "Indianapolis", "Columbus", "Fort Worth", "Charlotte", "Seattle",
        "Denver", "El Paso", "Washington D.C.", "Boston", "Detroit",
        "Nashville", "Portland", "Memphis", "Oklahoma City", "Las Vegas",
        "Louisville", "Baltimore", "Milwaukee", "Albuquerque", "Tucson",
        "Fresno", "Sacramento", "Kansas City", "Long Beach", "Mesa",
        "Atlanta", "Colorado Springs", "Virginia Beach", "Raleigh", "Omaha",
        "Miami", "Oakland", "Minneapolis", "Tulsa", "Wichita", "New Orleans",
        "Arlington", "Cleveland", "Bakersfield", "Tampa", "Aurora", "Honolulu",
        "Anaheim", "Santa Ana", "Corpus Christi", "Riverside", "St. Louis",
        "Dublin", "Belfast", "Cork", "Galway", "Limerick", "Waterford",
        "Derry", "Bangor", "Armagh", "Killarney", "Athlone", "Ennis",
        "Letterkenny", "Tralee", "Sligo", "Drogheda", "Brussels", "Antwerp",
        "Ghent", "Bruges", "Liege", "Charleroi", "Namur", "Leuven",
        "Mechelen", "Ostend", "Mons", "Tournai", "Hasselt", "Sofia",
        "Plovdiv", "Varna", "Burgas", "Ruse", "Stara Zagora", "Pleven",
        "Sliven", "Dobrich", "Shumen", "Pazardzhik", "Blagoevgrad", "Veliko Tarnovo",
        "Haskovo", "Rousse", "Yambol", "Kazanlak", "Gaborone", "Francistown",
        "Molepolole", "Serowe", "Selibe Phikwe", "Maun", "Mahalapye", "Lobatse",
        "Kanye", "Ramotswa", "Thamaga", "Mogoditshane", "Gaborone", "Jwaneng",
        "Lobatse", "Selibe Phikwe", "Lusaka", "Ndola", "Kitwe", "Kabwe",
        "Chingola", "Mufulira", "Luanshya", "Livingstone", "Kasama", "Chipata",
        "Solwezi", "Chililabombwe", "Mansa", "Mpika", "Kafue", "Kalulushi",
        "Mongu", "Kasumbalesa", "Kawambwa", "Kapiri Mposhi", "Chinsali", "Samfya",
        "Mumbwa", "Mazabuka", "Choma", "Monze", "Nyimba", "Petauke",
        "Serenje", "Siavonga", "Chadiza", "Lundazi", "Kabwe", "Luanshya",
        "Masaiti", "Mufumbwe", "Chavuma", "Kawambwa", "Luwingu", "Mbala",
        "Mpulungu", "Kasama", "Isoka", "Kaputa", "Kabompo", "Mwinilunga",
        "Mongu", "Sesheke", "Livingstone", "Kazungula", "Zambezi", "Katima Mulilo",
        "Rundu", "Oshakati", "Walvis Bay", "Swakopmund", "Otjiwarongo", "Okahandja",
        "Grootfontein", "Rehoboth", "Katima Mulilo", "Tsumeb", "Keetmanshoop", "Lüderitz",
        "Mariental", "Outjo", "Ondangwa", "Ongwediva", "Opuwo", "Usakos",
        "Karibib", "Otavi", "Windhoek", "Bhisho", "Buffalo City", "Emalahleni",
        "Mangaung", "Nelspruit", "Polokwane", "Rustenburg", "Tshwane", "Boksburg",
        "Alberton", "Germiston", "Benoni", "Centurion", "Vanderbijlpark", "Kempton Park",
        "Roodepoort", "Umlazi", "Pinetown", "Pietermaritzburg", "Newcastle", "Richards Bay",
        "Vryheid", "Port Shepstone", "Sasolburg", "Carletonville", "Witbank", "Nelspruit",
        "Rustenburg", "Thohoyandou", "Bethal", "Grahamstown", "Klerksdorp", "Welkom",
        "Springbok", "Cape Town", "Port Elizabeth", "East London", "Durban", "Johannesburg",
        "Pretoria", "Bloemfontein", "Bredasdorp", "Ladysmith", "Kimberley", "Mossel Bay",
        "Paarl", "Mthatha", "George", "Upington", "Vryburg", "Brits",
        "Volksrust", "Piet Retief", "Lydenburg", "Middelburg", "Parys", "Bethlehem",
        "Harrismith", "Standerton", "Swellendam", "Colesberg", "Graaff-Reinet", "Cradock",
        "Grahamstown", "Uitenhage", "Queenstown", "Aliwal North", "De Aar", "Beaufort West",
        "Oudtshoorn", "Knysna", "George", "Mossel Bay", "Plettenberg Bay", "Port St. Johns",
        "Port Edward", "Margate", "Hluhluwe", "Saint Lucia", "Sodwana Bay", "Kosi Bay",
        "Eshowe", "Richards Bay", "Vryheid", "Ulundi", "Piet Retief", "Mkhondo",
        "Embalenhle", "Ermelo", "Delmas", "Barberton", "Mbabane", "Manzini",
        "Big Bend", "Mhlume", "Nhlangano", "Siteki", "Lobamba", "Simunye", "Johannesburg", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein",
        "Mbombela", "Rustenburg", "Polokwane", "Kimberley", "Pietermaritzburg",
        "Mahikeng", "Vanderbijlpark", "Witbank", "Welkom", "Sasolburg", "George",
        "Uitenhage", "Aliwal North", "East London", "Grahamstown", "Queenstown",
        "Upington", "Mossel Bay", "Knysna", "Plettenberg Bay", "Stellenbosch",
        "Paarl", "Franschhoek", "Ceres", "Robertson", "Swellendam", "Worcester",
        "Malmesbury", "Beaufort West", "Springbok", "Port Nolloth", "Ladysmith",
        "Ulundi", "Vryheid", "Richards Bay", "Empangeni", "Kokstad", "Mthatha",
        "Vryburg", "Kuruman", "Postmasburg", "Aliwal North", "Middelburg", "Colesberg",
        "De Aar", "Springfontein", "Cradock", "Graaff-Reinet", "Port St. Johns",
        "Somerset East", "Mount Frere", "Elliot", "Dordrecht", "Steytlerville",
        "Willowmore", "Aberdeen", "Kirkwood", "Addo", "Hankey", "Jeffreys Bay",
        "Stormsrivier", "Port Edward", "Umzimkulu", "Bulwer", "Underberg", "Estcourt",
        "Greytown", "Richmond", "Ixopo", "Port Shepstone", "Scottburgh", "Kokstad",
        "Mandeni", "Eshowe", "Melmoth", "Nongoma", "Vryheid", "Paulpietersburg",
        "Piet Retief", "Amsterdam", "Carolina", "Barberton", "Mbombela", "White River",
        "Sabie", "Hazyview", "Graskop", "Lydenburg", "Belfast", "Badplaas",
        "Wakkerstroom", "Volksrust", "Bethal", "Standerton", "Greylingstad", "Meyerton",
        "Sasolburg", "Vereeniging", "Alberton", "Edenvale", "Kempton Park", "Benoni",
        "Brakpan", "Springs", "Heidelberg", "Meyerton", "Sasolburg", "Bethlehem",
        "Senekal", "Ficksburg", "Fouriesburg", "Clarens", "Ladybrand", "Clocolan",
        "Thaba Nchu", "Botshabelo", "Phuthaditjhaba", "Harrismith", "Kroonstad", "Sasolburg",
        "Parys", "Frankfort", "Vrede", "Winburg", "Virginia", "Welkom",
        "Brandfort", "Theunissen", "Boshof", "Dealesville", "Jacobsdal", "Petrusburg",
        "Smithfield", "Reddersburg", "Zastron", "Wepener", "Bethulie", "Rouxville",
        "Philippolis", "Springfontein", "Fauresmith", "Jagersfontein", "Luckhoff", "Trompsburg",
        "Edenburg", "Koffiefontein", "Boshof", "Hennenman", "Kroonstad", "Riebeeckstad",
        "Odendaalsrus", "Welkom", "Virginia", "Theunissen", "Winburg", "Ventersburg",
        "Koppies", "Parys", "Vredefort", "Petrus Steyn", "Sasolburg", "Vanderbijlpark",
        "Meyerton", "Alberton", "Heidelberg", "Johannesburg", "Randburg", "Sandton",
        "Soweto", "Roodepoort", "Germiston", "Benoni", "Boksburg", "Brakpan",
        "Kempton Park", "Edenvale", "Springs", "Nigel", "Vereeniging", "Vanderbijlpark",
        "Sasolburg", "Meyerton", "Randfontein", "Krugersdorp", "Carletonville", "Westonaria",
        "Rustenburg", "Brits", "Hartbeespoort", "Magaliesburg", "Gauteng", "Pretoria",
        "Centurion", "Akasia", "Soshanguve", "Mabopane", "Atteridgeville", "Bronkhorstspruit",
        "Ekangala", "Cullinan", "Rayton", "KwaMhlanga", "Mamelodi", "Belfast",
        "Dullstroom", "Waterval Boven", "Lydenburg", "Machadodorp", "Belfast", "Nelspruit",
        "Barberton", "Kaapmuiden", "White River", "Sabie", "Graskop", "Hazyview",
        "Pilgrim's Rest", "Komatiepoort", "Malelane", "Mbombela", "Badplaas", "Carolina",
        "Middelburg", "Witbank", "Secunda", "Ermelo", "Amsterdam", "Carletonville",
        "Potchefstroom", "Klerksdorp", "Orkney", "Stilfontein", "Ventersdorp", "Rustenburg",
        "Brits", "Hartebeespoort", "Magaliesburg", "Randfontein", "Westonaria", "Gauteng",
        "Soweto", "Randburg", "Sandton", "Midrand", "Roodepoort", "Krugersdorp",
        "Lenasia", "Johannesburg", "Pretoria", "Centurion", "Akasia", "Mabopane",
        "Atteridgeville", "Bronkhorstspruit", "Ekangala", "Cullinan", "Rayton", "KwaMhlanga",
        "Mamelodi", "Delmas", "Meyerton", "Heidelberg", "Balfour", "Leandra",
        "Secunda", "Bethal", "Ermelo", "Amsterdam", "Carletonville", "Potchefstroom",
        "Klerksdorp", "Orkney", "Stilfontein", "Ventersdorp", "Rustenburg", "Mogwase",
        "Phokeng", "Thabazimbi", "Brits", "Rustenburg", "Hartebeespoort", "Magaliesburg",
        "Brits", "Hartbeespoort", "Ventersdorp", "Mogwase", "Phokeng", "Thabazimbi",
        "Modimolle", "Mokopane", "Musina", "Thabazimbi", "Lebowakgomo", "Polokwane",
        "Tzaneen", "Phalaborwa", "Malamulele", "Makhado", "Thohoyandou", "Mutale",
        "Giyani", "Thabazimbi", "Ellisras", "Mokopane", "Modimolle", "Belabela",
        "Mokopane", "Vaalwater", "Thabazimbi", "Lephalale", "Musina", "Bela-Bela",
        "Modimolle", "Vaalwater", "Thabazimbi", "Mokopane", "Musina", "Polokwane",
        "Lebowakgomo", "Bela-Bela", "Mokopane", "Thohoyandou", "Louis Trichardt", "Tzaneen",
        "Modimolle", "Phalaborwa", "Bela-Bela", "Thabazimbi", "Mokopane", "Lebowakgomo",
        "Thohoyandou", "Louis Trichardt", "Tzaneen", "Modimolle", "Phalaborwa", "Musina",
        "Polokwane", "Lebowakgomo", "Bela-Bela", "Mokopane", "Musina", "Tzaneen",
        "Modimolle", "Phalaborwa", "Lebowakgomo", "Bela-Bela", "Mokopane", "Musina",
        "Polokwane", "Lebowakgomo", "Thohoyandou", "Louis Trichardt", "Tzaneen", "Phalaborwa",
        "Bela-Bela", "Modimolle", "Thabazimbi", "Lebowakgomo", "Thohoyandou", "Louis Trichardt",
        "Musina", "Tzaneen", "Modimolle", "Phalaborwa", "Polokwane", "Thabazimbi",
        "Lebowakgomo", "Thohoyandou", "Louis Trichardt", "Musina", "Tzaneen", "Modimolle",
        "Phalaborwa", "Bela-Bela", "Lebowakgomo", "Thohoyandou", "Louis Trichardt", "Musina", "Phalaborwa", "Bela-Bela", "Modimolle", "Thabazimbi", "Lebowakgomo", "Thohoyandou",
        "Louis Trichardt", "Musina", "Tzaneen", "Polokwane", "Rustenburg", "Thabazimbi",
        "Lebowakgomo", "Thohoyandou", "Louis Trichardt", "Musina", "Tzaneen", "Modimolle",
        "Phalaborwa", "Bela-Bela", "Lebowakgomo", "Thohoyandou", "Louis Trichardt", "Musina",
        "Tzaneen", "Modimolle", "Phalaborwa", "Polokwane", "Bela-Bela", "Thabazimbi",
        "Lebowakgomo", "Thohoyandou", "Louis Trichardt", "Musina", "Tzaneen", "Modimolle",
        "Phalaborwa", "Polokwane", "Lebowakgomo", "Thohoyandou", "Louis Trichardt", "Musina",
        "Tzaneen", "Modimolle", "Phalaborwa", "Bela-Bela", "Lebowakgomo", "Thohoyandou",
        "Louis Trichardt", "Musina", "Tzaneen", "Modimolle", "Phalaborwa", "Polokwane",
        "Thabazimbi", "Lebowakgomo", "Thohoyandou", "Louis Trichardt", "Musina", "Tzaneen",
        "Modimolle", "Phalaborwa", "Bela-Bela", "Lebowakgomo", "Thohoyandou", "Louis Trichardt",
        "Musina", "Tzaneen", "Modimolle", "Phalaborwa", "Polokwane", "Lebowakgomo",
        "Thohoyandou", "Louis Trichardt", "Musina", "Tzaneen", "Modimolle", "Phalaborwa",
        "Bela-Bela", "Lebowakgomo", "Thohoyandou", "Louis Trichardt", "Musina", "Tzaneen",
        "Modimolle", "Phalaborwa", "Polokwane", "Lebowakgomo", "Thohoyandou", "Louis Trichardt",
        "Musina", "Tzaneen", "Modimolle", "Phalaborwa", "Bela-Bela", "Lebowakgomo",
        "Thohoyandou", "Louis Trichardt", "Musina", "Tzaneen", "Modimolle", "Phalaborwa",
        "Polokwane", "Thabazimbi", "Lebowakgomo", "Thohoyandou", "Louis Trichardt", "Musina",
        "Tzaneen", "Modimolle", "Phalaborwa", "Bela-Bela", "Lebowakgomo", "Thohoyandou",
        "Louis Trichardt", "Musina", "Tzaneen", "Modimolle", "Phalaborwa", "Polokwane",
        "Lebowakgomo", "Thohoyandou", "Louis Trichardt", "Musina", "Tzaneen", "Modimolle",
        "Phalaborwa", "Bela-Bela", "Lebowakgomo", "Thohoyandou", "Louis Trichardt", "Musina",
        "Tzaneen", "Modimolle", "Phalaborwa", "Polokwane", "Lebowakgomo", "Thohoyandou",
        "Louis Trichardt", "Musina", "Tzaneen", "Modimolle", "Phalaborwa", "Bela-Bela",
        "Lebowakgomo", "Thohoyandou", "Louis Trichardt", "Musina", "Tzaneen", "Modimolle",
        "Phalaborwa", "Polokwane", "Lebowakgomo", "Thohoyandou", "Louis Trichardt", "Musina",
        "Tzaneen", "Modimolle", "Phalaborwa", "Bela-Bela", "Lebowakgomo", "Thohoyandou",
        "Louis Trichardt", "Musina", "Tzaneen", "Modimolle", "Phalaborwa", "Polokwane",
        "Thabazimbi", "Lebowakgomo", "Thohoyandou", "Louis Trichardt", "Musina", "Tzaneen",
        "Modimolle", "Phalaborwa", "Bela-Bela", "Lebowakgomo", "Thohoyandou", "Louis Trichardt",
        "Musina", "Tzaneen", "Modimolle", "Phalaborwa", "Polokwane", "Lebowakgomo",
        "Thohoyandou", "Louis Trichardt", "Musina", "Tzaneen", "Modimolle", "Phalaborwa",
        "Bela-Bela", "Lebowakgomo", "Thohoyandou", "Louis Trichardt", "Musina", "Tzaneen",
        "Modimolle", "Phalaborwa", "Polokwane", "Lebowakgomo", "Thohoyandou", "Louis Trichardt",
        "Musina", "Tzaneen", "Modimolle", "Phalaborwa", "Bela-Bela", "Lebowakgomo",
        "Thohoyandou", "Louis Trichardt", "Musina", "Tzaneen", "Modimolle", "Phalaborwa",
        "Polokwane", "Lebowakgomo", "Thohoyandou", "Louis Trichardt", "Musina", "Tzaneen",
        "Modimolle", "Phalaborwa", "Bela-Bela", "Lebowakgomo", "Thohoyandou", "Louis Trichardt",
        "Musina", "Tzaneen", "Modimolle", "Phalaborwa", "Polokwane", "Lebowakgomo",
        "Thohoyandou", "Louis Trichardt", "Musina", "Tzaneen", "Modimolle", "Phalaborwa",
        "Bela-Bela", "Lebowakgomo", "Thohoyandou", "Louis Trichardt", "Musina", "Tzaneen",
        "Modimolle", "Phalaborwa", "Polokwane", "Lebowakgomo", "Thohoyandou", "Louis Trichardt",
        "Musina", "Tzaneen", "Modimolle", "Phalaborwa", "Bela-Bela", "Lebowakgomo",
        "Thohoyandou", "Louis Trichardt", "Musina", "Tzaneen", "Modimolle", "Phalaborwa",
        "Polokwane", "Lebowakgomo", "Thohoyandou", "Louis Trichardt", "Musina", "Tzaneen",
        "Modimolle", "Phalaborwa", "Bela-Bela", "Lebowakgomo", "Thohoyandou", "Louis Trichardt",
        "Musina", "Tzaneen", "Modimolle", "Phalaborwa", "Polokwane", "Lebowakgomo",
        "Thohoyandou", "Louis Trichardt", "Musina", "Tzaneen", "Modimolle", "Phalaborwa",
        "Bela-Bela", "Lebowakgomo", "Thohoyandou", "Louis Trichardt", "Musina", "Tzaneen",
        "Modimolle", "Phalaborwa", "Polokwane", "Lebowakgomo", "Thohoyandou", "Louis Trichardt",
        "Musina", "Tzaneen", "Modimolle", "Phalaborwa", "Bela-Bela", "Lebowakgomo",
        "Thohoyandou", "Louis Trichardt", "Musina", "Tzaneen", "Modimolle", "Phalaborwa",
        "Polokwane", "Lebowakgomo", "Thohoyandou", "Louis Trichardt", "Musina", "Tzaneen",
        "Modimolle", "Phalaborwa", "Bela-Bela", "Lebowakgomo", "Thohoyandou", "Louis Trichardt",
        "Musina", "Tzaneen", "Modimolle", "Phalaborwa", "Polokwane", "Lebowakgomo",
        "Thohoyandou", "Louis Trichardt", "Musina", "Tzaneen", "Modimolle", "Phalaborwa",
        "Bela-Bela", "Lebowakgomo", "Thohoyandou"
    ];


    function autocomplete(inp, arr) {
        var currentFocus;
        inp.addEventListener("input", function (e) {
            var a, b, i, val = this.value;
            closeAllLists();
            if (!val) return false;
            currentFocus = -1;
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            this.parentNode.appendChild(a);
            for (i = 0; i < arr.length; i++) {
                if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    b = document.createElement("DIV");
                    b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].substr(val.length);
                    b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                    b.addEventListener("click", function (e) {
                        inp.value = this.getElementsByTagName("input")[0].value;
                        searchBar.value = inp.value;
                        // document.getElementById('search-bar').value = inp.value;

                        // console.log(document.getElementById("search-bar").value);
                        console.log(searchBar.value);

                        closeAllLists();
                    });
                    a.appendChild(b);

                }
            }
        });
        inp.addEventListener("keydown", function (e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                currentFocus++;
                addActive(x);
            } else if (e.keyCode == 38) {
                currentFocus--;
                addActive(x);
            } else if (e.keyCode == 13) {
                e.preventDefault();
                if (currentFocus > -1) {
                    if (x) x[currentFocus].click();
                }
            }
        });
        function addActive(x) {
            if (!x) return false;
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }
        function closeAllLists(elmnt) {
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }

    autocomplete(document.getElementById("search-bar"), cities);


    if (searchBar) {
        searchBtn.addEventListener('click', () => {
            event.preventDefault();  
            // Prevent the default form submission

            const city_name = searchBar.value;

            fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city_name}&limit=5&appid=${API_KEY}`)
                .then(res => res.json())
                .then(geolocationData => {
                    if (geolocationData.length > 0) {
                        console.log(geolocationData[0]);
                        const { lat, lon } = geolocationData[0];
                        fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=imperial&appid=${API_KEY}`)
                            .then(res => res.json())
                            .then(weatherData => {
                                fetch(`https://api.ipgeolocation.io/timezone?apiKey=57636760429244f78be9410273312537&lat=${lat}&long=${lon}`)
                                    .then(res => res.json())
                                    .then(locationData => {
                                        console.log(locationData);
                                        showWeatherData(weatherData, geolocationData, locationData);
                                    });
                            });
                    } else {
                        console.error('No geolocation data found for the specified city.');
                    }
                })
                .catch(err => console.error('Error fetching weather data:', err));
        });
    } else {
        console.error('Search button or search bar element not found.');
    }
});

// This function gets all the weather information and displays it in the frontend.
function showWeatherData(data, geolocationData, locationData) {

    // gets the following values from "main"
    let { sunset, sunrise,dt } = data.current;
    let { temp, humidity, wind_speed } = data.hourly[0];

    // gets the following from the Geolocation Data
    let { name, state } = geolocationData[0];

    // variables for the locationData
    let { time_24,date_time_txt } = locationData;

    // get's the following from weather
    let { id, main, description } = data.current.weather[0];

    let { timezone
    } = data;

    // This formats the time and converts the time based on the timezone 
    const formatter = new Intl.DateTimeFormat('en-US', {
        // How the hours & minutes are displayed
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
        // What timezone , here is using the timezone variable from data.
        timeZone: timezone
    });

    
      

    console.log(formatter.format(dt*1000));


   

    const sunset_time = (sunset * 1000);
    const sunrise_time = (sunrise * 1000);

    // Displays the extra information in the frontend 
    currentWeatherItemsEl.innerHTML =
        `
        <div class="weather-item">
        <i class="fa-solid fa-droplet fa-lg icon"></i>   
         <div>${humidity}%</div>
        </div>

    
        <div class="weather-item">
            <i class="fa-solid fa-wind fa-lg icon"></i>
            <div>${wind_speed}</div>
        </div>

        <div class="weather-item">
        <i class="fa-solid fa-sun fa-lg icon"></i>
            <div>${formatter.format(sunset_time)}</div>
        </div>

        <div class="weather-item">
        <i class="fa-regular fa-sun fa-lg icon"></i>
            <div>${formatter.format(sunrise_time)}</div>
        </div>
        `

    // Define the icons for each weather condition
    const icons = {
        "Clear": "images/weatherConditions/clear.png",
        "Clouds": "images/weatherConditions/cloud.png",
        "Few clouds": "images/weatherConditions/few.png",
        "Scattered clouds": "images/weatherConditions/cloud.png",
        "Broken clouds": "images/weatherConditions/broken.png",
        "Shower rain": "images/weatherConditions/rain.png",
        "Rain": "images/weatherConditions/rain.png",
        "Thunderstorm": "images/weatherConditions/lightning.png",
        "Snow": "images/weatherConditions/snow.png",
        "Mist": "images/weatherConditions/mist.png",
    };

    const hourlyIconsForecast = {
        "Clear": "images/icon/clear.png",
        "Clouds": "images/icon/cloud.png",
        "Few clouds": "images/icon/cloud.png",
        "Scattered clouds": "images/icon/cloud.png",
        "Broken clouds": "images/icon/cloud.png",
        "Shower rain": "images/icon/raining.png",
        "Rain": "images/icon/raining.png",
        "Thunderstorm": "images/icon/storm.png",
        "Snow": "images/icon/snow.png",
        "Mist": "images/icon/mist.png",
    };

    
    const weatherCondition = main;
    // Get the appropriate icon based on the weather condition
    const weatherIcon = icons[weatherCondition] || "default-icon.png"; // Default icon if condition not found
    // Today's temperature
    // Displays the Temperature and the city in the frontend 
    currentTempEl.innerHTML = ` 
        <div class="left">
            <div class="date">${moment(date_time_txt).format('dddd ,MMMM D')}</div>
            
       </div>
            <div class="time">${time_24}</div>
            <div class="top-weather-object"></div>
            <div class="current_city">${name}</div>
            <div class="state">${state}</div>

            <div class="weather-object"></div>
            <div class="current-temperature">${Math.trunc(temp)}&#176F</div>
            <div class="bottom-weather-object"></div>
             <div class="description">${description}</div>
             
        `
        // <img src="${weatherIcon}" alt="weather-icon" class="w-icon">

    // if(weatherCondition === 'Rain')
    //     {
    //         for (var i=0, max=all.length; i < max; i++) {
    //             all[i].style.color = "white";
    //         }

    //             container.style.background = '#b0c1c9 ';
    // }   

    // else if(weatherCondition === 'Clear')
    //     {
    //         for (var i=0, max=all.length; i < max; i++) {
    //             all[i].style.color = "black";
    //         }

    //             container.style.background = 'white ';
    // }  

    // else if(weatherCondition === 'Clouds')
    //     {
    //         for (var i=0, max=all.length; i < max; i++) {
    //             all[i].style.color = "white";
    //         }

    //             container.style.background = 'black ';
    // }  



    //#b0c1c9 rain cloud color

    let otherDayForecast = '';
    let HighAndLowestTemperature = '';


    // Goes to Daily and grabs the following information
    data.daily.forEach((day, idx) => {

        let { main } = day.weather[0]
        // console.log(main);


        const dailyCondition = main;

        // Get the appropriate icon based on the weather condition
        const hourlyIcon = hourlyIconsForecast[dailyCondition] || "default-icon.png"; // Default icon if condition not found



        // Gets the max and min temperature of TODAY.
        if (idx == 0) {
            HighAndLowestTemperature = ` 
             <div class="temp"> Max:${day.temp.max}&#176;F</div>
             <div class="temp"> Min:${day.temp.min}&#176;F</div> 
            `
        }


        // Weekly forecast
        // limits the days forecast it shows. // Only shows the day and night temp
        else if (idx > 0 && idx < 7) {

            otherDayForecast += ` 
            <div class="weather-forecast-week"> 
                    <div class="day-week"> ${window.moment(day.dt * 1000).format('ddd')}</div>
                    <div class="daily-temp"> ${Math.trunc(day.temp.day)}&#176;F</div>
                    <img src="${hourlyIcon}" alt="weather-icon" class="daily-weather-icon">
            </div>

            
            `
        }
    }
    );


    // Displays the upcoming days forecast
    weatherForecastEl.innerHTML = otherDayForecast;

    // Hourly Forecast as of RIGHT NOW AND next 24 HOURS
    let hourlyForecast = '';

    //  let {timezone} = data;
    // console.log(timezone);



    data.hourly.forEach((hour, idx) => {
        // Basically X = to the DT in hourly * 1000
        const x = (hour.dt * 1000);

        let { main } = hour.weather[0]
        //  console.log(main);

        // As long as it's not the current hour (0) but until 24 hours
        if (idx > 0 && idx < 24) {

            // let{main,description} = hourly.weather;
            const hourlyCondition = main;
            //  console.log(hourlyCondition);

            // Get the appropriate icon based on the weather condition
            const hourlyIcon = hourlyIconsForecast[hourlyCondition] || "default-icon.png"; // Default icon if condition not found

            // Displays the results from formatter
            hourlyForecast +=
                `
            <div class="hourly"> 

            <div class="hourly-temp">${formatter.format(x)}</div>
            <div class="hourly-temp">${Math.trunc(hour.temp)}&#176;F</div>
            <img src="${hourlyIcon}" alt="weather-icon" class="hourly-icon">

            </div>
            `
        }
    }
    );
    // Displays the information in the frontend
    hourlyForecastEl.innerHTML = hourlyForecast;

}
//console.log(Math.trunc((temp - 32) / (9 / 5)));


// Tabs 
function openTab(evt, when) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(when).style.display = "block";
    evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();



