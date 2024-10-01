import React from "react";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioButtonGroupProps {
  options: RadioOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  className?: string;
}

export default function RadioButtonGroup({
  options,
  defaultValue,
  onChange,
  name,
  className = "grid grid-cols-3 gap-2",
}: RadioButtonGroupProps) {
  return (
    <RadioGroup
      defaultValue={defaultValue}
      onValueChange={onChange}
      name={name}
      className={className}
    >
      {options.map((option) => (
        <div key={option.value}>
          <RadioGroupItem
            value={option.value}
            id={option.value}
            className="peer sr-only"
          />
          <Label
            htmlFor={option.value}
            className="flex cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover p-4 transition-colors hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:text-primary"
          >
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
