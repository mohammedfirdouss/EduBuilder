"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Monitor,
  Printer,
  CheckCircle,
  XCircle,
  Edit,
  Lightbulb,
  Play,
  BookOpen,
  Clock,
  Target,
  Award,
  TrendingUp,
  Eye,
  EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useCustomization } from "@/components/customization-provider"
import { InteractiveSimulation } from "@/components/interactive-simulation"
import { ThemeToggle } from "@/components/theme-toggle"

interface Demo {
  id: string
  title: string
  category: string
  gradeLevel: string
  description: string
  explanation: string
  imageUrl?: string
  simulationUrl: string
  videoUrl?: string
  questions: Array<{
    id: string
    text: string
    options: string[]
    correctAnswer: number
    difficulty?: "easy" | "medium" | "hard"
    explanation?: string
  }>
}

// Fallback demo data matching the homepage
const fallbackDemos: Demo[] = [
  {
    id: "phy-001",
    title: "Simple Pendulum Motion",
    category: "Physics",
    gradeLevel: "JSS3",
    description: "Explore the periodic motion of a simple pendulum and understand factors affecting its period.",
    explanation:
      "A simple pendulum consists of a mass suspended from a fixed point by a string or rod. When displaced from its equilibrium position, it oscillates back and forth under the influence of gravity. The period of oscillation depends primarily on the length of the pendulum and the acceleration due to gravity, while being largely independent of the mass and small amplitude of oscillation.",
    simulationUrl: "/sims/pendulum.html",
    imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/embed/yVkdfJ9PkRQ",
    questions: [
      {
        id: "q1",
        text: "What primarily affects the period of a simple pendulum?",
        options: ["Mass of the bob", "Amplitude of swing", "Length of the string", "Color of the bob"],
        correctAnswer: 2,
        difficulty: "medium",
      },
      {
        id: "q2",
        text: "What type of motion does a pendulum exhibit?",
        options: ["Linear motion", "Circular motion", "Periodic motion", "Random motion"],
        correctAnswer: 2,
        difficulty: "easy",
      },
      {
        id: "q3",
        text: "How would doubling the length affect the period?",
        options: ["Double it", "Halve it", "Increase by √2", "No change"],
        correctAnswer: 2,
        difficulty: "hard",
      },
    ],
  },
  {
    id: "chem-001",
    title: "Acid-Base Indicators",
    category: "Chemistry",
    gradeLevel: "SSS1",
    description: "Learn how different indicators change color in acidic and basic solutions.",
    explanation:
      "Acid-base indicators are substances that change color depending on the pH of the solution they are in. Common indicators like litmus paper, phenolphthalein, and methyl orange have specific pH ranges where they change color. This property makes them useful for determining whether a solution is acidic, neutral, or basic.",
    simulationUrl: "/sims/indicators.html",
    imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/embed/X1pWKK2zGHQ",
    questions: [
      {
        id: "q1",
        text: "What color does litmus paper turn in an acidic solution?",
        options: ["Blue", "Red", "Green", "Yellow"],
        correctAnswer: 1,
        difficulty: "easy",
      },
      {
        id: "q2",
        text: "What is the pH range for neutral solutions?",
        options: ["0-6", "7", "8-14", "1-13"],
        correctAnswer: 1,
        difficulty: "medium",
      },
      {
        id: "q3",
        text: "Which indicator is colorless in acidic solutions?",
        options: ["Litmus", "Methyl orange", "Phenolphthalein", "Universal indicator"],
        correctAnswer: 2,
        difficulty: "medium",
      },
    ],
  },
  {
    id: "bio-001",
    title: "Plant Cell Structure",
    category: "Biology",
    gradeLevel: "JSS2",
    description: "Explore the different parts of a plant cell and their functions.",
    explanation:
      "Plant cells are eukaryotic cells that contain several specialized organelles. Key structures include the cell wall (provides support), chloroplasts (for photosynthesis), vacuole (storage and support), nucleus (control center), and cell membrane (controls entry and exit of substances). Each organelle has specific functions that help the plant survive and grow.",
    simulationUrl: "/sims/plant-cell.html",
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/embed/Hmwvj9X4GNY",
    questions: [
      {
        id: "q1",
        text: "Which organelle is responsible for photosynthesis?",
        options: ["Nucleus", "Chloroplast", "Vacuole", "Mitochondria"],
        correctAnswer: 1,
        difficulty: "easy",
      },
      {
        id: "q2",
        text: "What provides structural support to plant cells?",
        options: ["Cell membrane", "Cytoplasm", "Cell wall", "Nucleus"],
        correctAnswer: 2,
        difficulty: "easy",
      },
      {
        id: "q3",
        text: "Which structure controls what enters and leaves the cell?",
        options: ["Cell wall", "Cell membrane", "Vacuole", "Chloroplast"],
        correctAnswer: 1,
        difficulty: "medium",
      },
    ],
  },
  {
    id: "math-001",
    title: "Quadratic Functions",
    category: "Mathematics",
    gradeLevel: "SSS2",
    description: "Understand the properties and graphs of quadratic functions.",
    explanation:
      "A quadratic function is a polynomial function of degree 2, typically written as f(x) = ax² + bx + c where a ≠ 0. The graph of a quadratic function is a parabola that opens upward if a > 0 or downward if a < 0. Key features include the vertex (maximum or minimum point), axis of symmetry, and x-intercepts (roots).",
    simulationUrl: "/sims/quadratic.html",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/embed/g7oBR7W8Ej4",
    questions: [
      {
        id: "q1",
        text: "What is the general form of a quadratic function?",
        options: ["ax + b", "ax² + bx + c", "ax³ + bx² + cx + d", "a/x + b"],
        correctAnswer: 1,
        difficulty: "easy",
      },
      {
        id: "q2",
        text: "What shape is the graph of a quadratic function?",
        options: ["Line", "Circle", "Parabola", "Hyperbola"],
        correctAnswer: 2,
        difficulty: "easy",
      },
      {
        id: "q3",
        text: "If a > 0 in f(x) = ax² + bx + c, the parabola opens:",
        options: ["Upward", "Downward", "Left", "Right"],
        correctAnswer: 0,
        difficulty: "medium",
      },
    ],
  },
  {
    id: "phy-006",
    title: "Electromagnetic Induction",
    category: "Physics",
    gradeLevel: "SSS3",
    description: "Discover how changing magnetic fields generate electric currents through Faraday's law.",
    explanation:
      "Electromagnetic induction is the process by which a changing magnetic field generates an electric current in a conductor. This fundamental principle, discovered by Michael Faraday, forms the basis of generators, transformers, and many modern electrical devices. The induced EMF is proportional to the rate of change of magnetic flux.",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/embed/kS25vitrZ6g",
    simulationUrl: "/sims/electromagnetic-induction.html",
    questions: [
      {
        id: "q1",
        text: "What is Faraday's law of electromagnetic induction?",
        options: [
          "EMF is proportional to magnetic field strength",
          "EMF is proportional to rate of change of magnetic flux",
          "EMF is inversely proportional to resistance",
          "EMF is constant in all conditions",
        ],
        correctAnswer: 1,
        difficulty: "medium",
        explanation:
          "Faraday's law states that the induced EMF is directly proportional to the rate of change of magnetic flux through the conductor.",
      },
      {
        id: "q2",
        text: "Which device works on the principle of electromagnetic induction?",
        options: ["Battery", "Capacitor", "Generator", "Resistor"],
        correctAnswer: 2,
        difficulty: "easy",
        explanation: "Generators convert mechanical energy to electrical energy using electromagnetic induction.",
      },
    ],
  },
  {
    id: "chem-006",
    title: "Organic Chemistry: Hydrocarbons",
    category: "Chemistry",
    gradeLevel: "SSS2",
    description: "Explore the structure and properties of alkanes, alkenes, and alkynes.",
    explanation:
      "Hydrocarbons are organic compounds composed entirely of hydrogen and carbon atoms. They are classified into three main groups: alkanes (single bonds), alkenes (double bonds), and alkynes (triple bonds). These compounds form the basis of petroleum products and many industrial chemicals.",
    imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/embed/Rd4a1X3B61w",
    simulationUrl: "/sims/hydrocarbons.html",
    questions: [
      {
        id: "q1",
        text: "What is the general formula for alkanes?",
        options: ["CnH2n", "CnH2n+2", "CnH2n-2", "CnHn"],
        correctAnswer: 1,
        difficulty: "easy",
        explanation: "Alkanes have the general formula CnH2n+2 because they contain only single bonds.",
      },
      {
        id: "q2",
        text: "Which hydrocarbon contains a triple bond?",
        options: ["Alkane", "Alkene", "Alkyne", "Aromatic"],
        correctAnswer: 2,
        difficulty: "easy",
        explanation: "Alkynes are characterized by the presence of at least one carbon-carbon triple bond.",
      },
    ],
  },
]

