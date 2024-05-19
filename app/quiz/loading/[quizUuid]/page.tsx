"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { pollQuizStatus } from '@/utils/polling';
import { LoadingSpinner } from '@/components/loadingspinner';
import NavBar from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

const funFacts = [
  "Honey never spoils. Archaeologists found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still edible.",
  "Bananas are berries, but strawberries aren't. This is due to the botanical definitions of berries.",
  "A day on Venus is longer than a year on Venus. It takes 243 Earth days to rotate once.",
  "Octopuses have three hearts and blue blood. Two pump blood to the gills, and one to the rest of the body.",
  "There are more stars in the universe than grains of sand on all Earth's beaches. The estimated number is around 10^24 stars.",
  "A single strand of spaghetti is called a 'spaghetto'. This is the singular form of the word in Italian.",
  "The shortest war in history lasted 38 minutes, between Britain and Zanzibar in 1896. It ended with a British victory.",
  "A bolt of lightning contains enough energy to toast 100,000 slices of bread. That's about 5 billion joules of energy.",
  "Cows have best friends and get stressed when they are separated. This affects their milk production.",
  "The inventor of the Pringles can is now buried in one. Fred Baur, who invented the can, requested this in his will.",
  "A group of flamingos is called a 'flamboyance'. This term reflects their colorful appearance.",
  "The Eiffel Tower can be 15 cm taller during the summer. This is due to the expansion of iron in the heat.",
  "Wombat poop is cube-shaped. This helps prevent it from rolling away and marks their territory.",
  "Humans and giraffes have the same number of neck vertebrae. Both species have seven neck bones.",
  "The shortest commercial flight in the world lasts just 57 seconds. It connects two islands in Scotland.",
  "A snail can sleep for three years. This is a survival mechanism during periods of extreme weather.",
  "The longest hiccuping spree lasted 68 years. Charles Osborne hiccuped continuously from 1922 to 1990.",
  "A blue whale's heart is the size of a small car. It can weigh as much as 1,300 pounds.",
  "The world's largest snowflake on record was 15 inches wide. It fell in Fort Keogh, Montana, in 1887.",
  "A jiffy is an actual unit of time. It represents 1/100th of a second in computer engineering.",
  "The unicorn is the national animal of Scotland. This mythical creature has been a symbol of Scotland for centuries.",
  "A group of crows is called a 'murder'. This term dates back to the 15th century.",
  "The longest recorded flight of a chicken is 13 seconds. Chickens are generally not known for their flying abilities.",
  "The dot over the letter 'i' is called a 'tittle'. This small distinguishing mark has a specific name.",
  "A crocodile cannot stick its tongue out. This is due to a membrane that holds its tongue in place.",
  "The first oranges weren't orange. The original oranges from Southeast Asia were a tangerine-pomelo hybrid, and they were green.",
  "There's a basketball court in the U.S. Supreme Court building. It's known as the 'Highest Court in the Land'.",
  "A group of porcupines is called a 'prickle'. This term reflects their spiky appearance.",
  "The inventor of the frisbee was turned into a frisbee. Walter Morrison's ashes were molded into a frisbee after he died.",
  "A shrimp's heart is in its head. This is due to the location of its internal organs.",
  "The longest wedding veil was longer than 63 football fields. It measured 23,000 feet.",
  "A cow-bison hybrid is called a 'beefalo'. You can even buy its meat in at least 21 states.",
  "Scotland has 421 words for 'snow'. Some examples are 'sneesl' (to start raining or snowing), 'feefle' (to swirl), and 'flindrikin' (a light snow shower).",
  "Samsung tests phone durability with a butt-shaped robot. The robot is designed to sit on the phones to test their durability.",
  "Peanuts aren't technically nuts. They are legumes, which are edible seeds enclosed in pods.",
  "The longest English word is 189,819 letters long. It's the full name for the protein nicknamed 'titin'.",
  "Octopuses lay 56,000 eggs at a time. The mother spends six months so devoted to protecting the eggs that she doesn't eat.",
  "Cats have fewer toes on their back paws. Like most four-legged mammals, they have five toes on the front, but their back paws only have four toes.",
  "A group of jellyfish is called a 'smack'. This term reflects their unique movement in the water.",
  "The first computer mouse was made of wood. It was invented by Doug Engelbart in 1964.",
  "A bolt of lightning is five times hotter than the surface of the sun. It can reach temperatures of around 30,000 Kelvin.",
  "The shortest complete sentence in the English language is 'I am'. It consists of a subject and a verb.",
  "A group of owls is called a 'parliament'. This term is believed to come from C.S. Lewis's description of a meeting of owls in 'The Chronicles of Narnia'.",
  "The world's largest grand piano was built by a 15-year-old in New Zealand. It is over 18 feet long and weighs 1.4 tons.",
  "A group of frogs is called an 'army'. This term reflects their large numbers and coordinated movements.",
  "The longest word in the English language without a vowel is 'rhythms'. It consists of seven letters.",
  "A group of kangaroos is called a 'mob'. This term reflects their social behavior and tendency to move in groups.",
  "The world's smallest mammal is the bumblebee bat. It weighs less than a penny and is about the size of a large bumblebee.",
  "A group of rhinos is called a 'crash'. This term reflects their powerful and potentially destructive nature.",
  "The longest recorded flight of a paper airplane is 226 feet and 10 inches. It was achieved by Joe Ayoob in 2012.",
  "A group of tigers is called a 'streak'. This term reflects their distinctive striped appearance.",
  "The world's largest rubber duck weighs over 1,000 pounds. It was created by Dutch artist Florentijn Hofman.",
  "A group of whales is called a 'pod'. This term reflects their social behavior and tendency to travel in groups.",
  "The longest recorded time for a person to hold their breath underwater is 24 minutes and 3 seconds. It was achieved by Aleix Segura Vendrell in 2016.",
  "A group of zebras is called a 'dazzle'. This term reflects their striking black-and-white striped appearance.",
  "The world's largest snow maze covers over 30,000 square feet. It was created in Canada in 2019.",
  "A group of giraffes is called a 'tower'. This term reflects their tall and majestic appearance.",
  "The longest recorded time for a person to go without sleep is 11 days. It was achieved by Randy Gardner in 1964."
];

