import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

interface PaletteFormProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

export function PaletteForm({
  inputValue,
  setInputValue,
  onSubmit,
  isPending,
}: PaletteFormProps) {
  const disabled = isPending || !inputValue.trim();

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-lg mx-auto gap-4 mb-4"
    >
      <Input
        placeholder="I'm feeling..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" isLoading={isPending} disabled={disabled}>
        Generate
      </Button>
    </form>
  );
}
