import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';


const SKINS_PATH = '/src/components/TextEditor/scribesmith-dark/skins/';

/** TODO
 * - tags
 * - dynamic content
 * - saving notes
 * - sorting out file uploads
 */

export default function TextEditor({content, readOnly, editorCallback}) {

    const editorRef = useRef(null);

    const log = () => {
        if (editorRef.current) {
            console.log(editorRef.current.getContent());
        }
    };
    return (
        <>
            <Editor
                apiKey='knfnarhktdvw0v5q8muzms71g5lgmhn6rkdv8bxytr7qhcl8'
                onInit={(evt, editor) => {
                    editorRef.current = editor;
                    editorCallback(editor);
                }}
                initialValue={content}
                init={{
                    height: 200,
                    menubar: false,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: '| undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | image | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    file_picker_types: 'image',
                    automatic_uploads: true,
                    
                    //created a TinyMCE skin at http://skin.tiny.cloud/t5/
                    content_css: SKINS_PATH + 'content/scribesmith-dark/content.css', //css for the rich text content of the editor
                    skin_url: SKINS_PATH + 'ui/scribesmith-dark', //directory of css for the ui of the editor
                    
                    readonly: readOnly,

                /**
                 * file picker code copied from TinyMCE documentation.
                 * unsure if we'll want to to use this or use our own system to have more control 
                 */
                file_picker_callback: (cb, value, meta) => {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');
                
                    input.addEventListener('change', (e) => {
                        const file = e.target.files[0];
                    
                        const reader = new FileReader();
                        reader.addEventListener('load', () => {
                            /*
                            Note: Now we need to register the blob in TinyMCEs image blob
                            registry. In the next release this part hopefully won't be
                            necessary, as we are looking to handle it internally.
                            */
                            const id = 'blobid' + (new Date()).getTime();
                            const blobCache =  tinymce.activeEditor.editorUpload.blobCache;
                            const base64 = reader.result.split(',')[1];
                            const blobInfo = blobCache.create(id, file, base64);
                            blobCache.add(blobInfo);
                    
                            /* call the callback and populate the Title field with the file name */
                            cb(blobInfo.blobUri(), { title: file.name });
                        });
                        reader.readAsDataURL(file);
                    });
                
                    input.click();
                },
                }}
            />
        </>
    );
}