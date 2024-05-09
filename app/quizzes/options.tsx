import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useMemo } from 'react';

interface OptionsProps {
  options: string[];
  questionIndex: number;
  onOptionSelected: (value: number) => void;
  answerStatus: boolean | null;
  selectedAnswerIndex: number | null;
  correctAnswerIndex: number;
}

const Options: React.FC<OptionsProps> = ({ options, questionIndex, onOptionSelected, answerStatus, selectedAnswerIndex, correctAnswerIndex }) => {
  const shuffledOptions = useMemo(() => {
    const optionsWithIndices = options.map((option, index) => ({ option, index }));
    for (let i = optionsWithIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsWithIndices[i], optionsWithIndices[j]] = [optionsWithIndices[j], optionsWithIndices[i]];
    }
    return optionsWithIndices;
  }, [options]);

  return (
    <RadioGroup onValueChange={(value) => onOptionSelected(parseInt(value))} disabled={answerStatus !== null}>
      {shuffledOptions.map(({ option, index }) => (
        <div key={index} className="flex items-center space-x-2">
          <RadioGroupItem value={index.toString()} id={`option-${questionIndex}-${index}`} disabled={answerStatus !== null} />
          <Label htmlFor={`option-${questionIndex}-${index}`} className={`font-sans rounded-lg px-2 py-1 ${
            answerStatus !== null ? (
              index === correctAnswerIndex ? 'bg-green-300 dark:bg-green-600' :
              (selectedAnswerIndex === index && index !== correctAnswerIndex ? 'bg-red-300 dark:bg-red-600' : '')
            ) : ''
          }`}>
            {option}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default Options;