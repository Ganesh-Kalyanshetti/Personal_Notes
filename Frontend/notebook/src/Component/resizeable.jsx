import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Node, mergeAttributes } from '@tiptap/core'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'

function ImageLightbox({ src, alt, onClose }) {
  const [naturalSize, setNaturalSize] = useState(null)

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const fitScale = naturalSize
    ? Math.min(
      (window.innerWidth * 0.9) / naturalSize.width,
      (window.innerHeight * 0.78) / naturalSize.height,
    )
    : 1

  const imageStyle = naturalSize
    ? {
        width: `${naturalSize.width * fitScale}px`,
        height: `${naturalSize.height * fitScale}px`,
      }
    : { maxWidth: '90vw', maxHeight: '78vh' }

  return createPortal(
    <div
      className="image-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="image-lightbox__content">
        <div className="image-lightbox__toolbar">
          <button type="button" onClick={onClose} aria-label="Close image preview">
            Close
          </button>
        </div>
        <div className="image-lightbox__viewport">
          <img
            src={src}
            alt={alt || 'Expanded note image'}
            style={imageStyle}
            onLoad={(event) => {
              const { naturalWidth, naturalHeight } = event.currentTarget
              setNaturalSize({ width: naturalWidth, height: naturalHeight })
            }}
          />
        </div>
      </div>
    </div>,
    document.body,
  )
}

function ResizableImageView({ node }) {
  const [isOpen, setIsOpen] = useState(false)
  const { src, alt, width } = node.attrs

  return (
    <NodeViewWrapper className="resizable-image">
      <img
        src={src}
        alt={alt || ''}
        style={{ width }}
        role="button"
        tabIndex={0}
        aria-label={`Open image preview${alt ? `: ${alt}` : ''}`}
        contentEditable={false}
        onClick={() => setIsOpen(true)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setIsOpen(true)
          }
        }}
      />
      {isOpen && (
        <ImageLightbox src={src} alt={alt} onClose={() => setIsOpen(false)} />
      )}
    </NodeViewWrapper>
  )
}

export const ResizableImage = Node.create({
  name: 'resizableImage',

  inline: false,
  group: 'block',
  draggable: true,
  selectable: true,
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      width: {
        default: '300px',
        parseHTML: (element) =>
          element.style.width || (element.getAttribute('width') ? `${element.getAttribute('width')}px` : '300px'),
        renderHTML: () => ({}),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'img[src]' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'img',
      mergeAttributes(HTMLAttributes, {
        style: `width: ${node.attrs.width}; max-width: 100%;`,
      }),
    ]
  },

  addCommands() {
    return {
      setImage:
        (attributes) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: attributes,
          }),
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView)
  },
})