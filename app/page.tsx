"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  BookOpen,
  Zap,
  Plus,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Users,
  Clock,
  Star,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useCustomization } from "@/components/customization-provider"

interface Demo {
  id: string
  title: string
  category: string
  gradeLevel: string
  description: string
  explanation: string
  imageUrl?: string
  videoUrl?: string
  simulationUrl: string
  questions: Array<{
    id: string
    text: string
    options: string[]
    correctAnswer: number
    difficulty?: "easy" | "medium" | "hard"
    explanation?: string
  }>
}

// Fallback demo data in case JSON files are not accessible
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

export default function HomePage() {
  const [allDemos, setAllDemos] = useState<Demo[]>([])
  const [displayedDemos, setDisplayedDemos] = useState<Demo[]>([])
  const [filteredDemos, setFilteredDemos] = useState<Demo[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [gradeFilter, setGradeFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { customContent } = useCustomization()

  const categories = ["All", "Physics", "Chemistry", "Biology", "Mathematics"]
  const grades = ["All", "JSS1", "JSS2", "JSS3", "SSS1", "SSS2", "SSS3"]
  const DEMOS_PER_PAGE = 12

  useEffect(() => {
    const loadDemos = async () => {
      try {
        setError(null)
        let originalData: Demo[] = []
        let enhancedData: Demo[] = []

        // Try to load original demos
        try {
          const originalResponse = await fetch("/data/demos.json")
          if (originalResponse.ok) {
            const text = await originalResponse.text()
            if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
              originalData = JSON.parse(text)
            }
          }
        } catch (err) {
          console.warn("Could not load original demos, using fallback data")
        }

        // Try to load enhanced demos
        try {
          const enhancedResponse = await fetch("/data/enhanced-demos.json")
          if (enhancedResponse.ok) {
            const text = await enhancedResponse.text()
            if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
              enhancedData = JSON.parse(text)
            }
          }
        } catch (err) {
          console.warn("Could not load enhanced demos, using fallback data")
        }

        // If no data was loaded successfully, use fallback
        if (originalData.length === 0 && enhancedData.length === 0) {
          console.log("Using fallback demo data")
          originalData = fallbackDemos
        }

        const combinedDemos = [...originalData, ...enhancedData, ...customContent]
        setAllDemos(combinedDemos)
        setFilteredDemos(combinedDemos)
      } catch (error) {
        console.error("Error loading demos:", error)
        // Use fallback data even if there's an error
        console.log("Using fallback demo data due to error")
        const combinedDemos = [...fallbackDemos, ...customContent]
        setAllDemos(combinedDemos)
        setFilteredDemos(combinedDemos)
      } finally {
        setIsLoading(false)
      }
    }

    loadDemos()
  }, [customContent])

  useEffect(() => {
    const filtered = allDemos.filter((demo) => {
      const matchesSearch =
        demo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        demo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        demo.category.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === "All" || demo.category === categoryFilter
      const matchesGrade = gradeFilter === "All" || demo.gradeLevel === gradeFilter

      return matchesSearch && matchesCategory && matchesGrade
    })

    setFilteredDemos(filtered)
    setCurrentPage(0)
  }, [allDemos, searchQuery, categoryFilter, gradeFilter])

  useEffect(() => {
    const shuffled = [...filteredDemos].sort(() => Math.random() - 0.5)
    const startIndex = currentPage * DEMOS_PER_PAGE
    const endIndex = startIndex + DEMOS_PER_PAGE
    setDisplayedDemos(shuffled.slice(startIndex, endIndex))
  }, [filteredDemos, currentPage])

  const shuffleDemos = () => {
    const shuffled = [...filteredDemos].sort(() => Math.random() - 0.5)
    const startIndex = currentPage * DEMOS_PER_PAGE
    const endIndex = startIndex + DEMOS_PER_PAGE
    setDisplayedDemos(shuffled.slice(startIndex, endIndex))
  }

  const totalPages = Math.ceil(filteredDemos.length / DEMOS_PER_PAGE)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Physics":
        return "⚛️"
      case "Chemistry":
        return "🧪"
      case "Biology":
        return "🧬"
      case "Mathematics":
        return "📐"
      default:
        return "📚"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin"></div>
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Loading EduBuilder</h3>
            <p className="text-gray-600 dark:text-gray-300">Preparing your enhanced learning experience...</p>
            <div className="flex items-center justify-center space-x-2 mt-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EduBuilder
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center space-x-2">
                  <span>Interactive STEM Learning Platform</span>
                  <Badge variant="secondary" className="text-xs">
                    v2.0
                  </Badge>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <Zap className="h-4 w-4 text-green-500" />
                  <span>Offline Ready</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span>{allDemos.length} Demos</span>
                </div>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <ThemeToggle />
              <Link href="/customize">
                <Button variant="outline" size="sm" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Demos</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{allDemos.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Custom Content</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{customContent.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length - 1}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Time</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">15m</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Search and Filter Section */}
        <Card className="mb-8 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-blue-500" />
              <span>Discover Learning Content</span>
            </CardTitle>
            <CardDescription>
              Search through our comprehensive collection of interactive STEM demonstrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search demonstrations, topics, or concepts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48 h-12">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        <div className="flex items-center space-x-2">
                          <span>{getCategoryIcon(category)}</span>
                          <span>{category}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                  <SelectTrigger className="w-full sm:w-32 h-12">
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={shuffleDemos} title="Shuffle demonstrations" className="h-12 px-6">
                  <Shuffle className="h-4 w-4 mr-2" />
                  Shuffle
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {filteredDemos.length} demonstrations found
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Showing {displayedDemos.length} results
              {customContent.length > 0 && (
                <span className="text-blue-600 dark:text-blue-400 ml-2">• {customContent.length} custom</span>
              )}
            </p>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = currentPage < 3 ? i : currentPage - 2 + i
                  if (pageNum >= totalPages) return null
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum + 1}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Enhanced Demonstrations Grid */}
        {displayedDemos.length === 0 ? (
          <Card className="card-hover">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <Filter className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No demonstrations found</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-6 max-w-md">
                Try adjusting your search terms or filters, or create your own custom demonstration.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setCategoryFilter("All")
                    setGradeFilter("All")
                  }}
                >
                  Clear Filters
                </Button>
                <Link href="/customize">
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Custom Demo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedDemos.map((demo, index) => (
              <Link key={demo.id} href={`/demo/${demo.id}`}>
                <Card
                  className="h-full card-hover group cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {demo.imageUrl && (
                    <div className="relative aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={demo.imageUrl || "/placeholder.svg"}
                        alt={demo.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(demo.title)}`
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-3 right-3">
                        {demo.videoUrl && <Badge className="bg-red-500 text-white">📹 Video</Badge>}
                      </div>
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          <span className="mr-1">{getCategoryIcon(demo.category)}</span>
                          {demo.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {demo.gradeLevel}
                        </Badge>
                      </div>
                      {demo.id.startsWith("custom-") && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                          Custom
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {demo.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">{demo.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                            <Clock className="h-3 w-3" />
                            <span>~15 min</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                            <BookOpen className="h-3 w-3" />
                            <span>{demo.questions.length} questions</span>
                          </div>
                        </div>
                      </div>

                      {demo.questions.some((q) => q.difficulty) && (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Difficulty:</span>
                          <div className="flex space-x-1">
                            {Array.from(new Set(demo.questions.map((q) => q.difficulty))).map((difficulty) => (
                              <Badge
                                key={difficulty}
                                variant="outline"
                                className={`text-xs px-2 py-0 ${
                                  difficulty === "easy"
                                    ? "border-green-300 text-green-700 dark:text-green-400"
                                    : difficulty === "medium"
                                      ? "border-yellow-300 text-yellow-700 dark:text-yellow-400"
                                      : "border-red-300 text-red-700 dark:text-red-400"
                                }`}
                              >
                                {difficulty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback className="text-xs bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                                EB
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-500 dark:text-gray-400">EduBuilder</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-auto p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Start Learning →
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
