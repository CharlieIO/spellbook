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
  "A bolt of lightning contains enough energy to toast 100,000 slices of bread. That's about 5 billion joules of energy.",
  "Cows have best friends and get stressed when they are separated. This affects their milk production.",
  "The Eiffel Tower can be 15 cm taller during the summer. This is due to the expansion of iron in the heat.",
  "Humans and giraffes have the same number of neck vertebrae. Both species have seven neck bones.",
  "A jiffy is an actual unit of time. It represents 1/100th of a second in computer engineering.",
  "The unicorn is the national animal of Scotland. This mythical creature has been a symbol of Scotland for centuries.",
  "The dot over the letter 'i' is called a 'tittle'. This small distinguishing mark has a specific name.",
  "A crocodile cannot stick its tongue out. This is due to a membrane that holds its tongue in place.",
  "The first oranges weren't orange. The original oranges from Southeast Asia were a tangerine-pomelo hybrid, and they were green.",
  "There's a basketball court in the U.S. Supreme Court building. It's known as the 'Highest Court in the Land'.",
  "A shrimp's heart is in its head. This is due to the location of its internal organs.",
  "A cow-bison hybrid is called a 'beefalo'. You can even buy its meat in at least 21 states.",
  "Scotland has 421 words for 'snow'. Some examples are 'sneesl' (to start raining or snowing), 'feefle' (to swirl), and 'flindrikin' (a light snow shower).",
  "Peanuts aren't technically nuts. They are legumes, which are edible seeds enclosed in pods.",
  "The shortest complete sentence in the English language is 'I am'. It consists of a subject and a verb.",
  "The world's smallest mammal is the bumblebee bat. It weighs less than a penny and is about the size of a large bumblebee.",
  "The longest word in the English language without a vowel is 'rhythms'. It consists of seven letters.",
  "The shortest commercial flight in the world lasts just 57 seconds. It connects two islands in Scotland.",
  "A snail can sleep for three years. This is a survival mechanism during periods of extreme weather.",
  "A blue whale's heart is the size of a small car. It can weigh as much as 1,300 pounds.",
  "The first computer mouse was made of wood. It was invented by Doug Engelbart in 1964.",
  "A bolt of lightning is five times hotter than the surface of the sun. It can reach temperatures of around 30,000 Kelvin.",
  "The world's largest grand piano was built by a 15-year-old in New Zealand. It is over 18 feet long and weighs 1.4 tons.",
  "The world's largest rubber duck weighs over 1,000 pounds. It was created by Dutch artist Florentijn Hofman.",
  "The longest recorded time for a person to hold their breath underwater is 24 minutes and 3 seconds. It was achieved by Aleix Segura Vendrell in 2016.",
  "The world's largest snow maze covers over 30,000 square feet. It was created in Canada in 2019.",
  "The longest recorded time for a person to go without sleep is 11 days. It was achieved by Randy Gardner in 1964."
];

const compliments = [
  "You're a rockstar, keep shining!",
  "You're doing amazing, sweetie!",
  "Your creativity knows no bounds!",
  "You're the best, hands down!",
  "You're a superstar, don't forget it!",
  "Your brilliance is unmatched!",
  "You're a gem, keep sparkling!",
  "You light up the room!",
  "You're fantastic, truly!",
  "You're a champion in every way!",
  "Your presence is inspiring!",
  "Your creativity is a gift!",
  "You're amazing at what you do!",
  "Your positivity is contagious!",
  "You always come out on top!",
  "You're wonderful beyond words!",
  "Your determination is admirable!",
  "You bring joy wherever you go!",
  "Your tenacity is impressive!",
  "Your energy is boundless!"
];

const LoadingPage = ({ params }: { params: { quizUuid: string } }) => {
  const router = useRouter();
  const { quizUuid } = params;
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [shuffledFacts, setShuffledFacts] = useState([...funFacts, ...compliments]);

  useEffect(() => {
    if (quizUuid) {
      pollQuizStatus(quizUuid, (quiz) => {
        if (quiz) {
          router.push(`/quiz/${quizUuid}`);
        }
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

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center justify-center h-full p-4 mt-8">
        <Card className="w-full max-w-lg h-64 pt-4 pb-8 md:pb-8 shadow-md">
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
};

export default LoadingPage;