export default function DemoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { getCustomContent } = useCustomization()
  const [demo, setDemo] = useState<Demo | null>(null)
  const [isClassroomMode, setIsClassroomMode] = useState(false)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({})
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [completedQuestions, setCompletedQuestions] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [showHints, setShowHints] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const loadDemo = async () => {
      try {
        // First check if it's a custom demo
        const customDemo = getCustomContent(params.id as string)
        if (customDemo) {
          setDemo(customDemo)
          setIsLoading(false)
          return
        }

        // Try to load from JSON files, with fallback to embedded data
        let foundDemo: Demo | undefined

        try {
          const originalResponse = await fetch("/data/demos.json")
          if (originalResponse.ok) {
            const text = await originalResponse.text()
            if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
              const originalDemos = JSON.parse(text)
              foundDemo = originalDemos.find((d: Demo) => d.id === params.id)
            }
          }
        } catch (err) {
          console.warn("Could not load original demos")
        }

        if (!foundDemo) {
          try {
            const enhancedResponse = await fetch("/data/enhanced-demos.json")
            if (enhancedResponse.ok) {
              const text = await enhancedResponse.text()
              if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
                const enhancedDemos = JSON.parse(text)
                foundDemo = enhancedDemos.find((d: Demo) => d.id === params.id)
              }
            }
          } catch (err) {
            console.warn("Could not load enhanced demos")
          }
        }

        // Fallback to embedded data
        if (!foundDemo) {
          foundDemo = fallbackDemos.find((d: Demo) => d.id === params.id)
        }

        setDemo(foundDemo || null)
      } catch (error) {
        console.error("Error loading demo:", error)
        // Try fallback data
        const foundDemo = fallbackDemos.find((d: Demo) => d.id === params.id)
        setDemo(foundDemo || null)
      } finally {
        setIsLoading(false)
      }
    }

    loadDemo()
  }, [params.id, getCustomContent])

  useEffect(() => {
    if (isClassroomMode) {
      document.body.classList.add("classroom-mode")
    } else {
      document.body.classList.remove("classroom-mode")
    }

    return () => {
      document.body.classList.remove("classroom-mode")
    }
  }, [isClassroomMode])

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }))
    setShowFeedback((prev) => ({ ...prev, [questionId]: true }))

    if (!showFeedback[questionId]) {
      setCompletedQuestions((prev) => prev + 1)
      const question = demo?.questions.find((q) => q.id === questionId)
      if (question && answerIndex === question.correctAnswer) {
        setCorrectAnswers((prev) => prev + 1)
      }
    }
  }

  const toggleExplanation = (questionId: string) => {
    setShowExplanations((prev) => ({ ...prev, [questionId]: !prev[questionId] }))
  }

  const toggleHint = (questionId: string) => {
    setShowHints((prev) => ({ ...prev, [questionId]: !prev[questionId] }))
  }

  const handlePrint = () => {
    window.print()
  }

  const toggleClassroomMode = () => {
    setIsClassroomMode(!isClassroomMode)
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getProgressPercentage = () => {
    if (!demo?.questions.length) return 0
    return (completedQuestions / demo.questions.length) * 100
  }

  const getScorePercentage = () => {
    if (!completedQuestions) return 0
    return (correctAnswers / completedQuestions) * 100
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Loading Demonstration</h3>
            <p className="text-gray-600 dark:text-gray-300">Preparing your interactive learning experience...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!demo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Demonstration Not Found</h2>
            <p className="text-gray-600 dark:text-gray-300">
              The demonstration you're looking for doesn't exist or has been moved.
            </p>
          </div>
          <Button onClick={() => router.push("/")} className="btn-gradient">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen ${isClassroomMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"}`}
    >
      {/* Enhanced Header */}
      {!isClassroomMode && (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Demonstrations
              </Button>

              <div className="flex items-center space-x-3">
                {demo.id.startsWith("custom-") && (
                  <Button variant="outline" size="sm" onClick={() => router.push(`/customize?edit=${demo.id}`)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
                <ThemeToggle />
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm" onClick={toggleClassroomMode}>
                  <Monitor className="h-4 w-4 mr-2" />
                  Classroom Mode
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Classroom Mode Exit Button */}
      {isClassroomMode && (
        <div className="fixed top-4 right-4 z-50 no-print">
          <Button onClick={toggleClassroomMode} variant="secondary" className="shadow-lg">
            <Eye className="h-4 w-4 mr-2" />
            Exit Classroom Mode
          </Button>
        </div>
      )}

      <main className={`${isClassroomMode ? "p-8" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"} demo-content`}>
        {/* Enhanced Hero Section */}
        <div className="mb-8 animate-fade-in">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {demo.category}
                    </Badge>
                    <Badge variant="outline" className="border-white/30 text-white">
                      {demo.gradeLevel}
                    </Badge>
                    {demo.id.startsWith("custom-") && (
                      <Badge className="bg-yellow-500/20 text-yellow-200 border-yellow-400/30">Custom</Badge>
                    )}
                  </div>
                  <h1 className={`${isClassroomMode ? "text-5xl" : "text-4xl"} font-bold leading-tight`}>
                    {demo.title}
                  </h1>
                  <p className={`${isClassroomMode ? "text-xl" : "text-lg"} text-white/90 max-w-2xl`}>
                    {demo.description}
                  </p>
                </div>

                {/* Progress Stats */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
                  <Card className="bg-white/10 border-white/20 text-white">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Target className="h-8 w-8 text-yellow-300" />
                        <div>
                          <p className="text-sm text-white/80">Progress</p>
                          <p className="text-2xl font-bold">{Math.round(getProgressPercentage())}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 border-white/20 text-white">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Award className="h-8 w-8 text-green-300" />
                        <div>
                          <p className="text-sm text-white/80">Score</p>
                          <p className="text-2xl font-bold">{Math.round(getScorePercentage())}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4 bg-white dark:bg-gray-800 shadow-sm">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="simulation" className="flex items-center space-x-2">
              <Play className="h-4 w-4" />
              <span className="hidden sm:inline">Simulation</span>
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Questions</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Progress</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            {/* Demo Image */}
            {demo.imageUrl && (
              <Card className="overflow-hidden card-hover">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={demo.imageUrl || "/placeholder.svg"}
                      alt={demo.title}
                      className="w-full h-64 md:h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm font-medium">Visual Learning Aid</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Explanation */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <span>Concept Explanation</span>
                </CardTitle>
                <CardDescription>Deep dive into the scientific principles and concepts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{demo.explanation}</p>
                </div>
              </CardContent>
            </Card>

            {/* Learning Objectives */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <span>Learning Objectives</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Understand Core Concepts</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Grasp fundamental principles through interactive exploration
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Apply Knowledge</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Use learned concepts to solve real-world problems
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Critical Thinking</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Develop analytical skills through guided questions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Practical Application</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Connect theory with practical demonstrations
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Simulation Tab */}
          <TabsContent value="simulation" className="animate-fade-in">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Play className="h-5 w-5 text-green-500" />
                  <span>Learning Experience</span>
                </CardTitle>
                <CardDescription>
                  Engage with simulations and educational videos to enhance understanding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InteractiveSimulation demoId={demo.id} title={demo.title} videoUrl={demo.videoUrl} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-6 animate-fade-in">
            {/* Progress Overview */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    <span>Assessment Questions</span>
                  </div>
                  <Badge variant="outline">
                    {completedQuestions} of {demo.questions.length} completed
                  </Badge>
                </CardTitle>
                <CardDescription>Test your understanding with these interactive questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{Math.round(getProgressPercentage())}%</span>
                  </div>
                  <Progress value={getProgressPercentage()} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Questions */}
            <div className="space-y-6">
              {demo.questions.map((question, index) => {
                const isAnswered = showFeedback[question.id]
                const isCorrect = answers[question.id] === question.correctAnswer

                return (
                  <Card
                    key={question.id}
                    className={`question-card animate-slide-in ${
                      isAnswered ? (isCorrect ? "correct" : "incorrect") : ""
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{index + 1}</span>
                            </div>
                            {question.difficulty && (
                              <Badge className={`difficulty-indicator ${getDifficultyColor(question.difficulty)}`}>
                                {question.difficulty}
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold leading-relaxed">{question.text}</h3>
                        </div>

                        {!isAnswered && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleHint(question.id)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            {showHints[question.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Hint */}
                      {showHints[question.id] && !isAnswered && (
                        <Alert>
                          <Lightbulb className="h-4 w-4" />
                          <AlertTitle>Hint</AlertTitle>
                          <AlertDescription>
                            Think about the key concepts explained in the demonstration above.
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Answer Options */}
                      <RadioGroup
                        value={answers[question.id]?.toString()}
                        onValueChange={(value) => handleAnswerSelect(question.id, Number.parseInt(value))}
                        disabled={isAnswered}
                        className="space-y-3"
                      >
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <RadioGroupItem
                              value={optionIndex.toString()}
                              id={`${question.id}-${optionIndex}`}
                              className="mt-0.5"
                            />
                            <Label
                              htmlFor={`${question.id}-${optionIndex}`}
                              className="flex-1 cursor-pointer text-base leading-relaxed"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>

                      {/* Feedback */}
                      {isAnswered && (
                        <div className="space-y-4 animate-scale-in">
                          <Separator />
                          <div
                            className={`p-4 rounded-lg flex items-start space-x-3 ${
                              isCorrect
                                ? "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800"
                                : "bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800"
                            }`}
                          >
                            {isCorrect ? (
                              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="space-y-2">
                              <p
                                className={`font-medium ${
                                  isCorrect ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"
                                }`}
                              >
                                {isCorrect
                                  ? "Excellent! That's correct."
                                  : `Not quite right. The correct answer is: ${question.options[question.correctAnswer]}`}
                              </p>

                              {question.explanation && (
                                <div className="space-y-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleExplanation(question.id)}
                                    className="p-0 h-auto font-normal text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                                  >
                                    <Lightbulb className="h-4 w-4 mr-1" />
                                    {showExplanations[question.id] ? "Hide" : "Show"} Explanation
                                  </Button>
                                  {showExplanations[question.id] && (
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                      <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                                        {question.explanation}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Overall Progress */}
              <Card className="card-hover">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    <span>Overall Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {Math.round(getProgressPercentage())}%
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Complete</p>
                    </div>
                    <Progress value={getProgressPercentage()} className="h-2" />
                    <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                      {completedQuestions} of {demo.questions.length} questions answered
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Score */}
              <Card className="card-hover">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Award className="h-5 w-5 text-green-500" />
                    <span>Current Score</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {Math.round(getScorePercentage())}%
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
                    </div>
                    <Progress value={getScorePercentage()} className="h-2" />
                    <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                      {correctAnswers} correct out of {completedQuestions} answered
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Time Spent */}
              <Card className="card-hover">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Clock className="h-5 w-5 text-purple-500" />
                    <span>Learning Time</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">~15</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Minutes</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Estimated completion</span>
                        <span>20 min</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Breakdown */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Question Breakdown</CardTitle>
                <CardDescription>See how you performed on each difficulty level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["easy", "medium", "hard"].map((difficulty) => {
                    const questionsOfDifficulty = demo.questions.filter((q) => q.difficulty === difficulty)
                    const answeredOfDifficulty = questionsOfDifficulty.filter((q) => showFeedback[q.id])
                    const correctOfDifficulty = questionsOfDifficulty.filter(
                      (q) => showFeedback[q.id] && answers[q.id] === q.correctAnswer,
                    )

                    if (questionsOfDifficulty.length === 0) return null

                    return (
                      <div key={difficulty} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge className={getDifficultyColor(difficulty)}>{difficulty}</Badge>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {correctOfDifficulty.length}/{questionsOfDifficulty.length} correct
                            </span>
                          </div>
                          <span className="text-sm font-medium">
                            {questionsOfDifficulty.length > 0
                              ? Math.round((correctOfDifficulty.length / questionsOfDifficulty.length) * 100)
                              : 0}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            questionsOfDifficulty.length > 0
                              ? (correctOfDifficulty.length / questionsOfDifficulty.length) * 100
                              : 0
                          }
                          className="h-2"
                        />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Print Summary */}
        <div className="print-only hidden">
          <div className="border-t-2 border-gray-300 pt-4 mt-8">
            <h2 className="text-xl font-bold mb-4">Summary - {demo.title}</h2>
            <div className="mb-4">
              <strong>Category:</strong> {demo.category} | <strong>Grade Level:</strong> {demo.gradeLevel}
            </div>
            <div className="mb-4">
              <strong>Description:</strong> {demo.description}
            </div>
            <div className="mb-4">
              <strong>Explanation:</strong> {demo.explanation}
            </div>
            <div>
              <strong>Questions and Answers:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-2">
                {demo.questions.map((question, index) => (
                  <li key={question.id}>
                    <strong>{question.text}</strong>
                    <br />
                    <span className="ml-4">
                      Answer: {question.options[question.correctAnswer]}
                      {question.difficulty && ` (${question.difficulty})`}
                    </span>
                    {question.explanation && <br />}
                    {question.explanation && <span className="ml-4 text-sm">Explanation: {question.explanation}</span>}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
