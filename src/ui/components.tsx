import React from 'react'
import { theme } from '../lib/theme'

// Type definitions
type ButtonVariant = 'primary' | 'success' | 'warning' | 'error' | 'secondary' | 'ghost' | 'outline'
type ButtonSize = 'small' | 'medium' | 'large'
type StatusBadgeStatus = 'success' | 'warning' | 'error' | 'info' | 'neutral'
type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'secondary'
type SpinnerSize = 'small' | 'medium' | 'large'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  className?: string
  [key: string]: any
}

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  [key: string]: any
}

interface StatusBadgeProps {
  status: StatusBadgeStatus
  children: React.ReactNode
  className?: string
}

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  className?: string
  error?: boolean
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  children: React.ReactNode
  className?: string
}

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
  [key: string]: any
}

interface LoadingSpinnerProps {
  size?: SpinnerSize
  className?: string
}

interface SpinnerProps {
  size?: number
  className?: string
}

interface ProgressBarProps {
  progress?: number
  className?: string
  [key: string]: any
}

// Shared button component with consistent theming
export const Button = ({ 
  variant = 'primary', 
  size = 'medium',
  children, 
  disabled = false,
  onClick,
  className = '',
  ...props 
}: ButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:transform hover:-translate-y-0.5"
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white focus:ring-indigo-500 shadow-lg dark:from-indigo-600 dark:to-purple-700 dark:hover:from-indigo-700 dark:hover:to-purple-800",
    success: "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white focus:ring-emerald-500 shadow-lg dark:from-emerald-600 dark:to-green-700",
    warning: "bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white focus:ring-amber-500 shadow-lg dark:from-amber-600 dark:to-yellow-700",
    error: "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white focus:ring-red-500 shadow-lg dark:from-red-600 dark:to-rose-700",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 focus:ring-indigo-500 shadow-md dark:bg-gray-800 dark:bg-opacity-90 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700",
    ghost: "bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 border border-gray-200 shadow-sm dark:bg-gray-800 dark:bg-opacity-90 dark:hover:bg-opacity-100 dark:border-gray-600 dark:text-white",
    outline: "bg-transparent border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500 dark:border-gray-600 dark:border-opacity-30 dark:text-white dark:hover:bg-gray-800 dark:hover:bg-opacity-10"
  }

  const sizes = {
    small: "px-3 py-1.5 text-sm rounded-md",
    medium: "px-4 py-2 text-sm rounded-lg",
    large: "px-6 py-3 text-base rounded-lg"
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// Shared card component with optimized performance
export const Card = ({ children, className = '', hover = true, ...props }: CardProps) => {
  const hoverClass = hover ? "hover:shadow-xl transform transition-transform transition-shadow duration-200 hover:-translate-y-1" : ""
  
  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl p-6 shadow-lg transition-all duration-200 dark:border-gray-700 dark:border-opacity-30 dark:bg-gray-800 dark:bg-opacity-10 ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

// Status badge component
export const StatusBadge = ({ status, children, className = '' }: StatusBadgeProps) => {
  const statusClasses = {
    success: "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700",
    warning: "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900 dark:text-amber-200 dark:border-amber-700", 
    error: "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700",
    info: "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700",
    neutral: "bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
  }
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${statusClasses[status]} ${className}`}>
      {children}
    </span>
  )
}

// Input component with consistent styling
export const Input = ({ className = '', error = false, ...props }: InputProps) => {
  const errorClass = error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200 dark:border-gray-600 dark:focus:border-indigo-400"
  
  return (
    <input
      className={`w-full px-4 py-3 bg-white rounded-lg text-gray-900 dark:bg-gray-800 dark:text-white transition-all duration-300 focus:outline-none focus:ring-2 shadow-sm ${errorClass} ${className}`}
      {...props}
    />
  )
}

// Loading spinner component
export const LoadingSpinner = ({ size = 'medium', className = '' }: LoadingSpinnerProps) => {
  const sizes = {
    small: "w-4 h-4",
    medium: "w-6 h-6", 
    large: "w-8 h-8"
  }
  
  return (
    <div className={`animate-spin rounded-full border-2 border-white border-opacity-30 border-t-white ${sizes[size]} ${className}`}></div>
  )
}

// Shared select component
export const Select = ({ children, className = '', ...props }: SelectProps) => {
  return (
    <select
      className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-300 cursor-pointer shadow-sm hover:border-indigo-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:border-indigo-400 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

// Badge component for status indicators
export const Badge = ({ variant = 'primary', children, className = '', ...props }: BadgeProps) => {
  const variants = {
    primary: 'bg-blue-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-red-500 text-white',
    secondary: 'bg-gray-500 text-white'
  }

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium inline-block ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

// Loading spinner component
export const Spinner = ({ size = 20, className = '' }: SpinnerProps) => {
  return (
    <div
      className={`border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin ${className}`}
      style={{ width: size, height: size }}
    />
  )
}

// Progress bar component
export const ProgressBar = ({ progress = 0, className = '', ...props }: ProgressBarProps) => {
  return (
    <div
      className={`w-full h-2 bg-gray-200 rounded-lg overflow-hidden ${className}`}
      {...props}
    >
      <div
        className="h-full bg-blue-500 transition-all duration-300 rounded-lg"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  )
}
