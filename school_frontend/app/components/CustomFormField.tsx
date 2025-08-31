import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";

interface CustomFormFieldProps<T extends FieldValues> {
  formControl: Control<T>;
  label: string;
  type?: string;
  name: Path<T>; // ensures only valid form field names
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

const CustomFormField = <T extends FieldValues>({
  formControl,
  label,
  type = "text",
  name,
  placeholder,
  disabled,
  required,
}: CustomFormFieldProps<T>) => {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              value={field.value ?? ""}
              required={required || false}
              disabled={disabled || false}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
