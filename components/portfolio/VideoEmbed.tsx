import { Play } from 'lucide-react'

function getYouTubeId(url: string): string | null {
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/
  const match = url.match(regExp)
  return match ? match[1] : null
}

function getVimeoId(url: string): string | null {
  const regExp = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+))/
  const match = url.match(regExp)
  return match ? match[3] : null
}

export function VideoEmbed({
  url,
  title,
  poster,
}: {
  url: string
  title: string
  poster?: string
}) {
  const youtubeId = getYouTubeId(url)
  const vimeoId = getVimeoId(url)
  const isDirectVideo = /\.(mp4|webm|ogg)($|\?)/i.test(url)

  if (youtubeId) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black shadow-lg">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
    )
  }

  if (vimeoId) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black shadow-lg">
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?dnt=1&title=0&byline=0&portrait=0`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
    )
  }

  if (isDirectVideo) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black shadow-lg">
        <video
          controls
          playsInline
          poster={poster}
          preload="metadata"
          className="h-full w-full object-contain"
        >
          <source src={url} />
          Browser Anda tidak mendukung pemutar video HTML5.
        </video>
      </div>
    )
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-surface flex flex-col items-center justify-center p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
        <Play className="h-6 w-6 fill-current ml-0.5" />
      </div>
      <p className="text-sm font-semibold text-foreground mb-2">Video Showcase</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Tonton Video Eksternal
      </a>
    </div>
  )
}

