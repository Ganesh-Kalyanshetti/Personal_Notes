import React, { forwardRef, useImperativeHandle } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import Image from '@tiptap/extension-image'
import '../Style/editor.css'
import { useEffect } from 'react'
import { ResizableImage } from './resizeable'

// ✅ Updated MenuBar to accept editor as prop
const MenuBar = ({ editor }) => {
  if (!editor) return null

  return (
        
    <div className="control-group">
      <div className="button-group">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''} style={{ fontWeight: 'bold' }}>B </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''} style={{ fontStyle: 'italic' }}>I</button>
        {/* <button onClick={() => editor.chain().focus().toggleCode().run()} className={editor.isActive('code') ? 'is-active' : ''} style={{fontFamily: 'monospace',background: '#2b2b2b'}}> Code</button>    */}
        {/* <button onClick={() => editor.chain().focus().toggleCode().run()} className={`code-btn ${editor.isActive('code') ? 'is-active' : ''}`}>Code</button> */}
        {/* <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>Clear marks</button>   */}
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'is-active' : ''}>Code block</button>
        <button onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive('paragraph') ? 'is-active' : ''}>Paragraph</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}>H1</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>H2</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}>H3</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}>H4</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()} className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}>H5</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()} className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}>H6</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}>Bullet list</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}>Ordered list</button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active' : ''}>Blockquote</button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>Horizontal rule</button>
        <button onClick={() => editor.chain().focus().setColor('#669a53ff').run()} className={editor.isActive('textStyle', { color: '#100885ff' }) ? 'is-active' : ''}>Blue</button>
        <button onClick={() => editor.chain().focus().clearNodes().run()}>Clear Style</button>
      </div>
    </div>
  )
}

useEffect(() => {
  let lastScrollY = window.scrollY

  const handleScroll = () => {
    const currentScrollY = window.scrollY
    const toolbar = document.querySelector('.control-group')

    if (!toolbar) return

    const selection = editor?.state?.selection
    const hasSelection = selection && !selection.empty

    if (currentScrollY < lastScrollY && hasSelection) {
      toolbar.classList.add('show-toolbar')
    } else {
      toolbar.classList.remove('show-toolbar')
    }

    lastScrollY = currentScrollY
  }

  window.addEventListener('scroll', handleScroll)

  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
}, [editor])


// ✅ Final Editor component (with forwardRef)
const Editor = forwardRef(({ content = '', onContentChange }, ref) => {
  const editor = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      StarterKit.configure({
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      // Image.configure({ inline: false }) // ✅ Add image support
      ResizableImage
    ],
    content,
    onUpdate({ editor }) {
      if (onContentChange) {
        onContentChange(editor.getHTML())
      }
    },
  })

  // ✅ Expose insertImage to parent
  useImperativeHandle(ref, () => ({
    editor,
    insertImage: (url) => {
      if (editor) {
        editor.chain().focus().setImage({ src: url, style: 'width:300px' }).run()
      }
    }
  }))

  if (!editor) return null

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  return (
    <>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      {/* <img src="..." width="300" /> */}

    </>
  )
})

export default Editor
