import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from 'react';  // Import useState from react

export function AddClassCard(props: { onSubmit: (name: string) => void }) {
  const [className, setClassName] = useState('');  // Initialize className state to an empty string

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClassName(event.target.value);  // Set className to the value of the input field
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();  // Prevent the default form submission behavior
    if (className.length >= 3) {
      props.onSubmit(className);  // Call the onSubmit prop with className
      setClassName('');  // Clear the className state after submission
    }
  };

  return (
    <Card className="w-full shadow-md max-w-md mx-auto">
      <CardHeader>  
        <CardTitle>Add New Class</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter class name" value={className} onChange={handleInputChange} />
          </div>
          <Button className="w-full" type="submit" disabled={className.length < 3}>
            Add Class
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
