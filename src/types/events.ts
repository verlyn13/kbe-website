// Event Handler Types - Replace (e: any) throughout codebase

import { ChangeEvent, FormEvent, KeyboardEvent, MouseEvent } from 'react';

// Form Events
export type FormSubmitEvent = FormEvent<HTMLFormElement>;
export type InputChangeEvent = ChangeEvent<HTMLInputElement>;
export type TextAreaChangeEvent = ChangeEvent<HTMLTextAreaElement>;
export type SelectChangeEvent = ChangeEvent<HTMLSelectElement>;

// Mouse Events
export type ButtonClickEvent = MouseEvent<HTMLButtonElement>;
export type LinkClickEvent = MouseEvent<HTMLAnchorElement>;
export type DivClickEvent = MouseEvent<HTMLDivElement>;

// Keyboard Events
export type InputKeyboardEvent = KeyboardEvent<HTMLInputElement>;
export type TextAreaKeyboardEvent = KeyboardEvent<HTMLTextAreaElement>;

// File Events
export interface FileChangeEvent extends ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & {
    files: FileList;
  };
}

// Custom Events
export type AsyncFormHandler = (event: FormSubmitEvent) => Promise<void>;
export type AsyncClickHandler = (event: ButtonClickEvent) => Promise<void>;
