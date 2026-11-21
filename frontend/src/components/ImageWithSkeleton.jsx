import React, { useState, useEffect, useRef } from 'react'
import { cacheImageUrl } from '../utils/cache'

// Tracks URLs successfully loaded in memory for zero-flicker re-renders
const loadedImageRegistry = new Set()

const ImageWithSkeleton = ({
  src,
  fallbackSrc,
  alt = '',
  className = '',
  wrapperClassName = 'relative w-full h-full overflow-hidden',
  skeletonClassName = '',
  imgRef = null,
  loading = 'lazy',
  fetchPriority,
  decoding = 'async',
  style,
  onLoad,
  onError,
  ...rest
}) => {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [isLoaded, setIsLoaded] = useState(() => Boolean(src && loadedImageRegistry.has(src)))
  const internalImgRef = useRef(null)

  const setCombinedRef = (node) => {
    internalImgRef.current = node
    if (typeof imgRef === 'function') {
      imgRef(node)
    } else if (imgRef && typeof imgRef === 'object') {
      imgRef.current = node
    }
  }

  useEffect(() => {
    setCurrentSrc(src)
    if (src && loadedImageRegistry.has(src)) {
      setIsLoaded(true)
    } else {
      setIsLoaded(false)
    }
  }, [src])

  useEffect(() => {
    const el = internalImgRef.current
    if (el && el.complete && el.naturalWidth > 0 && currentSrc) {
      loadedImageRegistry.add(currentSrc)
      setIsLoaded(true)
    }
  }, [currentSrc])

  const handleLoad = (e) => {
    if (currentSrc) {
      loadedImageRegistry.add(currentSrc)
      cacheImageUrl(currentSrc)
    }
    setIsLoaded(true)
    if (onLoad) onLoad(e)
  }

  const handleError = (e) => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
      setIsLoaded(false)
    } else {
      setIsLoaded(true)
    }
    if (onError) onError(e)
  }

  return (
    <div className={wrapperClassName}>
      {/* Dark-Luxury Skeleton Shimmer Layer */}
      {!isLoaded && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 z-10 bg-[#121216] skeleton-shimmer flex items-center justify-center ${skeletonClassName}`}
        >
          <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-neon-lime/60 animate-spin opacity-60" />
        </div>
      )}

      <img
        ref={setCombinedRef}
        src={currentSrc}
        alt={alt}
        loading={loading}
        decoding={decoding}
        {...(fetchPriority ? { fetchPriority } : {})}
        onLoad={handleLoad}
        onError={handleError}
        style={style}
        className={`${className} transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...rest}
      />
    </div>
  )
}

export default ImageWithSkeleton
