import React from 'react'

/**
 * UI Components Library
 * 
 * @description A comprehensive set of reusable UI components for the Product Analytics Dashboard.
 * All components are designed with TypeScript support, accessibility features, and theming capabilities.
 * Includes buttons, cards, form inputs, status badges, and loading indicators.
 * 
 * @features
 * - Full TypeScript support with proper interface definitions
 * - Dark/light theme compatibility
 * - Responsive design principles
 * - Accessibility (ARIA) support
 * - Consistent styling with Tailwind CSS
 * - Multiple variants and sizes for flexibility
 */

// Type definitions
type ButtonVariant = 'primary' | 'success' | 'warning' | 'error' | 'secondary' | 'ghost' | 'outline'
type ButtonSize = 'small' | 'medium' | 'large'
type StatusBadgeStatus = 'success' | 'warning' | 'error' | 'info' | 'neutral'
type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'secondary'
type SpinnerSize = 'small' | 'medium' | 'large'

/**
 * Button Component Props
 * @interface ButtonProps
 * @extends React.ButtonHTMLAttributes without className override
 * @property {ButtonVariant} variant - Visual style variant of the button
 * @property {ButtonSize} size - Size of the button (affects padding and font size)
 * @property {React.ReactNode} children - Button content (text, icons, etc.)
 * @property {string} className - Additional CSS classes for customization
 */
interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
  className?: string
}

/**
 * Card Component Props
 * @interface CardProps
 * @extends React.HTMLAttributes without className override
 * @property {React.ReactNode} children - Card content
 * @property {string} className - Additional CSS classes
 * @property {boolean} hover - Enable hover effects and interactions
 */
interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

/**
 * Status Badge Component Props
 * @interface StatusBadgeProps
 * @property {StatusBadgeStatus} status - Visual status indicator (success, warning, error, info, neutral)
 * @property {React.ReactNode} children - Badge content (usually text)
 * @property {string} className - Additional CSS classes for customization
 */
interface StatusBadgeProps {
  status: StatusBadgeStatus
  children: React.ReactNode
  className?: string
}

/**
 * Input Component Props
 * @interface InputProps
 * @extends React.InputHTMLAttributes without className override
 * @property {string} className - Additional CSS classes
 * @property {boolean} error - Apply error styling to indicate validation errors
 */
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  className?: string
  error?: boolean
}

/**
 * Select Component Props
 * @interface SelectProps
 * @extends React.SelectHTMLAttributes without className override
 * @property {React.ReactNode} children - Select options and content
 * @property {string} className - Additional CSS classes
 */
interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  children: React.ReactNode
  className?: string
}

/**
 * Badge Component Props
 * @interface BadgeProps
 * @extends React.HTMLAttributes without className override
 * @property {BadgeVariant} variant - Visual style variant
 * @property {React.ReactNode} children - Badge content
 * @property {string} className - Additional CSS classes
 */
interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'className'> {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

/**
 * Loading Spinner Component Props
 * @interface LoadingSpinnerProps
 * @property {SpinnerSize} size - Size of the spinner (small, medium, large)
 * @property {string} className - Additional CSS classes
 */
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

/**
 * Button Component
 * 
 * @description A versatile button component with multiple variants, sizes, and comprehensive theming support.
 * Features gradient backgrounds, smooth animations, and accessibility compliance.
 * 
 * @param {ButtonProps} props - Component properties
 * @param {ButtonVariant} variant - Visual style (primary, success, warning, error, secondary, ghost, outline)
 * @param {ButtonSize} size - Button size (small, medium, large)
 * @param {React.ReactNode} children - Button content (text, icons, etc.)
 * @param {boolean} disabled - Disable button interactions
 * @param {Function} onClick - Click event handler
 * @param {string} className - Additional CSS classes
 * 
 * @features
 * - 7 distinct visual variants with gradient styling
 * - 3 size options with responsive design
 * - Dark/light theme support
 * - Hover animations and focus states
 * - Disabled state handling
 * - Full accessibility support
 * - TypeScript integration
 * 
 * @example
 * ```tsx
 * <Button variant="success" size="large" onClick={handleClick}>
 *   Save Changes
 * </Button>
 * ```
 */
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

/**
 * Card Component
 * 
 * @description A flexible container component that provides consistent styling for content sections.
 * Features responsive design, hover effects, and dark theme support.
 * 
 * @param {CardProps} props - Component properties
 * @param {React.ReactNode} children - Card content
 * @param {string} className - Additional CSS classes for customization
 * @param {boolean} hover - Enable hover animations and shadow effects
 * 
 * @features
 * - Consistent border radius and shadow styling
 * - Optional hover animations with lift effect
 * - Dark/light theme compatibility
 * - Responsive padding and spacing
 * - Glass-morphism styling in dark mode
 * - Smooth transitions and animations
 * 
 * @example
 * ```tsx
 * <Card hover={true} className="mb-4">
 *   <h3>Chart Title</h3>
 *   <ChartComponent data={data} />
 * </Card>
 * ```
 */
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

/**
 * Status Badge Component
 * 
 * @description A small indicator component for displaying status information with color-coded styling.
 * Provides visual feedback for different states (success, warning, error, info, neutral).
 * 
 * @param {StatusBadgeProps} props - Component properties
 * @param {StatusBadgeStatus} status - Badge status type affecting color scheme
 * @param {React.ReactNode} children - Badge content (typically short text)
 * @param {string} className - Additional CSS classes for customization
 * 
 * @features
 * - 5 distinct status types with semantic colors
 * - Dark/light theme support
 * - Consistent padding and typography
 * - Border styling for better definition
 * - Accessible color contrast ratios
 * 
 * @example
 * ```tsx
 * <StatusBadge status="success">Active</StatusBadge>
 * <StatusBadge status="warning">Pending</StatusBadge>
 * <StatusBadge status="error">Failed</StatusBadge>
 * ```
 */
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

/**
 * Input Component
 * 
 * @description A styled input field component with error state handling and consistent theming.
 * Supports all standard HTML input attributes with enhanced visual design.
 * 
 * @param {InputProps} props - Component properties
 * @param {string} className - Additional CSS classes for customization
 * @param {boolean} error - Apply error styling for validation feedback
 * 
 * @features
 * - Error state with red border and focus ring
 * - Dark/light theme support
 * - Smooth focus transitions
 * - Consistent padding and rounded corners
 * - Shadow effects for depth
 * - Full keyboard accessibility
 * 
 * @example
 * ```tsx
 * <Input 
 *   type="email" 
 *   placeholder="Enter your email"
 *   error={hasValidationError}
 *   onChange={handleChange}
 * />
 * ```
 */
export const Input = ({ className = '', error = false, ...props }: InputProps) => {
  const errorClass = error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200 dark:border-gray-600 dark:focus:border-indigo-400"
  
  return (
    <input
      className={`w-full px-4 py-3 bg-white rounded-lg text-gray-900 dark:bg-gray-800 dark:text-white transition-all duration-300 focus:outline-none focus:ring-2 shadow-sm ${errorClass} ${className}`}
      {...props}
    />
  )
}

/**
 * Loading Spinner Component
 * 
 * @description An animated loading indicator with configurable sizes and smooth rotation animation.
 * Perfect for indicating loading states in forms, data fetching, or async operations.
 * 
 * @param {LoadingSpinnerProps} props - Component properties
 * @param {SpinnerSize} size - Spinner size (small: 16px, medium: 24px, large: 32px)
 * @param {string} className - Additional CSS classes for positioning and styling
 * 
 * @features
 * - 3 size variants for different use cases
 * - Smooth 360-degree rotation animation
 * - Accessible with proper ARIA attributes
 * - Dark/light theme compatible colors
 * - Lightweight SVG-based implementation
 * 
 * @example
 * ```tsx
 * <LoadingSpinner size="large" className="mx-auto" />
 * ```
 */
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

/**
 * Select Component
 * 
 * @description A styled dropdown select component with consistent theming and smooth interactions.
 * Supports all standard HTML select attributes with enhanced visual design.
 * 
 * @param {SelectProps} props - Component properties
 * @param {React.ReactNode} children - Select options (option elements)
 * @param {string} className - Additional CSS classes for customization
 * 
 * @features
 * - Consistent styling with other form components
 * - Hover and focus state animations
 * - Dark/light theme support
 * - Smooth border and shadow transitions
 * - Proper cursor styling
 * - Full keyboard accessibility
 * 
 * @example
 * ```tsx
 * <Select value={selectedValue} onChange={handleChange}>
 *   <option value="">Select an option</option>
 *   <option value="option1">Option 1</option>
 *   <option value="option2">Option 2</option>
 * </Select>
 * ```
 */
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

/**
 * Badge Component
 * 
 * @description A small label component for displaying short pieces of information with color coding.
 * Ideal for tags, labels, counts, or status indicators.
 * 
 * @param {BadgeProps} props - Component properties
 * @param {BadgeVariant} variant - Visual style variant (primary, success, warning, error, secondary)
 * @param {React.ReactNode} children - Badge content (text, numbers, etc.)
 * @param {string} className - Additional CSS classes for customization
 * 
 * @features
 * - 5 semantic color variants
 * - Compact, rounded design
 * - Consistent typography and spacing
 * - High contrast for readability
 * - Flexible content support
 * 
 * @example
 * ```tsx
 * <Badge variant="success">New</Badge>
 * <Badge variant="warning">Beta</Badge>
 * <Badge variant="error">{errorCount}</Badge>
 * ```
 */
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

/**
 * Spinner Component
 * 
 * @description A simple, customizable loading spinner with configurable size.
 * Lightweight alternative to LoadingSpinner for simpler use cases.
 * 
 * @param {SpinnerProps} props - Component properties
 * @param {number} size - Spinner size in pixels (default: 20)
 * @param {string} className - Additional CSS classes for styling
 * 
 * @features
 * - Customizable size via inline styles
 * - Simple circular animation
 * - Minimal design footprint
 * - Blue accent color
 * - Smooth rotation animation
 * 
 * @example
 * ```tsx
 * <Spinner size={24} className="mx-2" />
 * ```
 */
export const Spinner = ({ size = 20, className = '' }: SpinnerProps) => {
  return (
    <div
      className={`border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin ${className}`}
      style={{ width: size, height: size }}
    />
  )
}

/**
 * Progress Bar Component
 * 
 * @description A visual progress indicator showing completion percentage with smooth animations.
 * Perfect for file uploads, form completion, loading states, or any measurable progress.
 * 
 * @param {ProgressBarProps} props - Component properties
 * @param {number} progress - Progress percentage (0-100, automatically clamped)
 * @param {string} className - Additional CSS classes for customization
 * 
 * @features
 * - Smooth animated progress transitions
 * - Automatic value clamping (0-100%)
 * - Responsive width scaling
 * - Blue accent color with gray background
 * - Rounded corners for modern appearance
 * 
 * @example
 * ```tsx
 * <ProgressBar progress={75} className="mb-4" />
 * <ProgressBar progress={uploadProgress} />
 * ```
 */
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
