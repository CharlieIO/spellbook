import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createPortal } from 'react-dom';
import { CSSProperties } from 'react';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal
} from "@/components/ui/alert-dialog";

interface NoteCardProps {
  imageSrc: string;
  onDelete: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ imageSrc, onDelete }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);
  const openDialog = () => {
    if (isFullScreen) {
      setIsFullScreen(false);
    }
    setIsDialogOpen(true);
  };
  const closeDialog = () => setIsDialogOpen(false);
  const handleDelete = () => {
    onDelete();
    closeDialog();
  };

  const fullScreenStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 1000,
    background: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const imageContainer = (
    <div className={isFullScreen ? "relative w-full h-full" : "relative w-full h-full min-h-[200px] group"} onClick={toggleFullScreen}>
      <Image
        alt="Note Image"
        className="w-full h-full object-contain cursor-pointer"
        src={imageSrc}
        fill
        sizes="100vw"
        style={{
          objectFit: 'contain',
          objectPosition: 'center',
        }}
      />
      <Button
        className="absolute top-2 right-2 bg-primary text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-100"
        size="icon"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          openDialog();
        }}
      >
        <TrashIcon className="h-5 w-5" />
        <span className="sr-only">Delete Image</span>
      </Button>
    </div>
  );

  return (
    <Card className="max-w-sm w-full shadow-md">
      <CardContent className="p-0">
        {isFullScreen ? createPortal(<div style={fullScreenStyle}>{imageContainer}</div>, document.body) : imageContainer}
        {createPortal(
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogPortal>
              <AlertDialogOverlay />
              <AlertDialogContent>
                <AlertDialogTitle>Delete Note</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this note? This action cannot be undone.
                </AlertDialogDescription>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                <AlertDialogCancel onClick={closeDialog}>Cancel</AlertDialogCancel>
              </AlertDialogContent>
            </AlertDialogPortal>
          </AlertDialog>,
          document.body
        )}
      </CardContent>
    </Card>
  );
};

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}

export default NoteCard;