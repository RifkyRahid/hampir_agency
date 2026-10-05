import React from 'react'

export interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left'

  return (
    <div className={`max-w-2xl ${alignment} mb-12 sm:mb-16 ${className}`}>
      {eyebrow && (
        <span className="inline-block text-xs font-semibold uppercase tracking-wider text-accent mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base text-muted-foreground sm:text-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}

