import { useId } from 'react';
import { Input } from './input';
import { Label } from './label';
import { Select } from './select';
import { Textarea } from './textarea';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children?: React.ReactNode;
  className?: string;
}

export function FormField({ label, required, error, children, className }: FormFieldProps) {
  const id = useId();

  return (
    <div className={className}>
      <Label htmlFor={id}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children && React.cloneElement(children as React.ReactElement, { id })}
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function FormInput({ label, error, required, ...props }: FormInputProps) {
  const id = useId();

  return (
    <div>
      <Label htmlFor={id}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input id={id} required={required} {...props} />
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
}

interface FormSelectProps extends React.ComponentProps<typeof Select> {
  label: string;
  error?: string;
  required?: boolean;
}

export function FormSelect({ label, error, required, children, ...props }: FormSelectProps) {
  const id = useId();

  return (
    <div>
      <Label htmlFor={id}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Select {...props}>{children}</Select>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function FormTextarea({ label, error, required, ...props }: FormTextareaProps) {
  const id = useId();

  return (
    <div>
      <Label htmlFor={id}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Textarea id={id} required={required} {...props} />
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
}
