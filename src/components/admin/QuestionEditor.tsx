'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Question } from '@/types'
import { FaPlus, FaTrash, FaCode } from 'react-icons/fa'
import 'react-quill/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface QuestionEditorProps {
  initialQuestions?: Question[]
  onSave: (questions: Question[]) => void
  onCancel: () => void
}

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    ['code-block', 'formula'],
    ['clean'],
  ],
}

export default function QuestionEditor({ initialQuestions, onSave, onCancel }: QuestionEditorProps) {
  const [questions, setQuestions] = useState<Question[]>(
    initialQuestions || [
      { id: crypto.randomUUID(), question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' },
      { id: crypto.randomUUID(), question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' },
      { id: crypto.randomUUID(), question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' },
      { id: crypto.randomUUID(), question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' },
    ]
  )

  function updateQuestion(index: number, field: keyof Question, value: any) {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  function updateOption(questionIndex: number, optionIndex: number, value: string) {
    const updated = [...questions]
    const options = [...updated[questionIndex].options]
    options[optionIndex] = value
    updated[questionIndex] = { ...updated[questionIndex], options }
    setQuestions(updated)
  }

  function handleSubmit() {
    // Validate
    for (const q of questions) {
      if (!q.question.trim()) {
        alert('All questions must have content')
        return
      }
      if (q.options.some(opt => !opt.trim())) {
        alert('All options must be filled')
        return
      }
    }
    onSave(questions)
  }

  return (
    <div className="space-y-8">
      {questions.map((question, qIndex) => (
        <div key={question.id} className="border border-gray-300 rounded-lg p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Question {qIndex + 1}</h3>
            <span className="text-sm text-gray-500">ID: {question.id.slice(0, 8)}</span>
          </div>

          {/* Question Text */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Text *
            </label>
            <div className="bg-white rounded-lg">
              <ReactQuill
                theme="snow"
                value={question.question}
                onChange={(value) => updateQuestion(qIndex, 'question', value)}
                modules={quillModules}
                placeholder="Enter your question here... You can use LaTeX with $$formula$$"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              <FaCode className="inline mr-1" />
              Supports: <strong>LaTeX</strong> ($$x^2$$), <strong>Code</strong> (code block button), <strong>Rich text</strong>
            </p>
          </div>

          {/* Options */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer Options *
            </label>
            <div className="space-y-3">
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-start gap-3">
                  <div className="flex items-center pt-3">
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={question.correctAnswer === oIndex}
                      onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                      className="w-5 h-5 text-primary-600"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">
                      Option {String.fromCharCode(65 + oIndex)}
                    </label>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                      placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Select the radio button to mark the correct answer
            </p>
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Explanation (Optional)
            </label>
            <textarea
              value={question.explanation || ''}
              onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              placeholder="Explain why the correct answer is correct..."
            />
          </div>
        </div>
      ))}

      <div className="flex justify-end gap-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Save Question Page
        </button>
      </div>
    </div>
  )
}
