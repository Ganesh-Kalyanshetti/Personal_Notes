import { Node, mergeAttributes } from '@tiptap/core'

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
      width: { default: '300' },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
        getAttrs: dom => ({
          src: dom.getAttribute('src'),
          alt: dom.getAttribute('alt'),
          width: dom.getAttribute('width') || '300',
        }),
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)]
  },

  addCommands() {
    return {
      setImage: attributes => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: attributes,
        })
      },
    }
  },
})
