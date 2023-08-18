import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { initialContent } from './initialContent';
import { lowlight } from 'lowlight';
import { BsTypeBold, BsTypeItalic, BsTypeStrikethrough, BsCodeSlash } from 'react-icons/bs';
import { BubbleButton } from './bubbleButton';

import js from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/tokyo-night-dark.css';
import { useState } from 'react';

lowlight.registerLanguage('js', js);

export function Editor() {

    const [content, setContent] = useState('');

    const editor = useEditor({
        extensions: [
            StarterKit,
            CodeBlockLowlight.configure({
                lowlight,
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'outline-none'
            }
        }
    });

    return (
        <>
            <EditorContent
                className='max-w-full min-h-full mx-auto p-20 prose prose-violet'
                editor={editor}
            />
            {editor && (
                <BubbleMenu editor={editor} className='bg-zinc-700 shadow-xl border border-zinc-600 shadow-black/20 rounded-lg overflow-hidden flex divide-x divide-zinc-600'>
                    <BubbleButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        data-active={editor.isActive('bold')}
                    >
                        <BsTypeBold className="w-4 h-4" />
                    </BubbleButton>
                    <BubbleButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        data-active={editor.isActive('italic')}
                    >
                        <BsTypeItalic className="w-4 h-4" />
                    </BubbleButton>
                    <BubbleButton
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        data-active={editor.isActive('strike')}
                    >
                        <BsTypeStrikethrough className="w-4 h-4" />
                    </BubbleButton>
                    <BubbleButton
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        data-active={editor.isActive('code')}
                    >
                        <BsCodeSlash className="w-4 h-4" />
                    </BubbleButton>
                    <BubbleButton onClick={() => setContent(initialContent)}>
                        insert
                    </BubbleButton>
                </BubbleMenu>
            )}
        </>
    );
}