"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, Plus, Trash2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useCustomization } from "@/components/customization-provider"
import { ThemeToggle } from "@/components/theme-toggle"

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  difficulty: "easy" | "medium" | "hard"
  explanation?: string
}

export default function CustomizePage() {
  const router = useRouter()
  const { addCustomContent, customContent } = useCustomization()

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [gradeLevel, setGradeLevel] = useState("")
  const [description, setDescription] = useState("")
  const [explanation, setExplanation] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    text: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    difficulty: "easy",
    explanation: "",
  })

  const categories = ["Physics", "Chemistry", "Biology", "Mathematics"]
  const grades = ["JSS1", "JSS2", "JSS3", "SSS1", "SSS2", "SSS3"]

  const addQuestion = () => {
    if (currentQuestion.text && currentQuestion.options?.every((opt) => opt.trim())) {
      const newQuestion: Question = {
        id: `q${questions.length + 1}`,
        text: currentQuestion.text,
        options: currentQuestion.options,
        correctAnswer: currentQuestion.correctAnswer || 0,
        difficulty: currentQuestion.difficulty || "easy",
        explanation: currentQuestion.explanation,
      }
      setQuestions([...questions, newQuestion])
      setCurrentQuestion({
        text: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        difficulty: "easy",
        explanation: "",
      })
    }
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const saveCustomDemo = () => {
    if (!title || !category || !gradeLevel || !description || !explanation || questions.length === 0) {
      alert("Please fill in all required fields and add at least one question.")
      return
    }

    const customDemo = {
      id: `custom-${Date.now()}`,
      title,
      category,
      gradeLevel,
      description,
      explanation,
      imageUrl: imageUrl || `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(title)}`,
      simulationUrl: "/sims/custom-simulation.html",
      questions,
      videoUrl,
    }

    addCustomContent(customDemo)
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Demonstrations
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Customize Content</h1>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button onClick={saveCustomDemo}>
                <Save className="h-4 w-4 mr-2" />
                Save Demo
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demo Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Demo Information</CardTitle>
                <CardDescription>Basic details about your demonstration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter demonstration title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Grade Level *</label>
                    <Select value={gradeLevel} onValueChange={setGradeLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {grades.map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the demonstration"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Explanation *</label>
                  <Textarea
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Detailed explanation of the concept"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Image</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload">
                        <Button variant="outline" size="sm" asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Image
                          </span>
                        </Button>
                      </label>
                      <span className="text-sm text-gray-500">or</span>
                      <Input
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Enter image URL"
                        className="flex-1"
                      />
                    </div>
                    {imageUrl && (
                      <div className="aspect-video w-full max-w-xs overflow-hidden rounded-lg border">
                        <img
                          src={imageUrl || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Video URL (Optional)</label>
                  <Input
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Enter YouTube video URL (e.g., https://www.youtube.com/watch?v=...)"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Question</CardTitle>
                <CardDescription>Create multiple-choice questions for assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Question Text</label>
                  <Textarea
                    value={currentQuestion.text || ""}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                    placeholder="Enter your question"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Answer Options</label>
                  <div className="space-y-2">
                    {currentQuestion.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(currentQuestion.options || [])]
                            newOptions[index] = e.target.value
                            setCurrentQuestion({ ...currentQuestion, options: newOptions })
                          }}
                          placeholder={`Option ${index + 1}`}
                        />
                        <input
                          type="radio"
                          name="correct-answer"
                          checked={currentQuestion.correctAnswer === index}
                          onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                          className="w-4 h-4"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Difficulty</label>
                    <Select
                      value={currentQuestion.difficulty}
                      onValueChange={(value: "easy" | "medium" | "hard") =>
                        setCurrentQuestion({ ...currentQuestion, difficulty: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Explanation (Optional)</label>
                  <Textarea
                    value={currentQuestion.explanation || ""}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                    placeholder="Explain why this is the correct answer"
                    rows={2}
                  />
                </div>

                <Button onClick={addQuestion} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </CardContent>
            </Card>

            {/* Questions List */}
            {questions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Questions ({questions.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">
                          {index + 1}. {question.text}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={`difficulty-${question.difficulty}`}>
                            {question.difficulty}
                          </Badge>
                          <Button variant="ghost" size="sm" onClick={() => removeQuestion(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>
                          <strong>Correct Answer:</strong> {question.options[question.correctAnswer]}
                        </p>
                        {question.explanation && (
                          <p>
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Existing Custom Content */}
        {customContent.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Your Custom Demonstrations ({customContent.length})</CardTitle>
              <CardDescription>Previously created custom content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customContent.map((demo) => (
                  <div key={demo.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{demo.title}</h4>
                      <div className="flex space-x-1">
                        <Badge variant="secondary" className="text-xs">
                          {demo.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {demo.gradeLevel}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{demo.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{demo.questions.length} questions</span>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`/demo/${demo.id}`}>View</a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
