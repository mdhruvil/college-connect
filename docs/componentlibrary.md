# Component Library

This document provides an overview of the reusable React components located in the `components` directory. Each component is documented with its purpose, props, and usage examples to facilitate understanding and reuse across the application.

## UI Components

### Alert

- **Purpose:** Displays alert messages to the user, such as error or success notifications.
- **Props:**
  - `variant`: (optional) Specifies the alert style (`default` or `destructive`).
  - `className`: (optional) Allows custom CSS classes to be applied.
  - `children`: The content to display inside the alert.
- **Usage:**

```jsx
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert";

function MyComponent() {
  return (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Something went wrong.</AlertDescription>
    </Alert>
  );
}
```

### Avatar

- **Purpose:** Displays a user's avatar, with fallback initials if no image is available.
- **Components:**
  - `Avatar`: The main avatar container.
  - `AvatarImage`: Displays the user's image.
  - `AvatarFallback`: Displays fallback initials if no image is available.
- **Props:**
  - `Avatar`: `className` (optional): Allows custom CSS classes to be applied.
  - `AvatarImage`: `src` (optional): URL of the avatar image.
  - `AvatarFallback`: `children` (optional): The initials to display as fallback.
- **Usage:**

```jsx
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";

function MyComponent() {
  return (
    <Avatar>
      <AvatarImage src="/path/to/image.jpg" alt="User Avatar" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  );
}
```

### BottomBar

- **Purpose:** Provides a fixed navigation bar at the bottom of the screen for easy access to main sections.
- **Props:** None
- **Usage:**

```jsx
import { BottomBar } from "~/components/bottom-bar";

function MyComponent() {
  return (
    <div>
      {/* Content */}
      <BottomBar />
    </div>
  );
}
```

### Button

- **Purpose:** A styled button component with various variants and sizes.
- **Props:**
  - `variant`: (optional) Specifies the button style (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`).
  - `size`: (optional) Specifies the button size (`default`, `sm`, `lg`, `icon`).
  - `className`: (optional) Allows custom CSS classes to be applied.
  - `loading`: (optional) Displays a loading indicator within the button.
  - All standard HTML button attributes.
- **Usage:**

```jsx
import { Button } from "~/components/ui/button";

function MyComponent() {
  return (
    <Button variant="outline" onClick={() => alert('Clicked!')}>Click me</Button>
  );
}
```

### Calendar

- **Purpose:** A date picker component for selecting dates.
- **Props:**
  - All props from `react-day-picker`.
- **Usage:**

```jsx
import { Calendar } from "~/components/ui/calendar";
import { useState } from 'react';

function MyComponent() {
  const [date, setDate] = useState();
  return (
    <Calendar mode="single" selected={date} onSelect={setDate} />
  );
}
```

### Card

- **Purpose:** A container component for grouping related content with a consistent style.
- **Components:**
  - `Card`: The main card container.
  - `CardHeader`: The card header.
  - `CardTitle`: The card title.
  - `CardDescription`: The card description.
  - `CardContent`: The card content area.
  - `CardFooter`: The card footer.
- **Props:**
  - `Card`: `className` (optional): Allows custom CSS classes to be applied.
- **Usage:**

```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>Card Content</CardContent>
    </Card>
  );
}
```

### ClubCard

- **Purpose:** Displays a summary of a club, including its name, description, image, and member count.
- **Props:**
  - `name`: The name of the club.
  - `description`: A brief description of the club.
  - `image`: URL of the club's image.
  - `memberCount`: The number of members in the club.
  - `eventCount`: The number of events hosted by the club.
  - `isMember`: A boolean indicating whether the current user is a member of the club.
  - `id`: The ID of the club.
  - `refetchClubs`: A function to refetch the list of clubs.
- **Usage:**

```jsx
import { ClubCard } from "~/components/club-card";

