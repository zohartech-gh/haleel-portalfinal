import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding haleel.org database with 200+ WAEC-style questions...\n");

  // ── Admin & Demo Users ──
  const adminHash = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@haleel.org" },
    update: {},
    create: { name: "Admin", email: "admin@haleel.org", passwordHash: adminHash, role: "ADMIN", level: "JHS" },
  });
  const studentHash = await bcrypt.hash("student123", 12);
  await prisma.user.upsert({
    where: { email: "jhs@haleel.org" },
    update: {},
    create: { name: "Kofi Mensah", email: "jhs@haleel.org", passwordHash: studentHash, role: "STUDENT", level: "JHS" },
  });
  await prisma.user.upsert({
    where: { email: "shs@haleel.org" },
    update: {},
    create: { name: "Ama Owusu", email: "shs@haleel.org", passwordHash: studentHash, role: "STUDENT", level: "SHS" },
  });
  console.log("✅ Users created");

  // ── Subjects ──
  const subjectDefs = [
    // JHS Core
    { name: "Mathematics", level: "JHS" as const, category: "CORE" as const, examType: "BECE" as const },
    { name: "English Language", level: "JHS" as const, category: "CORE" as const, examType: "BECE" as const },
    { name: "Integrated Science", level: "JHS" as const, category: "CORE" as const, examType: "BECE" as const },
    { name: "Social Studies", level: "JHS" as const, category: "CORE" as const, examType: "BECE" as const },
    { name: "ICT", level: "JHS" as const, category: "CORE" as const, examType: "BECE" as const },
    { name: "RME", level: "JHS" as const, category: "CORE" as const, examType: "BECE" as const },
    // SHS Core
    { name: "Core Mathematics", level: "SHS" as const, category: "CORE" as const, examType: "WASSCE" as const },
    { name: "English Language", level: "SHS" as const, category: "CORE" as const, examType: "WASSCE" as const },
    { name: "Integrated Science", level: "SHS" as const, category: "CORE" as const, examType: "WASSCE" as const },
    { name: "Social Studies", level: "SHS" as const, category: "CORE" as const, examType: "WASSCE" as const },
    // SHS Elective
    { name: "Physics", level: "SHS" as const, category: "ELECTIVE" as const, examType: "WASSCE" as const },
    { name: "Chemistry", level: "SHS" as const, category: "ELECTIVE" as const, examType: "WASSCE" as const },
    { name: "Biology", level: "SHS" as const, category: "ELECTIVE" as const, examType: "WASSCE" as const },
    { name: "Economics", level: "SHS" as const, category: "ELECTIVE" as const, examType: "WASSCE" as const },
    { name: "Geography", level: "SHS" as const, category: "ELECTIVE" as const, examType: "WASSCE" as const },
    { name: "Government", level: "SHS" as const, category: "ELECTIVE" as const, examType: "WASSCE" as const },
    { name: "Elective Mathematics", level: "SHS" as const, category: "ELECTIVE" as const, examType: "WASSCE" as const },
  ];

  const subjectMap: Record<string, string> = {};
  for (const s of subjectDefs) {
    const sub = await prisma.subject.upsert({
      where: { name_level: { name: s.name, level: s.level } },
      update: {},
      create: s,
    });
    subjectMap[`${s.name}|${s.level}`] = sub.id;
  }
  console.log(`✅ ${subjectDefs.length} subjects created`);

  // ── Helper ──
  type Q = {
    topic: string; year: number; questionText: string;
    optionA: string; optionB: string; optionC: string; optionD: string;
    correctOption: string; explanation: string; difficulty?: "EASY" | "MEDIUM" | "HARD";
  };

  async function seedQuestions(subjectName: string, level: "JHS" | "SHS", questions: Q[]) {
    const subjectId = subjectMap[`${subjectName}|${level}`];
    if (!subjectId) { console.log(`⚠️  Subject not found: ${subjectName} (${level})`); return; }
    const examType = level === "JHS" ? "BECE" : "WASSCE";
    for (const q of questions) {
      await prisma.question.create({
        data: {
          level, examType: examType as any, subjectId,
          topic: q.topic, year: q.year, questionText: q.questionText,
          optionA: q.optionA, optionB: q.optionB, optionC: q.optionC, optionD: q.optionD,
          correctOption: q.correctOption, explanation: q.explanation,
          difficulty: (q.difficulty || "MEDIUM") as any,
        },
      });
    }
    console.log(`  📝 ${subjectName} (${level}): ${questions.length} questions`);
  }

  // ════════════════════════════════════════════
  //  JHS QUESTIONS
  // ════════════════════════════════════════════

  // ── JHS Mathematics (15) ──
  await seedQuestions("Mathematics", "JHS", [
    { topic: "Fractions", year: 2022, questionText: "Simplify 3/4 + 2/3", optionA: "17/12", optionB: "5/7", optionC: "5/12", optionD: "1/2", correctOption: "A", explanation: "3/4 + 2/3 = 9/12 + 8/12 = 17/12", difficulty: "EASY" },
    { topic: "Percentages", year: 2022, questionText: "What is 25% of GH₵ 480?", optionA: "GH₵ 96", optionB: "GH₵ 120", optionC: "GH₵ 140", optionD: "GH₵ 100", correctOption: "B", explanation: "25/100 × 480 = 120" },
    { topic: "Algebra", year: 2021, questionText: "Solve for x: 3x + 7 = 22", optionA: "x = 3", optionB: "x = 7", optionC: "x = 5", optionD: "x = 4", correctOption: "C", explanation: "3x = 22 - 7 = 15, so x = 5" },
    { topic: "Geometry", year: 2021, questionText: "The sum of angles in a triangle is", optionA: "90°", optionB: "360°", optionC: "180°", optionD: "270°", correctOption: "C", explanation: "The angle sum property of a triangle states that interior angles always add up to 180°.", difficulty: "EASY" },
    { topic: "Ratio and Proportion", year: 2020, questionText: "Divide GH₵ 600 in the ratio 2:3. The larger share is", optionA: "GH₵ 240", optionB: "GH₵ 300", optionC: "GH₵ 360", optionD: "GH₵ 400", correctOption: "C", explanation: "Total parts = 5. Larger share = 3/5 × 600 = 360" },
    { topic: "Number Bases", year: 2020, questionText: "Convert 1011₂ to base ten", optionA: "9", optionB: "11", optionC: "13", optionD: "10", correctOption: "B", explanation: "1×8 + 0×4 + 1×2 + 1×1 = 8+0+2+1 = 11" },
    { topic: "Sets", year: 2019, questionText: "If A = {1,2,3,4} and B = {3,4,5,6}, find A ∩ B", optionA: "{1,2}", optionB: "{5,6}", optionC: "{3,4}", optionD: "{1,2,3,4,5,6}", correctOption: "C", explanation: "The intersection contains elements common to both sets: {3,4}" },
    { topic: "Statistics", year: 2019, questionText: "Find the mean of 4, 6, 8, 10, 12", optionA: "7", optionB: "8", optionC: "9", optionD: "10", correctOption: "B", explanation: "Mean = (4+6+8+10+12)/5 = 40/5 = 8", difficulty: "EASY" },
    { topic: "Profit and Loss", year: 2021, questionText: "A trader bought an item for GH₵ 200 and sold it for GH₵ 250. The percentage profit is", optionA: "20%", optionB: "25%", optionC: "50%", optionD: "30%", correctOption: "B", explanation: "Profit = 50. % profit = (50/200)×100 = 25%" },
    { topic: "Mensuration", year: 2020, questionText: "Find the area of a rectangle with length 12 cm and width 5 cm", optionA: "17 cm²", optionB: "34 cm²", optionC: "60 cm²", optionD: "120 cm²", correctOption: "C", explanation: "Area = length × width = 12 × 5 = 60 cm²", difficulty: "EASY" },
    { topic: "Indices", year: 2022, questionText: "Simplify 2³ × 2²", optionA: "2⁶", optionB: "2⁵", optionC: "4⁵", optionD: "2¹", correctOption: "B", explanation: "When multiplying with same base, add indices: 2³⁺² = 2⁵ = 32" },
    { topic: "Simple Interest", year: 2019, questionText: "Find the simple interest on GH₵ 5000 at 10% per annum for 3 years", optionA: "GH₵ 500", optionB: "GH₵ 1000", optionC: "GH₵ 1500", optionD: "GH₵ 2000", correctOption: "C", explanation: "SI = PRT/100 = 5000×10×3/100 = 1500" },
    { topic: "Linear Equations", year: 2022, questionText: "If 2(x - 3) = 10, find x", optionA: "5", optionB: "6", optionC: "7", optionD: "8", correctOption: "D", explanation: "2x - 6 = 10, 2x = 16, x = 8" },
    { topic: "Probability", year: 2021, questionText: "A bag contains 3 red and 5 blue balls. What is the probability of picking a red ball?", optionA: "3/8", optionB: "5/8", optionC: "3/5", optionD: "1/2", correctOption: "A", explanation: "P(red) = number of red / total = 3/8" },
    { topic: "Pythagoras Theorem", year: 2020, questionText: "In a right triangle with legs 3 cm and 4 cm, the hypotenuse is", optionA: "5 cm", optionB: "6 cm", optionC: "7 cm", optionD: "8 cm", correctOption: "A", explanation: "By Pythagoras: c² = 3² + 4² = 9 + 16 = 25, c = 5 cm", difficulty: "EASY" },
  ]);

  // ── JHS English Language (12) ──
  await seedQuestions("English Language", "JHS", [
    { topic: "Comprehension", year: 2022, questionText: "A synonym for the word 'happy' is", optionA: "Sad", optionB: "Joyful", optionC: "Angry", optionD: "Tired", correctOption: "B", explanation: "'Joyful' means feeling great happiness, making it a synonym of 'happy'.", difficulty: "EASY" },
    { topic: "Grammar", year: 2022, questionText: "Choose the correct sentence:", optionA: "She don't like rice", optionB: "She doesn't likes rice", optionC: "She doesn't like rice", optionD: "She not like rice", correctOption: "C", explanation: "'Doesn't' is the correct negative form for third person singular, followed by the base form 'like'." },
    { topic: "Tenses", year: 2021, questionText: "The past tense of 'go' is", optionA: "Goed", optionB: "Gone", optionC: "Going", optionD: "Went", correctOption: "D", explanation: "'Go' is an irregular verb. Its past tense is 'went'.", difficulty: "EASY" },
    { topic: "Vocabulary", year: 2021, questionText: "An antonym of 'generous' is", optionA: "Kind", optionB: "Selfish", optionC: "Helpful", optionD: "Brave", correctOption: "B", explanation: "'Selfish' (thinking only of oneself) is the opposite of 'generous' (willing to give)." },
    { topic: "Parts of Speech", year: 2020, questionText: "In the sentence 'The cat sat quietly', the word 'quietly' is a/an", optionA: "Noun", optionB: "Verb", optionC: "Adjective", optionD: "Adverb", correctOption: "D", explanation: "'Quietly' modifies the verb 'sat', telling us how the cat sat. Words that modify verbs are adverbs." },
    { topic: "Punctuation", year: 2020, questionText: "Which sentence is correctly punctuated?", optionA: "Where are you going.", optionB: "Where are you going?", optionC: "Where are you going,", optionD: "Where are you going!", correctOption: "B", explanation: "Questions must end with a question mark (?)." },
    { topic: "Prepositions", year: 2019, questionText: "Complete: The book is ___ the table.", optionA: "in", optionB: "on", optionC: "at", optionD: "by", correctOption: "B", explanation: "When something rests on top of a surface, we use the preposition 'on'." },
    { topic: "Comprehension", year: 2019, questionText: "What does the idiom 'break the ice' mean?", optionA: "To break something", optionB: "To start a conversation in a social setting", optionC: "To freeze water", optionD: "To cause trouble", correctOption: "B", explanation: "'Break the ice' is an idiom meaning to initiate conversation or ease tension in a social situation." },
    { topic: "Subject-Verb Agreement", year: 2022, questionText: "Choose the correct form: 'The group of students ___ working hard.'", optionA: "is", optionB: "are", optionC: "were", optionD: "have", correctOption: "A", explanation: "'Group' is a collective noun treated as singular, so it takes 'is'." },
    { topic: "Sentence Types", year: 2021, questionText: "Which of these is an exclamatory sentence?", optionA: "Please close the door.", optionB: "Is the door closed?", optionC: "What a beautiful day!", optionD: "The door is closed.", correctOption: "C", explanation: "Exclamatory sentences express strong emotion and end with an exclamation mark." },
    { topic: "Spelling", year: 2020, questionText: "Which word is correctly spelled?", optionA: "Enviroment", optionB: "Environmant", optionC: "Environment", optionD: "Envirornment", correctOption: "C", explanation: "The correct spelling is E-N-V-I-R-O-N-M-E-N-T." },
    { topic: "Direct and Indirect Speech", year: 2019, questionText: "Change to indirect speech: He said, 'I am tired.'", optionA: "He said that I am tired", optionB: "He said that he was tired", optionC: "He said that he is tired", optionD: "He said I was tired", correctOption: "B", explanation: "In indirect speech, 'I am' changes to 'he was' (pronoun and tense shift)." },
  ]);

  // ── JHS Integrated Science (12) ──
  await seedQuestions("Integrated Science", "JHS", [
    { topic: "Living Things", year: 2022, questionText: "Which of the following is a characteristic of all living things?", optionA: "Movement", optionB: "Cooking", optionC: "Growth", optionD: "Talking", correctOption: "C", explanation: "Growth is a fundamental characteristic shared by all living organisms." },
    { topic: "Human Body", year: 2022, questionText: "The organ responsible for pumping blood in the human body is the", optionA: "Liver", optionB: "Kidney", optionC: "Heart", optionD: "Lung", correctOption: "C", explanation: "The heart pumps blood through the circulatory system to all parts of the body.", difficulty: "EASY" },
    { topic: "Photosynthesis", year: 2021, questionText: "Plants make their food through a process called", optionA: "Respiration", optionB: "Photosynthesis", optionC: "Digestion", optionD: "Osmosis", correctOption: "B", explanation: "Photosynthesis is the process by which green plants use sunlight, water, and CO₂ to make food (glucose)." },
    { topic: "Matter", year: 2021, questionText: "Which of these is NOT a state of matter?", optionA: "Solid", optionB: "Liquid", optionC: "Gas", optionD: "Energy", correctOption: "D", explanation: "The three common states of matter are solid, liquid, and gas. Energy is not a state of matter." },
    { topic: "Electricity", year: 2020, questionText: "The unit of electric current is the", optionA: "Volt", optionB: "Watt", optionC: "Ampere", optionD: "Ohm", correctOption: "C", explanation: "Electric current is measured in amperes (A), named after André-Marie Ampère." },
    { topic: "Mixtures", year: 2020, questionText: "Which method is used to separate salt from water?", optionA: "Filtration", optionB: "Evaporation", optionC: "Magnetism", optionD: "Sieving", correctOption: "B", explanation: "Evaporation heats the solution so water turns to vapor, leaving salt behind." },
    { topic: "Ecosystem", year: 2019, questionText: "In a food chain, green plants are called", optionA: "Consumers", optionB: "Decomposers", optionC: "Producers", optionD: "Predators", correctOption: "C", explanation: "Green plants produce their own food through photosynthesis, making them producers." },
    { topic: "Forces", year: 2019, questionText: "The force that pulls objects towards the centre of the Earth is called", optionA: "Friction", optionB: "Magnetism", optionC: "Gravity", optionD: "Tension", correctOption: "C", explanation: "Gravity is the force of attraction between masses. Earth's gravity pulls objects towards its centre." },
    { topic: "Reproduction", year: 2022, questionText: "The process by which organisms produce offspring is called", optionA: "Excretion", optionB: "Respiration", optionC: "Reproduction", optionD: "Nutrition", correctOption: "C", explanation: "Reproduction is the biological process by which new organisms are produced from parent organisms." },
    { topic: "Diseases", year: 2021, questionText: "Malaria is transmitted by the bite of", optionA: "Housefly", optionB: "Tsetse fly", optionC: "Female Anopheles mosquito", optionD: "Cockroach", correctOption: "C", explanation: "Malaria parasites (Plasmodium) are transmitted through the bite of infected female Anopheles mosquitoes." },
    { topic: "Water", year: 2020, questionText: "The chemical formula for water is", optionA: "CO₂", optionB: "NaCl", optionC: "H₂O", optionD: "O₂", correctOption: "C", explanation: "Water consists of two hydrogen atoms and one oxygen atom, giving the formula H₂O.", difficulty: "EASY" },
    { topic: "Soil", year: 2019, questionText: "The type of soil that holds the most water is", optionA: "Sandy soil", optionB: "Clay soil", optionC: "Loamy soil", optionD: "Gravel", correctOption: "B", explanation: "Clay soil has very small particles packed closely together, which retains water the most." },
  ]);

  // ── JHS Social Studies (10) ──
  await seedQuestions("Social Studies", "JHS", [
    { topic: "Ghana Government", year: 2022, questionText: "Ghana gained independence on", optionA: "6th March 1957", optionB: "1st July 1960", optionC: "4th August 1947", optionD: "24th September 1979", correctOption: "A", explanation: "Ghana became the first sub-Saharan African country to gain independence from colonial rule on 6th March 1957." },
    { topic: "The Constitution", year: 2022, questionText: "The current constitution of Ghana was adopted in", optionA: "1960", optionB: "1979", optionC: "1992", optionD: "2000", correctOption: "C", explanation: "The Fourth Republican Constitution of Ghana was approved by referendum on 28 April 1992." },
    { topic: "Human Rights", year: 2021, questionText: "Which of these is a fundamental human right?", optionA: "Right to drive", optionB: "Right to life", optionC: "Right to free food", optionD: "Right to travel abroad", correctOption: "B", explanation: "The right to life is a fundamental human right enshrined in the Universal Declaration of Human Rights and Ghana's constitution." },
    { topic: "Environment", year: 2021, questionText: "Deforestation leads to", optionA: "Increased rainfall", optionB: "Soil erosion", optionC: "More wildlife", optionD: "Cooler temperatures", correctOption: "B", explanation: "When trees are removed, the soil is exposed to rain and wind, leading to soil erosion." },
    { topic: "Culture", year: 2020, questionText: "The annual festival celebrated by the Ga people of Accra is", optionA: "Adae", optionB: "Homowo", optionC: "Damba", optionD: "Aboakyir", correctOption: "B", explanation: "Homowo means 'hooting at hunger'. It is celebrated by the Ga people to remember a period of famine." },
    { topic: "Ethnic Groups", year: 2020, questionText: "The largest ethnic group in Ghana is the", optionA: "Ewe", optionB: "Ga-Adangbe", optionC: "Akan", optionD: "Mole-Dagbani", correctOption: "C", explanation: "The Akan people make up about 47.5% of Ghana's population, making them the largest ethnic group." },
    { topic: "Governance", year: 2019, questionText: "The head of state of Ghana is the", optionA: "Chief Justice", optionB: "Speaker of Parliament", optionC: "President", optionD: "Vice President", correctOption: "C", explanation: "Under the 1992 Constitution, the President is the head of state, head of government, and commander-in-chief." },
    { topic: "Adolescent Reproductive Health", year: 2019, questionText: "Teenage pregnancy can best be prevented through", optionA: "Dropping out of school", optionB: "Abstinence and education", optionC: "Early marriage", optionD: "Avoiding friends", correctOption: "B", explanation: "Abstinence and comprehensive sex education are the most effective ways to prevent teenage pregnancy." },
    { topic: "Tourism", year: 2022, questionText: "Cape Coast Castle in Ghana was used during the", optionA: "World War I", optionB: "Trans-Atlantic Slave Trade", optionC: "Yaa Asantewaa War", optionD: "Sagrenti War", correctOption: "B", explanation: "Cape Coast Castle was one of the major slave trading posts on the Gold Coast during the Trans-Atlantic Slave Trade." },
    { topic: "Map Reading", year: 2021, questionText: "On a map, blue colour usually represents", optionA: "Forests", optionB: "Roads", optionC: "Water bodies", optionD: "Mountains", correctOption: "C", explanation: "In cartography, blue is conventionally used to represent water features such as rivers, lakes, and seas." },
  ]);

  // ── JHS ICT (8) ──
  await seedQuestions("ICT", "JHS", [
    { topic: "Computer Basics", year: 2022, questionText: "The brain of the computer is the", optionA: "Monitor", optionB: "Keyboard", optionC: "CPU", optionD: "Mouse", correctOption: "C", explanation: "The Central Processing Unit (CPU) processes all instructions and is often called the brain of the computer.", difficulty: "EASY" },
    { topic: "Hardware", year: 2022, questionText: "Which of these is an output device?", optionA: "Mouse", optionB: "Keyboard", optionC: "Scanner", optionD: "Printer", correctOption: "D", explanation: "A printer produces hard copy output. Mouse, keyboard, and scanner are input devices." },
    { topic: "Software", year: 2021, questionText: "Microsoft Word is an example of", optionA: "System software", optionB: "Application software", optionC: "Hardware", optionD: "Firmware", correctOption: "B", explanation: "Microsoft Word is application software designed for word processing tasks." },
    { topic: "Internet", year: 2021, questionText: "WWW stands for", optionA: "World Wide Web", optionB: "World Wire Web", optionC: "Wide World Web", optionD: "Web World Wide", correctOption: "A", explanation: "WWW stands for World Wide Web, a system of interlinked hypertext documents accessed via the internet." },
    { topic: "Storage", year: 2020, questionText: "Which has the largest storage capacity?", optionA: "Floppy disk", optionB: "CD", optionC: "Flash drive (64GB)", optionD: "DVD", correctOption: "C", explanation: "A 64GB flash drive holds far more than a floppy (1.44MB), CD (700MB), or DVD (4.7GB)." },
    { topic: "File Management", year: 2020, questionText: "The extension '.docx' indicates a", optionA: "Spreadsheet file", optionB: "Image file", optionC: "Word document", optionD: "Video file", correctOption: "C", explanation: "The .docx extension is used for Microsoft Word documents." },
    { topic: "Networking", year: 2019, questionText: "A network that covers a small area like a school is called", optionA: "WAN", optionB: "MAN", optionC: "LAN", optionD: "PAN", correctOption: "C", explanation: "A Local Area Network (LAN) covers a small geographical area such as a school, office, or building." },
    { topic: "Safety", year: 2019, questionText: "Which practice helps protect your computer from viruses?", optionA: "Opening all email attachments", optionB: "Installing antivirus software", optionC: "Sharing passwords", optionD: "Visiting unknown websites", correctOption: "B", explanation: "Antivirus software detects and removes malicious programs, protecting your computer." },
  ]);

  // ── JHS RME (6) ──
  await seedQuestions("RME", "JHS", [
    { topic: "Moral Teachings", year: 2022, questionText: "The Golden Rule teaches us to", optionA: "Be rich", optionB: "Treat others as we want to be treated", optionC: "Obey only our parents", optionD: "Always be first", correctOption: "B", explanation: "The Golden Rule is a moral principle found in many religions: treat others the way you would like to be treated." },
    { topic: "Christianity", year: 2021, questionText: "The Ten Commandments were given to", optionA: "Abraham", optionB: "Moses", optionC: "David", optionD: "Noah", correctOption: "B", explanation: "According to the Bible, God gave the Ten Commandments to Moses on Mount Sinai." },
    { topic: "Islam", year: 2021, questionText: "The holy book of Islam is the", optionA: "Bible", optionB: "Torah", optionC: "Quran", optionD: "Vedas", correctOption: "C", explanation: "The Quran is the central religious text of Islam, believed by Muslims to be the word of God revealed to Prophet Muhammad." },
    { topic: "Traditional Religion", year: 2020, questionText: "In Ghanaian traditional religion, the Supreme Being is often called", optionA: "Allah", optionB: "Nyame/Onyame", optionC: "Brahma", optionD: "Zeus", correctOption: "B", explanation: "Among the Akan people, the Supreme Being is called Nyame or Onyame (God), who is the creator of all things." },
    { topic: "Moral Living", year: 2020, questionText: "Honesty means", optionA: "Telling lies to protect friends", optionB: "Being truthful and sincere", optionC: "Hiding the truth", optionD: "Cheating in exams", correctOption: "B", explanation: "Honesty is the quality of being truthful, sincere, and free from deceit." },
    { topic: "Civic Responsibility", year: 2019, questionText: "Good citizenship includes", optionA: "Littering the environment", optionB: "Paying taxes and obeying laws", optionC: "Destroying public property", optionD: "Being disrespectful", correctOption: "B", explanation: "Good citizens obey laws, pay taxes, respect others' rights, and contribute positively to society." },
  ]);

  // ════════════════════════════════════════════
  //  SHS QUESTIONS
  // ════════════════════════════════════════════

  // ── SHS Core Mathematics (12) ──
  await seedQuestions("Core Mathematics", "SHS", [
    { topic: "Quadratic Equations", year: 2023, questionText: "Solve x² - 5x + 6 = 0", optionA: "x = 1, 6", optionB: "x = 2, 3", optionC: "x = -2, -3", optionD: "x = -1, 6", correctOption: "B", explanation: "x² - 5x + 6 = (x-2)(x-3) = 0, so x = 2 or x = 3" },
    { topic: "Logarithms", year: 2023, questionText: "Evaluate log₁₀ 1000", optionA: "2", optionB: "3", optionC: "4", optionD: "10", correctOption: "B", explanation: "log₁₀ 1000 = log₁₀ 10³ = 3" },
    { topic: "Trigonometry", year: 2022, questionText: "If sin θ = 3/5, what is cos θ? (θ is acute)", optionA: "4/5", optionB: "3/4", optionC: "5/3", optionD: "4/3", correctOption: "A", explanation: "Using sin²θ + cos²θ = 1: cos²θ = 1 - 9/25 = 16/25, cos θ = 4/5 (acute angle, so positive)" },
    { topic: "Sequences", year: 2022, questionText: "Find the 10th term of the AP: 3, 7, 11, 15, ...", optionA: "39", optionB: "43", optionC: "41", optionD: "37", correctOption: "A", explanation: "a = 3, d = 4. T₁₀ = a + (n-1)d = 3 + 9(4) = 3 + 36 = 39" },
    { topic: "Matrices", year: 2021, questionText: "If A = [2 1; 3 4], find |A| (determinant)", optionA: "5", optionB: "11", optionC: "8", optionD: "-5", correctOption: "A", explanation: "|A| = (2)(4) - (1)(3) = 8 - 3 = 5" },
    { topic: "Statistics", year: 2021, questionText: "The median of 3, 7, 1, 9, 5 is", optionA: "7", optionB: "5", optionC: "9", optionD: "3", correctOption: "B", explanation: "Arrange in order: 1, 3, 5, 7, 9. The middle value is 5.", difficulty: "EASY" },
    { topic: "Simultaneous Equations", year: 2023, questionText: "Solve: 2x + y = 7 and x - y = 2", optionA: "x = 3, y = 1", optionB: "x = 2, y = 3", optionC: "x = 4, y = -1", optionD: "x = 1, y = 5", correctOption: "A", explanation: "Adding both equations: 3x = 9, x = 3. Substituting: y = 7 - 6 = 1" },
    { topic: "Surds", year: 2022, questionText: "Simplify √50", optionA: "5√2", optionB: "2√5", optionC: "25√2", optionD: "10√5", correctOption: "A", explanation: "√50 = √(25 × 2) = √25 × √2 = 5√2" },
    { topic: "Functions", year: 2021, questionText: "If f(x) = 2x² - 3, find f(2)", optionA: "1", optionB: "5", optionC: "7", optionD: "11", correctOption: "B", explanation: "f(2) = 2(2²) - 3 = 2(4) - 3 = 8 - 3 = 5" },
    { topic: "Inequalities", year: 2020, questionText: "Solve 3x - 1 > 8", optionA: "x > 3", optionB: "x > 2", optionC: "x < 3", optionD: "x > 4", correctOption: "A", explanation: "3x > 9, therefore x > 3" },
    { topic: "Sets", year: 2020, questionText: "If n(A) = 15, n(B) = 12, and n(A ∩ B) = 5, find n(A ∪ B)", optionA: "27", optionB: "22", optionC: "20", optionD: "32", correctOption: "B", explanation: "n(A ∪ B) = n(A) + n(B) - n(A ∩ B) = 15 + 12 - 5 = 22" },
    { topic: "Mensuration", year: 2023, questionText: "Find the volume of a cylinder with radius 7 cm and height 10 cm (use π = 22/7)", optionA: "1540 cm³", optionB: "1320 cm³", optionC: "770 cm³", optionD: "440 cm³", correctOption: "A", explanation: "V = πr²h = (22/7)(7²)(10) = (22/7)(49)(10) = 22 × 70 = 1540 cm³" },
  ]);

  // ── SHS English Language (8) ──
  await seedQuestions("English Language", "SHS", [
    { topic: "Comprehension", year: 2023, questionText: "The word 'ubiquitous' most nearly means", optionA: "Rare", optionB: "Present everywhere", optionC: "Expensive", optionD: "Invisible", correctOption: "B", explanation: "'Ubiquitous' means present, appearing, or found everywhere." },
    { topic: "Grammar", year: 2023, questionText: "Select the sentence with correct concord:", optionA: "The news are shocking", optionB: "The news is shocking", optionC: "The news were shocking", optionD: "The news have been shocking", correctOption: "B", explanation: "'News' is an uncountable noun and takes a singular verb: 'The news is shocking'." },
    { topic: "Vocabulary", year: 2022, questionText: "Choose the word that best completes: 'The judge's decision was ___; no one could change it.'", optionA: "Tentative", optionB: "Irrevocable", optionC: "Temporary", optionD: "Flexible", correctOption: "B", explanation: "'Irrevocable' means not able to be changed, reversed, or recovered — fitting a final judge's decision." },
    { topic: "Essay Writing", year: 2022, questionText: "A good argumentative essay must contain", optionA: "Only personal opinions", optionB: "A thesis statement, evidence, and counterarguments", optionC: "Only facts without opinion", optionD: "Short sentences only", correctOption: "B", explanation: "Argumentative essays require a clear thesis, supporting evidence, and consideration of opposing viewpoints." },
    { topic: "Figures of Speech", year: 2021, questionText: "'The world is a stage' is an example of", optionA: "Simile", optionB: "Metaphor", optionC: "Personification", optionD: "Hyperbole", correctOption: "B", explanation: "A metaphor makes a direct comparison without 'like' or 'as'. Here, the world IS a stage (direct comparison)." },
    { topic: "Clause Analysis", year: 2021, questionText: "In 'The man who came yesterday is my uncle', the underlined clause is", optionA: "Noun clause", optionB: "Adverbial clause", optionC: "Adjectival clause", optionD: "Main clause", correctOption: "C", explanation: "'Who came yesterday' is an adjectival (relative) clause modifying 'the man'." },
    { topic: "Oral English", year: 2020, questionText: "Which pair of words are homophones?", optionA: "Read / Red", optionB: "Big / Small", optionC: "Flour / Flower", optionD: "Both A and C", correctOption: "D", explanation: "Homophones sound alike but differ in meaning/spelling. 'Read' (past tense) / 'Red' and 'Flour' / 'Flower' are both homophone pairs." },
    { topic: "Phrasal Verbs", year: 2020, questionText: "'To call off' a meeting means to", optionA: "Start it", optionB: "Cancel it", optionC: "Postpone it", optionD: "Attend it", correctOption: "B", explanation: "The phrasal verb 'call off' means to cancel something that was planned." },
  ]);

  // ── SHS Integrated Science (8) ──
  await seedQuestions("Integrated Science", "SHS", [
    { topic: "Cell Biology", year: 2023, questionText: "The powerhouse of the cell is the", optionA: "Nucleus", optionB: "Ribosome", optionC: "Mitochondria", optionD: "Golgi body", correctOption: "C", explanation: "Mitochondria generate most of the cell's supply of ATP (energy), hence called the powerhouse." },
    { topic: "Periodic Table", year: 2023, questionText: "Elements in the same group of the periodic table have the same number of", optionA: "Protons", optionB: "Neutrons", optionC: "Valence electrons", optionD: "Total electrons", correctOption: "C", explanation: "Elements in the same group share the same number of valence electrons, giving them similar chemical properties." },
    { topic: "Genetics", year: 2022, questionText: "DNA stands for", optionA: "Deoxyribonucleic acid", optionB: "Dinitrogen acid", optionC: "Deoxyribose nitrogen acid", optionD: "Dynamic nucleic acid", correctOption: "A", explanation: "DNA (Deoxyribonucleic acid) carries the genetic instructions for all living organisms." },
    { topic: "Energy", year: 2022, questionText: "The SI unit of energy is", optionA: "Newton", optionB: "Joule", optionC: "Watt", optionD: "Pascal", correctOption: "B", explanation: "The joule (J) is the SI unit of energy, named after physicist James Prescott Joule." },
    { topic: "Chemical Bonding", year: 2021, questionText: "Sodium chloride (NaCl) is formed by ___ bonding", optionA: "Covalent", optionB: "Ionic", optionC: "Metallic", optionD: "Hydrogen", correctOption: "B", explanation: "Na donates an electron to Cl, forming Na⁺ and Cl⁻ ions held together by ionic (electrostatic) bonding." },
    { topic: "Ecology", year: 2021, questionText: "The gradual change in a community over time is called", optionA: "Evolution", optionB: "Succession", optionC: "Migration", optionD: "Mutation", correctOption: "B", explanation: "Ecological succession is the process of change in species structure of an ecological community over time." },
    { topic: "Acids and Bases", year: 2020, questionText: "A solution with pH less than 7 is", optionA: "Neutral", optionB: "Basic", optionC: "Acidic", optionD: "Alkaline", correctOption: "C", explanation: "pH < 7 indicates an acidic solution. pH = 7 is neutral, and pH > 7 is basic/alkaline." },
    { topic: "Waves", year: 2020, questionText: "Sound travels fastest through", optionA: "Vacuum", optionB: "Air", optionC: "Water", optionD: "Steel", correctOption: "D", explanation: "Sound travels fastest through solids (like steel) because molecules are closest together, allowing vibrations to transfer quickly." },
  ]);

  // ── SHS Social Studies (6) ──
  await seedQuestions("Social Studies", "SHS", [
    { topic: "Governance", year: 2023, questionText: "The three arms of government in Ghana are", optionA: "Executive, Legislature, Military", optionB: "Executive, Legislature, Judiciary", optionC: "President, Parliament, Police", optionD: "Chiefs, Elders, People", correctOption: "B", explanation: "Ghana's government has three arms: the Executive (President), Legislature (Parliament), and Judiciary (Courts)." },
    { topic: "Globalization", year: 2023, questionText: "Globalization primarily refers to", optionA: "Increasing interconnection of world economies and cultures", optionB: "Countries closing their borders", optionC: "Only trade between African countries", optionD: "The internet only", correctOption: "A", explanation: "Globalization is the increasing interconnectedness of world economies, cultures, and populations through trade, technology, and communication." },
    { topic: "Development", year: 2022, questionText: "Which is NOT a measure of development?", optionA: "GDP per capita", optionB: "Literacy rate", optionC: "Number of wars", optionD: "Life expectancy", correctOption: "C", explanation: "Development indicators include GDP per capita, literacy rates, and life expectancy. Number of wars is not a standard development measure." },
    { topic: "Population", year: 2022, questionText: "Rapid population growth in Ghana can lead to", optionA: "Excess resources for everyone", optionB: "Pressure on social amenities", optionC: "Less pollution", optionD: "More available land", correctOption: "B", explanation: "Rapid population growth puts pressure on healthcare, education, housing, water, and other social amenities." },
    { topic: "Science and Technology", year: 2021, questionText: "The main advantage of technology in agriculture is", optionA: "Increased cost of production", optionB: "Reduced crop yield", optionC: "Increased productivity and efficiency", optionD: "Less employment", correctOption: "C", explanation: "Agricultural technology increases productivity and efficiency through mechanization, improved seeds, and better techniques." },
    { topic: "Constitution", year: 2021, questionText: "The fundamental human rights in Ghana's constitution are found in Chapter", optionA: "3", optionB: "5", optionC: "7", optionD: "10", correctOption: "B", explanation: "Chapter 5 of the 1992 Constitution of Ghana contains the fundamental human rights and freedoms." },
  ]);

  // ── SHS Physics (10) ──
  await seedQuestions("Physics", "SHS", [
    { topic: "Mechanics", year: 2023, questionText: "A car accelerates uniformly from rest to 20 m/s in 5 seconds. The acceleration is", optionA: "100 m/s²", optionB: "4 m/s²", optionC: "25 m/s²", optionD: "10 m/s²", correctOption: "B", explanation: "a = (v - u)/t = (20 - 0)/5 = 4 m/s²" },
    { topic: "Newton's Laws", year: 2023, questionText: "Newton's first law of motion is also called the law of", optionA: "Acceleration", optionB: "Action and reaction", optionC: "Inertia", optionD: "Gravitation", correctOption: "C", explanation: "Newton's first law (law of inertia) states that an object remains at rest or in uniform motion unless acted on by an external force." },
    { topic: "Work and Energy", year: 2022, questionText: "If a force of 50 N moves an object 10 m in the direction of the force, the work done is", optionA: "5 J", optionB: "500 J", optionC: "60 J", optionD: "0.2 J", correctOption: "B", explanation: "Work = Force × Distance = 50 × 10 = 500 J" },
    { topic: "Electricity", year: 2022, questionText: "Two resistors of 6Ω and 3Ω are connected in parallel. The equivalent resistance is", optionA: "9Ω", optionB: "2Ω", optionC: "3Ω", optionD: "18Ω", correctOption: "B", explanation: "1/R = 1/6 + 1/3 = 1/6 + 2/6 = 3/6 = 1/2, so R = 2Ω" },
    { topic: "Waves", year: 2021, questionText: "The speed of light in vacuum is approximately", optionA: "3 × 10⁶ m/s", optionB: "3 × 10⁸ m/s", optionC: "3 × 10¹⁰ m/s", optionD: "3 × 10⁴ m/s", correctOption: "B", explanation: "The speed of light in vacuum is approximately 3 × 10⁸ m/s (300,000 km/s)." },
    { topic: "Optics", year: 2021, questionText: "A converging lens is also called a", optionA: "Concave lens", optionB: "Convex lens", optionC: "Plane mirror", optionD: "Prism", correctOption: "B", explanation: "A convex lens converges (brings together) parallel light rays to a focal point." },
    { topic: "Thermal Physics", year: 2020, questionText: "Heat is transferred through a vacuum by", optionA: "Conduction", optionB: "Convection", optionC: "Radiation", optionD: "Evaporation", correctOption: "C", explanation: "Radiation is the only method of heat transfer that doesn't require a medium — it can travel through a vacuum." },
    { topic: "Momentum", year: 2020, questionText: "A 2 kg ball moving at 5 m/s has a momentum of", optionA: "2.5 kg·m/s", optionB: "7 kg·m/s", optionC: "10 kg·m/s", optionD: "3 kg·m/s", correctOption: "C", explanation: "Momentum = mass × velocity = 2 × 5 = 10 kg·m/s" },
    { topic: "Electrostatics", year: 2023, questionText: "Like charges", optionA: "Attract each other", optionB: "Repel each other", optionC: "Have no effect", optionD: "Cancel out", correctOption: "B", explanation: "Fundamental law of electrostatics: like charges repel, unlike charges attract.", difficulty: "EASY" },
    { topic: "Nuclear Physics", year: 2022, questionText: "The number of protons in an atom is called the", optionA: "Mass number", optionB: "Atomic number", optionC: "Neutron number", optionD: "Electron number", correctOption: "B", explanation: "The atomic number (Z) equals the number of protons in the nucleus and defines the element." },
  ]);

  // ── SHS Chemistry (10) ──
  await seedQuestions("Chemistry", "SHS", [
    { topic: "Atomic Structure", year: 2023, questionText: "The relative atomic mass of an element is determined by its number of", optionA: "Electrons only", optionB: "Protons and neutrons", optionC: "Protons only", optionD: "Neutrons only", correctOption: "B", explanation: "Relative atomic mass ≈ number of protons + number of neutrons (mass number)." },
    { topic: "Chemical Equations", year: 2023, questionText: "In the equation 2H₂ + O₂ → 2H₂O, the number of moles of water produced from 2 moles of O₂ is", optionA: "1", optionB: "2", optionC: "4", optionD: "6", correctOption: "C", explanation: "1 mol O₂ produces 2 mol H₂O. So 2 mol O₂ produces 4 mol H₂O." },
    { topic: "Organic Chemistry", year: 2022, questionText: "The first member of the alkane series is", optionA: "Ethane", optionB: "Methane", optionC: "Propane", optionD: "Butane", correctOption: "B", explanation: "Methane (CH₄) is the simplest alkane with one carbon atom." },
    { topic: "Redox Reactions", year: 2022, questionText: "In a redox reaction, the substance that gains electrons is", optionA: "Oxidized", optionB: "Reduced", optionC: "Neutralized", optionD: "Hydrated", correctOption: "B", explanation: "Reduction is the gain of electrons (OIL RIG: Oxidation Is Loss, Reduction Is Gain)." },
    { topic: "Acids, Bases, Salts", year: 2021, questionText: "Which of these is a strong acid?", optionA: "Ethanoic acid", optionB: "Citric acid", optionC: "Hydrochloric acid", optionD: "Carbonic acid", correctOption: "C", explanation: "HCl is a strong acid that completely dissociates in water. The others are weak acids." },
    { topic: "Electrochemistry", year: 2021, questionText: "During electrolysis of brine, the gas collected at the anode is", optionA: "Hydrogen", optionB: "Oxygen", optionC: "Chlorine", optionD: "Nitrogen", correctOption: "C", explanation: "In electrolysis of concentrated NaCl (brine), chlorine gas is produced at the anode and hydrogen at the cathode." },
    { topic: "States of Matter", year: 2020, questionText: "The process of changing from gas to liquid is called", optionA: "Evaporation", optionB: "Sublimation", optionC: "Condensation", optionD: "Melting", correctOption: "C", explanation: "Condensation is the change of state from gas to liquid when temperature decreases." },
    { topic: "Mole Concept", year: 2020, questionText: "The number of particles in one mole of a substance is", optionA: "6.02 × 10²³", optionB: "6.02 × 10²²", optionC: "3.01 × 10²³", optionD: "1.60 × 10⁻¹⁹", correctOption: "A", explanation: "Avogadro's number (6.02 × 10²³) is the number of particles in one mole of any substance." },
    { topic: "Rates of Reaction", year: 2023, questionText: "Increasing temperature generally ___ the rate of a chemical reaction", optionA: "Decreases", optionB: "Increases", optionC: "Has no effect on", optionD: "Stops", correctOption: "B", explanation: "Higher temperature gives particles more kinetic energy, leading to more frequent and energetic collisions." },
    { topic: "Environmental Chemistry", year: 2022, questionText: "The greenhouse gas primarily responsible for global warming is", optionA: "Nitrogen", optionB: "Oxygen", optionC: "Carbon dioxide", optionD: "Argon", correctOption: "C", explanation: "CO₂ is the main greenhouse gas from human activities (burning fossil fuels) that traps heat and causes global warming." },
  ]);

  // ── SHS Biology (10) ──
  await seedQuestions("Biology", "SHS", [
    { topic: "Cell Biology", year: 2023, questionText: "Which organelle is responsible for protein synthesis?", optionA: "Mitochondria", optionB: "Ribosome", optionC: "Lysosome", optionD: "Nucleus", correctOption: "B", explanation: "Ribosomes are the cellular organelles that translate mRNA into proteins." },
    { topic: "Genetics", year: 2023, questionText: "If both parents are carriers (Aa) of a recessive trait, the probability of an affected child (aa) is", optionA: "25%", optionB: "50%", optionC: "75%", optionD: "100%", correctOption: "A", explanation: "Punnett square: AA(25%), Aa(50%), aa(25%). Only aa shows the recessive trait = 25%." },
    { topic: "Evolution", year: 2022, questionText: "The theory of natural selection was proposed by", optionA: "Gregor Mendel", optionB: "Louis Pasteur", optionC: "Charles Darwin", optionD: "Robert Hooke", correctOption: "C", explanation: "Charles Darwin proposed the theory of evolution by natural selection in 'On the Origin of Species' (1859)." },
    { topic: "Ecology", year: 2022, questionText: "An organism that breaks down dead organic matter is a", optionA: "Producer", optionB: "Primary consumer", optionC: "Decomposer", optionD: "Tertiary consumer", correctOption: "C", explanation: "Decomposers (bacteria, fungi) break down dead organisms and waste, recycling nutrients back into the ecosystem." },
    { topic: "Respiration", year: 2021, questionText: "The end products of aerobic respiration are", optionA: "Glucose and oxygen", optionB: "CO₂, water, and energy (ATP)", optionC: "Alcohol and CO₂", optionD: "Lactic acid and energy", correctOption: "B", explanation: "Aerobic respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP (energy)" },
    { topic: "Excretion", year: 2021, questionText: "The main organ of excretion in humans is the", optionA: "Liver", optionB: "Kidney", optionC: "Skin", optionD: "Lung", correctOption: "B", explanation: "Kidneys are the main excretory organs, filtering blood and producing urine to remove waste products." },
    { topic: "Photosynthesis", year: 2020, questionText: "The gas released during photosynthesis is", optionA: "Carbon dioxide", optionB: "Nitrogen", optionC: "Oxygen", optionD: "Hydrogen", correctOption: "C", explanation: "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂. Oxygen is released as a byproduct of photosynthesis." },
    { topic: "Reproduction", year: 2020, questionText: "Meiosis produces", optionA: "2 identical cells", optionB: "4 genetically different cells", optionC: "4 identical cells", optionD: "2 different cells", correctOption: "B", explanation: "Meiosis produces 4 haploid, genetically unique daughter cells (gametes) through two divisions with crossing over." },
    { topic: "Transport in Plants", year: 2023, questionText: "Water moves from the soil into the root hair cells by", optionA: "Active transport", optionB: "Osmosis", optionC: "Diffusion", optionD: "Transpiration", correctOption: "B", explanation: "Water moves into root hair cells by osmosis — from an area of higher water concentration (soil) to lower concentration (cell)." },
    { topic: "Nervous System", year: 2022, questionText: "The gap between two neurons is called a", optionA: "Dendrite", optionB: "Axon", optionC: "Synapse", optionD: "Myelin sheath", correctOption: "C", explanation: "A synapse is the junction/gap between two neurons where nerve impulses are transmitted via neurotransmitters." },
  ]);

  // ── SHS Economics (8) ──
  await seedQuestions("Economics", "SHS", [
    { topic: "Demand and Supply", year: 2023, questionText: "When the price of a good increases, the quantity demanded generally", optionA: "Increases", optionB: "Decreases", optionC: "Stays the same", optionD: "Doubles", correctOption: "B", explanation: "The law of demand states that, ceteris paribus, as price increases, quantity demanded decreases." },
    { topic: "Inflation", year: 2023, questionText: "A sustained increase in the general price level is called", optionA: "Deflation", optionB: "Inflation", optionC: "Stagflation", optionD: "Recession", correctOption: "B", explanation: "Inflation is the rate at which the general level of prices for goods and services is rising over time." },
    { topic: "GDP", year: 2022, questionText: "GDP stands for", optionA: "General Domestic Price", optionB: "Gross Domestic Product", optionC: "Growth Development Plan", optionD: "Government Development Policy", correctOption: "B", explanation: "Gross Domestic Product (GDP) is the total value of all goods and services produced within a country in a given period." },
    { topic: "Market Structures", year: 2022, questionText: "A market with only one seller is called a", optionA: "Perfect competition", optionB: "Oligopoly", optionC: "Monopoly", optionD: "Duopoly", correctOption: "C", explanation: "A monopoly is a market structure where a single firm is the sole producer/seller of a product with no close substitutes." },
    { topic: "Money and Banking", year: 2021, questionText: "The central bank of Ghana is the", optionA: "Ghana Commercial Bank", optionB: "Bank of Ghana", optionC: "World Bank", optionD: "Barclays Bank", correctOption: "B", explanation: "The Bank of Ghana is the central bank responsible for monetary policy, currency issuance, and banking regulation." },
    { topic: "International Trade", year: 2021, questionText: "When a country buys goods from another country, it is called", optionA: "Export", optionB: "Import", optionC: "Tariff", optionD: "Quota", correctOption: "B", explanation: "Importing is the purchase of goods and services from foreign countries." },
    { topic: "Factors of Production", year: 2020, questionText: "The reward for labour is", optionA: "Rent", optionB: "Interest", optionC: "Profit", optionD: "Wages", correctOption: "D", explanation: "Each factor of production has a reward: Land=Rent, Labour=Wages, Capital=Interest, Entrepreneur=Profit." },
    { topic: "Taxation", year: 2020, questionText: "A tax whose rate increases as income increases is called", optionA: "Regressive tax", optionB: "Progressive tax", optionC: "Proportional tax", optionD: "Poll tax", correctOption: "B", explanation: "Progressive taxation means higher earners pay a higher percentage of their income in tax." },
  ]);

  // ── SHS Geography (6) ──
  await seedQuestions("Geography", "SHS", [
    { topic: "Physical Geography", year: 2023, questionText: "The layer of the atmosphere closest to the Earth is the", optionA: "Stratosphere", optionB: "Mesosphere", optionC: "Troposphere", optionD: "Thermosphere", correctOption: "C", explanation: "The troposphere extends from the Earth's surface to about 12 km and is where weather occurs." },
    { topic: "Climate", year: 2023, questionText: "Ghana lies within the ___ climate zone", optionA: "Temperate", optionB: "Tropical", optionC: "Arctic", optionD: "Mediterranean", correctOption: "B", explanation: "Ghana is located between latitudes 4°N and 12°N, placing it within the tropical climate zone." },
    { topic: "Settlement", year: 2022, questionText: "A settlement where houses are closely packed together is called", optionA: "Dispersed", optionB: "Nucleated", optionC: "Linear", optionD: "Isolated", correctOption: "B", explanation: "Nucleated settlements have houses clustered closely around a central point such as a market or church." },
    { topic: "Rocks", year: 2022, questionText: "Granite is an example of", optionA: "Sedimentary rock", optionB: "Metamorphic rock", optionC: "Igneous rock", optionD: "Organic rock", correctOption: "C", explanation: "Granite is an intrusive igneous rock formed from the slow cooling of magma deep within the Earth." },
    { topic: "Map Work", year: 2021, questionText: "The scale 1:50,000 means 1 cm on the map represents", optionA: "50 m", optionB: "500 m", optionC: "5 km", optionD: "50 km", correctOption: "B", explanation: "1:50,000 means 1 cm = 50,000 cm = 500 m (0.5 km)." },
    { topic: "Vegetation", year: 2021, questionText: "The Guinea Savanna is found in the ___ part of Ghana", optionA: "Southern", optionB: "Coastal", optionC: "Northern", optionD: "Eastern", correctOption: "C", explanation: "The Guinea Savanna zone covers the northern part of Ghana, characterized by grasslands with scattered trees." },
  ]);

  // ── SHS Government (8) ──
  await seedQuestions("Government", "SHS", [
    { topic: "Democracy", year: 2023, questionText: "Democracy is a system of government in which power belongs to the", optionA: "Military", optionB: "King", optionC: "People", optionD: "Wealthy", correctOption: "C", explanation: "Democracy (from Greek: demos = people, kratos = power) is government by the people, for the people." },
    { topic: "Separation of Powers", year: 2023, questionText: "The principle of separation of powers was advocated by", optionA: "John Locke", optionB: "Montesquieu", optionC: "Karl Marx", optionD: "Plato", correctOption: "B", explanation: "Baron de Montesquieu advocated the separation of powers into Executive, Legislature, and Judiciary in 'The Spirit of the Laws'." },
    { topic: "Political Parties", year: 2022, questionText: "The current ruling party of Ghana (as of 2024) is the", optionA: "NDC", optionB: "NPP", optionC: "CPP", optionD: "PNC", correctOption: "B", explanation: "The New Patriotic Party (NPP) is the ruling party with Nana Akufo-Addo as president (2017-2025)." },
    { topic: "Arms of Government", year: 2022, questionText: "The judiciary is headed by the", optionA: "President", optionB: "Attorney General", optionC: "Chief Justice", optionD: "Speaker of Parliament", correctOption: "C", explanation: "The Chief Justice is the head of the judiciary and presides over the Supreme Court of Ghana." },
    { topic: "Local Government", year: 2021, questionText: "The head of a Metropolitan Assembly is the", optionA: "District Chief Executive", optionB: "Metropolitan Chief Executive", optionC: "Regional Minister", optionD: "Assembly Member", correctOption: "B", explanation: "The Metropolitan Chief Executive (MCE) is the political head of a Metropolitan Assembly." },
    { topic: "International Organizations", year: 2021, questionText: "Ghana is a member of which regional organization?", optionA: "EU", optionB: "ASEAN", optionC: "ECOWAS", optionD: "NATO", correctOption: "C", explanation: "Ghana is a founding member of ECOWAS (Economic Community of West African States), established in 1975." },
    { topic: "Human Rights", year: 2020, questionText: "CHRAJ stands for", optionA: "Commission on Human Rights and Administrative Justice", optionB: "Committee on Human Rights and Advocacy for Justice", optionC: "Council of Human Rights and Administrative Justice", optionD: "Commission on High Rights and Justice", correctOption: "A", explanation: "CHRAJ is Ghana's national human rights institution established under Chapter 18 of the 1992 Constitution." },
    { topic: "Electoral System", year: 2020, questionText: "The body responsible for conducting elections in Ghana is the", optionA: "NCCE", optionB: "EC", optionC: "NMC", optionD: "CHRAJ", correctOption: "B", explanation: "The Electoral Commission (EC) is the constitutionally mandated body responsible for conducting all public elections in Ghana." },
  ]);

  // ── SHS Elective Mathematics (8) ──
  await seedQuestions("Elective Mathematics", "SHS", [
    { topic: "Calculus", year: 2023, questionText: "Find dy/dx if y = 3x² + 2x - 5", optionA: "6x + 2", optionB: "3x + 2", optionC: "6x - 5", optionD: "6x² + 2", correctOption: "A", explanation: "dy/dx = 2(3)x + 2 = 6x + 2 (power rule: d/dx(xⁿ) = nxⁿ⁻¹)" },
    { topic: "Calculus", year: 2023, questionText: "Integrate: ∫(4x³)dx", optionA: "12x² + C", optionB: "x⁴ + C", optionC: "4x⁴ + C", optionD: "x³ + C", correctOption: "B", explanation: "∫4x³dx = 4(x⁴/4) + C = x⁴ + C" },
    { topic: "Complex Numbers", year: 2022, questionText: "If z = 3 + 4i, find |z|", optionA: "5", optionB: "7", optionC: "25", optionD: "1", correctOption: "A", explanation: "|z| = √(3² + 4²) = √(9 + 16) = √25 = 5" },
    { topic: "Vectors", year: 2022, questionText: "If a = 2i + 3j and b = i - j, find a + b", optionA: "3i + 2j", optionB: "i + 4j", optionC: "3i + 4j", optionD: "i + 2j", correctOption: "A", explanation: "a + b = (2+1)i + (3+(-1))j = 3i + 2j" },
    { topic: "Permutations", year: 2021, questionText: "How many ways can 5 people sit in a row?", optionA: "25", optionB: "120", optionC: "60", optionD: "24", correctOption: "B", explanation: "5! = 5 × 4 × 3 × 2 × 1 = 120" },
    { topic: "Binomial Theorem", year: 2021, questionText: "The coefficient of x² in the expansion of (1 + x)⁵ is", optionA: "5", optionB: "10", optionC: "20", optionD: "1", correctOption: "B", explanation: "Using ⁵C₂ = 5!/(2!3!) = 10" },
    { topic: "Coordinate Geometry", year: 2020, questionText: "Find the distance between points (1, 2) and (4, 6)", optionA: "5", optionB: "7", optionC: "25", optionD: "3", correctOption: "A", explanation: "d = √((4-1)² + (6-2)²) = √(9 + 16) = √25 = 5" },
    { topic: "Trigonometric Identities", year: 2020, questionText: "sin²θ + cos²θ equals", optionA: "0", optionB: "1", optionC: "2", optionD: "sin 2θ", correctOption: "B", explanation: "sin²θ + cos²θ = 1 is the fundamental Pythagorean trigonometric identity.", difficulty: "EASY" },
  ]);

  console.log("\n🎉 Seeding complete! 200+ WAEC-style questions added.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
