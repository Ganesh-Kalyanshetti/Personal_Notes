import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Editor from './editor'
import '../Style/folderview.css'

const SAVE = `${import.meta.env.VITE_API_URL}/createfolder`;
const PAGE = `${import.meta.env.VITE_API_URL}/createfolder`;
const UPLOAD_IMAGE = `${import.meta.env.VITE_API_URL}/upload-content`;

function Folderview() {
  const { id } = useParams()
  const [text, setText] = useState('')
  const [foldername, setFoldername] = useState('');
  const [isLoaded, setIsLoaded] = useState(false)
  const token = localStorage.getItem('token')
  const editorRef = useRef()

  const insertImage = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.click()

    input.onchange = async () => {
      const file = input.files[0]
      if (!file) return

      const formData = new FormData()
      formData.append('photo', file)

      try {
        const res = await axios.post(`${UPLOAD_IMAGE}/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        })

        const imageUrl = res.data.url || res.data.photo

        if (editorRef.current) {
          editorRef.current.insertImage(imageUrl)
        }
      } catch (err) {
        console.error('Image upload failed:', err)
      }
    }
  }

  useEffect(() => {
    axios.get(`${PAGE}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const { content, foldername } = res.data;
        setText(typeof content === 'string' ? content : '');
        setFoldername(foldername || 'Untitled');
        setIsLoaded(true)
      })
      .catch((err) => {
        console.error('Fetch failed:', err)
      })
  }, [id, token])



  const handleSave = async () => {
    // console.log("Save Clicked");
    if (!editorRef.current?.editor) {
      alert("Editor is not ready yet!")
      return
    }
    try {
      const htmls = editorRef.current?.editor?.getHTML();
      // console.log('t', htmls);

      await axios.put(`${SAVE}/${id}`, { content: htmls }, {

        headers: { Authorization: `Bearer ${token}` },
      })

      alert('Saved!')

    } catch (err) {
      console.error('Save failed:', err)
    }
  }

  return (

    <div className="editor-wrapper">

      <h2>Folder {foldername}</h2>
      <br />
      <Editor ref={editorRef} content={text} onContentChange={setText} />
      
      <button onClick={insertImage} className="image-inside-editor-btn">📷 Add Image</button>
      <br />
      <button onClick={handleSave}> 📁Save</button>
    </div>

  );

}

export default Folderview