function MyComponent() {
  return (
    <ClubCard
      name="Example Club"
      description="A club for example purposes."
      image="/path/to/club-image.jpg"
      memberCount={50}
      eventCount={10}
      isMember={true}
      id="club-id"
      refetchClubs={() => {}}
    />
  );
}
```

### DatePicker

- **Purpose:** Provides a date and time picker component.
- **Props:**
  - `value`: The currently selected date.
  - `onChange`: A function to handle date changes.
  - `disabled`: A boolean to disable the input.
  - `hourCycle`: 12 | 24, to display time in 12 or 24 hour format.
  - `placeholder`: The placeholder text for the input.
  - `displayFormat`: Object with `hour24` and `hour12` properties to customize the date format.
  - `granularity`: "day" | "hour" | "minute" | "second", to control the smallest unit displayed.
- **Usage:**

```jsx
import { DateTimePicker } from "~/components/date-picker";
import { useState } from 'react';

function MyComponent() {
  const [date, setDate] = useState(new Date());
  return (
    <DateTimePicker value={date} onChange={setDate} />
  );
}
```

### ErrorWithLogin

- **Purpose:** Displays an error message and a login button if the user is not authenticated.
- **Props:**
  - `errorMsg`: The error message to display.
- **Usage:**

```jsx
import { ErrorWithLogin } from "~/components/error-with-login";

function MyComponent() {
  return <ErrorWithLogin errorMsg="You must be logged in." />;
}
```

### EventCard

- **Purpose:** Displays a summary of an event, including its name, description, image, date, and location.
- **Props:**
  - `name`: The name of the event.
  - `image`: URL of the event's image.
  - `date`: The date of the event.
  - `location`: The location of the event.
  - `registrationCount`: The number of people registered for the event.
  - `id`: The ID of the event.
  - `description`: A brief description of the event.
  - `clubName`: The name of the club hosting the event.
- **Usage:**

```jsx
import { EventCard } from "~/components/event-card";

function MyComponent() {
  return (
    <EventCard
      name="Example Event"
      image="/path/to/event-image.jpg"
      date={new Date()}
      location="Example Location"
      registrationCount={25}
      id="event-id"
      description="An example event."
      clubName="Example Club"
    />
  );
}
```

### FileUploader

- **Purpose:** Provides a drag-and-drop file uploader component.
- **Props:**
  - `value`: The array of files currently selected.
  - `onValueChange`: A function to handle file changes.
  - `onUpload`: A function to handle file uploads.
  - `progresses`: An object tracking the upload progress of each file.
  - `accept`: An object specifying accepted file types.
  - `maxSize`: The maximum file size in bytes.
  - `maxFileCount`: The maximum number of files allowed.
  - `multiple`: A boolean indicating whether multiple files can be selected.
  - `disabled`: A boolean to disable the uploader.
- **Usage:**

```jsx
import { FileUploader } from "~/components/file-uploader";
import { useState } from 'react';

function MyComponent() {
  const [files, setFiles] = useState([]);
  return (
    <FileUploader value={files} onValueChange={setFiles} />
  );
}
```

### Input

- **Purpose:** A styled input component.
- **Props:**
  - All standard HTML input attributes.
- **Usage:**

```jsx
import { Input } from "~/components/ui/input";

function MyComponent() {
  return <Input type="text" placeholder="Enter text" />;
}
```

### Label

- **Purpose:** A styled label component.
- **Props:**
  - All standard HTML label attributes.
- **Usage:**

```jsx
import { Label } from "~/components/ui/label";

function MyComponent() {
  return <Label htmlFor="input-id">Example Label</Label>;
}
```

### RadioButtonGroup

- **Purpose:** A component for creating a group of radio buttons with labels.
- **Props:**
  - `options`: An array of objects, each with a `value` and `label` property.
  - `defaultValue`: The default selected value.
  - `onChange`: A function to handle value changes.
  - `name`: The name attribute for the radio group.
- **Usage:**

```jsx
import RadioButtonGroup from "~/components/radio-button-groups";
import { useState } from 'react';

