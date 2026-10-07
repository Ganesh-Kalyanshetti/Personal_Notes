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
  const [isEditing, setIsEditing] = useState(false)
  const [showEditConfirmation, setShowEditConfirmation] = useState(false)
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
      setIsEditing(false)

    } catch (err) {
      console.error('Save failed:', err)
    }
  }

  return (

    <div className="editor-wrapper">
      {isLoaded && (
        <>
          <Editor
            ref={editorRef}
            content={text}
            onContentChange={setText}
            onAddImage={insertImage}
            folderTitle={foldername}
            isEditing={isEditing}
            onRequestEdit={() => setShowEditConfirmation(true)}
          />
          {isEditing && (
            <button onClick={handleSave} className="Savebtn">Save changes</button>
          )}
          {showEditConfirmation && (
            <div
              className="edit-confirmation-backdrop"
              role="presentation"
              onClick={() => setShowEditConfirmation(false)}
            >
              <section
                className="edit-confirmation"
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-confirmation-title"
                onClick={(event) => event.stopPropagation()}
              >
                <h2 id="edit-confirmation-title">Do you want to edit this note?</h2>
                <div className="edit-confirmation__actions">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditConfirmation(false)
                      setIsEditing(true)
                    }}
                  >
                    Yes
                  </button>
                  <button type="button" onClick={() => setShowEditConfirmation(false)}>
                    No
                  </button>
                </div>
              </section>
            </div>
          )}
        </>
      )}
    </div>

  );

}

export default Folderview
