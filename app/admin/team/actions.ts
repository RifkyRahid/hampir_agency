'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'

export type ActionResult = { success?: boolean; error?: string }

function revalidateAll() {
  revalidatePath('/admin/team')
  revalidatePath('/admin')
  revalidatePath('/id/about')
  revalidatePath('/en/about')
}

function parseTeamMember(formData: FormData) {
  const name = String(formData.get('name') || '').trim()
  const roleId = String(formData.get('roleId') || '').trim()
  const roleEn = String(formData.get('roleEn') || '').trim() || null
  const bioId = String(formData.get('bioId') || '').trim() || null
  const bioEn = String(formData.get('bioEn') || '').trim() || null
  const photoUrl = String(formData.get('photoUrl') || '').trim() || null
  const skillsRaw = String(formData.get('skills') || '')
  const skills = skillsRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const order = parseInt(String(formData.get('order') || '0'), 10) || 0
  const isActive = formData.get('isActive') !== 'false'

  return { name, roleId, roleEn, bioId, bioEn, photoUrl, skills, order, isActive }
}

export async function createTeamMember(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()
    const data = parseTeamMember(formData)

    if (!data.name) return { error: 'Nama anggota tim wajib diisi.' }
    if (!data.roleId) return { error: 'Peran / Jabatan (ID) wajib diisi.' }

    await prisma.teamMember.create({ data })
    revalidateAll()
    return { success: true }
  } catch (e: any) {
    console.error('createTeamMember error:', e)
    return { error: e.message || 'Gagal menambahkan anggota tim.' }
  }
}

export async function updateTeamMember(id: string, formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()
    const data = parseTeamMember(formData)

    if (!data.name) return { error: 'Nama anggota tim wajib diisi.' }
    if (!data.roleId) return { error: 'Peran / Jabatan (ID) wajib diisi.' }

    await prisma.teamMember.update({ where: { id }, data })
    revalidateAll()
    return { success: true }
  } catch (e: any) {
    console.error('updateTeamMember error:', e)
    return { error: e.message || 'Gagal memperbarui anggota tim.' }
  }
}

export async function deleteTeamMember(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    await prisma.teamMember.delete({ where: { id } })
    revalidateAll()
    return { success: true }
  } catch (e: any) {
    console.error('deleteTeamMember error:', e)
    return { error: e.message || 'Gagal menghapus anggota tim.' }
  }
}

