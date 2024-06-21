'use client';
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { X } from 'lucide-react';

interface ProcessingStatusProps {
  uuid: string;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ uuid }) => {
  const [processedNotes, setProcessedNotes] = useState<number>(0);
  const [unprocessedNotes, setUnprocessedNotes] = useState<number>(0);
  const [totalNotes, setTotalNotes] = useState<number>(0);
  const [isProcessingComplete, setIsProcessingComplete] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [wasProcessing, setWasProcessing] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/class/notes/status?classUuid=${uuid}`);
        if (!response.ok) {
          throw new Error('Failed to fetch processing status');
        }
        const data = await response.json();
        setProcessedNotes(data.processedNotes);
        setUnprocessedNotes(data.unprocessedNotes);
        setTotalNotes(data.totalNotes);

        if (data.unprocessedNotes > 0) {
          setWasProcessing(true);
        }

        if (data.processedNotes === data.totalNotes && data.totalNotes > 0) {
          setIsProcessingComplete(true);
          if (wasProcessing) {
            setShowAlert(true);
          }
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Error fetching processing status:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [uuid, wasProcessing]);

  const progress = totalNotes > 0 ? (processedNotes / totalNotes) * 100 : 0;

  if (totalNotes === 0 && unprocessedNotes === 0) {
    return null;
  }

  return (
    <>
      {!isProcessingComplete && (
        <Alert>
          <AlertTitle>Processing notes...</AlertTitle>
          <AlertDescription>
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{processedNotes} / {totalNotes}</span>
              </div>
              <span className="text-sm italic">Notes won&apos;t be used for exams until processing is complete.</span>
              <Progress value={progress} className="w-full" />
            </div>
          </AlertDescription>
        </Alert>
      )}
      {showAlert && (
        <Alert className="mt-4">
          <AlertTitle className="flex items-center justify-between">
            Processing Complete
            <button onClick={() => setShowAlert(false)} className="text-sm">
              <X size={16} />
            </button>
          </AlertTitle>
          <AlertDescription>
            <div className="mt-2">
              <Progress value={100} className="w-full" />
            </div>
            <p className="mt-2">All notes have been processed successfully!</p>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default ProcessingStatus;
