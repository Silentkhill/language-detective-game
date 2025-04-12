document.addEventListener('DOMContentLoaded', () => {
    // Game state
    const gameState = {
        score: 0,
        level: 1,
        currentLocation: null,
        visitedLocations: [],
        cluesFound: [],
        suspectsEliminated: [],
        currentSuspect: null,
        caseSolved: false,
        speechRecognitionActive: false,
        languageHelper: {}
    };

    // DOM Elements
    const elements = {
        startButton: document.getElementById('start-game'),
        introScreen: document.getElementById('intro-screen'),
        sceneContainer: document.getElementById('scene-container'),
        scene: document.getElementById('scene'),
        sceneImage: document.getElementById('scene-image'),
        sceneDescription: document.getElementById('scene-description'),
        characterContainer: document.getElementById('character-container'),
        characterImage: document.getElementById('character-image'),
        characterDialog: document.getElementById('character-dialog'),
        clueContainer: document.getElementById('clue-container'),
        cluesList: document.getElementById('clues-list'),
        speechControls: document.getElementById('speech-controls'),
        speakButton: document.getElementById('speak-button'),
        recognizedSpeech: document.getElementById('recognized-speech'),
        translationHelper: document.getElementById('translation-helper'),
        translations: document.getElementById('translations'),
        mapContainer: document.getElementById('map-container'),
        worldMap: document.getElementById('world-map'),
        locationOptions: document.getElementById('location-options'),
        scoreDisplay: document.getElementById('score'),
        levelDisplay: document.getElementById('level')
    };

    // Game locations with associated languages
    const gameLocations = [
        {
            id: 'paris',
            name: 'Paris, France',
            language: 'French',
            description: 'The bustling streets of Paris are filled with art, culture, and the aroma of fresh baked bread.',
            image: 'paris.jpg',
            characters: [
                {
                    id: 'baker',
                    name: 'Pierre the Baker',
                    image: 'baker.jpg',
                    dialog: {
                        greeting: 'Bonjour! Welcome to my bakery.',
                        clue: 'I saw someone suspicious yesterday. They asked about the "Tour Eiffel" and seemed very interested in learning French words.',
                        hint: 'They mentioned going somewhere with "kangaroos" next.',
                        farewell: 'Au revoir! Good luck with your investigation!'
                    },
                    languageWords: {
                        'hello': 'bonjour',
                        'goodbye': 'au revoir',
                        'thank you': 'merci',
                        'Eiffel Tower': 'Tour Eiffel',
                        'bread': 'pain',
                        'yes': 'oui',
                        'no': 'non'
                    },
                    questions: {
                        'what did you see': 'clue',
                        'where did they go': 'hint',
                        'hello': 'greeting',
                        'goodbye': 'farewell',
                        'bonjour': 'greeting',
                        'au revoir': 'farewell',
                        'merci': 'You\'re welcome! (De rien!)'
                    }
                },
                {
                    id: 'artist',
                    name: 'Sophie the Artist',
                    image: 'artist.jpg',
                    dialog: {
                        greeting: 'Bonjour! I am painting the beautiful Seine river today.',
                        clue: 'I saw someone taking pictures of my artwork and writing down French words for colors.',
                        hint: 'They mentioned Australia a lot while talking on their phone.',
                        farewell: 'Bonne chance with your investigation!'
                    },
                    languageWords: {
                        'red': 'rouge',
                        'blue': 'bleu',
                        'green': 'vert',
                        'yellow': 'jaune',
                        'river': 'rivière',
                        'painting': 'peinture',
                        'good luck': 'bonne chance'
                    },
                    questions: {
                        'what did you see': 'clue',
                        'where did they go': 'hint',
                        'what are you doing': 'greeting',
                        'goodbye': 'farewell',
                        'colors': 'I know many colors in French: rouge, bleu, vert, jaune!',
                        'bonne chance': 'Thank you! I wish you luck too!'
                    }
                }
            ]
        },
        {
            id: 'sydney',
            name: 'Sydney, Australia',
            language: 'Australian English',
            description: 'The iconic Sydney Opera House stands proudly in the harbor of this beautiful coastal city.',
            image: 'sydney.jpg',
            characters: [
                {
                    id: 'lifeguard',
                    name: 'Jack the Lifeguard',
                    image: 'lifeguard.jpg',
                    dialog: {
                        greeting: 'G\'day mate! Welcome to Bondi Beach!',
                        clue: 'Yeah, I saw someone asking about Aussie slang. They were writing down words like "crikey" and "fair dinkum".',
                        hint: 'They said something about heading to Japan to learn about "sushi" and "samurai".',
                        farewell: 'Cheers, mate! Hope you catch that word thief!'
                    },
                    languageWords: {
                        'hello': 'g\'day',
                        'friend': 'mate',
                        'amazing': 'crikey',
                        'true/genuine': 'fair dinkum',
                        'goodbye': 'cheers',
                        'beach': 'beach',
                        'surfboard': 'surfie'
                    },
                    questions: {
                        'what did you see': 'clue',
                        'where did they go': 'hint',
                        'hello': 'greeting',
                        'goodbye': 'farewell',
                        'g\'day': 'G\'day to you too, mate!',
                        'crikey': 'Crikey! You\'re learning Aussie slang already!'
                    }
                },
                {
                    id: 'tourist_guide',
                    name: 'Emma the Tour Guide',
                    image: 'guide.jpg',
                    dialog: {
                        greeting: 'Welcome to Sydney! I\'m just about to start a tour of the Opera House.',
                        clue: 'I had someone on my tour yesterday who was very interested in Australian animals and kept noting down their names.',
                        hint: 'They mentioned catching a flight to Tokyo after this.',
                        farewell: 'Take care and enjoy your time in Sydney!'
                    },
                    languageWords: {
                        'kangaroo': 'kangaroo',
                        'koala': 'koala',
                        'platypus': 'platypus',
                        'wombat': 'wombat',
                        'opera house': 'opera house',
                        'thanks': 'ta',
                        'excellent': 'bonza'
                    },
                    questions: {
                        'what did you see': 'clue',
                        'where did they go': 'hint',
                        'opera house': 'The Sydney Opera House is our most famous landmark!',
                        'animals': 'Australia has unique animals like kangaroos, koalas, and platypuses!',
                        'goodbye': 'farewell',
                        'ta': 'You\'re welcome!'
                    }
                }
            ]
        },
        {
            id: 'tokyo',
            name: 'Tokyo, Japan',
            language: 'Japanese',
            description: 'The busy streets of Tokyo blend ancient traditions with futuristic technology.',
            image: 'tokyo.jpg',
            characters: [
                {
                    id: 'sushi_chef',
                    name: 'Hiroshi the Sushi Chef',
                    image: 'chef.jpg',
                    dialog: {
                        greeting: 'Irasshaimase! Welcome to my sushi restaurant.',
                        clue: 'A strange customer came yesterday. They asked me to teach them Japanese food words and wrote everything down.',
                        hint: 'They said they were going to Mexico City next to learn Spanish.',
                        farewell: 'Sayonara and good luck finding them!'
                    },
                    languageWords: {
                        'hello': 'konnichiwa',
                        'welcome': 'irasshaimase',
                        'goodbye': 'sayonara',
                        'thank you': 'arigatou',
                        'sushi': 'sushi',
                        'delicious': 'oishii',
                        'fish': 'sakana'
                    },
                    questions: {
                        'what did you see': 'clue',
                        'where did they go': 'hint',
                        'hello': 'greeting',
                        'goodbye': 'farewell',
                        'konnichiwa': 'Konnichiwa! You speak some Japanese!',
                        'sushi': 'We have the freshest sushi in Tokyo!'
                    }
                },
                {
                    id: 'samurai_guide',
                    name: 'Yuki the Museum Guide',
                    image: 'museum_guide.jpg',
                    dialog: {
                        greeting: 'Konnichiwa! Welcome to our samurai exhibition.',
                        clue: 'Someone visited yesterday who was very interested in samurai terms. They wrote down many Japanese words.',
                        hint: 'I overheard them booking a ticket to Mexico City.',
                        farewell: 'Arigatou for visiting! Sayonara!'
                    },
                    languageWords: {
                        'warrior': 'samurai',
                        'sword': 'katana',
                        'honor': 'meiyo',
                        'please': 'onegaishimasu',
                        'yes': 'hai',
                        'no': 'iie',
                        'castle': 'shiro'
                    },
                    questions: {
                        'what did you see': 'clue',
                        'where did they go': 'hint',
                        'samurai': 'Samurai were Japanese warriors who followed a strict code of honor called Bushido.',
                        'katana': 'The katana is a traditional Japanese sword used by samurai.',
                        'hello': 'greeting',
                        'goodbye': 'farewell',
                        'arigatou': 'Douitashimashite! (You\'re welcome!)'
                    }
                }
            ]
        },
        {
            id: 'mexico_city',
            name: 'Mexico City, Mexico',
            language: 'Spanish',
            description: 'The vibrant streets of Mexico City are filled with color, music, and the enticing smell of street food.',
            image: 'mexico_city.jpg',
            characters: [
                {
                    id: 'chef',
                    name: 'Elena the Chef',
                    image: 'mexican_chef.jpg',
                    dialog: {
                        greeting: '¡Hola! Welcome to my taqueria!',
                        clue: 'Sí, I remember someone asking me about Mexican food words. They wrote down "tacos", "enchiladas", and many more words.',
                        hint: 'They mentioned going to Rome, Italy to learn Italian next.',
                        farewell: '¡Adiós! Good luck catching that word thief!'
                    },
                    languageWords: {
                        'hello': 'hola',
                        'goodbye': 'adiós',
                        'thank you': 'gracias',
                        'yes': 'sí',
                        'tacos': 'tacos',
                        'delicious': 'delicioso',
                        'water': 'agua'
                    },
                    questions: {
                        'what did you see': 'clue',
                        'where did they go': 'hint',
                        'hello': 'greeting',
                        'goodbye': 'farewell',
                        'hola': '¡Hola! Nice to meet you!',
                        'food': 'Mexican food is famous worldwide! We have tacos, enchiladas, quesadillas, and much more!'
                    }
                },
                {
                    id: 'musician',
                    name: 'Carlos the Musician',
                    image: 'musician.jpg',
                    dialog: {
                        greeting: '¡Hola amigo! I was just playing my guitar.',
                        clue: 'A stranger was here yesterday asking about Spanish music words. They seemed very interested in learning words like "música" and "guitarra".',
                        hint: 'They told me they were heading to Italy next.',
                        farewell: '¡Buena suerte! (Good luck!)'
                    },
                    languageWords: {
                        'music': 'música',
                        'guitar': 'guitarra',
                        'song': 'canción',
                        'dance': 'baile',
                        'friend': 'amigo',
                        'good luck': 'buena suerte',
                        'beautiful': 'hermoso'
                    },
                    questions: {
                        'what did you see': 'clue',
                        'where did they go': 'hint',
                        'music': 'Music is my passion! ¡Me encanta la música!',
                        'guitar': 'The guitarra is a beautiful instrument!',
                        'hello': 'greeting',
                        'goodbye': 'farewell',
                        'gracias': 'De nada! (You\'re welcome!)'
                    }
                }
            ]
        },
        {
            id: 'rome',
            name: 'Rome, Italy',
            language: 'Italian',
            description: 'Ancient history and modern life blend seamlessly in the eternal city of Rome.',
            image: 'rome.jpg',
            characters: [
                {
                    id: 'gelato_maker',
                    name: 'Marco the Gelato Maker',
                    image: 'gelato_maker.jpg',
                    dialog: {
                        greeting: 'Buongiorno! Welcome to my gelateria!',
                        clue: 'Yes, a strange customer came yesterday. They were learning Italian food words and wrote down "pizza", "pasta", "gelato".',
                        hint: 'I heard them say they were going to be the word thief of Cairo next.',
                        farewell: 'Arrivederci! Catch that thief!'
                    },
                    languageWords: {
                        'hello': 'buongiorno',
                        'goodbye': 'arrivederci',
                        'thank you': 'grazie',
                        'ice cream': 'gelato',
                        'pizza': 'pizza',
                        'pasta': 'pasta',
                        'delicious': 'delizioso'
                    },
                    questions: {
                        'what did you see': 'clue',
                        'where did they go': 'hint',
                        'hello': 'greeting',
                        'goodbye': 'farewell',
                        'buongiorno': 'Buongiorno to you too!',
                        'gelato': 'My gelato is the best in Rome! Would you like to try some?'
                    }
                },
                {
                    id: 'tour_guide',
                    name: 'Sophia the Tour Guide',
                    image: 'italian_guide.jpg',
                    dialog: {
                        greeting: 'Buongiorno! I\'m just about to start a tour of the Colosseum.',
                        clue: 'I remember someone on my tour yesterday who was writing down all the Italian words I used to describe monuments.',
                        hint: 'They mentioned going to Cairo after Rome.',
                        farewell: 'Ciao! Good luck with your investigation!'
                    },
                    languageWords: {
                        'hello': 'ciao',
                        'beautiful': 'bello',
                        'ancient': 'antico',
                        'history': 'storia',
                        'monument': 'monumento',
                        'fountain': 'fontana',
                        'Rome': 'Roma'
                    },
                    questions: {
                        'what did you see': 'clue',
                        'where did they go': 'hint',
                        'colosseum': 'The Colosseo is an ancient amphitheater in the center of Rome!',
                        'history': 'Roma has thousands of years of storia!',
                        'hello': 'greeting',
                        'goodbye': 'farewell',
                        'grazie': 'Prego! (You\'re welcome!)'
                    }
                }
            ]
        },
        {
            id: 'cairo',
            name: 'Cairo, Egypt',
            language: 'Arabic',
            description: 'The ancient pyramids rise from the desert just outside this bustling metropolis on the Nile.',
            image: 'cairo.jpg',
            characters: [
                {
                    id: 'market_vendor',
                    name: 'Ahmed the Market Vendor',
                    image: 'vendor.jpg',
                    dialog: {
                        greeting: 'Ahlan wa sahlan! Welcome to my shop!',
                        clue: 'I met someone strange yesterday. They were learning Arabic words and writing them down.',
                        hint: 'I think this is the word thief you\'re looking for! They\'re hiding in the museum!',
                        farewell: 'Ma\'a salama! Good luck catching them!'
                    },
                    languageWords: {
                        'hello': 'ahlan',
                        'welcome': 'ahlan wa sahlan',
                        'goodbye': 'ma\'a salama',
                        'thank you': 'shukran',
                        'market': 'souq',
                        'beautiful': 'jamil',
                        'how much': 'kam'
                    },
                    questions: {
                        'what did you see': 'clue',
                        'where did they go': 'hint',
                        'hello': 'greeting',
                        'goodbye': 'farewell',
                        'ahlan': 'Ahlan bik! (Hello to you!)',
                        'market': 'You\'re in the famous Khan el-Khalili souq!'
                    }
                },
                {
                    id: 'word_thief',
                    name: 'The Word Thief',
                    image: 'thief.jpg',
                    dialog: {
                        greeting: 'You found me! I am the Word Thief!',
                        clue: 'I\'ve been collecting words from all over the world because I want to create the ultimate language learning app!',
                        hint: 'I didn\'t mean any harm. I just love languages and want to help others learn them too!',
                        farewell: 'I surrender! Maybe we can work together on my language app instead?'
                    },
                    languageWords: {
                        // This character knows words from all languages
                        'hello': 'hello, bonjour, hola, ciao, konnichiwa, ahlan',
                        'goodbye': 'goodbye, au revoir, adiós, arrivederci, sayonara, ma\'a salama',
                        'thank you': 'thank you, merci, gracias, grazie, arigatou, shukran',
                        'language': 'language, langue, idioma, lingua, gengo, lugha',
                        'world': 'world, monde, mundo, mondo, sekai, aalam',
                        'learning': 'learning, apprentissage, aprendizaje, apprendimento, gakushū, taallum',
                        'friend': 'friend, ami, amigo, amico, tomodachi, sadiq'
                    },
                    questions: {
                        'why': 'clue',
                        'what are you doing': 'clue',
                        'surrender': 'farewell',
                        'hello': 'greeting',
                        'goodbye': 'farewell',
                        'languages': 'I love all languages! French, Spanish, Italian, Japanese, Arabic, and many more!'
                    }
                }
            ]
        }
    ];

    // Speech recognition setup
    let recognition;
    
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event) => {
            const speechResult = event.results[0][0].transcript.toLowerCase();
            elements.recognizedSpeech.textContent = speechResult;
            
            processPlayerSpeech(speechResult);
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            elements.recognizedSpeech.textContent = `Error: ${event.error}. Please try again.`;
        };
        
        recognition.onend = () => {
            gameState.speechRecognitionActive = false;
            elements.speakButton.textContent = 'Ask a Question';
        };
    } else {
        // Fallback for browsers that don't support speech recognition
        elements.speechControls.innerHTML = '<p>Speech recognition is not supported in your browser. Please try Chrome.</p>';
    }

    // Initialize game
    function initGame() {
        // Event listeners
        elements.startButton.addEventListener('click', startGame);
        elements.speakButton.addEventListener('click', toggleSpeechRecognition);
        
        // Update displays
        updateScoreDisplay();
        updateLevelDisplay();
    }

    // Start game
    function startGame() {
        elements.introScreen.classList.add('hidden');
        elements.sceneContainer.classList.remove('hidden');
        elements.speechControls.classList.remove('hidden');
        elements.mapContainer.classList.remove('hidden');
        
        displayLocationOptions();
    }

    // Display location options
    function displayLocationOptions() {
        elements.locationOptions.innerHTML = '';
        
        gameLocations.forEach(location => {
            // Only show locations that haven't been solved yet or are the next logical step
            if (!gameState.visitedLocations.includes(location.id) || 
                location.id === 'cairo' && gameState.visitedLocations.length === gameLocations.length - 1) {
                
                const locationButton = document.createElement('button');
                locationButton.classList.add('location-option');
                locationButton.textContent = location.name;
                locationButton.addEventListener('click', () => selectLocation(location));
                
                elements.locationOptions.appendChild(locationButton);
            }
        });
    }

    // Select a location
    function selectLocation(location) {
        gameState.currentLocation = location;
        
        if (!gameState.visitedLocations.includes(location.id)) {
            gameState.visitedLocations.push(location.id);
        }
        
        displayLocation(location);
        
        // If this is Cairo and we've visited most locations, make the Word Thief available
        if (location.id === 'cairo' && gameState.visitedLocations.length >= gameLocations.length - 1) {
            // Ensure the word thief is accessible
            const wordThief = location.characters.find(char => char.id === 'word_thief');
            if (wordThief) {
                const wordThiefButton = document.createElement('button');
                wordThiefButton.textContent = 'Investigate Museum';
                wordThiefButton.addEventListener('click', () => {
                    displayCharacter(wordThief);
                    gameState.currentSuspect = wordThief;
                });
                
                elements.sceneDescription.appendChild(document.createElement('br'));
                elements.sceneDescription.appendChild(wordThiefButton);
            }
        }
    }

    // Display location
    function displayLocation(location) {
        elements.scene.classList.remove('hidden');
        elements.characterContainer.classList.add('hidden');
        
        elements.sceneImage.style.backgroundImage = `url('https://raw.githubusercontent.com/Silentkhill/language-detective-game/main/assets/${location.image}')`;
        elements.sceneDescription.innerHTML = `
            <h2>${location.name}</h2>
            <p>${location.description}</p>
            <p>The local language is <strong>${location.language}</strong>.</p>
            <h3>Who would you like to talk to?</h3>
        `;
        
        // Create buttons for each character
        location.characters.forEach(character => {
            // Skip the word thief until the end
            if (character.id === 'word_thief' && location.id === 'cairo' && gameState.visitedLocations.length < gameLocations.length - 1) {
                return;
            }
            
            const characterButton = document.createElement('button');
            characterButton.textContent = character.name;
            characterButton.addEventListener('click', () => {
                displayCharacter(character);
                gameState.currentSuspect = character;
            });
            
            elements.sceneDescription.appendChild(characterButton);
            elements.sceneDescription.appendChild(document.createElement('br'));
        });
        
        // Show translation helper for the current language
        updateTranslationHelper(location.language);
    }

    // Display character
    function displayCharacter(character) {
        elements.characterContainer.classList.remove('hidden');
        elements.characterImage.style.backgroundImage = `url('https://raw.githubusercontent.com/Silentkhill/language-detective-game/main/assets/${character.image}')`;
        
        // Start with greeting
        elements.characterDialog.textContent = character.dialog.greeting;
        
        // If this is the word thief in Cairo and we've visited all locations, trigger final scene
        if (character.id === 'word_thief' && gameState.currentLocation.id === 'cairo' && 
            gameState.visitedLocations.length >= gameLocations.length - 1) {
            triggerFinalScene();
        }
    }

    // Process player speech
    function processPlayerSpeech(speech) {
        if (!gameState.currentSuspect) {
            elements.characterDialog.textContent = "Please select a character to talk to first.";
            return;
        }
        
        const lowerSpeech = speech.toLowerCase();
        let responded = false;
        
        // Check for specific question matches
        for (const [question, response] of Object.entries(gameState.currentSuspect.questions)) {
            if (lowerSpeech.includes(question)) {
                elements.characterDialog.textContent = gameState.currentSuspect.dialog[response] || response;
                
                // If this was a clue or hint, potentially add to clues
                if (response === 'clue' && !gameState.cluesFound.includes(`${gameState.currentLocation.id}_${gameState.currentSuspect.id}_clue`)) {
                    addClue(`${gameState.currentSuspect.name} in ${gameState.currentLocation.name}: ${gameState.currentSuspect.dialog.clue}`);
                    gameState.cluesFound.push(`${gameState.currentLocation.id}_${gameState.currentSuspect.id}_clue`);
                    
                    // Increment score for finding a new clue
                    incrementScore(10);
                }
                
                responded = true;
                break;
            }
        }
        
        // Check for language words
        if (!responded) {
            for (const [english, foreign] of Object.entries(gameState.currentSuspect.languageWords)) {
                if (lowerSpeech.includes(english) || lowerSpeech.includes(foreign)) {
                    let response = `Yes, "${english}" in ${gameState.currentLocation.language} is "${foreign}".`;
                    elements.characterDialog.textContent = response;
                    
                    // If the player used the foreign word, give them bonus points
                    if (lowerSpeech.includes(foreign)) {
                        incrementScore(5);
                        elements.characterDialog.textContent += " Great job using the local language!";
                    }
                    
                    responded = true;
                    break;
                }
            }
        }
        
        // Default response if nothing matched
        if (!responded) {
            elements.characterDialog.textContent = "I'm not sure how to respond to that. Try asking about what I saw, where they went, or use some of the words from the Language Helper.";
        }
    }

    // Toggle speech recognition
    function toggleSpeechRecognition() {
        if (!recognition) {
            elements.recognizedSpeech.textContent = 'Speech recognition not supported in your browser.';
            return;
        }
        
        if (gameState.speechRecognitionActive) {
            recognition.stop();
            gameState.speechRecognitionActive = false;
            elements.speakButton.textContent = 'Ask a Question';
        } else {
            recognition.start();
            gameState.speechRecognitionActive = true;
            elements.speakButton.textContent = 'Listening...';
            elements.recognizedSpeech.textContent = '';
        }
    }

    // Add clue to the list
    function addClue(clueText) {
        elements.clueContainer.classList.remove('hidden');
        
        const clueItem = document.createElement('li');
        clueItem.textContent = clueText;
        clueItem.classList.add('fade-in');
        
        elements.cluesList.appendChild(clueItem);
    }

    // Update translation helper
    function updateTranslationHelper(language) {
        elements.translationHelper.classList.remove('hidden');
        elements.translations.innerHTML = '';
        
        // Get all words for the current language from all characters in the location
        const languageWords = {};
        
        gameState.currentLocation.characters.forEach(character => {
            Object.entries(character.languageWords).forEach(([english, foreign]) => {
                languageWords[english] = foreign;
            });
        });
        
        // Display the translations
        Object.entries(languageWords).forEach(([english, foreign]) => {
            const translationItem = document.createElement('div');
            translationItem.classList.add('translation-item');
            
            const englishWord = document.createElement('span');
            englishWord.textContent = english;
            
            const foreignWord = document.createElement('span');
            foreignWord.classList.add('translation-word');
            foreignWord.textContent = foreign;
            
            translationItem.appendChild(englishWord);
            translationItem.appendChild(foreignWord);
            
            elements.translations.appendChild(translationItem);
        });
    }

    // Increment score
    function incrementScore(points) {
        gameState.score += points;
        updateScoreDisplay();
        
        // Check for level up
        if (gameState.score >= gameState.level * 50) {
            levelUp();
        }
    }

    // Level up
    function levelUp() {
        gameState.level++;
        updateLevelDisplay();
        
        // Animation for level up
        elements.levelDisplay.classList.add('fade-in');
        setTimeout(() => {
            elements.levelDisplay.classList.remove('fade-in');
        }, 1000);
    }

    // Update score display
    function updateScoreDisplay() {
        elements.scoreDisplay.textContent = gameState.score;
    }

    // Update level display
    function updateLevelDisplay() {
        elements.levelDisplay.textContent = gameState.level;
    }

    // Trigger final scene
    function triggerFinalScene() {
        // Add final clue
        if (!gameState.cluesFound.includes('final_clue')) {
            addClue('You found the Word Thief! They were collecting words to create a language learning app!');
            gameState.cluesFound.push('final_clue');
            
            // Big score bonus for solving the case
            incrementScore(50);
        }
        
        // Change dialog
        setTimeout(() => {
            elements.characterDialog.textContent = "Congratulations! You've solved the case! The Word Thief was collecting words to create a language learning app. They've agreed to work with international language experts instead of stealing words. You've saved languages around the world!";
            
            // Show replay button
            const replayButton = document.createElement('button');
            replayButton.textContent = 'Play Again';
            replayButton.addEventListener('click', resetGame);
            
            elements.speechControls.appendChild(replayButton);
        }, 3000);
    }

    // Reset game
    function resetGame() {
        // Reset game state
        gameState.score = 0;
        gameState.level = 1;
        gameState.currentLocation = null;
        gameState.visitedLocations = [];
        gameState.cluesFound = [];
        gameState.suspectsEliminated = [];
        gameState.currentSuspect = null;
        gameState.caseSolved = false;
        
        // Reset UI
        elements.introScreen.classList.remove('hidden');
        elements.sceneContainer.classList.add('hidden');
        elements.scene.classList.add('hidden');
        elements.characterContainer.classList.add('hidden');
        elements.clueContainer.classList.add('hidden');
        elements.speechControls.classList.add('hidden');
        elements.mapContainer.classList.add('hidden');
        elements.translationHelper.classList.add('hidden');
        
        elements.cluesList.innerHTML = '';
        
        // Update displays
        updateScoreDisplay();
        updateLevelDisplay();
    }

    // Initialize the game
    initGame();
});