const compliments = [
  "You're a rockstar, keep shining!",
  "You're doing amazing, sweetie!",
  "You're a wizard of awesomeness!",
  "You're the bee's knees!",
  "You're a superstar, don't forget it!",
  "You're a bundle of brilliance!",
  "You're a gem, keep sparkling!",
  "You're a ray of sunshine!",
  "You're a marvel of magnificence!",
  "You're a champion of cheerfulness!",
  "You're a beacon of brilliance!",
  "You're a fountain of creativity!",
  "You're a maestro of magnificence!",
  "You're a paragon of positivity!",
  "You're a virtuoso of victory!",
  "You're a wizard of wonder!",
  "You're a dynamo of determination!",
  "You're a luminary of laughter!",
  "You're a titan of tenacity!",
  "You're a vanguard of vitality!"
];

const LoadingPage = ({ params }: { params: { quizUuid: string } }) => {
  const router = useRouter();
  const { quizUuid } = params;
  const [quizData, setQuizData] = useState(null);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [shuffledFacts, setShuffledFacts] = useState([...funFacts, ...compliments]);

  useEffect(() => {
    if (quizUuid) {
      pollQuizStatus(quizUuid, (quiz) => {
        setQuizData(quiz);
        router.push(`/quiz/${quizUuid}`);
      });
    }
  }, [quizUuid, router]);

  useEffect(() => {
    const shuffleArray = (array: any[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    setShuffledFacts(shuffleArray([...funFacts, ...compliments]));

    const factInterval = setInterval(() => {
      setCurrentFactIndex((prevIndex) => (prevIndex + 1) % shuffledFacts.length);
    }, 10000); // Change fact every 10 seconds

    return () => clearInterval(factInterval);
  }, []);

  if (!quizData) {
    return (
      <>
        <NavBar />
        <div className="flex flex-col items-center justify-center h-full p-4 mt-8">
          <Card className="w-full max-w-lg h-64 pt-4 pb-8 md:pb-8">
            <CardHeader>
              <CardTitle className="text-center">Generating Quiz</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <LoadingSpinner className="h-10 w-10 mb-4" />
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentFactIndex}
                  className="text-md text-center text-base italic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {shuffledFacts[currentFactIndex]}
                </motion.p>
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return null;
};

export default LoadingPage;