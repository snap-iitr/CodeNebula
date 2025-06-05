"use client"

import type React from "react"
import { useState } from "react"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, language }) => {
  const [lineCount, setLineCount] = useState(1)

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange(newValue)

    // Count lines
    const lines = newValue.split("\n").length
    setLineCount(Math.max(lines, 1))
  }

  const generateLineNumbers = () => {
    const totalLines = Math.max(lineCount, 25) // Show at least 25 lines
    return Array.from({ length: totalLines }, (_, i) => i + 1)
  }

  return (
    <div className="relative h-full bg-black rounded-lg border border-gray-700 overflow-hidden">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="ml-2 text-sm text-gray-400">
            main.{language === "cpp" ? "cpp" : language === "c" ? "c" : language === "python" ? "py" : "js"}
          </span>
        </div>
        <div className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300 border border-gray-600">
          {language.toUpperCase()}
        </div>
      </div>

      <div className="flex h-full">
        {/* Line Numbers */}
        <div className="bg-black px-3 py-3 text-gray-500 text-sm font-mono border-r border-gray-700 select-none min-w-[3rem]">
          {generateLineNumbers().map((num) => (
            <div key={num} className="leading-6 text-right hover:text-gray-300 transition-colors">
              {num}
            </div>
          ))}
        </div>

        {/* Editor Area */}
        <div className="flex-1 relative bg-black">
          {/* Actual Textarea */}
          <textarea
            value={value}
            onChange={handleTextareaChange}
            className="absolute inset-0 w-full h-full p-3 bg-transparent text-white text-sm font-mono leading-6 resize-none focus:outline-none overflow-auto whitespace-pre-wrap break-words"
            style={{
              caretColor: "#00f5ff",
              color: "white", // Ensure text is white
            }}
            placeholder={`// Start coding in ${language}...`}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-gray-800 border-t border-gray-700 text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Lines: {lineCount}</span>
          <span>Characters: {value.length}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Ready</span>
        </div>
      </div>
    </div>
  )
}

export default CodeEditor
