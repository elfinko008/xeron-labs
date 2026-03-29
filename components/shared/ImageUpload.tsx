'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface Props {
  onUpload: (url: string) => void
  onRemove?: (url: string) => void
  maxFiles?: number
  purpose?: string
  uploadedUrls?: string[]
}

const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

async function uploadImageToSupabase(file: File, userId: string): Promise<string> {
  const supabase = createClient()
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${userId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from('project-references')
    .upload(path, file, { cacheControl: '3600', upsert: false })

  if (error) throw new Error('Upload failed: ' + error.message)

  const { data: { publicUrl } } = supabase.storage
    .from('project-references')
    .getPublicUrl(path)

  // Track in user_uploads
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await supabase.from('user_uploads').insert({
      user_id: user.id,
      storage_path: path,
      public_url: publicUrl,
      file_type: 'reference',
      file_size_bytes: file.size,
    })
  }

  return publicUrl
}

export function ImageUpload({ onUpload, onRemove, maxFiles = 4, purpose = 'reference', uploadedUrls = [] }: Props) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState<string[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArr = Array.from(files)
    const remaining = maxFiles - uploadedUrls.length

    if (remaining <= 0) {
      setErrors([`Maximum ${maxFiles} images allowed`])
      return
    }

    const toProcess = fileArr.slice(0, remaining)
    const newErrors: string[] = []

    for (const file of toProcess) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        newErrors.push(`${file.name}: unsupported type (use JPG, PNG, WebP, GIF)`)
        continue
      }
      if (file.size > MAX_SIZE_BYTES) {
        newErrors.push(`${file.name}: too large (max 10MB)`)
        continue
      }

      const previewId = URL.createObjectURL(file)
      setUploading(prev => [...prev, previewId])

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')
        const url = await uploadImageToSupabase(file, user.id)
        onUpload(url)
      } catch (e: any) {
        newErrors.push(`${file.name}: ${e.message}`)
      } finally {
        setUploading(prev => prev.filter(id => id !== previewId))
        URL.revokeObjectURL(previewId)
      }
    }

    if (newErrors.length > 0) setErrors(newErrors)
  }, [uploadedUrls.length, maxFiles, onUpload, supabase])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    processFiles(e.dataTransfer.files)
  }, [processFiles])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files)
    e.target.value = ''
  }, [processFiles])

  const hasImages = uploadedUrls.length > 0 || uploading.length > 0
  const canAddMore = uploadedUrls.length < maxFiles

  return (
    <div>
      {/* Drop zone */}
      {canAddMore && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `1.5px dashed ${dragging ? 'rgba(0,128,255,0.60)' : 'rgba(100,150,220,0.25)'}`,
            borderRadius: 14,
            padding: '20px 16px',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragging ? 'rgba(0,128,255,0.06)' : 'rgba(14,45,74,0.15)',
            transition: 'all 0.2s ease',
            marginBottom: hasImages ? 12 : 0,
          }}
        >
          <Upload size={20} color={dragging ? '#0080FF' : '#506080'} style={{ margin: '0 auto 8px' }} />
          <div style={{ fontSize: 13, color: dragging ? '#66B2FF' : 'var(--t-3)', fontFamily: "'DM Sans',sans-serif" }}>
            {dragging ? 'Drop to upload' : (
              <>
                <span style={{ color: '#66B2FF', fontWeight: 500 }}>Click to upload</span> or drag & drop
              </>
            )}
          </div>
          <div style={{ fontSize: 11, color: 'var(--t-3)', marginTop: 4 }}>
            JPG, PNG, WebP, GIF · max 10MB · {uploadedUrls.length}/{maxFiles} uploaded
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={ALLOWED_TYPES.join(',')}
            multiple={maxFiles > 1}
            onChange={handleChange}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {/* Thumbnails */}
      {hasImages && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
          {uploadedUrls.map((url, i) => (
            <div key={url} style={{ position: 'relative', width: 72, height: 72 }}>
              <img
                src={url}
                alt={`Reference ${i + 1}`}
                style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 10, border: '0.5px solid rgba(100,150,220,0.20)' }}
              />
              {onRemove && (
                <button
                  onClick={() => onRemove(url)}
                  style={{
                    position: 'absolute', top: -6, right: -6, width: 20, height: 20,
                    borderRadius: '50%', background: 'rgba(7,24,40,0.95)',
                    border: '0.5px solid rgba(239,68,68,0.40)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#F87171',
                  }}
                >
                  <X size={10} />
                </button>
              )}
            </div>
          ))}
          {uploading.map((id) => (
            <div key={id} style={{ width: 72, height: 72, borderRadius: 10, background: 'rgba(14,45,74,0.40)', border: '0.5px solid rgba(100,150,220,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loader2 size={20} color="#66B2FF" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ))}
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {errors.map((err, i) => (
            <div key={i} style={{ fontSize: 12, color: '#F87171', display: 'flex', alignItems: 'center', gap: 6 }}>
              <X size={11} /> {err}
            </div>
          ))}
          <button onClick={() => setErrors([])} style={{ fontSize: 11, color: 'var(--t-3)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, marginTop: 2 }}>
            Dismiss
          </button>
        </div>
      )}

      {purpose === 'reference' && uploadedUrls.length > 0 && (
        <div style={{ fontSize: 12, color: 'var(--t-3)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
          <ImageIcon size={12} />
          {uploadedUrls.length} reference image{uploadedUrls.length > 1 ? 's' : ''} will be sent to AI
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default ImageUpload
