'use server'

import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

const ALLOWED: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
}

export type UploadResult = { url?: string; error?: string }

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get('file') as File | null
    if (!file || typeof file === 'string') return { error: 'No file provided.' }
    const ext = ALLOWED[file.type]
    if (!ext) return { error: 'Unsupported format. Use JPG, PNG, WebP or SVG.' }
    if (file.size > 15 * 1024 * 1024) return { error: 'File too large (max 15MB).' }

    const bytes = Buffer.from(await file.arrayBuffer())
    const dir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(dir, { recursive: true })
    const name = `${randomUUID()}.${ext}`
    await writeFile(path.join(dir, name), bytes)
    return { url: `/uploads/${name}` }
  } catch (e) {
    console.error('uploadImage error:', e)
    return { error: 'Upload failed. Please try again.' }
  }
}