function MyComponent() {
  const [value, setValue] = useState("option1");
  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
  ];
  return (
    <RadioButtonGroup options={options} defaultValue={value} onChange={setValue} />
  );
}
```

### ScrollArea

- **Purpose:** A component that provides a scrollable area with custom scrollbars.
- **Props:**
  - `className`: (optional) Allows custom CSS classes to be applied.
- **Usage:**

```jsx
import { ScrollArea } from "~/components/ui/scroll-area";

function MyComponent() {
  return (
    <ScrollArea className="h-40">
      {/* Content */}
    </ScrollArea>
  );
}
```

### Select

- **Purpose:** A styled select component.
- **Components:**
  - `Select`: The main select container.
  - `SelectTrigger`: The select trigger button.
  - `SelectValue`: The currently selected value display.
  - `SelectContent`: The dropdown content.
  - `SelectItem`: An option in the dropdown.
- **Props:**
  - `Select`: `className` (optional): Allows custom CSS classes to be applied.
- **Usage:**

```jsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~/components/ui/select";
import { useState } from 'react';

function MyComponent() {
  const [value, setValue] = useState("option1");
  return (
    <Select onValueChange={setValue} defaultValue={value}>
      <SelectTrigger>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

### Skeleton

- **Purpose:** Displays a placeholder skeleton for loading content.
- **Props:**
  - `className`: (optional) Allows custom CSS classes to be applied.
- **Usage:**

```jsx
import { Skeleton } from "~/components/ui/skeleton";

function MyComponent() {
  return <Skeleton className="h-10 w-40" />;
}
```

### Tabs

- **Purpose:** A component for creating tabbed interfaces.
- **Components:**
  - `Tabs`: The main tabs container.
  - `TabsList`: The list of tab triggers.
  - `TabsTrigger`: A tab trigger button.
  - `TabsContent`: The content associated with a tab.
- **Props:**
  - `Tabs`: `defaultValue`: The value of the default active tab.
- **Usage:**

```jsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";

function MyComponent() {
  return (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content for Tab 1</TabsContent>
      <TabsContent value="tab2">Content for Tab 2</TabsContent>
    </Tabs>
  );
}
```

### Textarea

- **Purpose:** A styled textarea component.
- **Props:**
  - All standard HTML textarea attributes.
- **Usage:**

```jsx
import { Textarea } from "~/components/ui/textarea";

function MyComponent() {
  return <Textarea placeholder="Enter text" />;
}
```

## Utility Components

### ClubCardSkeleton

- **Purpose:** Displays a skeleton loading state for the `ClubCard` component.
- **Props:** None
- **Usage:**

```jsx
import { ClubCardSkeleton } from "~/components/club-card";

function MyComponent() {
  return <ClubCardSkeleton />;
}
```

### EventCardSkeleton

- **Purpose:** Displays a skeleton loading state for the `EventCard` component.
- **Props:** None
- **Usage:**

```jsx
import { EventCardSkeleton } from "~/components/event-card";

function MyComponent() {
  return <EventCardSkeleton />;
}
```

## Hooks

### useUploadFile

- **Purpose:** A hook to handle file uploads.
- **Return Values:**
  - `onUpload`: A function to trigger the file upload.
  - `uploadedFiles`: An array of uploaded files.
  - `progresses`: An object tracking the upload progress of each file.
  - `isUploading`: A boolean indicating whether a file is currently being uploaded.
- **Usage:**

```jsx
import { useUploadFile } from "~/hooks/use-upload-file";

function MyComponent() {
  const { onUpload, uploadedFiles, progresses, isUploading } = useUploadFile("imageUploader");

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    await onUpload(files);
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      {isUploading && <p>Uploading...</p>}
      {uploadedFiles.map((file) => (
        <div key={file.fileKey}>{file.fileKey} - {progresses[file.name]}%</div>
      ))}
    </div>
  );
}
```

This component library aims to provide a set of consistent and reusable UI elements to streamline the development process and maintain a unified look and feel across the application. Developers are encouraged to utilize these components whenever possible and contribute to the library by creating new components or improving existing ones.