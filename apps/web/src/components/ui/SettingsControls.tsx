/**
 * @file apps/web/src/components/ui/SettingsControls.tsx
 * @description Reusable accessible settings switches, numeric steppers, and labeled control rows
 */
import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface ToggleSwitchProps {
  id?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  badge?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  checked,
  onChange,
  label,
  description,
  disabled = false,
  badge,
}) => {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          <label
            htmlFor={id}
            onClick={() => !disabled && onChange(!checked)}
            className={`text-sm font-semibold text-[#142647] ${disabled ? 'opacity-60' : 'cursor-pointer'}`}
          >
            {label}
          </label>
          {badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#DDF7EC] text-[#079669]">
              {badge}
            </span>
          )}
        </div>
        {description && <p className="text-xs text-[#5A708D] leading-relaxed max-w-xl">{description}</p>}
      </div>

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
          checked ? 'bg-[#079669]' : 'bg-[#CBDAD4]'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

interface NumberStepperProps {
  label: string;
  description?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
}

export const NumberStepper: React.FC<NumberStepperProps> = ({
  label,
  description,
  value,
  min,
  max,
  step = 5,
  unit = '',
  onChange,
}) => {
  const handleDecrement = () => onChange(Math.max(min, value - step));
  const handleIncrement = () => onChange(Math.min(max, value + step));

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3">
      <div>
        <div className="text-sm font-semibold text-[#142647]">{label}</div>
        {description && <p className="text-xs text-[#5A708D] mt-0.5">{description}</p>}
      </div>

      <div className="inline-flex items-center gap-2 bg-[#F7FCFA] border border-[#E1EEE9] rounded-xl p-1 self-start sm:self-auto">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className="w-8 h-8 rounded-lg bg-white border border-[#E1EEE9] hover:border-[#079669] text-[#142647] flex items-center justify-center disabled:opacity-40 cursor-pointer"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <div className="min-w-[82px] text-center text-sm font-bold text-[#142647] tabular-nums px-2">
          {value} {unit}
        </div>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className="w-8 h-8 rounded-lg bg-white border border-[#E1EEE9] hover:border-[#079669] text-[#142647] flex items-center justify-center disabled:opacity-40 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
