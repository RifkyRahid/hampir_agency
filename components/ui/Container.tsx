import React from 'react'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'narrow' | 'wide'
}

export function Container({
  size = 'default',
  className = '',
  children,
  ...props
}: ContainerProps) {
  const maxW = {
    narrow: 'max-w-4xl',
    default: 'max-w-6xl',
    wide: 'max-w-7xl',
  }[size]

  return (
    <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${maxW} ${className}`} {...props}>
      {children}
    </div>
  )
}

