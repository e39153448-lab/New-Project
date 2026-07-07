import type { PrismaClient } from "@/generated/prisma/client";
import bcrypt from "bcryptjs";

const LEVELS = {
  READINESS: "Kindergarten Readiness",
  K: "Kindergarten",
  FIRST: "1st Grade",
  SECOND: "2nd Grade",
} as const;

export async function seedDatabase(prisma: PrismaClient) {
  console.log("Clearing existing data...");
  await prisma.$transaction([
    prisma.rocketFuelTransaction.deleteMany(),
    prisma.shipmentItem.deleteMany(),
    prisma.shipment.deleteMany(),
    prisma.childCertification.deleteMany(),
    prisma.certificationMilestone.deleteMany(),
    prisma.childCard.deleteMany(),
    prisma.childMissionSection.deleteMany(),
    prisma.childMission.deleteMany(),
    prisma.childMilestone.deleteMany(),
    prisma.childCaregiver.deleteMany(),
    prisma.caregiverInvite.deleteMany(),
    prisma.missionQuestion.deleteMany(),
    prisma.missionSection.deleteMany(),
    prisma.mission.deleteMany(),
    prisma.certification.deleteMany(),
    prisma.pin.deleteMany(),
    prisma.card.deleteMany(),
    prisma.character.deleteMany(),
    prisma.milestone.deleteMany(),
    prisma.child.deleteMany(),
    prisma.family.deleteMany(),
    prisma.inquiry.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // ── Milestones ────────────────────────────────────────────────────────
  console.log("Seeding milestones...");

  const milestoneData: { level: string; title: string; description: string; instructions: string }[] = [
    // Kindergarten Readiness
    { level: LEVELS.READINESS, title: "Count objects to 5", description: "Child can count a small group of objects up to 5.", instructions: "Line up 5 small objects (blocks, snacks, toys). Ask your child to count them out loud, pointing to each one." },
    { level: LEVELS.READINESS, title: "Count objects to 10", description: "Child can count a group of objects up to 10.", instructions: "Line up 10 objects. Ask your child to count them one at a time, touching each object." },
    { level: LEVELS.READINESS, title: "Recognize numbers 1–10", description: "Child can identify written numerals 1 through 10.", instructions: "Show number cards 1-10 in random order. Ask your child to name each number." },
    { level: LEVELS.READINESS, title: "Compare more/less", description: "Child can tell which of two groups has more or less.", instructions: "Make two small piles of objects with different amounts. Ask which has more, which has less." },
    { level: LEVELS.READINESS, title: "Identify basic shapes", description: "Child can name circle, square, triangle, and rectangle.", instructions: "Point to shapes around the house or on a shape card. Ask your child to name each one." },
    { level: LEVELS.READINESS, title: "Create simple patterns", description: "Child can copy and extend an AB pattern.", instructions: "Make a pattern with two colors of blocks (red, blue, red, blue). Ask your child what comes next." },
    { level: LEVELS.READINESS, title: "Sort by color/shape/size", description: "Child can sort a mixed group of objects by one attribute.", instructions: "Give your child a mixed pile of objects. Ask them to sort into groups by color, shape, or size." },
    { level: LEVELS.READINESS, title: "Understand first/last", description: "Child can identify the first and last object in a line.", instructions: "Line up 5 toys. Ask your child to point to the first one and the last one." },
    { level: LEVELS.READINESS, title: "Begin addition with objects", description: "Child can combine two small groups and count the total.", instructions: "Put 2 objects and 3 objects in separate piles. Ask your child to push them together and count how many total." },
    { level: LEVELS.READINESS, title: "Begin subtraction with objects", description: "Child can take away objects from a group and count what's left.", instructions: "Start with 5 objects. Take 2 away with your child watching. Ask how many are left." },

    // Kindergarten
    { level: LEVELS.K, title: "Count to 100 by ones", description: "Child can count from 1 to 100 by ones.", instructions: "Practice counting together, a little further each day, until your child reaches 100." },
    { level: LEVELS.K, title: "Count to 100 by tens", description: "Child can count 10, 20, 30... up to 100.", instructions: "Count by tens together using fingers or objects grouped in tens." },
    { level: LEVELS.K, title: "Count forward from a given number", description: "Child can start counting from any number, not just 1.", instructions: "Say a number like 7 and ask your child to keep counting forward from there." },
    { level: LEVELS.K, title: "Compare numbers 1–10", description: "Child can say which of two numbers is greater or less.", instructions: "Show two numeral cards. Ask which number is bigger." },
    { level: LEVELS.K, title: "Addition within 10", description: "Child can add two numbers with a sum up to 10.", instructions: "Use objects or fingers to model simple addition problems within 10." },
    { level: LEVELS.K, title: "Subtraction within 10", description: "Child can subtract within 10 using objects or drawings.", instructions: "Use objects to model taking away, keeping totals at or below 10." },
    { level: LEVELS.K, title: "Decompose numbers up to 10", description: "Child can break a number into two parts in more than one way.", instructions: "Ask: 'How many ways can we make 5?' Use objects to find pairs like 2+3, 4+1." },
    { level: LEVELS.K, title: "Identify measurable attributes", description: "Child can describe length or weight of an object.", instructions: "Pick up two objects and ask which is longer, heavier, or bigger." },
    { level: LEVELS.K, title: "Identify pennies and dimes", description: "Child can recognize a penny and a dime.", instructions: "Show a penny and dime. Ask your child to point out which is which." },
    { level: LEVELS.K, title: "2D and 3D shapes", description: "Child can tell the difference between flat and solid shapes.", instructions: "Compare a flat shape (paper circle) to a solid one (a ball). Ask which is flat and which is solid." },

    // 1st Grade
    { level: LEVELS.FIRST, title: "Count to 120", description: "Child can count to 120 starting from any number.", instructions: "Practice counting past 100 together, starting from different numbers." },
    { level: LEVELS.FIRST, title: "Add/subtract within 20", description: "Child can add and subtract fluently within 20.", instructions: "Practice quick addition and subtraction facts within 20 using flashcards or objects." },
    { level: LEVELS.FIRST, title: "Solve word problems within 20", description: "Child can solve simple story problems within 20.", instructions: "Tell a short story problem ('You have 8 apples and get 5 more...') and ask your child to solve it." },
    { level: LEVELS.FIRST, title: "Understand tens and ones", description: "Child understands a two-digit number as tens and ones.", instructions: "Use ten-sticks and single blocks to build two-digit numbers together." },
    { level: LEVELS.FIRST, title: "Compare two-digit numbers", description: "Child can compare two two-digit numbers using >, =, <.", instructions: "Show two two-digit numbers and ask which is greater." },
    { level: LEVELS.FIRST, title: "Add within 100", description: "Child can add a two-digit and one-digit or multiple of ten.", instructions: "Practice adding numbers like 34 + 5 or 34 + 20 using drawings." },
    { level: LEVELS.FIRST, title: "Tell time to hour/half-hour", description: "Child can read a clock to the hour and half-hour.", instructions: "Practice reading a clock together at different times of day." },
    { level: LEVELS.FIRST, title: "Identify coins", description: "Child can name penny, nickel, dime, and quarter.", instructions: "Lay out coins and ask your child to name and sort them." },
    { level: LEVELS.FIRST, title: "Organize simple data", description: "Child can sort data into up to three categories and answer questions about it.", instructions: "Sort a group of objects into 3 categories and ask how many are in each." },

    // 2nd Grade
    { level: LEVELS.SECOND, title: "Odd/even numbers", description: "Child can identify whether a number is odd or even.", instructions: "Give your child a number of objects and ask if it can be split evenly into two groups." },
    { level: LEVELS.SECOND, title: "Add/subtract within 100", description: "Child can add and subtract fluently within 100.", instructions: "Practice two-digit addition and subtraction problems together." },
    { level: LEVELS.SECOND, title: "Place value to 1,000", description: "Child understands hundreds, tens, and ones.", instructions: "Build a 3-digit number using hundred flats, ten-sticks, and single blocks." },
    { level: LEVELS.SECOND, title: "Skip count by 5s, 10s, 100s", description: "Child can skip-count by 5, 10, and 100.", instructions: "Practice counting by 5s, 10s, and 100s together out loud." },
    { level: LEVELS.SECOND, title: "Read/write numbers to 1,000", description: "Child can read and write 3-digit numbers.", instructions: "Say a 3-digit number and ask your child to write it down, and vice versa." },
    { level: LEVELS.SECOND, title: "Compare three-digit numbers", description: "Child can compare two 3-digit numbers.", instructions: "Show two 3-digit numbers and ask which is greater using >, =, <." },
    { level: LEVELS.SECOND, title: "Measure length", description: "Child can measure an object's length with a ruler.", instructions: "Give your child a ruler and ask them to measure a few household objects." },
    { level: LEVELS.SECOND, title: "Picture/bar graphs", description: "Child can read and answer questions about a simple graph.", instructions: "Make a simple bar graph together (favorite fruits, colors) and ask questions about it." },
    { level: LEVELS.SECOND, title: "Tell time to 5 minutes", description: "Child can read a clock in 5-minute increments.", instructions: "Practice reading the clock together in 5-minute steps." },
    { level: LEVELS.SECOND, title: "Count coins up to $1", description: "Child can count a mixed group of coins up to one dollar.", instructions: "Give your child a mix of coins and ask them to count the total value." },
  ];

  const milestonesByLevel: Record<string, string[]> = {};
  for (const [i, m] of milestoneData.entries()) {
    const created = await prisma.milestone.create({
      data: { ...m, sortOrder: i },
    });
    milestonesByLevel[m.level] ??= [];
    milestonesByLevel[m.level].push(created.id);
  }

  // ── Pins & Certifications ─────────────────────────────────────────────
  console.log("Seeding pins and certifications...");

  const pinDefs = [
    { name: "Counting & Cardinality", level: LEVELS.READINESS, description: "Awarded for mastering Kindergarten Readiness math skills.", imageUrl: "" },
    { name: "Kindergarten Math Pin", level: LEVELS.K, description: "Awarded for mastering Kindergarten math skills.", imageUrl: "" },
    { name: "1st Grade Math Pin", level: LEVELS.FIRST, description: "Awarded for mastering 1st Grade math skills.", imageUrl: "" },
    { name: "2nd Grade Math Pin", level: LEVELS.SECOND, description: "Awarded for mastering 2nd Grade math skills.", imageUrl: "" },
  ];
  const pins = [];
  for (const p of pinDefs) pins.push(await prisma.pin.create({ data: p }));

  const certDefs = [
    { name: "Kindergarten Readiness Certification", level: LEVELS.READINESS, description: "Certifies foundational counting, shapes, and early operations skills.", pinId: pins[0].id, rocketFuelReward: 500 },
    { name: "Kindergarten Certification", level: LEVELS.K, description: "Certifies Kindergarten-level math standards.", pinId: pins[1].id, rocketFuelReward: 750 },
    { name: "1st Grade Certification", level: LEVELS.FIRST, description: "Certifies 1st Grade-level math standards.", pinId: pins[2].id, rocketFuelReward: 1000 },
    { name: "2nd Grade Certification", level: LEVELS.SECOND, description: "Certifies 2nd Grade-level math standards.", pinId: pins[3].id, rocketFuelReward: 1250 },
  ];
  const certs = [];
  for (const c of certDefs) certs.push(await prisma.certification.create({ data: c }));

  for (const cert of certs) {
    const ids = milestonesByLevel[cert.level] ?? [];
    for (const milestoneId of ids) {
      await prisma.certificationMilestone.create({
        data: { certificationId: cert.id, milestoneId },
      });
    }
  }

  // ── Characters & Cards (The Astronites) ───────────────────────────────
  console.log("Seeding characters and cards...");

  const characterDefs = [
    { name: "Unity", superpower: "Teamwork Boost", description: "Brings crews together — Unity makes group counting missions twice as fun.", rarity: "common" },
    { name: "Helix", superpower: "Pattern Sight", description: "Sees patterns everywhere, from DNA strands to number sequences.", rarity: "common" },
    { name: "Triggy", superpower: "Shape Shift", description: "A shapes expert who can spot triangles hiding in any picture.", rarity: "common" },
    { name: "Elemento", superpower: "Building Blocks", description: "Combines simple shapes into amazing new ones.", rarity: "common" },
    { name: "Pentagrim", superpower: "Five-Sided Focus", description: "Master of five-sided shapes and steady counting.", rarity: "rare" },
    { name: "Sigma", superpower: "Sum Sense", description: "Can add up any group of objects in a flash.", rarity: "common" },
    { name: "Septaflux", superpower: "Seven-Step Streak", description: "Keeps patterns going, seven steps at a time.", rarity: "common" },
    { name: "Bytebot", superpower: "Tech Vision", description: "A tiny robot who explains how AI and technology work, one byte at a time.", rarity: "rare" },
    { name: "Plutora", superpower: "Far Out Estimating", description: "Great at estimating distances across the whole solar system.", rarity: "common" },
    { name: "Basematic", superpower: "Place Value Power", description: "Understands ones, tens, and hundreds better than anyone in the galaxy.", rarity: "common" },
    { name: "Fibona", superpower: "Sequence Sense", description: "Spots number sequences no one else notices.", rarity: "rare" },
    { name: "Dodeky", superpower: "Twelve-Fold Vision", description: "Sees all twelve sides of every problem.", rarity: "common" },
    { name: "Magdigit", superpower: "Digital Precision", description: "A calculating robot who never makes a counting mistake.", rarity: "rare" },
    { name: "Goldie", superpower: "Golden Ratio", description: "Finds the perfect proportion in every measurement.", rarity: "rare" },
    { name: "Exvee", superpower: "Roman Numeral Recall", description: "Reads and writes numbers in every form imaginable.", rarity: "common" },
    { name: "Hex", superpower: "Six-Sided Strategy", description: "Plans every mission with six steps ahead.", rarity: "epic" },
    { name: "Shohei", superpower: "All-Star Averages", description: "Loves sports stats and calculating averages.", rarity: "rare" },
    { name: "Argon", superpower: "Element Energy", description: "Powers up missions with bursts of scientific curiosity.", rarity: "rare" },
    { name: "Metonic", superpower: "Time Cycles", description: "Keeps perfect track of calendars, cycles, and clocks.", rarity: "epic" },
    { name: "Amino", superpower: "Building Blocks of Life", description: "Connects math to science, one building block at a time.", rarity: "rare" },
    { name: "Captain Caldwell", superpower: "Mission Command", description: "Leads every Rocket Club crew with a steady countdown.", rarity: "epic" },
    { name: "Professor Engelward", superpower: "Deep Knowledge", description: "Has an answer for every 'why' question about math.", rarity: "epic" },
    { name: "Agent Enigma", superpower: "Puzzle Cracking", description: "Solves the trickiest word problems like secret codes.", rarity: "legendary" },
    { name: "Cosmo", superpower: "Rocket Fuel Mastery", description: "The founding astronaut of Rocket Club — always first to explore a new mission.", rarity: "legendary" },
  ];

  const rarityCost: Record<string, number> = { common: 100, rare: 250, epic: 500, legendary: 1000 };

  const characters = [];
  for (const c of characterDefs) {
    const character = await prisma.character.create({
      data: {
        name: c.name,
        description: c.description,
        superpower: c.superpower,
        imageUrl: "",
      },
    });
    const card = await prisma.card.create({
      data: {
        characterId: character.id,
        name: c.name,
        rarity: c.rarity,
        rocketFuelCost: rarityCost[c.rarity],
        imageUrl: "",
        description: c.description,
      },
    });
    characters.push({ character, card, rarity: c.rarity });
  }

  // ── Mission: FIFA World Cup (Week 4) ───────────────────────────────────
  console.log("Seeding mission...");

  const bytebot = characters.find((c) => c.character.name === "Bytebot")!;

  const mission = await prisma.mission.create({
    data: {
      title: "FIFA World Cup: Future of Soccer Technology",
      theme: "Sports + technology + math",
      weekNumber: 4,
      description:
        "Use soccer, technology, and Rocket Club characters to practice counting, addition, and reasoning.",
      level: "All Levels",
      characterId: bytebot.character.id,
      caregiverInstructions:
        "This week, explore how AI and technology are changing the FIFA World Cup. Watch the video together, work through the trivia and math questions at your child's level, then wrap up with the discussion prompts below. No prep needed — just follow the sections in order.",
      rocketFuelReward: 300,
    },
  });

  const sectionDefs = [
    {
      title: "Video",
      sortOrder: 0,
      content:
        "Watch 'The World Cup Goes AI' together — a short news-style video explaining how AI is transforming referee decisions, camera tracking, and player stats at the World Cup.",
    },
    {
      title: "Trivia",
      sortOrder: 1,
      content:
        "Answer trivia questions to show what you learned from the video. Use the K-2nd questions for younger children and the 3rd-and-up questions for older children. Earn 25 Rocket Fuel per question.",
    },
    {
      title: "Math Gameshow",
      sortOrder: 2,
      content:
        "Work through grade-leveled math word problems about cameras, scoreboards, and referees at the World Cup.",
    },
    {
      title: "Future of FIFA",
      sortOrder: 3,
      content:
        "In the future, soccer will use advanced technology to help make games fair and exciting. Cameras like VAR may instantly show if a ball crossed the goal line or if a player was offside. Players might wear smart jerseys with sensors that track how fast they run. Coaches could use this data to help players improve and stay healthy, and some training may even use virtual reality so players can practice scoring goals inside a digital stadium before real games.",
    },
    {
      title: "Discussion",
      sortOrder: 4,
      content:
        "1) What is one piece of technology you'd want a soccer team to have?\n2) How do you think AI helps referees make fairer calls?\n3) If you designed a smart jersey, what would it track?",
    },
  ];
  for (const s of sectionDefs) {
    await prisma.missionSection.create({ data: { missionId: mission.id, ...s } });
  }

  const questionDefs: { gradeLevel: string; question: string; answer: string; choices?: string[] }[] = [
    // Math Gameshow word problems
    { gradeLevel: LEVELS.K, question: "There are 4 cameras facing the players already. The stadium has 10 altogether. How many cameras are remaining?", answer: "6 cameras" },
    { gradeLevel: LEVELS.FIRST, question: "A smart scoreboard shows 15 fans on one screen and 12 fans on another screen. How many fans are shown together?", answer: "27 fans" },
    { gradeLevel: LEVELS.SECOND, question: "There are 5 cameras on each side of the field and there are 4 sides. How many cameras are there in total?", answer: "20 cameras" },
    { gradeLevel: "3rd Grade", question: "It takes the referee 3 minutes to check 1 camera. If there are 9 cameras, how many minutes does the referee need?", answer: "27 minutes" },
    // K-2nd Trivia
    { gradeLevel: "K-2nd", question: "What technology helps referees make faster and more accurate decisions?", answer: "AI (artificial intelligence)", choices: ["AI (artificial intelligence)", "Music speakers", "Weather radar", "Team uniforms"] },
    { gradeLevel: "K-2nd", question: "What is the special camera called that shows the referee's point of view?", answer: "RefCam", choices: ["Field Cam", "RefCam", "GoalCam", "FanCam"] },
    { gradeLevel: "K-2nd", question: "What is inside the soccer ball that helps track it during games?", answer: "Sensor", choices: ["Sensor", "Light bulb", "Battery pack only", "Microphone"] },
    { gradeLevel: "K-2nd", question: "How do stadium cameras help during games?", answer: "They track players' movement very quickly", choices: ["They slow the game down", "They track players' movement very quickly", "They change the weather", "They pick team captains"] },
    { gradeLevel: "K-2nd", question: "What is one way engineers are improving the World Cup?", answer: "Adding AI and new technology tools", choices: ["Adding AI and new technology tools", "Making goals smaller", "Changing uniforms every minute", "Removing referees"] },
    // 3rd+ Trivia
    { gradeLevel: "3rd Grade", question: "What technology helps referees decide if a player is offside?", answer: "AI combined with tracking cameras and ball data", choices: ["Crowd noise analysis", "AI combined with tracking cameras and ball data", "Player interviews", "Weather tracking systems"] },
    { gradeLevel: "3rd Grade", question: "How often do stadium cameras track player movement?", answer: "50 times per second", choices: ["10 times per second", "25 times per second", "50 times per second", "100 times per second"] },
    { gradeLevel: "3rd Grade", question: "What is the main purpose of RefCam?", answer: "To show fans the referee's point of view during live play", choices: ["To record celebrations after goals", "To show fans the referee's point of view during live play", "To replace all stadium cameras", "To track how many fans are watching"] },
    { gradeLevel: "3rd Grade", question: "What can AI tools do for coaches and teams?", answer: "Analyze matches and generate strategy insights", choices: ["Create jerseys", "Analyze matches and generate strategy insights", "Choose referees for games", "Sell tickets automatically"] },
    { gradeLevel: "3rd Grade", question: "Why do engineers use player tracking and AI systems in the World Cup?", answer: "To improve accuracy, speed up decisions, and help teams prepare", choices: ["To make games longer", "To improve accuracy, speed up decisions, and help teams prepare", "To reduce the number of fans", "To change stadium designs"] },
    // Mission 1 bonus problem
    { gradeLevel: LEVELS.SECOND, question: "Unity ran 22 miles while Fibiona ran 18 miles. What is the total distance they ran together?", answer: "40 miles" },
  ];
  for (const q of questionDefs) {
    await prisma.missionQuestion.create({
      data: {
        missionId: mission.id,
        gradeLevel: q.gradeLevel,
        question: q.question,
        answer: q.answer,
        choices: q.choices ?? undefined,
        rocketFuelReward: 25,
      },
    });
  }

  // Link mission to Kindergarten Readiness milestones it reinforces (counting/addition)
  const readinessAddSub = milestonesByLevel[LEVELS.READINESS].slice(8, 10);
  await prisma.mission.update({
    where: { id: mission.id },
    data: { relatedMilestones: { connect: readinessAddSub.map((id) => ({ id })) } },
  });

  // ── Users, Families, Children ──────────────────────────────────────────
  console.log("Seeding users, families, children...");

  const passwordHash = await bcrypt.hash("password123", 10);
  const adminPasswordHash = await bcrypt.hash("admin123", 10);

  await prisma.user.create({
    data: {
      email: "admin@rocketclub.com",
      passwordHash: adminPasswordHash,
      firstName: "Rocket",
      lastName: "Admin",
      role: "admin",
    },
  });

  const jamie = await prisma.user.create({
    data: {
      email: "jamie.chen@example.com",
      passwordHash,
      firstName: "Jamie",
      lastName: "Chen",
      role: "parent",
    },
  });

  const maria = await prisma.user.create({
    data: {
      email: "maria.lopez@example.com",
      passwordHash,
      firstName: "Maria",
      lastName: "Lopez",
      role: "caregiver",
    },
  });

  const priya = await prisma.user.create({
    data: {
      email: "priya.patel@example.com",
      passwordHash,
      firstName: "Priya",
      lastName: "Patel",
      role: "parent",
    },
  });

  const now = new Date();
  const trialStart = new Date(now);
  trialStart.setMonth(trialStart.getMonth() - 2);
  const trialEnd = new Date(trialStart);
  trialEnd.setMonth(trialEnd.getMonth() + 1);

  const chenFamily = await prisma.family.create({
    data: {
      parentUserId: jamie.id,
      membershipStatus: "active",
      trialStartDate: trialStart,
      trialEndDate: trialEnd,
    },
  });

  const readinessCert = certs[0];

  const emma = await prisma.child.create({
    data: {
      familyId: chenFamily.id,
      firstName: "Emma",
      age: 5,
      gradeLevel: LEVELS.READINESS,
      currentLevel: LEVELS.READINESS,
      rocketFuel: 0,
      currentCertificationId: readinessCert.id,
    },
  });

  await prisma.childCaregiver.create({
    data: { childId: emma.id, caregiverUserId: maria.id },
  });

  const patelTrialStart = new Date(now);
  patelTrialStart.setDate(patelTrialStart.getDate() - 10);
  const patelTrialEnd = new Date(patelTrialStart);
  patelTrialEnd.setMonth(patelTrialEnd.getMonth() + 1);

  const patelFamily = await prisma.family.create({
    data: {
      parentUserId: priya.id,
      membershipStatus: "free_trial",
      trialStartDate: patelTrialStart,
      trialEndDate: patelTrialEnd,
    },
  });

  const liam = await prisma.child.create({
    data: {
      familyId: patelFamily.id,
      firstName: "Liam",
      age: 4,
      gradeLevel: LEVELS.READINESS,
      currentLevel: LEVELS.READINESS,
      rocketFuel: 0,
    },
  });

  await prisma.caregiverInvite.create({
    data: {
      familyId: patelFamily.id,
      childId: liam.id,
      caregiverEmail: "grandma.patel@example.com",
      caregiverName: "Grandma Patel",
      status: "pending",
    },
  });

  // ── Emma's progress ──────────────────────────────────────────────────--
  console.log("Seeding Emma's progress...");

  const readinessMilestoneIds = milestonesByLevel[LEVELS.READINESS];
  for (const [i, milestoneId] of readinessMilestoneIds.entries()) {
    const completed = i < 8;
    await prisma.childMilestone.create({
      data: {
        childId: emma.id,
        milestoneId,
        status: completed ? "completed" : "available",
        completedAt: completed ? new Date(now.getTime() - (8 - i) * 86400000) : null,
      },
    });
  }
  // Lock other levels' milestones for Emma until she's certified up
  for (const level of [LEVELS.K, LEVELS.FIRST, LEVELS.SECOND]) {
    for (const milestoneId of milestonesByLevel[level]) {
      await prisma.childMilestone.create({
        data: { childId: emma.id, milestoneId, status: "locked" },
      });
    }
  }
  // A handful for Liam too (all locked/available at start — diagnostic not yet run)
  for (const milestoneId of readinessMilestoneIds) {
    await prisma.childMilestone.create({
      data: { childId: liam.id, milestoneId, status: "available" },
    });
  }

  await prisma.childCertification.create({
    data: { childId: emma.id, certificationId: readinessCert.id, status: "in_progress" },
  });
  for (const cert of certs.slice(1)) {
    await prisma.childCertification.create({
      data: { childId: emma.id, certificationId: cert.id, status: "locked" },
    });
  }
  for (const cert of certs) {
    await prisma.childCertification.create({
      data: { childId: liam.id, certificationId: cert.id, status: cert.id === readinessCert.id ? "available" : "locked" },
    });
  }

  await prisma.childMission.create({
    data: { childId: emma.id, missionId: mission.id, status: "not_started" },
  });
  await prisma.childMission.create({
    data: { childId: liam.id, missionId: mission.id, status: "not_started" },
  });

  // Cards: Emma has collected the first 7, rest locked
  for (const [i, c] of characters.entries()) {
    await prisma.childCard.create({
      data: {
        childId: emma.id,
        cardId: c.card.id,
        status: i < 7 ? "collected" : "locked",
        collectedAt: i < 7 ? new Date(now.getTime() - (7 - i) * 3 * 86400000) : null,
      },
    });
    await prisma.childCard.create({
      data: { childId: liam.id, cardId: c.card.id, status: "locked" },
    });
  }

  // Rocket Fuel ledger for Emma
  const fuelEntries: { amount: number; reason: string; sourceType: string }[] = [
    { amount: 800, reason: "Completed 8 Kindergarten Readiness milestones", sourceType: "milestone" },
    { amount: 900, reason: "Weekly mission sections & worksheets completed", sourceType: "mission" },
    { amount: 200, reason: "Certification progress bonus", sourceType: "certification" },
    { amount: -700, reason: "Unlocked 7 character cards from the shop", sourceType: "card" },
    { amount: 1150, reason: "Bonus Rocket Fuel from caregiver training completion", sourceType: "bonus" },
  ];
  let runningTotal = 0;
  for (const entry of fuelEntries) {
    runningTotal += entry.amount;
    await prisma.rocketFuelTransaction.create({
      data: { childId: emma.id, ...entry },
    });
  }
  await prisma.child.update({ where: { id: emma.id }, data: { rocketFuel: runningTotal } });

  // ── Shipments ────────────────────────────────────────────────────────--
  console.log("Seeding shipments...");

  const monthLabel = (offset: number) => {
    const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    return d.toLocaleString("en-US", { month: "long", year: "numeric" });
  };

  const shipmentDefs = [
    { month: monthLabel(-2), status: "delivered" as const, trackingNumber: "1Z999AA10123456784" },
    { month: monthLabel(-1), status: "delivered" as const, trackingNumber: "1Z999AA10123456785" },
    { month: monthLabel(0), status: "preparing" as const, trackingNumber: null },
  ];
  for (const s of shipmentDefs) {
    const shipment = await prisma.shipment.create({
      data: { childId: emma.id, month: s.month, status: s.status, trackingNumber: s.trackingNumber },
    });
    await prisma.shipmentItem.createMany({
      data: [
        { shipmentId: shipment.id, itemType: "worksheet", itemName: "Weekly mission worksheets", quantity: 4 },
        { shipmentId: shipment.id, itemType: "card", itemName: "Astronite trading card pack", quantity: 2 },
        { shipmentId: shipment.id, itemType: "pin", itemName: "Milestone pin (if certified)", quantity: 1 },
        { shipmentId: shipment.id, itemType: "milestone_sheet", itemName: "Milestone tracking sheet", quantity: 1 },
      ],
    });
  }

  await prisma.shipment.create({
    data: { childId: liam.id, month: monthLabel(0), status: "not_prepared" },
  });

  // ── Inquiries ────────────────────────────────────────────────────────--
  console.log("Seeding inquiries...");

  const inquiryDefs = [
    { parentFirstName: "Alex", parentLastName: "Rivera", email: "alex.rivera@example.com", phone: "555-010-1234", childFirstName: "Noah", childAge: 5, childGrade: LEVELS.READINESS, facilitatorType: "nanny", caregiverName: "Fatima", city: "Austin", state: "TX", zip: "78701", goal: "school_readiness", notes: "Wants to start before the school year begins.", status: "new" as const },
    { parentFirstName: "Devon", parentLastName: "Marsh", email: "devon.marsh@example.com", phone: "555-010-5678", childFirstName: "Ivy", childAge: 6, childGrade: LEVELS.K, facilitatorType: "grandparent", caregiverName: "Grandma Jo", city: "Denver", state: "CO", zip: "80202", goal: "math_confidence", notes: null, status: "contacted" as const },
    { parentFirstName: "Sam", parentLastName: "Okafor", email: "sam.okafor@example.com", phone: "555-010-9012", childFirstName: "Zuri", childAge: 7, childGrade: LEVELS.FIRST, facilitatorType: "au_pair", caregiverName: "Elin", city: "Seattle", state: "WA", zip: "98101", goal: "homeschool_support", notes: "Currently homeschooling, needs structure.", status: "call_booked" as const },
    { parentFirstName: "Taylor", parentLastName: "Brooks", email: "taylor.brooks@example.com", phone: "555-010-3456", childFirstName: "Micah", childAge: 8, childGrade: LEVELS.SECOND, facilitatorType: "parent", caregiverName: null, city: "Charlotte", state: "NC", zip: "28202", goal: "enrichment", notes: null, status: "training_booked" as const },
    { parentFirstName: "Jamie", parentLastName: "Chen", email: "jamie.chen@example.com", phone: "555-010-7890", childFirstName: "Emma", childAge: 5, childGrade: LEVELS.READINESS, facilitatorType: "nanny", caregiverName: "Maria Lopez", city: "San Francisco", state: "CA", zip: "94103", goal: "structured_caregiver_time", notes: "Enrolled - see Chen family.", status: "enrolled" as const },
    { parentFirstName: "Morgan", parentLastName: "Lee", email: "morgan.lee@example.com", phone: "555-010-2345", childFirstName: "Ada", childAge: 6, childGrade: LEVELS.K, facilitatorType: "other", caregiverName: null, city: "Chicago", state: "IL", zip: "60601", goal: "enrichment", notes: "Went with a different program.", status: "lost" as const },
  ];
  for (const inq of inquiryDefs) {
    await prisma.inquiry.create({ data: inq });
  }

  console.log("Seed complete.");
}
