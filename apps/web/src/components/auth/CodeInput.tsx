import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface CodeInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onComplete?: () => void;
}

export default function CodeInput({ 
  length = 6, 
  value, 
  onChange, 
  error, 
  onComplete 
}: CodeInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update internal state when value prop changes
  useEffect(() => {
    const newValues = value.split("").slice(0, length);
    while (newValues.length < length) newValues.push("");
    setValues(newValues);
  }, [value, length]);

  const handleChange = (index: number, newValue: string) => {
    // Only allow digits
    if (!/^\d*$/.test(newValue)) return;

    const newValues = [...values];
    newValues[index] = newValue.slice(-1); // Only take last digit
    setValues(newValues);

    const fullValue = newValues.join("");
    onChange(fullValue);

    // Auto-advance to next input
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete when all fields are filled
    if (fullValue.length === length && onComplete) {
      onComplete();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "");
    const newValues = pasteData.split("").slice(0, length);
    
    while (newValues.length < length) newValues.push("");
    setValues(newValues);
    
    const fullValue = newValues.join("");
    onChange(fullValue);

    // Focus last filled input or next empty one
    const lastIndex = Math.min(pasteData.length, length - 1);
    inputRefs.current[lastIndex]?.focus();

    if (fullValue.length === length && onComplete) {
      onComplete();
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm text-zinc-300 mb-3">Verification code</label>
      <div className="flex justify-center gap-3 mb-2">
        {Array.from({ length }).map((_, index) => (
          <motion.input
            key={index}
            ref={(el: HTMLInputElement | null) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={values[index]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`
              w-12 h-12 text-center text-xl font-semibold
              bg-zinc-900/60 border border-zinc-700 rounded-xl
              text-zinc-100 outline-none
              focus:ring-2 focus:ring-violet-500 focus:border-violet-500
              transition-all duration-200
              ${error ? 'border-rose-500 bg-rose-500/10' : ''}
            `}
            animate={error ? { x: [-2, 2, -2, 2, 0] } : {}}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
      <p className="text-center text-xs text-zinc-500">
        Enter the 6-digit code sent via SMS or WhatsApp
      </p>
      {!!error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs text-rose-400 text-center"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
