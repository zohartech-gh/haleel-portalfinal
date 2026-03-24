import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminHash = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@haleel.org" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@haleel.org",
      passwordHash: adminHash,
      role: "ADMIN",
      level: "JHS",
    },
  });

  // Create demo students
  const studentHash = await bcrypt.hash("student123", 12);
  await prisma.user.upsert({
    where: { email: "jhs@haleel.org" },
    update: {},
    create: {
      name: "Kofi Mensah",
      email: "jhs@haleel.org",
      passwordHash: studentHash,
      role: "STUDENT",
      level: "JHS",
    },
  });
  await prisma.user.upsert({
    where: { email: "shs@haleel.org" },
    update: {},
    create: {
      name: "Ama Darko",
      email: "shs@haleel.org",
      passwordHash: studentHash,
      role: "STUDENT",
      level: "SHS",
    },
  });

  // JHS Subjects
  const jhsSubjects = [
    "Mathematics", "English Language", "Integrated Science", "Social Studies",
    "ICT", "RME", "French", "Creative Arts", "Career Technology",
  ];

  for (const name of jhsSubjects) {
    await prisma.subject.upsert({
      where: { name_level: { name, level: "JHS" } },
      update: {},
      create: { name, level: "JHS", category: "CORE", examType: "BECE" },
    });
  }

  // SHS Core Subjects
  const shsCore = ["Core Mathematics", "English Language", "Integrated Science", "Social Studies"];
  for (const name of shsCore) {
    await prisma.subject.upsert({
      where: { name_level: { name, level: "SHS" } },
      update: {},
      create: { name, level: "SHS", category: "CORE", examType: "WASSCE" },
    });
  }

  // SHS Electives
  const shsElectives = [
    "Physics", "Chemistry", "Biology", "Economics",
    "Geography", "Government", "Literature", "Elective Mathematics", "Accounting",
  ];
  for (const name of shsElectives) {
    await prisma.subject.upsert({
      where: { name_level: { name, level: "SHS" } },
      update: {},
      create: { name, level: "SHS", category: "ELECTIVE", examType: "WASSCE" },
    });
  }

  // Seed questions
  const allSubjects = await prisma.subject.findMany();
  const subjectMap = new Map(allSubjects.map((s) => [`${s.name}:${s.level}`, s]));

  const questions = [
    // JHS Mathematics
    ...makeQuestions("Mathematics", "JHS", "BECE", [
      { topic: "Algebra", year: 2022, questionText: "Solve for x: 2x + 5 = 15", optionA: "3", optionB: "5", optionC: "7", optionD: "10", correctOption: "B", explanation: "2x + 5 = 15, 2x = 10, x = 5", difficulty: "EASY" },
      { topic: "Algebra", year: 2022, questionText: "What is the value of 3(x - 2) when x = 5?", optionA: "6", optionB: "9", optionC: "12", optionD: "15", correctOption: "B", explanation: "3(5 - 2) = 3(3) = 9", difficulty: "EASY" },
      { topic: "Geometry", year: 2021, questionText: "What is the area of a rectangle with length 8cm and width 5cm?", optionA: "13 cm\u00B2", optionB: "26 cm\u00B2", optionC: "40 cm\u00B2", optionD: "80 cm\u00B2", correctOption: "C", explanation: "Area = length x width = 8 x 5 = 40 cm\u00B2", difficulty: "EASY" },
      { topic: "Fractions", year: 2021, questionText: "Simplify: 3/4 + 1/2", optionA: "4/6", optionB: "5/4", optionC: "1", optionD: "7/4", correctOption: "B", explanation: "3/4 + 2/4 = 5/4", difficulty: "MEDIUM" },
      { topic: "Percentages", year: 2020, questionText: "What is 25% of 200?", optionA: "25", optionB: "50", optionC: "75", optionD: "100", correctOption: "B", explanation: "25/100 x 200 = 50", difficulty: "EASY" },
      { topic: "Numbers", year: 2023, questionText: "What is the LCM of 4 and 6?", optionA: "2", optionB: "12", optionC: "24", optionD: "6", correctOption: "B", explanation: "Multiples of 4: 4,8,12... Multiples of 6: 6,12... LCM = 12", difficulty: "MEDIUM" },
      { topic: "Numbers", year: 2023, questionText: "Express 0.75 as a fraction in its simplest form.", optionA: "3/4", optionB: "7/5", optionC: "75/10", optionD: "15/20", correctOption: "A", explanation: "0.75 = 75/100 = 3/4", difficulty: "EASY" },
      { topic: "Geometry", year: 2022, questionText: "The sum of angles in a triangle is:", optionA: "90\u00B0", optionB: "180\u00B0", optionC: "270\u00B0", optionD: "360\u00B0", correctOption: "B", explanation: "The sum of interior angles of a triangle is always 180\u00B0", difficulty: "EASY" },
      { topic: "Statistics", year: 2021, questionText: "Find the mean of 4, 6, 8, 10, 12", optionA: "6", optionB: "8", optionC: "10", optionD: "12", correctOption: "B", explanation: "(4+6+8+10+12)/5 = 40/5 = 8", difficulty: "MEDIUM" },
      { topic: "Algebra", year: 2020, questionText: "If y = 3x + 1 and x = 2, find y.", optionA: "5", optionB: "7", optionC: "9", optionD: "6", correctOption: "B", explanation: "y = 3(2) + 1 = 6 + 1 = 7", difficulty: "EASY" },
    ]),
    // JHS English
    ...makeQuestions("English Language", "JHS", "BECE", [
      { topic: "Grammar", year: 2022, questionText: "Choose the correct form: She ____ to school every day.", optionA: "go", optionB: "goes", optionC: "going", optionD: "gone", correctOption: "B", explanation: "Third person singular present tense requires 'goes'.", difficulty: "EASY" },
      { topic: "Vocabulary", year: 2022, questionText: "The word 'benevolent' means:", optionA: "cruel", optionB: "kind and generous", optionC: "sad", optionD: "angry", correctOption: "B", explanation: "Benevolent means well-meaning and kindly.", difficulty: "MEDIUM" },
      { topic: "Comprehension", year: 2021, questionText: "An antonym of 'ancient' is:", optionA: "old", optionB: "modern", optionC: "historic", optionD: "aged", correctOption: "B", explanation: "Modern is the opposite of ancient.", difficulty: "EASY" },
      { topic: "Grammar", year: 2021, questionText: "Identify the noun in: 'The cat sat on the mat.'", optionA: "sat", optionB: "on", optionC: "cat", optionD: "the", correctOption: "C", explanation: "Cat and mat are nouns. Cat is the subject noun.", difficulty: "EASY" },
      { topic: "Grammar", year: 2020, questionText: "Which sentence is correct?", optionA: "He don't like rice.", optionB: "He doesn't likes rice.", optionC: "He doesn't like rice.", optionD: "He not like rice.", correctOption: "C", explanation: "Correct negation: subject + doesn't + base verb.", difficulty: "EASY" },
      { topic: "Vocabulary", year: 2023, questionText: "A person who writes books is called a/an:", optionA: "editor", optionB: "author", optionC: "publisher", optionD: "librarian", correctOption: "B", explanation: "An author is a person who writes books.", difficulty: "EASY" },
      { topic: "Grammar", year: 2023, questionText: "The plural of 'child' is:", optionA: "childs", optionB: "childrens", optionC: "children", optionD: "childes", correctOption: "C", explanation: "Child has an irregular plural: children.", difficulty: "EASY" },
      { topic: "Grammar", year: 2022, questionText: "Choose the correct pronoun: 'Mary said ____ would come.'", optionA: "her", optionB: "she", optionC: "hers", optionD: "herself", correctOption: "B", explanation: "She is the subject pronoun needed here.", difficulty: "MEDIUM" },
      { topic: "Comprehension", year: 2021, questionText: "A synonym of 'happy' is:", optionA: "sad", optionB: "angry", optionC: "joyful", optionD: "tired", correctOption: "C", explanation: "Joyful means the same as happy.", difficulty: "EASY" },
      { topic: "Vocabulary", year: 2020, questionText: "What does 'transparent' mean?", optionA: "Opaque", optionB: "See-through", optionC: "Colorful", optionD: "Dark", correctOption: "B", explanation: "Transparent means allowing light to pass through; see-through.", difficulty: "MEDIUM" },
    ]),
    // JHS Integrated Science
    ...makeQuestions("Integrated Science", "JHS", "BECE", [
      { topic: "Living Things", year: 2022, questionText: "Which organ pumps blood in the human body?", optionA: "Liver", optionB: "Lungs", optionC: "Heart", optionD: "Kidney", correctOption: "C", explanation: "The heart is responsible for pumping blood throughout the body.", difficulty: "EASY" },
      { topic: "Matter", year: 2022, questionText: "Water boils at what temperature (at sea level)?", optionA: "50\u00B0C", optionB: "100\u00B0C", optionC: "150\u00B0C", optionD: "200\u00B0C", correctOption: "B", explanation: "Water boils at 100\u00B0C (212\u00B0F) at standard atmospheric pressure.", difficulty: "EASY" },
      { topic: "Energy", year: 2021, questionText: "Solar energy comes from the:", optionA: "Moon", optionB: "Stars", optionC: "Sun", optionD: "Earth", correctOption: "C", explanation: "Solar energy is radiant energy from the Sun.", difficulty: "EASY" },
      { topic: "Living Things", year: 2021, questionText: "Photosynthesis occurs in which part of the plant?", optionA: "Roots", optionB: "Stem", optionC: "Leaves", optionD: "Flowers", correctOption: "C", explanation: "Photosynthesis mainly occurs in the leaves where chlorophyll is present.", difficulty: "MEDIUM" },
      { topic: "Matter", year: 2023, questionText: "Which of these is a chemical change?", optionA: "Melting ice", optionB: "Rusting of iron", optionC: "Boiling water", optionD: "Cutting paper", correctOption: "B", explanation: "Rusting involves a chemical reaction between iron and oxygen.", difficulty: "MEDIUM" },
      { topic: "Forces", year: 2020, questionText: "The force that pulls objects toward the Earth is called:", optionA: "Friction", optionB: "Magnetism", optionC: "Gravity", optionD: "Tension", correctOption: "C", explanation: "Gravity is the force of attraction between objects with mass.", difficulty: "EASY" },
      { topic: "Living Things", year: 2023, questionText: "Which blood cells fight infections?", optionA: "Red blood cells", optionB: "White blood cells", optionC: "Platelets", optionD: "Plasma", correctOption: "B", explanation: "White blood cells are part of the immune system and fight infections.", difficulty: "MEDIUM" },
      { topic: "Matter", year: 2022, questionText: "The three states of matter are:", optionA: "Hot, cold, warm", optionB: "Solid, liquid, gas", optionC: "Big, medium, small", optionD: "Heavy, light, neutral", correctOption: "B", explanation: "The three common states of matter are solid, liquid, and gas.", difficulty: "EASY" },
      { topic: "Energy", year: 2021, questionText: "Which device converts electrical energy to light?", optionA: "Generator", optionB: "Motor", optionC: "Bulb", optionD: "Battery", correctOption: "C", explanation: "A light bulb converts electrical energy into light (and heat) energy.", difficulty: "EASY" },
      { topic: "Environment", year: 2020, questionText: "Which gas do humans breathe out?", optionA: "Oxygen", optionB: "Nitrogen", optionC: "Carbon dioxide", optionD: "Hydrogen", correctOption: "C", explanation: "Humans exhale carbon dioxide as a waste product of respiration.", difficulty: "EASY" },
    ]),
    // JHS Social Studies
    ...makeQuestions("Social Studies", "JHS", "BECE", [
      { topic: "Ghana History", year: 2022, questionText: "Ghana gained independence in which year?", optionA: "1945", optionB: "1957", optionC: "1960", optionD: "1966", correctOption: "B", explanation: "Ghana gained independence from Britain on March 6, 1957.", difficulty: "EASY" },
      { topic: "Government", year: 2022, questionText: "The head of state of Ghana is the:", optionA: "Chief Justice", optionB: "Speaker of Parliament", optionC: "President", optionD: "Vice President", correctOption: "C", explanation: "The President is the head of state and government in Ghana.", difficulty: "EASY" },
      { topic: "Geography", year: 2021, questionText: "The capital city of Ghana is:", optionA: "Kumasi", optionB: "Tamale", optionC: "Cape Coast", optionD: "Accra", correctOption: "D", explanation: "Accra is the capital and largest city of Ghana.", difficulty: "EASY" },
      { topic: "Culture", year: 2021, questionText: "The Homowo festival is celebrated by the:", optionA: "Ashanti", optionB: "Ga people", optionC: "Ewe", optionD: "Dagomba", correctOption: "B", explanation: "Homowo is a festival of the Ga people of Accra.", difficulty: "MEDIUM" },
      { topic: "Government", year: 2023, questionText: "How many regions does Ghana currently have?", optionA: "10", optionB: "12", optionC: "14", optionD: "16", correctOption: "D", explanation: "Ghana has 16 administrative regions after the 2018 referendum.", difficulty: "MEDIUM" },
      { topic: "Geography", year: 2020, questionText: "The largest lake in Ghana is:", optionA: "Lake Bosomtwe", optionB: "Lake Volta", optionC: "Lake Chad", optionD: "Lake Victoria", correctOption: "B", explanation: "Lake Volta is the largest artificial lake in Ghana and one of the largest in the world.", difficulty: "EASY" },
      { topic: "Ghana History", year: 2023, questionText: "Who was the first President of Ghana?", optionA: "J.B. Danquah", optionB: "Kwame Nkrumah", optionC: "Kofi Busia", optionD: "Jerry Rawlings", correctOption: "B", explanation: "Dr. Kwame Nkrumah was the first President of Ghana.", difficulty: "EASY" },
      { topic: "Citizenship", year: 2022, questionText: "The national anthem of Ghana is:", optionA: "God Save the Queen", optionB: "Star Spangled Banner", optionC: "God Bless Our Homeland Ghana", optionD: "Yen Ara Asase Ni", correctOption: "C", explanation: "God Bless Our Homeland Ghana is the national anthem.", difficulty: "EASY" },
      { topic: "Environment", year: 2021, questionText: "Deforestation leads to:", optionA: "More rainfall", optionB: "Soil erosion", optionC: "Cleaner air", optionD: "More wildlife", correctOption: "B", explanation: "Removing trees exposes soil to wind and rain, causing erosion.", difficulty: "MEDIUM" },
      { topic: "Culture", year: 2020, questionText: "Kente cloth originates from the:", optionA: "Ga people", optionB: "Ewe and Ashanti", optionC: "Fante", optionD: "Dagomba", correctOption: "B", explanation: "Kente cloth is traditionally woven by the Ashanti and Ewe people.", difficulty: "MEDIUM" },
    ]),
    // SHS Core Mathematics
    ...makeQuestions("Core Mathematics", "SHS", "WASSCE", [
      { topic: "Algebra", year: 2022, questionText: "Solve: x\u00B2 - 5x + 6 = 0", optionA: "x = 2, 3", optionB: "x = 1, 6", optionC: "x = -2, -3", optionD: "x = -1, 6", correctOption: "A", explanation: "(x-2)(x-3) = 0, so x = 2 or x = 3", difficulty: "MEDIUM" },
      { topic: "Trigonometry", year: 2022, questionText: "What is sin(30\u00B0)?", optionA: "1", optionB: "0.5", optionC: "0.866", optionD: "0", correctOption: "B", explanation: "sin(30\u00B0) = 1/2 = 0.5", difficulty: "EASY" },
      { topic: "Sets", year: 2021, questionText: "If A = {1,2,3} and B = {2,3,4}, find A \u2229 B.", optionA: "{1,2,3,4}", optionB: "{2,3}", optionC: "{1,4}", optionD: "{}", correctOption: "B", explanation: "A \u2229 B contains elements common to both sets: {2,3}", difficulty: "EASY" },
      { topic: "Statistics", year: 2021, questionText: "The median of 3, 7, 1, 9, 5 is:", optionA: "3", optionB: "5", optionC: "7", optionD: "9", correctOption: "B", explanation: "Arranged: 1,3,5,7,9. The middle value is 5.", difficulty: "EASY" },
      { topic: "Logarithms", year: 2023, questionText: "Evaluate log\u2081\u2080(100).", optionA: "1", optionB: "2", optionC: "10", optionD: "100", correctOption: "B", explanation: "log\u2081\u2080(100) = log\u2081\u2080(10\u00B2) = 2", difficulty: "EASY" },
      { topic: "Probability", year: 2020, questionText: "A fair die is thrown. What is P(even number)?", optionA: "1/6", optionB: "1/3", optionC: "1/2", optionD: "2/3", correctOption: "C", explanation: "Even numbers: 2,4,6. P = 3/6 = 1/2", difficulty: "EASY" },
      { topic: "Algebra", year: 2023, questionText: "Simplify: (2x\u00B3)(3x\u00B2)", optionA: "5x\u2075", optionB: "6x\u2075", optionC: "6x\u2076", optionD: "5x\u2076", correctOption: "B", explanation: "2\u00D73 = 6, x\u00B3\u00B7x\u00B2 = x\u2075. Answer: 6x\u2075", difficulty: "EASY" },
      { topic: "Geometry", year: 2022, questionText: "The distance between points (1,2) and (4,6) is:", optionA: "3", optionB: "4", optionC: "5", optionD: "7", correctOption: "C", explanation: "d = \u221A((4-1)\u00B2 + (6-2)\u00B2) = \u221A(9+16) = \u221A25 = 5", difficulty: "MEDIUM" },
      { topic: "Sequences", year: 2021, questionText: "The 5th term of the AP: 3, 7, 11, 15, ... is:", optionA: "17", optionB: "19", optionC: "21", optionD: "23", correctOption: "B", explanation: "Common difference d = 4. a\u2085 = 3 + 4(4) = 19", difficulty: "MEDIUM" },
      { topic: "Algebra", year: 2020, questionText: "If f(x) = 2x + 3, find f(4).", optionA: "8", optionB: "10", optionC: "11", optionD: "14", correctOption: "C", explanation: "f(4) = 2(4) + 3 = 8 + 3 = 11", difficulty: "EASY" },
    ]),
    // SHS English
    ...makeQuestions("English Language", "SHS", "WASSCE", [
      { topic: "Grammar", year: 2022, questionText: "Choose the correct option: 'Neither the students nor the teacher ____ present.'", optionA: "were", optionB: "was", optionC: "are", optionD: "have been", correctOption: "B", explanation: "With 'neither...nor', the verb agrees with the nearest subject (teacher = singular).", difficulty: "MEDIUM" },
      { topic: "Vocabulary", year: 2022, questionText: "An 'altruistic' person is one who is:", optionA: "selfish", optionB: "selfless", optionC: "arrogant", optionD: "lazy", correctOption: "B", explanation: "Altruistic means showing a selfless concern for others.", difficulty: "MEDIUM" },
      { topic: "Grammar", year: 2021, questionText: "Identify the figure of speech: 'The wind howled in the night.'", optionA: "Simile", optionB: "Metaphor", optionC: "Personification", optionD: "Hyperbole", correctOption: "C", explanation: "Giving human qualities (howling) to the wind is personification.", difficulty: "MEDIUM" },
      { topic: "Comprehension", year: 2023, questionText: "A 'bibliography' is:", optionA: "A biography", optionB: "A list of references", optionC: "A book summary", optionD: "A table of contents", correctOption: "B", explanation: "A bibliography is a list of books and sources used or referenced.", difficulty: "EASY" },
      { topic: "Grammar", year: 2021, questionText: "The passive form of 'She wrote the letter' is:", optionA: "The letter is written by her", optionB: "The letter was written by her", optionC: "The letter was wrote by her", optionD: "She was written the letter", correctOption: "B", explanation: "Past tense active to passive: was/were + past participle + by agent.", difficulty: "MEDIUM" },
      { topic: "Vocabulary", year: 2020, questionText: "'Ubiquitous' means:", optionA: "Rare", optionB: "Present everywhere", optionC: "Unique", optionD: "Dangerous", correctOption: "B", explanation: "Ubiquitous means found everywhere; omnipresent.", difficulty: "HARD" },
      { topic: "Grammar", year: 2023, questionText: "Which is a compound sentence?", optionA: "I ran fast.", optionB: "I ran fast, but I lost the race.", optionC: "Running fast, I won.", optionD: "The fast runner.", correctOption: "B", explanation: "A compound sentence has two independent clauses joined by a conjunction.", difficulty: "MEDIUM" },
      { topic: "Literature", year: 2022, questionText: "A 'soliloquy' in drama is:", optionA: "A conversation between two characters", optionB: "A speech by one character alone on stage", optionC: "The conclusion of a play", optionD: "Stage directions", correctOption: "B", explanation: "A soliloquy is when a character speaks their thoughts aloud while alone.", difficulty: "MEDIUM" },
      { topic: "Grammar", year: 2021, questionText: "Choose the correct spelling:", optionA: "Occassion", optionB: "Ocassion", optionC: "Occasion", optionD: "Ocasion", correctOption: "C", explanation: "The correct spelling is 'occasion' with two c's and one s.", difficulty: "EASY" },
      { topic: "Vocabulary", year: 2020, questionText: "The opposite of 'verbose' is:", optionA: "Lengthy", optionB: "Concise", optionC: "Eloquent", optionD: "Fluent", correctOption: "B", explanation: "Verbose means using too many words. Concise is the opposite.", difficulty: "MEDIUM" },
    ]),
    // SHS Physics
    ...makeQuestions("Physics", "SHS", "WASSCE", [
      { topic: "Mechanics", year: 2022, questionText: "Newton's second law states that F = ?", optionA: "mv", optionB: "ma", optionC: "mg", optionD: "mv\u00B2", correctOption: "B", explanation: "Force = mass x acceleration (F = ma)", difficulty: "EASY" },
      { topic: "Waves", year: 2022, questionText: "The speed of light in a vacuum is approximately:", optionA: "3 x 10\u2076 m/s", optionB: "3 x 10\u2078 m/s", optionC: "3 x 10\u00B9\u2070 m/s", optionD: "3 x 10\u00B9\u00B2 m/s", correctOption: "B", explanation: "The speed of light is approximately 3 x 10\u2078 m/s.", difficulty: "EASY" },
      { topic: "Electricity", year: 2021, questionText: "Ohm's law is expressed as:", optionA: "V = IR", optionB: "V = I/R", optionC: "V = R/I", optionD: "V = I + R", correctOption: "A", explanation: "Ohm's law: Voltage = Current x Resistance (V = IR)", difficulty: "EASY" },
      { topic: "Mechanics", year: 2023, questionText: "The SI unit of force is:", optionA: "Joule", optionB: "Watt", optionC: "Newton", optionD: "Pascal", correctOption: "C", explanation: "The Newton (N) is the SI unit of force.", difficulty: "EASY" },
      { topic: "Energy", year: 2021, questionText: "Kinetic energy is given by:", optionA: "mgh", optionB: "\u00BDmv\u00B2", optionC: "Fd", optionD: "Pt", correctOption: "B", explanation: "Kinetic energy = \u00BDmv\u00B2", difficulty: "EASY" },
      { topic: "Mechanics", year: 2020, questionText: "A body at rest will remain at rest unless acted upon by an external force. This is Newton's:", optionA: "First law", optionB: "Second law", optionC: "Third law", optionD: "Law of gravitation", correctOption: "A", explanation: "This describes Newton's first law of motion (law of inertia).", difficulty: "EASY" },
      { topic: "Optics", year: 2023, questionText: "The image formed by a plane mirror is:", optionA: "Real and inverted", optionB: "Virtual and erect", optionC: "Real and erect", optionD: "Virtual and inverted", correctOption: "B", explanation: "A plane mirror always forms a virtual, erect, and laterally inverted image.", difficulty: "MEDIUM" },
      { topic: "Waves", year: 2022, questionText: "Sound waves are:", optionA: "Transverse waves", optionB: "Longitudinal waves", optionC: "Electromagnetic waves", optionD: "Surface waves", correctOption: "B", explanation: "Sound waves are longitudinal (compressional) waves.", difficulty: "EASY" },
      { topic: "Electricity", year: 2021, questionText: "Two resistors of 4\u03A9 and 6\u03A9 in series have total resistance:", optionA: "2.4\u03A9", optionB: "5\u03A9", optionC: "10\u03A9", optionD: "24\u03A9", correctOption: "C", explanation: "In series: R_total = R1 + R2 = 4 + 6 = 10\u03A9", difficulty: "EASY" },
      { topic: "Mechanics", year: 2020, questionText: "Acceleration due to gravity (g) is approximately:", optionA: "8.9 m/s\u00B2", optionB: "9.8 m/s\u00B2", optionC: "10.8 m/s\u00B2", optionD: "11.8 m/s\u00B2", correctOption: "B", explanation: "g \u2248 9.8 m/s\u00B2 (often approximated as 10 m/s\u00B2)", difficulty: "EASY" },
    ]),
    // SHS Chemistry
    ...makeQuestions("Chemistry", "SHS", "WASSCE", [
      { topic: "Atomic Structure", year: 2022, questionText: "The atomic number of an element is the number of:", optionA: "Neutrons", optionB: "Protons", optionC: "Electrons in outer shell", optionD: "Nucleons", correctOption: "B", explanation: "Atomic number = number of protons in the nucleus.", difficulty: "EASY" },
      { topic: "Periodic Table", year: 2022, questionText: "Elements in the same group have the same number of:", optionA: "Protons", optionB: "Neutrons", optionC: "Valence electrons", optionD: "Total electrons", correctOption: "C", explanation: "Elements in the same group have the same number of valence electrons.", difficulty: "EASY" },
      { topic: "Chemical Bonding", year: 2021, questionText: "NaCl is an example of:", optionA: "Covalent bonding", optionB: "Ionic bonding", optionC: "Metallic bonding", optionD: "Van der Waals forces", correctOption: "B", explanation: "NaCl is formed by ionic bonding between Na+ and Cl- ions.", difficulty: "EASY" },
      { topic: "Stoichiometry", year: 2023, questionText: "How many moles are in 44g of CO\u2082? (C=12, O=16)", optionA: "0.5", optionB: "1", optionC: "2", optionD: "4", correctOption: "B", explanation: "Molar mass of CO\u2082 = 12 + 2(16) = 44g/mol. Moles = 44/44 = 1", difficulty: "MEDIUM" },
      { topic: "Acids & Bases", year: 2021, questionText: "The pH of a neutral solution is:", optionA: "0", optionB: "5", optionC: "7", optionD: "14", correctOption: "C", explanation: "A neutral solution has a pH of 7.", difficulty: "EASY" },
      { topic: "Gases", year: 2020, questionText: "At STP, the volume of 1 mole of any gas is:", optionA: "11.2 dm\u00B3", optionB: "22.4 dm\u00B3", optionC: "44.8 dm\u00B3", optionD: "100 dm\u00B3", correctOption: "B", explanation: "At STP, 1 mole of any ideal gas occupies 22.4 dm\u00B3.", difficulty: "MEDIUM" },
      { topic: "Organic Chemistry", year: 2023, questionText: "The first member of the alkane series is:", optionA: "Ethane", optionB: "Methane", optionC: "Propane", optionD: "Butane", correctOption: "B", explanation: "Methane (CH\u2084) is the first and simplest alkane.", difficulty: "EASY" },
      { topic: "Reactions", year: 2022, questionText: "Rusting of iron is an example of:", optionA: "Physical change", optionB: "Reduction", optionC: "Oxidation", optionD: "Neutralization", correctOption: "C", explanation: "Rusting is oxidation: iron reacts with oxygen and water.", difficulty: "EASY" },
      { topic: "Atomic Structure", year: 2021, questionText: "Isotopes have the same number of ____ but different ____.", optionA: "neutrons, protons", optionB: "protons, neutrons", optionC: "electrons, protons", optionD: "protons, electrons", correctOption: "B", explanation: "Isotopes: same protons (same element) but different neutrons.", difficulty: "MEDIUM" },
      { topic: "Electrolysis", year: 2020, questionText: "During electrolysis, cations move to the:", optionA: "Anode", optionB: "Cathode", optionC: "Both electrodes", optionD: "Neither electrode", correctOption: "B", explanation: "Cations (positive ions) move to the cathode (negative electrode).", difficulty: "MEDIUM" },
    ]),
    // SHS Biology
    ...makeQuestions("Biology", "SHS", "WASSCE", [
      { topic: "Cell Biology", year: 2022, questionText: "The powerhouse of the cell is the:", optionA: "Nucleus", optionB: "Ribosome", optionC: "Mitochondria", optionD: "Golgi body", correctOption: "C", explanation: "Mitochondria produce ATP, the cell's energy currency.", difficulty: "EASY" },
      { topic: "Genetics", year: 2022, questionText: "DNA stands for:", optionA: "Deoxyribose Nucleic Acid", optionB: "Deoxyribonucleic Acid", optionC: "Dinitrogen Acid", optionD: "Dinucleotide Acid", correctOption: "B", explanation: "DNA = Deoxyribonucleic Acid.", difficulty: "EASY" },
      { topic: "Ecology", year: 2021, questionText: "The study of the relationship between organisms and their environment is:", optionA: "Genetics", optionB: "Ecology", optionC: "Anatomy", optionD: "Taxonomy", correctOption: "B", explanation: "Ecology is the study of organisms and their interactions with the environment.", difficulty: "EASY" },
      { topic: "Cell Biology", year: 2023, questionText: "Which organelle is responsible for protein synthesis?", optionA: "Lysosome", optionB: "Ribosome", optionC: "Vacuole", optionD: "Centriole", correctOption: "B", explanation: "Ribosomes are the sites of protein synthesis in cells.", difficulty: "EASY" },
      { topic: "Evolution", year: 2021, questionText: "The theory of natural selection was proposed by:", optionA: "Gregor Mendel", optionB: "Louis Pasteur", optionC: "Charles Darwin", optionD: "Robert Hooke", correctOption: "C", explanation: "Charles Darwin proposed the theory of evolution by natural selection.", difficulty: "EASY" },
      { topic: "Genetics", year: 2020, questionText: "In humans, the sex chromosomes of a male are:", optionA: "XX", optionB: "XY", optionC: "YY", optionD: "XXY", correctOption: "B", explanation: "Males have XY sex chromosomes; females have XX.", difficulty: "EASY" },
      { topic: "Nutrition", year: 2023, questionText: "Enzymes are biological:", optionA: "Lipids", optionB: "Catalysts", optionC: "Carbohydrates", optionD: "Vitamins", correctOption: "B", explanation: "Enzymes are biological catalysts that speed up chemical reactions.", difficulty: "EASY" },
      { topic: "Respiration", year: 2022, questionText: "Anaerobic respiration in yeast produces:", optionA: "Lactic acid", optionB: "Ethanol and CO\u2082", optionC: "Water", optionD: "Oxygen", correctOption: "B", explanation: "Yeast undergoes alcoholic fermentation producing ethanol and CO\u2082.", difficulty: "MEDIUM" },
      { topic: "Cell Biology", year: 2021, questionText: "Which structure is found in plant cells but NOT animal cells?", optionA: "Nucleus", optionB: "Cell wall", optionC: "Mitochondria", optionD: "Ribosome", correctOption: "B", explanation: "Plant cells have a rigid cell wall; animal cells do not.", difficulty: "EASY" },
      { topic: "Ecology", year: 2020, questionText: "A food chain always starts with:", optionA: "Herbivore", optionB: "Carnivore", optionC: "Producer", optionD: "Decomposer", correctOption: "C", explanation: "Food chains start with producers (green plants) that make their own food.", difficulty: "EASY" },
    ]),
    // SHS Integrated Science
    ...makeQuestions("Integrated Science", "SHS", "WASSCE", [
      { topic: "Biology", year: 2022, questionText: "The basic unit of life is the:", optionA: "Tissue", optionB: "Organ", optionC: "Cell", optionD: "Atom", correctOption: "C", explanation: "The cell is the basic structural and functional unit of life.", difficulty: "EASY" },
      { topic: "Chemistry", year: 2022, questionText: "The chemical formula for water is:", optionA: "H\u2082O", optionB: "CO\u2082", optionC: "NaCl", optionD: "O\u2082", correctOption: "A", explanation: "Water consists of 2 hydrogen atoms and 1 oxygen atom: H\u2082O.", difficulty: "EASY" },
      { topic: "Physics", year: 2021, questionText: "Which is a renewable energy source?", optionA: "Coal", optionB: "Natural gas", optionC: "Solar energy", optionD: "Petroleum", correctOption: "C", explanation: "Solar energy is renewable as it comes from the sun continuously.", difficulty: "EASY" },
      { topic: "Agriculture", year: 2023, questionText: "NPK fertilizer provides:", optionA: "Nitrogen, Potassium, Calcium", optionB: "Nitrogen, Phosphorus, Potassium", optionC: "Sodium, Phosphorus, Calcium", optionD: "Nitrogen, Phosphorus, Calcium", correctOption: "B", explanation: "NPK = Nitrogen (N), Phosphorus (P), Potassium (K).", difficulty: "EASY" },
      { topic: "Health", year: 2021, questionText: "Malaria is caused by:", optionA: "Virus", optionB: "Bacteria", optionC: "Plasmodium", optionD: "Fungus", correctOption: "C", explanation: "Malaria is caused by the Plasmodium parasite, transmitted by mosquitoes.", difficulty: "EASY" },
      { topic: "Technology", year: 2020, questionText: "The process of converting raw materials into finished goods is:", optionA: "Mining", optionB: "Manufacturing", optionC: "Farming", optionD: "Refining", correctOption: "B", explanation: "Manufacturing is the process of converting raw materials into products.", difficulty: "EASY" },
      { topic: "Environment", year: 2023, questionText: "The ozone layer protects Earth from:", optionA: "Infrared rays", optionB: "Ultraviolet rays", optionC: "Radio waves", optionD: "Microwaves", correctOption: "B", explanation: "The ozone layer absorbs harmful UV radiation from the sun.", difficulty: "EASY" },
      { topic: "Biology", year: 2022, questionText: "Photosynthesis requires all EXCEPT:", optionA: "Sunlight", optionB: "Water", optionC: "Carbon dioxide", optionD: "Oxygen", correctOption: "D", explanation: "Photosynthesis needs sunlight, water, and CO\u2082. Oxygen is a product.", difficulty: "MEDIUM" },
      { topic: "Physics", year: 2021, questionText: "The unit of electrical power is:", optionA: "Volt", optionB: "Ampere", optionC: "Watt", optionD: "Ohm", correctOption: "C", explanation: "The Watt (W) is the SI unit of power.", difficulty: "EASY" },
      { topic: "Chemistry", year: 2020, questionText: "An acid turns blue litmus paper:", optionA: "Blue", optionB: "Red", optionC: "Green", optionD: "No change", correctOption: "B", explanation: "Acids turn blue litmus paper red.", difficulty: "EASY" },
    ]),
    // SHS Social Studies
    ...makeQuestions("Social Studies", "SHS", "WASSCE", [
      { topic: "Government", year: 2022, questionText: "The three arms of government are:", optionA: "Executive, Military, Judiciary", optionB: "Executive, Legislature, Judiciary", optionC: "Executive, Legislature, Military", optionD: "President, Parliament, Police", correctOption: "B", explanation: "The three arms/branches are Executive, Legislature, and Judiciary.", difficulty: "EASY" },
      { topic: "Economics", year: 2022, questionText: "The law of demand states that as price increases:", optionA: "Demand increases", optionB: "Demand decreases", optionC: "Supply decreases", optionD: "Supply increases", correctOption: "B", explanation: "Law of demand: price and quantity demanded are inversely related.", difficulty: "EASY" },
      { topic: "Culture", year: 2021, questionText: "Socialization is the process by which:", optionA: "People make friends", optionB: "Individuals learn the norms and values of society", optionC: "Government controls citizens", optionD: "People move to cities", correctOption: "B", explanation: "Socialization is learning the norms, values, and behaviors of society.", difficulty: "EASY" },
      { topic: "Development", year: 2023, questionText: "GDP stands for:", optionA: "General Domestic Product", optionB: "Gross Domestic Product", optionC: "Gross Development Plan", optionD: "General Development Program", correctOption: "B", explanation: "GDP = Gross Domestic Product, the total value of goods and services.", difficulty: "EASY" },
      { topic: "Government", year: 2021, questionText: "The right to vote is called:", optionA: "Franchise", optionB: "Freedom", optionC: "Liberty", optionD: "Democracy", correctOption: "A", explanation: "Franchise (or suffrage) is the right to vote in elections.", difficulty: "EASY" },
      { topic: "Social Issues", year: 2020, questionText: "Rapid population growth can lead to:", optionA: "More resources", optionB: "Pressure on resources", optionC: "Less pollution", optionD: "More employment", correctOption: "B", explanation: "Rapid population growth puts pressure on limited resources.", difficulty: "EASY" },
      { topic: "Human Rights", year: 2023, questionText: "The Universal Declaration of Human Rights was adopted in:", optionA: "1945", optionB: "1948", optionC: "1957", optionD: "1960", correctOption: "B", explanation: "The UDHR was adopted by the UN General Assembly on December 10, 1948.", difficulty: "MEDIUM" },
      { topic: "Economics", year: 2022, questionText: "Inflation is a sustained increase in:", optionA: "Employment", optionB: "General price level", optionC: "Production", optionD: "Population", correctOption: "B", explanation: "Inflation is a sustained increase in the general price level.", difficulty: "EASY" },
      { topic: "Governance", year: 2021, questionText: "ECOWAS stands for:", optionA: "Economic Community of West African States", optionB: "Economic Council of West African States", optionC: "European Community of West African States", optionD: "Economic Committee of West African States", correctOption: "A", explanation: "ECOWAS = Economic Community of West African States.", difficulty: "EASY" },
      { topic: "Social Issues", year: 2020, questionText: "Urbanization refers to:", optionA: "Movement from cities to villages", optionB: "Growth of urban areas", optionC: "Building of roads", optionD: "Development of agriculture", correctOption: "B", explanation: "Urbanization is the increasing proportion of people living in urban areas.", difficulty: "EASY" },
    ]),
  ];

  for (const q of questions) {
    const subKey = `${q.subjectName}:${q.level}`;
    const subject = subjectMap.get(subKey);
    if (!subject) {
      console.warn(`Subject not found: ${subKey}`);
      continue;
    }
    await prisma.question.create({
      data: {
        level: q.level as "JHS" | "SHS",
        examType: q.examType as "BECE" | "WASSCE",
        subjectId: subject.id,
        topic: q.topic,
        year: q.year,
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctOption: q.correctOption,
        explanation: q.explanation,
        difficulty: q.difficulty as "EASY" | "MEDIUM" | "HARD",
      },
    });
  }

  console.log(`Seeded ${questions.length} questions.`);
  console.log("Seeding complete!");
  console.log("\nDemo accounts:");
  console.log("  Admin:       admin@haleel.org / admin123");
  console.log("  JHS Student: jhs@haleel.org / student123");
  console.log("  SHS Student: shs@haleel.org / student123");
}

function makeQuestions(
  subjectName: string,
  level: string,
  examType: string,
  qs: Array<{
    topic: string; year: number; questionText: string;
    optionA: string; optionB: string; optionC: string; optionD: string;
    correctOption: string; explanation: string; difficulty: string;
  }>
) {
  return qs.map((q) => ({ ...q, subjectName, level, examType }));
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
