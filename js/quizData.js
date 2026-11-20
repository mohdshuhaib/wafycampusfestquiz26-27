/**
 * Wafy Campus Fest Quiz 2026-27 - Official Quiz Data
 * Campus Arts Fest | Wafy Campus Students' Union, Kalikavu
 * Led by: Hafsal Faizy Anjilangadi
 */

const QUIZ_DATA = {
  info: {
    title: "Quiz Competition",
    event: "Campus Arts Fest 2026",
    dates: "2026 November 21 - 22",
    host: "Wafy Campus Students' Union - Wafy Campus Kalikavu",
    director: "Hafsal Faizy Anjilangadi"
  },
  rounds: [
    {
      id: 1,
      title: "Round 1",
      subtitle: "General Knowledge & Awareness",
      type: "general",
      totalQuestions: 11,
      description: "11 Common questions for all teams. Questions contain video, audio, and images.",
      rules: [
        "11 Common Questions for all participating teams.",
        "60 Seconds per question with countdown timer.",
        "Audio and video media will be played on presenter command.",
        "Final 10 seconds warning sound will alert the teams."
      ],
      questions: [
        {
          id: "r1-q1",
          round: 1,
          qNum: 1,
          text: "Identify the person speaking in this video?",
          video: "quizassets/round1-q1video.mp4",
          answer: "Check video speaker",
          hint: "Watch facial features and voice tone carefully."
        },
        {
          id: "r1-q2",
          round: 1,
          qNum: 2,
          text: "This is the tagline of which company?",
          image: "quizassets/round1-q2img.png",
          audio: "quizassets/round1-q2audio.mp3",
          answer: "Nokia ('Connecting People' & iconic Nokia tune)",
          hint: "The world-famous Finnish telecommunications and mobile pioneer."
        },
        {
          id: "r1-q3",
          round: 1,
          qNum: 3,
          text: "What does the Korean word 'Samsung' mean?",
          image: "quizassets/round1-q3img.jpeg",
          answer: "Three Stars (Sam = Three, Sung = Stars)",
          hint: "Symbolizing something big, numerous and powerful like stars in the sky."
        },
        {
          id: "r1-q4",
          round: 1,
          qNum: 4,
          text: "Name the Kerala startup that had Lionel Messi as its brand ambassador?",
          image: "quizassets/round1-q4img.png",
          answer: "BYJU'S (Founded by Byju Raveendran from Azhikode, Kannur)",
          hint: "Lionel Messi was global ambassador for 'Education For All' initiative."
        },
        {
          id: "r1-q5",
          round: 1,
          qNum: 5,
          text: "In 'E20 Petrol', what does 'E' stand for?",
          image: "quizassets/round1-q5img.jpeg",
          answer: "Ethanol (20% Ethanol blended with gasoline/petrol)",
          hint: "A biofuel produced largely from sugarcane and grains."
        },
        {
          id: "r1-q6",
          round: 1,
          qNum: 6,
          text: "The BMW logo colors are taken from the flag of which state?",
          image: "quizassets/round1-q6img.jpeg",
          answer: "Bavaria (Free State of Bavaria, Germany)",
          hint: "The blue and white quarters represent the Bavarian state flag."
        },
        {
          id: "r1-q7",
          round: 1,
          qNum: 7,
          text: "Google is a misspelling of the word 'Googol'. What is the mathematical meaning of 'Googol'?",
          image: "quizassets/round1-q7img.jpeg",
          answer: "1 followed by 100 zeros (10¹⁰⁰)",
          hint: "Coined in 1920 by 9-year-old Milton Sirotta, nephew of mathematician Edward Kasner."
        },
        {
          id: "r1-q8",
          round: 1,
          qNum: 8,
          text: "Who designed the Apple logo?",
          image: "quizassets/round1-q8img.png",
          answer: "Rob Janoff",
          hint: "Created the rainbow apple silhouette with a bite in 1977."
        },
        {
          id: "r1-q9",
          round: 1,
          qNum: 9,
          text: "What initiative is this logo related to?",
          image: "quizassets/round1-q9img.png",
          answer: "Fit India Movement (launched by Govt of India)",
          hint: "National initiative promoting physical fitness and healthy lifestyle."
        },
        {
          id: "r1-q10",
          round: 1,
          qNum: 10,
          text: "Identify the sports personality in this faded image?",
          image: "quizassets/round1-q10img.jpeg",
          answer: "Lionel Messi (FIFA World Cup 2022 Champions celebration)",
          hint: "Argentina football legend celebrating with the World Cup trophy."
        },
        {
          id: "r1-q11",
          round: 1,
          qNum: 11,
          text: "In which district is this statue located?",
          image: "quizassets/round1-q11img.png",
          answer: "Kollam (Jatayu Earth's Center, Chadayamangalam)",
          hint: "The world's largest bird sculpture in southern Kerala."
        }
      ]
    },
    {
      id: 2,
      title: "Round 2",
      subtitle: "The Highlight Box Selection Round",
      type: "box-choice",
      totalBoxes: 6,
      description: "6 Sets of Mystery Boxes. Click SPIN to highlight boxes fast for 4 seconds and randomly choose. Each box offers Q-1 and Q-2.",
      rules: [
        "6 Mystery boxes displayed on screen.",
        "Judge clicks 'SPIN' to highlight boxes rapidly for 4 seconds, stopping randomly on one box.",
        "Each box reveals two question choices: Q-1 and Q-2.",
        "The team selects one question; the judge clicks to reveal it.",
        "60 Seconds per question with live warning countdown.",
        "Returning to box selection hides the completed box for remaining teams."
      ],
      boxes: [
        {
          boxNum: 1,
          label: "Box 1",
          questions: [
            {
              id: "r2-b1-q1",
              qCode: "B-1-1",
              choice: "Q-1",
              text: "Identify the animal featured in the logo of Qatar Airways?",
              image: "quizassets/round2-b1-q1img.jpeg",
              answer: "Arabian Oryx (Al Maha)",
              hint: "The national animal of Qatar, a white antelope with long pointed horns."
            },
            {
              id: "r2-b1-q2",
              qCode: "B-1-2",
              choice: "Q-2",
              text: "The name Starbucks was inspired by a character from which classic novel?",
              image: "quizassets/round2-b1-q2img.jpeg",
              answer: "Moby-Dick (by Herman Melville - character: Starbuck)",
              hint: "Starbuck was the chief mate aboard the whaling ship Pequod."
            }
          ]
        },
        {
          boxNum: 2,
          label: "Box 2",
          questions: [
            {
              id: "r2-b2-q1",
              qCode: "B-2-1",
              choice: "Q-1",
              text: "After facing a nationwide ban in India, which famous brand made a massive comeback using this emotional tagline 'We Miss You Too'?",
              image: "quizassets/round2-b2-q1img.png",
              answer: "Maggi Noodles (Nestlé India)",
              hint: "Returned to the market in November 2015 with heart-warming commercials."
            },
            {
              id: "r2-b2-q2",
              qCode: "B-2-2",
              choice: "Q-2",
              text: "Identify the iconic Indian-made cola beverage that uses the famous tagline 'India Ka Thanda' or 'The Great Indian Taste'?",
              image: "quizassets/round2-b2-q2img.png",
              answer: "Campa Cola / Thums Up (Campa Cola)",
              hint: "The home-grown cola created in the late 1970s and relaunched recently."
            }
          ]
        },
        {
          boxNum: 3,
          label: "Box 3",
          questions: [
            {
              id: "r2-b3-q1",
              qCode: "B-3-1",
              choice: "Q-1",
              text: "Which global brand adopted its world-famous tagline, inspired by the final words of a convict just before his execution?",
              image: "quizassets/round2-b3-q1img.jpg",
              answer: "Nike ('Just Do It')",
              hint: "Dan Wieden coined it in 1988, inspired by death row convict Gary Gilmore's last words 'Let's do it'."
            },
            {
              id: "r2-b3-q2",
              qCode: "B-3-2",
              choice: "Q-2",
              text: "Identify the new bill recently introduced by the Government of Kerala based on this motto ONE STATE, ONE APPROVAL, ONE DOCUMENT (OSAD)?",
              image: "quizassets/round2-b3-q2img.png",
              answer: "Kerala Investment Promotion and Facilitation Bill (K-SWIFT / OSAD Bill)",
              hint: "A landmark ease-of-doing-business reform for industrial clearances."
            }
          ]
        },
        {
          boxNum: 4,
          label: "Box 4",
          questions: [
            {
              id: "r2-b4-q1",
              qCode: "B-4-1",
              choice: "Q-1",
              text: "Who is the renowned advertising professional who coined the famous tourism tagline 'God's Own Country' for Kerala?",
              image: "quizassets/round2-b4-q1img.png",
              answer: "Walter Mendez (Mudra Communications)",
              hint: "Created the historic campaign for Kerala Tourism in 1989."
            },
            {
              id: "r2-b4-q2",
              qCode: "B-4-2",
              choice: "Q-2",
              text: "This recently released book by Jijo Abraham is the sequel (second part) to which famous novel?",
              image: "quizassets/round2-b4-q2img.jpeg",
              answer: "Francis Itty Cora (ഫ്രാൻസിസ് ഇട്ടിക്കോര - Novel by TD Ramakrishnan)",
              hint: "The book shown is 'സ്ത്രീയേ, ഇതാ നിന്റെ മകൻ' (Streeye, Itha Ninte Makan)."
            }
          ]
        },
        {
          boxNum: 5,
          label: "Box 5",
          questions: [
            {
              id: "r2-b5-q1",
              qCode: "B-5-1",
              choice: "Q-1",
              text: "What is the specific name given to this calligraphic monogram or official seal used by the Sultans of the Ottoman Empire?",
              image: "quizassets/round2-b5-q1img.jpeg",
              answer: "Tughra (തുഗ്റ / Tuğra)",
              hint: "An elaborate imperial signature affixed to all official decrees and coins."
            },
            {
              id: "r2-b5-q2",
              qCode: "B-5-2",
              choice: "Q-2",
              text: "Identify the names of these two official mascots of the Census of India?",
              image: "quizassets/round2-b5-q2img.jpeg",
              answer: "Female Enumerator (Census Lady) & Master Census (Male Enumerator)",
              hint: "Introduced to represent the field workers gathering census data across the country."
            }
          ]
        },
        {
          boxNum: 6,
          label: "Box 6",
          questions: [
            {
              id: "r2-b6-q1",
              qCode: "B-6-1",
              choice: "Q-1",
              text: "The common brand introduced by the Government of Kerala for local products is called ___?",
              image: "quizassets/round2-b6-q1img.jpeg",
              answer: "Kerala Brand ('Nanma' / 'Kerala Brand')",
              hint: "Certification initiative ensuring high quality and authenticity for Made-in-Kerala goods."
            },
            {
              id: "r2-b6-q2",
              qCode: "B-6-2",
              choice: "Q-2",
              text: "Which company does the third logo belong to?",
              image: "quizassets/round2-b6-q2img.png",
              answer: "iD Fresh Food (Bengaluru-based packaged batter and food company)",
              hint: "Founded by PC Musthafa from Wayanad, Kerala."
            }
          ]
        }
      ]
    },
    {
      id: 3,
      title: "Round 3",
      subtitle: "General Knowledge & Rapid Observation",
      type: "general",
      totalQuestions: 5,
      description: "5 Common questions for all teams. Identify brands, records, history, and current affairs.",
      rules: [
        "5 General questions for all participating teams.",
        "60 Seconds per question with live warning countdown.",
        "Visuals and audio will be presented on screen."
      ],
      questions: [
        {
          id: "r3-q1",
          round: 3,
          qNum: 1,
          text: "Guess the brand?",
          image: "quizassets/round3-q1img.jpeg",
          answer: "KFC (Kentucky Fried Chicken - Colonel Harland Sanders)",
          hint: "The world-famous fried chicken restaurant chain."
        },
        {
          id: "r3-q2",
          round: 3,
          qNum: 2,
          text: "What does V stand for?",
          image: "quizassets/round3-q2img.jpeg",
          answer: "Voltage (V-Guard = Voltage Guard)",
          hint: "Founded by Kochouseph Chittilappilly in 1977 as a voltage stabilizer maker."
        },
        {
          id: "r3-q3",
          round: 3,
          qNum: 3,
          text: "In which well was the Prophet Muhammad's seal ring lost?",
          image: "quizassets/round3-q3img.jpeg",
          answer: "Well of Aris (Bi'r Aris / بئر أريس - near Masjid Quba, Madinah)",
          hint: "Slipped from the finger of Caliph Uthman ibn Affan (RA) into this historic well."
        },
        {
          id: "r3-q4",
          round: 3,
          qNum: 4,
          text: "Who is the minister in charge of India's first AI department?",
          image: "quizassets/round3-q4img.jpeg",
          answer: "P. Rajeev (Minister for Law, Industries and Coir, Kerala)",
          hint: "Kerala became the first state in India to establish a dedicated AI ministerial department."
        },
        {
          id: "r3-q5",
          round: 3,
          qNum: 5,
          text: "What unique world record does he hold?",
          image: "quizassets/round3-q5img.jpeg",
          answer: "Andrea Kimi Antonelli (Mercedes F1 Driver) - Youngest Italian to start an F1 GP / Multi-category Champion",
          hint: "Italian prodigy signed to drive for Mercedes-AMG Petronas F1 Team."
        }
      ]
    },
    {
      id: 4,
      title: "Round 4",
      subtitle: "The Clue Round",
      type: "clue-box",
      totalBoxes: 6,
      description: "6 Mystery Boxes. Click SPIN to highlight boxes fast for 4 seconds and randomly choose. Each box contains 1 question with 3 successive clues. 1 minute total.",
      rules: [
        "6 Mystery boxes displayed on screen.",
        "Judge clicks 'SPIN' to highlight boxes rapidly for 4 seconds, stopping randomly on one box.",
        "Each box contains 1 question with 3 progressive clues.",
        "Timer is 60 SECONDS TOTAL for all clues (not per clue).",
        "Clue 1 appears when question starts.",
        "Judge clicks 'Next Clue' to reveal Clue 2 and Clue 3 when requested.",
        "After completion, returning to box selection hides the used box."
      ],
      boxes: [
        {
          boxNum: 1,
          label: "Box 1",
          qCode: "B-1-1",
          answer: "NVIDIA (എൻവിഡിയ)",
          hint: "American tech giant founded by Jensen Huang, dominance in GPU and AI hardware.",
          clues: [
            {
              clueNum: 1,
              label: "Clue 1",
              text: "ലോകത്തിലെ എ.ഐ (AI) ചിപ്പ് വിപണിയുടെ 80 ശതമാനത്തിലധികവും കൈയടക്കി വെച്ചിരിക്കുന്ന, ലോകത്ത് ഏറ്റവും കൂടുതൽ എ.ഐ ചിപ്പുകൾ വിതരണം ചെയ്യുന്ന കമ്പനിയാണിത്.",
              image: null
            },
            {
              clueNum: 2,
              label: "Clue 2",
              text: "പച്ച നിറത്തിലുള്ള കണ്ണുപോലുള്ള ഈ ലോഗോ ഏത് അമേരിക്കൻ ടെക് കമ്പനിയുടേതാണ്?",
              image: "quizassets/round4-cl2-q1img.jpeg"
            },
            {
              clueNum: 3,
              label: "Clue 3",
              text: "ചൈനയുമായി ബന്ധപ്പെട്ട ചാരവൃത്തി വിവാദങ്ങളെത്തുടർന്ന് അടുത്തിടെ ഇതിൻ്റെ സ്ഥാപകനും സി.ഇ.ഒയുമായ ജെൻസൻ ഹുവാങ് രാജിവെച്ചതോടെ വാർത്തകളിൽ നിറഞ്ഞുനിന്ന കമ്പനിയാണിത്.",
              image: null
            }
          ]
        },
        {
          boxNum: 2,
          label: "Box 2",
          qCode: "B-2-1",
          answer: "Elon Musk (ഇലോൺ മസ്ക്)",
          hint: "World's richest entrepreneur, head of Tesla, SpaceX, xAI, Neuralink and X.",
          clues: [
            {
              clueNum: 1,
              label: "Clue 1",
              text: "ഇലക്ട്രിക് സ്പോർട്സ് കാറായ റോഡ്സ്റ്റർ (Roadster) നിർമ്മിച്ച കമ്പനിയുടെ ഉടമയാണ് ഇദ്ദേഹം.",
              image: null
            },
            {
              clueNum: 2,
              label: "Clue 2",
              text: "Grok എന്ന പ്രശസ്തമായ എ.ഐ ചാറ്റ്ബോട്ട് നിർമ്മിച്ച കമ്പനിയുടെ ഉടമസ്ഥനും ഇദ്ദേഹമാണ്.",
              image: null
            },
            {
              clueNum: 3,
              label: "Clue 3",
              text: "SpaceX എന്ന ബഹിരാകാശ കമ്പനി സ്ഥാപിച്ചത് ഇദ്ദേഹമാണ്.",
              image: null
            }
          ]
        },
        {
          boxNum: 3,
          label: "Box 3",
          qCode: "B-3-1",
          answer: "Andhra Pradesh (ആന്ധ്രാപ്രദേശ്)",
          hint: "Southern Indian state with its planned capital at Amaravati on the banks of Krishna River.",
          clues: [
            {
              clueNum: 1,
              label: "Clue 1",
              text: "അമേരിക്കയ്ക്ക് പുറത്ത് ഗൂഗിൾ നടത്തുന്ന ഏറ്റവും വലിയ AI നിക്ഷേപത്തിന് (15 ബില്യൺ ഡോളർ) വേദിയാകുന്ന ഇന്ത്യൻ സംസ്ഥാനമാണിത്.",
              image: null
            },
            {
              clueNum: 2,
              label: "Clue 2",
              text: "'ഇന്ത്യയുടെ കോഹിനൂർ' (Kohinoor of India) എന്ന ടൂറിസം ടാഗ്ലൈൻ ഈ സംസ്ഥാനത്തിന്റേതാണ്.",
              image: null
            },
            {
              clueNum: 3,
              label: "Clue 3",
              text: "ലോകോത്തര നിലവാരത്തിൽ നിർമ്മാണം പുരോഗമിച്ചുകൊണ്ടിരിക്കുന്ന 'അമരാവതി' ആണ് ഈ സംസ്ഥാനത്തിന്റെ പുതിയ തലസ്ഥാനം.",
              image: null
            }
          ]
        },
        {
          boxNum: 4,
          label: "Box 4",
          qCode: "B-4-1",
          answer: "Sanju Samson (സഞ്ജു സാംസൺ)",
          hint: "Indian international cricketer and Rajasthan Royals captain from Thiruvananthapuram.",
          clues: [
            {
              clueNum: 1,
              label: "Clue 1",
              text: "ഇംഗ്ലീഷ് പ്രീമിയർ ലീഗിന്റെ (EPL) ഇന്ത്യയിലെ ബ്രാൻഡ് അംബാസഡർ ആണ് ഇദ്ദേഹം.",
              image: null
            },
            {
              clueNum: 2,
              label: "Clue 2",
              text: "കേരളത്തിൽ നടന്ന സൂപ്പർ ലീഗ് കേരളയിലെ മലപ്പുറം എഫ്സിയുടെ (Malappuram FC) സഹ ഉടമകളിൽ ഒരാളാണ് ഈ തിരുവനന്തപുരം സ്വദേശി.",
              image: null
            },
            {
              clueNum: 3,
              label: "Clue 3",
              text: "നിലവിൽ നടന്നുകൊണ്ടിരിക്കുന്ന സയ്യിദ് മുഷ്താഖ് അലി ട്രോഫി ടി20 ടൂർണമെന്റിൽ കേരള ടീമിന്റെ നായകൻ ഇദ്ദേഹമാണ്.",
              image: null
            }
          ]
        },
        {
          boxNum: 5,
          label: "Box 5",
          qCode: "B-5-1",
          answer: "Britannia Industries (ബ്രിട്ടാനിയ ഇൻഡസ്ട്രീസ്)",
          hint: "Leading Indian food products company famous for Good Day, Marie Gold, Tiger and 50-50.",
          clues: [
            {
              clueNum: 1,
              label: "Clue 1",
              text: "'ബിസ്കറ്റ് കിംഗ്' എന്നറിയപ്പെടുന്ന പ്രശസ്തനായ മലയാളി വ്യവസായി രാജൻ പിള്ള ഒരു കാലത്ത് ഈ കമ്പനിയുടെ ആഗോള നിയന്ത്രണം ഏറ്റെടുത്തിരുന്നു.",
              image: null
            },
            {
              clueNum: 2,
              label: "Clue 2",
              text: "1892-ൽ കൊൽക്കത്തയിലെ ഒരു ചെറിയ വീട്ടിൽ നിന്നും ആരംഭിച്ച, ഇന്ത്യയിലെ ഏറ്റവും ആദ്യത്തെ ബിസ്കറ്റ് കമ്പനി ഇതാണ്.",
              image: null
            },
            {
              clueNum: 3,
              label: "Clue 3",
              text: "ഗുഡ് ഡേ (Good Day), ടൈഗർ (Tiger), മേരി ഗോൾഡ് (Marie Gold) തുടങ്ങിയ പ്രശസ്തമായ ബ്രാൻഡുകൾ ഈ കമ്പനിയുടേതാണ്.",
              image: null
            }
          ]
        },
        {
          boxNum: 6,
          label: "Box 6",
          qCode: "B-6-1",
          answer: "Turkey / Türkiye (തുർക്കി)",
          hint: "Eurasian nation straddling Eastern Europe and Western Asia, flag features crescent and star.",
          clues: [
            {
              clueNum: 1,
              label: "Clue 1",
              text: "'Widen Your World' എന്ന ടാഗ്ലൈനുള്ള, ലോകത്ത് ഏറ്റവും കൂടുതൽ രാജ്യങ്ങളിലേക്ക് സർവീസ് നടത്തുന്ന ഗിന്നസ് റെക്കോർഡ് നേടിയ വിമാനക്കമ്പനി ഈ രാജ്യത്തിൻ്റേതാണ്.",
              image: "quizassets/round4-cl1-q6img.jpeg"
            },
            {
              clueNum: 2,
              label: "Clue 2",
              text: "2026 നവംബറിൽ അൻ്റാലിയയിൽ വെച്ച് നടന്ന ഐക്യരാഷ്ട്രസഭയുടെ കാലാവസ്ഥാ ഉച്ചകോടിയായ COP31-ന് ആതിഥേയത്വം വഹിച്ച രാജ്യമാണിത്.",
              image: null
            },
            {
              clueNum: 3,
              label: "Clue 3",
              text: "ചരിത്രപ്രസിദ്ധമായ ഹാഗിയ സോഫിയ (Hagia Sophia), ബ്ലൂ മോസ്ക് (Blue Mosque), ടോപ്കാപി കൊട്ടാരം (Topkapi Palace) എന്നിവ സ്ഥിതി ചെയ്യുന്ന രാജ്യമാണിത്.",
              image: null
            }
          ]
        }
      ]
    },
    {
      id: 5,
      title: "Round 5",
      subtitle: "The Grand Finale Round",
      type: "general",
      totalQuestions: 5,
      description: "5 Final decisive questions for all teams. Identify logos, country of origin, odd pair, economics, and personality.",
      rules: [
        "5 Final questions for the competition.",
        "60 Seconds countdown per question.",
        "Visual inspection and sharp deduction required."
      ],
      questions: [
        {
          id: "r5-q1",
          round: 5,
          qNum: 1,
          text: "Which of these is the latest McDonald's logo?",
          image: "quizassets/round5-q1img.png",
          answer: "The minimalist pure Golden Arches without frame/shadow",
          hint: "McDonald's modern flat corporate identity."
        },
        {
          id: "r5-q2",
          round: 5,
          qNum: 2,
          text: "Which country do all these brands originate from?",
          image: "quizassets/round5-q2img.jpeg",
          answer: "Sweden (IKEA, H&M, Spotify, Ericsson, Volvo)",
          hint: "Scandinavian powerhouse known for design, tech, and innovation."
        },
        {
          id: "r5-q3",
          round: 5,
          qNum: 3,
          text: "Find the odd one out from the given pairs?",
          image: "quizassets/round5-q3img.jpeg",
          answer: "c. HORSE - LAMBORGHINI (Lamborghini's emblem is a Raging Bull, not a horse)",
          hint: "Ferrari and Porsche feature a horse; Lamborghini features the Ferruccio Lamborghini bull."
        },
        {
          id: "r5-q4",
          round: 5,
          qNum: 4,
          text: "In economics, whose needs does the 'Silver Economy' refer to?",
          image: null,
          answer: "Senior Citizens / Elderly (The Ageing Population, aged 50+ / 60+)",
          hint: "Refers to the system of production, distribution and consumption of goods and services aimed at utilizing the purchasing potential of older people."
        },
        {
          id: "r5-q5",
          round: 5,
          qNum: 5,
          text: "Who am I?",
          image: "quizassets/round5-q5img.jpeg",
          answer: "Booker Prize Author / Samantha Harvey (or M.J. Harrison / Booker Nominee)",
          hint: "Author of the Booker Prize listed work shown next to the prestigious trophy."
        }
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = QUIZ_DATA;
}
