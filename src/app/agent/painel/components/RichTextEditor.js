"use client"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import Code from '@tiptap/extension-code'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaCode, FaLink, FaListUl, FaListOl, FaHeading, FaAlignLeft, FaAlignCenter, FaAlignRight, FaPalette } from 'react-icons/fa'
import Dropdown from 'react-bootstrap/Dropdown'

const MenuBar = ({ editor }) => {
  if (!editor) return null

  return (
    <div className="border-bottom p-2 d-flex gap-2 flex-wrap">
      {/* Headings Dropdown */}
      <Dropdown>
        <Dropdown.Toggle variant="outline-secondary" size="sm">
          <FaHeading />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {[1,2,3,4,5,6].map(level => (
            <Dropdown.Item
              key={level}
              active={editor.isActive('heading', { level })}
              onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
            >
              Heading {level}
            </Dropdown.Item>
          ))}
          <Dropdown.Item
            active={editor.isActive('paragraph')}
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            Normal text
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Text Align Dropdown */}
      <Dropdown>
        <Dropdown.Toggle variant="outline-secondary" size="sm">
          <FaAlignLeft />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => editor.chain().focus().setTextAlign('left').run()}><FaAlignLeft /> Left</Dropdown.Item>
          <Dropdown.Item onClick={() => editor.chain().focus().setTextAlign('center').run()}><FaAlignCenter /> Center</Dropdown.Item>
          <Dropdown.Item onClick={() => editor.chain().focus().setTextAlign('right').run()}><FaAlignRight /> Right</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Formatting */}
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={`btn btn-sm ${editor.isActive('bold') ? 'btn-primary' : 'btn-outline-secondary'}`}><FaBold /></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`btn btn-sm ${editor.isActive('italic') ? 'btn-primary' : 'btn-outline-secondary'}`}><FaItalic /></button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`btn btn-sm ${editor.isActive('underline') ? 'btn-primary' : 'btn-outline-secondary'}`}><FaUnderline /></button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`btn btn-sm ${editor.isActive('strike') ? 'btn-primary' : 'btn-outline-secondary'}`}><FaStrikethrough /></button>
      <button onClick={() => editor.chain().focus().toggleCode().run()} className={`btn btn-sm ${editor.isActive('code') ? 'btn-primary' : 'btn-outline-secondary'}`}><FaCode /></button>
      {/* Color */}
      <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={`btn btn-sm ${editor.isActive('highlight') ? 'btn-primary' : 'btn-outline-secondary'}`}><FaPalette /></button>
      {/* Link */}
      <button onClick={() => {
        const url = window.prompt('Enter URL')
        if (url) editor.chain().focus().setLink({ href: url }).run()
      }} className={`btn btn-sm ${editor.isActive('link') ? 'btn-primary' : 'btn-outline-secondary'}`}><FaLink /></button>
      {/* Lists */}
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`btn btn-sm ${editor.isActive('bulletList') ? 'btn-primary' : 'btn-outline-secondary'}`}><FaListUl /></button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`btn btn-sm ${editor.isActive('orderedList') ? 'btn-primary' : 'btn-outline-secondary'}`}><FaListOl /></button>
    </div>
  )
}

export default function RichTextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Strike,
      Code,
      Link,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Color,
      Highlight,
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  return (
    <div className="border rounded-3">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="p-3" />
    </div>
  )
}