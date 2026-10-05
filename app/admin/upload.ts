'use server'

import { put } from '@vercel/blob'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import sharp from 'sharp'
import { requireAdmin } from '@/lib/auth'
import { imageSpecs, type ImageKind } from '@/lib/image-specs'

export type UploadResult = { url?: string; error?: string }

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  try {
    // 1. Enforce admin authentication
    await requireAdmin()

    const file = formData.get('file') as File | null
    const kind = (formData.get('kind') as ImageKind) || 'portfolio-cover'

    if (!file || typeof file === 'string') {
      return { error: 'Tidak ada file yang dipilih.' }
    }

    const spec = imageSpecs[kind] || imageSpecs['portfolio-cover']

    // 2. Validate MIME format
    if (!spec.allowedFormats.includes(file.type)) {
      return {
        error: `Format tidak sesuai. Gunakan: ${spec.allowedFormats
          .map((f) => f.split('/')[1].toUpperCase())
          .join(', ')}.`,
      }
    }

    // 3. Validate File Size
    const maxBytes = spec.maxSizeMB * 1024 * 1024
    if (file.size > maxBytes) {
      return { error: `Ukuran file melebihi batas maksimal ${spec.maxSizeMB} MB.` }
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer())

    let outputBuffer: Buffer
    let finalExt = 'webp'
    let contentType = 'image/webp'

    if (file.type === 'image/svg+xml') {
      outputBuffer = inputBuffer
      finalExt = 'svg'
      contentType = 'image/svg+xml'
    } else {
      // Auto-convert raster image to WebP with 82% quality compression
      outputBuffer = await sharp(inputBuffer)
        .webp({ quality: 82, effort: 4 })
        .toBuffer()
    }

    const fileName = `${kind}-${randomUUID()}.${finalExt}`

    // 4. Upload to Vercel Blob if token available
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(fileName, outputBuffer, {
        access: 'public',
        contentType,
      })
      return { url: blob.url }
    }

    // 5. Fallback: Local upload for offline / local testing
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    await writeFile(path.join(uploadDir, fileName), outputBuffer)

    return { url: `/uploads/${fileName}` }
  } catch (e: any) {
    console.error('uploadImage error:', e)
    return { error: e.message || 'Gagal mengunggah dan memproses file.' }
  }
}

