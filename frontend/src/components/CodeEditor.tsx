import { Editor } from '@monaco-editor/react'
import React from 'react'

interface Props
{
    value?: string,
    onChange?: (value: string) => void,
    language?: "css" | "html" | "javascript"
}

const CodeEditor: React.FC<Props> = ({ value, onChange, language }) =>
{

    return (
        <Editor
            value={value}
            onChange={(e) => { if (onChange) onChange(e || "") }}
            className="font-[Menlo] w-full text-white resize-none bg-black outline-none"
            language={language}
            theme="vs-dark"
            options={
                {
                    scrollBeyondLastLine: false,
                    minimap: {
                        autohide: true,
                        renderCharacters: false,
                    }
                }
            }
        />
    )
}

export default CodeEditor
