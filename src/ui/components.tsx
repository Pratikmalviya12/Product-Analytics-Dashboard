import React from 'react'
import { theme } from '../lib/theme'

// Shared button component with consistent theming
export const Button = ({ 
  variant = 'primary', 
  size = 'medium',
  children, 
  disabled = false,
  onClick,
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:transform hover:-translate-y-0.5"
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white focus:ring-indigo-500 shadow-lg dark:from-indigo-600 dark:to-purple-700 dark:hover:from-indigo-700 dark:hover:to-purple-800",
    success: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500 shadow-lg dark:bg-green-600 dark:hover:bg-green-700",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500 shadow-lg dark:bg-yellow-600 dark:hover:bg-yellow-700",
    error: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 shadow-lg dark:bg-red-600 dark:hover:bg-red-700",
    secondary: "bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 border border-white border-opacity-30 focus:ring-indigo-500 shadow-lg backdrop-blur-md dark:bg-gray-800 dark:bg-opacity-90 dark:text-gray-200 dark:border-gray-600 dark:border-opacity-30",
    ghost: "bg-white bg-opacity-10 hover:bg-opacity-20 text-white border border-white border-opacity-20 backdrop-blur-md dark:bg-gray-800 dark:bg-opacity-10 dark:hover:bg-opacity-20 dark:border-gray-600 dark:border-opacity-20",
    outline: "bg-transparent border-2 border-white border-opacity-30 text-white hover:bg-white hover:bg-opacity-10 focus:ring-indigo-500 dark:border-gray-600 dark:border-opacity-30 dark:hover:bg-gray-800 dark:hover:bg-opacity-10"
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

// Shared card component with glass effect
export const Card = ({ children, className = '', hover = true, ...props }) => {
  const hoverClass = hover ? "hover:transform hover:-translate-y-1 hover:shadow-xl" : ""
  
  return (
    <div
      className={`glass rounded-xl p-6 shadow-lg border border-white border-opacity-20 backdrop-blur-lg transition-all duration-300 dark:border-gray-700 dark:border-opacity-30 dark:bg-gray-800 dark:bg-opacity-10 ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

// Status badge component
export const StatusBadge = ({ status, children, className = '' }) => {
  const statusClasses = {
    success: "bg-green-500 bg-opacity-90 text-white",
    warning: "bg-yellow-500 bg-opacity-90 text-white", 
    error: "bg-red-500 bg-opacity-90 text-white",
    info: "bg-blue-500 bg-opacity-90 text-white",
    neutral: "bg-gray-500 bg-opacity-90 text-white"
  }
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${statusClasses[status]} ${className}`}>
      {children}
    </span>
  )
}

// Input component with consistent styling
export const Input = ({ className = '', error = false, ...props }) => {
  const errorClass = error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-white border-opacity-30 focus:border-indigo-500 focus:ring-indigo-200"
  
  return (
    <input
      className={`w-full px-4 py-3 bg-white bg-opacity-90 backdrop-blur-md rounded-lg text-gray-900 transition-all duration-300 focus:outline-none focus:ring-2 shadow-sm ${errorClass} ${className}`}
      {...props}
    />
  )
}

// Loading spinner component
export const LoadingSpinner = ({ size = 'medium', className = '' }) => {
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
export const Select = ({ children, className = '', ...props }) => {
  return (
    <select
      className={`w-full px-4 py-3 bg-white bg-opacity-90 backdrop-blur-md rounded-lg text-gray-900 border border-white border-opacity-30 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-300 cursor-pointer shadow-sm hover:bg-opacity-100 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

// Badge component for status indicators
export const Badge = ({ variant = 'primary', children, className = '', ...props }) => {
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
export const Spinner = ({ size = 20, className = '' }) => {
  return (
    <div
      className={`border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin ${className}`}
      style={{ width: size, height: size }}
    />
  )
}

// Progress bar component
export const ProgressBar = ({ progress = 0, className = '', ...props }) => {
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
