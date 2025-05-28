// React 19 compatibility fixes for UI components
declare module '@radix-ui/react-*' {
  import { ComponentProps, ForwardRefExoticComponent, RefAttributes } from 'react';
  
  export interface ButtonProps extends ComponentProps<'button'> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    asChild?: boolean;
  }
  
  export interface DialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
    children?: React.ReactNode;
  }
  
  export interface DialogTriggerProps extends ComponentProps<'button'> {
    asChild?: boolean;
    children?: React.ReactNode;
  }
  
  export interface DialogContentProps extends ComponentProps<'div'> {
    children?: React.ReactNode;
    className?: string;
  }
  
  export interface DialogTitleProps extends ComponentProps<'h2'> {
    children?: React.ReactNode;
  }
  
  export interface SelectProps {
    value?: string;
    onValueChange?: (value: string) => void;
    children?: React.ReactNode;
  }
  
  export interface SelectTriggerProps extends ComponentProps<'button'> {
    children?: React.ReactNode;
  }
  
  export interface SelectValueProps {
    placeholder?: string;
    children?: React.ReactNode;
  }
  
  export interface SelectContentProps extends ComponentProps<'div'> {
    children?: React.ReactNode;
  }
  
  export interface SelectItemProps extends ComponentProps<'div'> {
    value: string;
    children?: React.ReactNode;
  }
  
  export interface DropdownMenuProps {
    children?: React.ReactNode;
  }
  
  export interface DropdownMenuTriggerProps extends ComponentProps<'button'> {
    asChild?: boolean;
    children?: React.ReactNode;
  }
  
  export interface DropdownMenuContentProps extends ComponentProps<'div'> {
    align?: 'start' | 'center' | 'end';
    children?: React.ReactNode;
  }
  
  export interface DropdownMenuItemProps extends ComponentProps<'div'> {
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode;
  }
  
  export interface LabelProps extends ComponentProps<'label'> {
    htmlFor?: string;
    children?: React.ReactNode;
  }
  
  export interface InputProps extends ComponentProps<'input'> {}
  
  export interface TextareaProps extends ComponentProps<'textarea'> {}
}

declare module 'lucide-react' {
  import { ComponentProps } from 'react';
  
  export interface LucideProps extends ComponentProps<'svg'> {
    size?: number;
    strokeWidth?: number;
  }
  
  export const CheckCircle: React.FC<LucideProps>;
  export const Clock: React.FC<LucideProps>;
  export const AlertCircle: React.FC<LucideProps>;
  export const Filter: React.FC<LucideProps>;
  export const Plus: React.FC<LucideProps>;
  export const Flag: React.FC<LucideProps>;
  export const Calendar: React.FC<LucideProps>;
  export const Building: React.FC<LucideProps>;
  export const Edit: React.FC<LucideProps>;
  export const MoreHorizontal: React.FC<LucideProps>;
  export const Trash2: React.FC<LucideProps>;
}
