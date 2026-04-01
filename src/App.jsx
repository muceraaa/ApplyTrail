import { useEffect, useMemo, useState } from 'react'
// pdfjs module will be loaded dynamically when needed
import './App.css'
import TrackModal from './components/TrackModal'
import { addApplication } from './utils/trackerStorage'

// Kenya-based placeholder tech jobs
const jobsData = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'Savannah Tech',
    location: 'Nairobi',
    shortDescription: 'Build responsive web interfaces with React and CSS.',
    shortSummary:
      'You will craft user-facing features, keep UI performant, and collaborate closely with design for accessibility and polish.',
    responsibilities: [
      'Implement reusable React components and styling',
      'Work with designers to refine UX and accessibility',
      'Optimize performance for a range of devices and networks'
    ],
    requirements: [
      '2+ years with React or similar frameworks',
      'Strong CSS fundamentals and responsive design',
      'Familiarity with version control and code reviews'
    ],
    applicationLink: 'https://example.com/jobs/frontend-developer'
  },
  {
    id: 2,
    title: 'Backend Developer',
    company: 'Nile Digital',
    location: 'Remote - Kenya',
    shortDescription: 'Design and build APIs powering fintech products.',
    shortSummary:
      'Own backend services, improve reliability, and collaborate with product to deliver secure, scalable APIs.',
    responsibilities: [
      'Design REST/GraphQL endpoints and data models',
      'Maintain CI/CD pipelines and service observability',
      'Collaborate on architecture and security reviews'
    ],
    requirements: [
      'Experience with Node.js or Python backends',
      'Knowledge of SQL databases and caching',
      'Understanding of API security and authentication'
    ],
    applicationLink: 'https://example.com/jobs/backend-developer'
  },
  {
    id: 3,
    title: 'Full Stack Developer',
    company: 'AfriSoft Solutions',
    location: 'Hybrid - Nairobi',
    shortDescription: 'Ship features across React frontends and Node.js services.',
    shortSummary:
      'Work end-to-end from UI to database, ensuring reliable releases and great user experiences.',
    responsibilities: [
      'Build UI flows and connect them to backend APIs',
      'Write integration tests for critical paths',
      'Participate in design and code reviews'
    ],
    requirements: [
      'Comfortable with React and Node.js/Express',
      'Experience with relational databases (e.g., PostgreSQL)',
      'Ability to debug across the stack'
    ],
    applicationLink: 'https://example.com/jobs/fullstack-developer'
  },
  {
    id: 4,
    title: 'Data Scientist',
    company: 'Karibu Data Labs',
    location: 'Nairobi',
    shortDescription: 'Turn product data into insights and predictive models.',
    shortSummary:
      'Own experimentation, model prototyping, and insight delivery to help teams make data-informed decisions.',
    responsibilities: [
      'Explore datasets and build feature pipelines',
      'Prototype and validate ML models',
      'Present findings to product and leadership'
    ],
    requirements: [
      'Strong Python and SQL skills',
      'Experience with pandas and common ML libraries',
      'Ability to communicate insights clearly'
    ],
    applicationLink: 'https://example.com/jobs/data-scientist'
  },
  {
    id: 5,
    title: 'Machine Learning Engineer',
    company: 'NextWave Systems',
    location: 'Thika',
    shortDescription: 'Productionize ML models for personalization and risk.',
    shortSummary:
      'Deploy, monitor, and iterate on ML systems with robust tooling and observability.',
    responsibilities: [
      'Build and maintain model serving pipelines',
      'Monitor drift, performance, and data quality',
      'Collaborate with data scientists on feature stores'
    ],
    requirements: [
      'Experience with TensorFlow or PyTorch',
      'Familiarity with Docker and cloud deployments',
      'Knowledge of monitoring and logging for ML systems'
    ],
    applicationLink: 'https://example.com/jobs/ml-engineer'
  },
  {
    id: 6,
    title: 'DevOps Engineer',
    company: 'CloudBridge Africa',
    location: 'Nairobi',
    shortDescription: 'Own CI/CD pipelines and keep infrastructure reliable.',
    shortSummary:
      'Improve release speed and reliability through automation, observability, and good incident practices.',
    responsibilities: [
      'Maintain CI/CD workflows and artifact pipelines',
      'Manage Kubernetes clusters and IaC templates',
      'Set up monitoring, alerting, and runbooks'
    ],
    requirements: [
      'Hands-on with Docker and Kubernetes',
      'Experience with Terraform or similar IaC tools',
      'Comfortable with Linux and scripting'
    ],
    applicationLink: 'https://example.com/jobs/devops-engineer'
  },
  {
    id: 7,
    title: 'Cloud Engineer',
    company: 'BlueGrid Technologies',
    location: 'Mombasa',
    shortDescription: 'Design secure, scalable cloud environments.',
    shortSummary:
      'Plan and implement cloud networking, access control, and disaster recovery for client workloads.',
    responsibilities: [
      'Design VPCs, subnets, and secure connectivity',
      'Implement IAM, backups, and cost monitoring',
      'Document architectures and handover guides'
    ],
    requirements: [
      'Experience with AWS or GCP',
      'Networking fundamentals (DNS, VPNs, firewalls)',
      'Understanding of security best practices'
    ],
    applicationLink: 'https://example.com/jobs/cloud-engineer'
  },
  {
    id: 8,
    title: 'Cybersecurity Analyst',
    company: 'Apex Kenya Tech',
    location: 'Nairobi',
    shortDescription: 'Monitor threats and harden systems across the stack.',
    shortSummary:
      'Triage alerts, investigate incidents, and guide teams on secure configurations.',
    responsibilities: [
      'Operate SIEM tools and analyze security events',
      'Run vulnerability scans and track remediation',
      'Contribute to incident response playbooks'
    ],
    requirements: [
      'Knowledge of common attack vectors and OWASP',
      'Experience with SIEM or log analysis tools',
      'Strong documentation and communication skills'
    ],
    applicationLink: 'https://example.com/jobs/cybersecurity-analyst'
  },
  {
    id: 9,
    title: 'UI/UX Designer',
    company: 'Savannah Tech',
    location: 'Hybrid - Nairobi',
    shortDescription: 'Create intuitive flows and clean UI for web and mobile.',
    shortSummary:
      'Own discovery, prototyping, and handoff to engineering while maintaining a cohesive design system.',
    responsibilities: [
      'Run user interviews and usability tests',
      'Produce wireframes, prototypes, and design specs',
      'Maintain components in the design system'
    ],
    requirements: [
      'Proficiency with Figma or similar tools',
      'Portfolio demonstrating UX and visual craft',
      'Ability to collaborate closely with engineers'
    ],
    applicationLink: 'https://example.com/jobs/ui-ux-designer'
  },
  {
    id: 10,
    title: 'Product Manager',
    company: 'Nile Digital',
    location: 'Remote - Kenya',
    shortDescription: 'Lead a product pod delivering payments experiences.',
    shortSummary:
      'Define strategy, align teams, and ship impactful releases informed by data and user feedback.',
    responsibilities: [
      'Own roadmap and success metrics for your domain',
      'Write clear problem statements and PRDs',
      'Coordinate experiments and analyze outcomes'
    ],
    requirements: [
      'Experience shipping software products',
      'Comfort with data analysis and user research',
      'Strong communication and facilitation skills'
    ],
    applicationLink: 'https://example.com/jobs/product-manager'
  },
  {
    id: 11,
    title: 'QA Engineer',
    company: 'AfriSoft Solutions',
    location: 'Nakuru',
    shortDescription:
      'Guard release quality with automation and exploratory testing.',
    shortSummary:
      'Design test strategies, expand automation, and keep regression risk low for web apps.',
    responsibilities: [
      'Build and maintain automated test suites',
      'Create and run exploratory test plans',
      'Track defects and collaborate on fixes'
    ],
    requirements: [
      'Experience with Playwright, Cypress, or Selenium',
      'Understanding of CI/CD test integration',
      'Detail-oriented with strong documentation'
    ],
    applicationLink: 'https://example.com/jobs/qa-engineer'
  },
  {
    id: 12,
    title: 'Mobile App Developer',
    company: 'CloudBridge Africa',
    location: 'Kisumu',
    shortDescription: 'Deliver smooth React Native apps for Android and iOS.',
    shortSummary:
      'Collaborate with design and backend to ship performant mobile features and reliable releases.',
    responsibilities: [
      'Build React Native screens and native integrations',
      'Integrate APIs and handle offline states',
      'Prepare builds and support store submissions'
    ],
    requirements: [
      'React Native experience with production apps',
      'Knowledge of mobile performance and debugging',
      'Familiarity with TypeScript is a plus'
    ],
    applicationLink: 'https://example.com/jobs/mobile-developer'
  },
  {
    id: 13,
    title: 'Business Intelligence Analyst',
    company: 'Karibu Data Labs',
    location: 'Remote - Kenya',
    shortDescription:
      'Build dashboards and models that guide business decisions.',
    shortSummary:
      'Model data, automate reporting, and translate metrics into clear recommendations.',
    responsibilities: [
      'Design and maintain BI dashboards',
      'Model data for self-service analytics',
      'Document definitions and data lineage'
    ],
    requirements: [
      'Strong SQL and data modeling skills',
      'Experience with a BI tool (e.g., Power BI, Looker)',
      'Ability to communicate with non-technical stakeholders'
    ],
    applicationLink: 'https://example.com/jobs/bi-analyst'
  },
  {
    id: 14,
    title: 'IT Support Specialist',
    company: 'BlueGrid Technologies',
    location: 'Eldoret',
    shortDescription: 'Support devices, SaaS tools, and network access for staff.',
    shortSummary:
      'Handle tickets, onboard users, and keep endpoints secure and up to date.',
    responsibilities: [
      'Respond to and resolve support tickets',
      'Set up laptops, accounts, and access controls',
      'Document fixes and improve self-service resources'
    ],
    requirements: [
      'Experience with Windows/macOS administration',
      'Familiarity with MDM and identity tools',
      'Customer-service mindset and clear communication'
    ],
    applicationLink: 'https://example.com/jobs/it-support'
  },
  {
    id: 15,
    title: 'Systems Administrator',
    company: 'Apex Kenya Tech',
    location: 'Nairobi',
    shortDescription: 'Maintain servers, backups, and identity services.',
    shortSummary:
      'Keep core systems patched, monitored, and documented while improving reliability.',
    responsibilities: [
      'Manage Linux/Windows servers and backups',
      'Administer identity and access controls',
      'Monitor uptime and capacity trends'
    ],
    requirements: [
      'Experience with virtualization and storage',
      'Scripting skills for automation (e.g., Bash, PowerShell)',
      'Understanding of backup and recovery practices'
    ],
    applicationLink: 'https://example.com/jobs/systems-admin'
  },
  {
    id: 16,
    title: 'Software Engineer',
    company: 'NextWave Systems',
    location: 'Hybrid - Nairobi',
    shortDescription: 'Build reliable platform services used across products.',
    shortSummary:
      'Design, implement, and support services with a focus on performance and maintainability.',
    responsibilities: [
      'Design service APIs and data contracts',
      'Write well-tested code and participate in reviews',
      'Profile and improve performance hot spots'
    ],
    requirements: [
      'Proficiency in a modern backend language',
      'Experience with relational databases',
      'Familiarity with observability practices'
    ],
    applicationLink: 'https://example.com/jobs/software-engineer'
  },
  {
    id: 17,
    title: 'Data Analyst',
    company: 'Savannah Tech',
    location: 'Nakuru',
    shortDescription: 'Analyze product usage data and share clear insights.',
    shortSummary:
      'Build dashboards, investigate trends, and recommend actions based on evidence.',
    responsibilities: [
      'Write SQL queries and build reports',
      'Validate data quality and definitions',
      'Communicate findings to product teams'
    ],
    requirements: [
      'Strong SQL and spreadsheet skills',
      'Experience with visualization tools',
      'Ability to translate data into recommendations'
    ],
    applicationLink: 'https://example.com/jobs/data-analyst'
  },
  {
    id: 18,
    title: 'Network Engineer',
    company: 'BlueGrid Technologies',
    location: 'Mombasa',
    shortDescription: 'Design and maintain secure, high-availability networks.',
    shortSummary:
      'Configure, monitor, and troubleshoot networking for offices and cloud connectivity.',
    responsibilities: [
      'Configure switches, routers, firewalls, and VPNs',
      'Monitor network health and respond to incidents',
      'Document standards and topology changes'
    ],
    requirements: [
      'Strong understanding of networking protocols',
      'Experience with firewall and VPN configuration',
      'Troubleshooting mindset and clear documentation'
    ],
    applicationLink: 'https://example.com/jobs/network-engineer'
  },
  {
    id: 19,
    title: 'Technical Writer',
    company: 'Apex Kenya Tech',
    location: 'Remote - Kenya',
    shortDescription: 'Create clear docs that help teams ship and support products.',
    shortSummary:
      'Own API and product documentation, craft tutorials, and keep knowledge bases current.',
    responsibilities: [
      'Write and maintain API and product documentation',
      'Produce quickstart guides and release notes',
      'Collaborate with engineers and support on accuracy'
    ],
    requirements: [
      'Excellent written communication',
      'Experience documenting software products or APIs',
      'Ability to learn technical domains quickly'
    ],
    applicationLink: 'https://example.com/jobs/technical-writer'
  },
  {
    id: 20,
    title: 'Scrum Master',
    company: 'Savannah Tech',
    location: 'Hybrid - Nairobi',
    shortDescription: 'Facilitate agile ceremonies and unblock delivery teams.',
    shortSummary:
      'Coach teams on agile practices, track progress, and remove impediments to keep sprints on target.',
    responsibilities: [
      'Run daily standups, sprint planning, and retros',
      'Track sprint health and manage team blockers',
      'Partner with product and engineering leads on priorities'
    ],
    requirements: [
      'Hands-on experience as a Scrum Master',
      'Strong communication and facilitation skills',
      'Familiarity with Jira or similar tools'
    ],
    applicationLink: 'https://example.com/jobs/scrum-master'
  }
]

function App() {
  const [searchInput, setSearchInput] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)
  const [cvPanelOpen, setCvPanelOpen] = useState(false)
  const [cvFileName, setCvFileName] = useState('')
  const [cvText, setCvText] = useState('')
  const [analysisDone, setAnalysisDone] = useState(false)
  const [analysisJobId, setAnalysisJobId] = useState(null)
  const [analysisResult, setAnalysisResult] = useState({
    score: 0,
    matched: [],
    gaps: [],
    feedback: [],
    summary: '',
    breakdown: [],
    warnings: []
  })
  const [cvSearchTerm, setCvSearchTerm] = useState('')
  const [analysisDebug, setAnalysisDebug] = useState({
    analysisEntered: false,
    cvTextAvailable: false,
    cvTextLength: 0,
    requirementsCount: 0,
    breakdownBuilt: false,
    scoreCalculated: false,
    analysisError: ''
  })

  const [extractionInfo, setExtractionInfo] = useState({
    fileName: '',
    fileType: '',
    fileSize: 0,
    loaded: false,
    parserRan: false,
    parserCalled: false,
    parserAvailable: false,
    parserLibrary: '',
    workerSrc: '',
    extractionSucceeded: false,
    extractedLength: 0,
    sample: '',
    error: '',
    steps: []
  })
  const [trackModalOpen, setTrackModalOpen] = useState(false)
  const [trackDraft, setTrackDraft] = useState(null)

  useEffect(() => {
    if (cvPanelOpen) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }
    return () => document.body.classList.remove('no-scroll')
  }, [cvPanelOpen])

  const filteredJobs = useMemo(() => {
    const term = searchInput.trim().toLowerCase()
    if (!term) return jobsData
    return jobsData.filter(
      (job) =>
        job.title.toLowerCase().includes(term) ||
        job.company.toLowerCase().includes(term)
    )
  }, [searchInput])

  const handleSearch = () => {
    setSearchInput((value) => value.trim())
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleBack = () => setSelectedJob(null)
  const resetAnalysisState = () => {
    setAnalysisResult({
      score: 0,
      matched: [],
      gaps: [],
      feedback: [],
      summary: '',
      breakdown: [],
      warnings: []
    })
    setAnalysisDebug({
      analysisEntered: false,
      cvTextAvailable: false,
      cvTextLength: 0,
      requirementsCount: 0,
      breakdownBuilt: false,
      scoreCalculated: false,
      analysisError: ''
    })
  }
  const resetCvState = () => {
    setCvPanelOpen(false)
    setCvFileName('')
    setCvText('')
    setAnalysisDone(false)
    setAnalysisJobId(null)
    resetAnalysisState()
  }

  const handleViewJob = (job) => {
    setSelectedJob(job)
    resetCvState()
  }

  const handleApplyNow = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleTrackApplication = (job) => {
    if (!job) return
    setTrackDraft({
      jobTitle: job.title,
      company: job.company,
      jobId: job.id
    })
    setTrackModalOpen(true)
  }

  const handleTrackSave = (payload) => {
    const data = {
      ...payload,
      jobTitle: payload.jobTitle || trackDraft?.jobTitle,
      company: payload.company || trackDraft?.company,
      jobId: payload.jobId ?? trackDraft?.jobId
    }
    addApplication(data)
    setTrackModalOpen(false)
  }

  const handleCloseTrackModal = () => setTrackModalOpen(false)

  const handleOpenCvPanel = () => {
    if (!selectedJob) return
    setCvPanelOpen(true)
    setAnalysisJobId(selectedJob.id)
    setAnalysisDone(false)
    resetAnalysisState()
  }

  const handleCloseCvPanel = () => {
    setCvPanelOpen(false)
  }

  const addWarning = (msg) => {
    setAnalysisResult((prev) => {
      const existing = new Set(prev.warnings || [])
      existing.add(msg)
      return { ...prev, warnings: Array.from(existing) }
    })
  }

  const logStep = (msg) => {
    console.debug('[CV Extract]', msg)
    setExtractionInfo((prev) => ({
      ...prev,
      steps: [...(prev.steps || []), msg]
    }))
  }

  const handleCvUpload = async (e) => {
    const file = e.target.files?.[0]
    setCvFileName(file ? file.name : '')
    setAnalysisDone(false)
    setCvText('')
    resetAnalysisState()
    setExtractionInfo({
      fileName: file ? file.name : '',
      fileType: file ? file.type : '',
      fileSize: file ? file.size : 0,
      loaded: !!file,
      parserRan: false,
      parserCalled: false,
      parserAvailable: false,
      parserLibrary: '',
      workerSrc: '',
      extractionSucceeded: false,
      extractedLength: 0,
      sample: '',
      error: '',
      steps: file ? ['File selected'] : []
    })

    if (!file) {
      logStep('No file provided')
      return
    }
    logStep(`File stored: ${file.name} (${file.type || 'unknown'})`)

    const cleanText = (text) =>
      text
        .toLowerCase()
        .replace(/[\r\n]+/g, ' ')
        .replace(/[^\w+#./-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

    const loadPdfJs = async () => {
      try {
        logStep('Loading PDF.js locally (lazy)')
        if (window.__pdfjsLib) {
          setExtractionInfo((prev) => ({
            ...prev,
            parserLibrary: prev.parserLibrary || 'pdfjs-dist@5.5.207 (local)',
            workerSrc: prev.workerSrc || prev.workerSrc
          }))
          return window.__pdfjsLib
        }

        // Import from bundled dependency so we are offline-safe
        const [mod, workerSrcModule] = await Promise.all([
          import('pdfjs-dist'),
          import('pdfjs-dist/build/pdf.worker.min.mjs?url')
        ])
        const workerSrcUrl = workerSrcModule.default
        mod.GlobalWorkerOptions.workerSrc = workerSrcUrl
        logStep(`PDF.js worker set: ${workerSrcUrl}`)

        window.__pdfjsLib = mod
        setExtractionInfo((prev) => ({
          ...prev,
          parserLibrary: 'pdfjs-dist@5.5.207 (local)',
          workerSrc: workerSrcUrl
        }))
        logStep('PDF.js loaded locally')
        return mod
      } catch (err) {
        logStep(`PDF.js load failed: ${err}`)
        setExtractionInfo((prev) =>
          prev.error
            ? prev
            : { ...prev, error: err.message || String(err), parserLibrary: 'unavailable' }
        )
        return null
      }
    }

    const extractPdfText = async (blob) => {
      setExtractionInfo((prev) => ({ ...prev, parserCalled: true }))
      const pdfjsLib = await loadPdfJs()
      setExtractionInfo((prev) => ({ ...prev, parserAvailable: !!pdfjsLib }))
      if (!pdfjsLib) {
        setExtractionInfo((prev) => ({ ...prev, error: 'Failed to load PDF parser' }))
        return null
      }
      try {
        logStep('Parser function entered')
        setExtractionInfo((prev) => ({ ...prev, parserRan: true }))

        // Always convert to ArrayBuffer/Uint8Array so we pass raw bytes to PDF.js
        const arrayBuffer =
          typeof blob.arrayBuffer === 'function'
            ? await blob.arrayBuffer()
            : await new Response(blob).arrayBuffer()
        logStep('ArrayBuffer read from file')

        const pdf = await pdfjsLib.getDocument({
          data: new Uint8Array(arrayBuffer)
        }).promise
        logStep(`PDF document loaded (${pdf.numPages} pages)`)

        const pageTexts = []
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          const strings = content.items.map((item) => item.str).filter(Boolean).join(' ')
          pageTexts.push(strings)
        }

        const combined = pageTexts.join(' ').trim()
        logStep(`PDF pages extracted, length=${combined.length}`)
        return combined
      } catch (err) {
        logStep(`Parser error: ${err}`)
        setExtractionInfo((prev) =>
          prev.error ? prev : { ...prev, error: err.message || String(err) }
        )
        return null
      }
    }

    const loadText = async () => {
      const isPdf =
        (file.type && file.type.toLowerCase().startsWith('application/pdf')) ||
        file.name.toLowerCase().endsWith('.pdf')

      if (isPdf) {
        logStep('PDF branch entered')
        const pdfText = await extractPdfText(file)
        if (pdfText && pdfText.trim().length > 0) {
          logStep('Extraction succeeded')
          setCvText(cleanText(pdfText))
          setExtractionInfo((prev) => ({
            ...prev,
            extractionSucceeded: true,
            extractedLength: pdfText.length,
            sample: pdfText.slice(0, 500),
            error: ''
          }))
          if (selectedJob) {
            runAnalysis(cleanText(pdfText))
          }
          return
        }
        logStep('Extraction failed or returned empty text')
        addWarning('Failed to extract readable text from PDF')
        setExtractionInfo((prev) => ({
          ...prev,
          extractionSucceeded: false,
          extractedLength: 0,
          sample: '',
          error: 'Failed to extract readable text from PDF'
        }))
        setCvText('')
      } else {
        logStep('PDF branch entered: false (treating as text)')
        const text = await file.text()
        const cleaned = cleanText(text)
        setCvText(cleaned)
        setExtractionInfo((prev) => ({
          ...prev,
          extractionSucceeded: cleaned.length > 0,
          extractedLength: cleaned.length,
          sample: cleaned.slice(0, 500),
          error: cleaned.length ? '' : 'No readable text found in file'
        }))
        if (selectedJob) {
          runAnalysis(cleaned)
        }
      }
    }

    await loadText()
  }

  const runAnalysis = (textOverride) => {
    if (!selectedJob) return
    const reqs = (selectedJob.requirements || []).map((r) => r.trim()).filter(Boolean)
    const cvContent = (textOverride ?? cvText ?? '').trim()
    const cvContentLower = cvContent.toLowerCase()

    setAnalysisJobId(selectedJob.id)
    setAnalysisDebug({
      analysisEntered: true,
      cvTextAvailable: cvContent.length > 0,
      cvTextLength: cvContent.length,
      requirementsCount: reqs.length,
      breakdownBuilt: false,
      scoreCalculated: false,
      analysisError: ''
    })

    const normalizeWord = (w) =>
      w
        .toLowerCase()
        // keep hyphens for things like scikit-learn and fine-grained terms
        .replace(/[^a-z0-9+.#-]/g, '')

    const tokenize = (text) =>
      text
        .toLowerCase()
        .replace(/[^a-z0-9+.#\- ]/g, ' ')
        .split(/\s+/)
        .filter(Boolean)
        .map(normalizeWord)
        .filter(Boolean)

    const stop = new Set(['and', 'or', 'with', 'for', 'to', 'of', 'the', 'a', 'an', 'in', 'on', 'at', 'by', 'be', 'as'])
    const filler = new Set(['experience', 'knowledge', 'understanding', 'familiarity'])
    const coreSkillWhitelist = new Set([
      'python',
      'sql',
      'node.js',
      'nodejs',
      'node',
      'api',
      'backend',
      'authentication',
      'authorization',
      'database',
      'databases',
      'postgresql',
      'mysql',
      'sqlite',
      'mongodb',
      'pandas',
      'numpy',
      'scikit-learn',
      'tensorflow',
      'keras',
      'matplotlib',
      'power bi',
      'machine learning',
      'data analysis',
      'ml libraries'
    ])

    const weightMap = {
      python: 3,
      sql: 3,
      'node.js': 3,
      nodejs: 3,
      node: 3,
      api: 2,
      'rest api': 2,
      backend: 2,
      authentication: 3,
      authorization: 3,
      auth: 3,
      jwt: 2,
      database: 2,
      databases: 2,
      postgresql: 2,
      mysql: 2,
      sqlite: 2,
      mongodb: 2,
      pandas: 3,
      numpy: 3,
      'scikit-learn': 3,
      tensorflow: 3,
      keras: 3,
      matplotlib: 2,
      'power bi': 3,
      'machine learning': 3,
      'data analysis': 2,
      'ml libraries': 3
    }

    const synonymMap = {
      backend: ['backend', 'server-side', 'server', 'django', 'flask', 'fastapi', 'express', 'nestjs', 'spring'],
      'node.js': ['node', 'nodejs', 'node.js', 'express', 'nestjs'],
      python: ['python', 'django', 'flask', 'fastapi'],
      sql: ['sql', 'postgresql', 'mysql', 'sqlite', 'mariadb'],
      database: ['database', 'databases', 'postgresql', 'mysql', 'sqlite', 'mongodb'],
      api: ['api', 'apis', 'rest', 'rest api', 'api development', 'graphql'],
      authentication: ['authentication', 'auth', 'authorization', 'oauth', 'jwt', 'login', 'login systems'],
      authorization: ['authorization', 'authz', 'oauth', 'rbac', 'jwt'],
      jwt: ['jwt', 'json web token'],
      pandas: ['pandas'],
      numpy: ['numpy'],
      'scikit-learn': ['scikit-learn', 'scikitlearn'],
      tensorflow: ['tensorflow', 'tf'],
      keras: ['keras'],
      matplotlib: ['matplotlib', 'mpl'],
      'power bi': ['power bi', 'powerbi'],
      'machine learning': ['machine learning', 'ml'],
      'data analysis': ['data analysis', 'data analytics', 'analytics'],
      'ml libraries': ['ml libraries', 'common ml libraries', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'keras', 'matplotlib']
    }

    const canonicalForTerm = (term) => {
      const lower = term.toLowerCase()
      for (const [canon, list] of Object.entries(synonymMap)) {
        if (list.includes(lower)) return canon
      }
      return lower
    }

    if (!cvContent) {
      const warning = 'Could not extract readable text from this CV.'
      setAnalysisResult({
        score: 0,
        matched: [],
        gaps: [],
        feedback: [],
        summary: '',
        breakdown: [],
        warnings: [warning]
      })
      setAnalysisDone(false)
      setAnalysisDebug((prev) => ({ ...prev, analysisError: warning }))
      return
    }

    const cvTokens = tokenize(cvContent)
    const cvTokenSet = new Set(cvTokens)

    const warnings = []
    if (cvContent.length < 15) {
      warnings.push('CV text is empty or too short to analyze.')
    }
    if (!reqs.length) {
      warnings.push('No requirements found for this job.')
    }

    const breakdown = reqs.map((req) => {
      const reqLower = req.toLowerCase()
      const rawWords = reqLower.replace(/[^a-z0-9+.# -]/g, ' ').split(/\s+/).filter(Boolean)

      const coreSkills = new Set()
      const fillerWords = []

      // phrase detection first so multi-word skills are kept
      Object.entries(synonymMap).forEach(([canon, list]) => {
        list.forEach((syn) => {
          if (syn.includes(' ') || syn.includes('-')) {
            if (reqLower.includes(syn)) {
              coreSkills.add(canon)
            }
          }
        })
      })

      rawWords.forEach((w) => {
        const canon = canonicalForTerm(w)
        // First, keep any whitelisted or weighted skill, even if it looks like a filler/stop word
        if (coreSkillWhitelist.has(canon) || weightMap[canon]) {
          coreSkills.add(canon)
          return
        }
        if (filler.has(canon) || stop.has(canon)) {
          fillerWords.push(canon)
          return
        }
        // Check if word matches any synonym (single-word)
        for (const [canonKey, list] of Object.entries(synonymMap)) {
          if (list.includes(canon)) {
            coreSkills.add(canonKey)
            return
          }
        }
      })

      // Add OR handling: if requirement contains "or", split chunks and keep union
      if (reqLower.includes(' or ')) {
        reqLower
          .split(/\s+or\s+/)
          .forEach((chunk) => {
            const chunkWords = chunk.replace(/[^a-z0-9+.# -]/g, ' ').split(/\s+/)
            chunkWords.forEach((w) => {
              const canon = canonicalForTerm(w)
              if (weightMap[canon]) coreSkills.add(canon)
            })
          })
      }

      // Build evidence per skill
      const evidence = []
      let matchedWeight = 0
      let totalWeight = 0

      coreSkills.forEach((skill) => {
        const synonyms = synonymMap[skill] || [skill]
        const weight = weightMap[skill] || 1
        totalWeight += weight
        const hit = synonyms.some((syn) => cvContentLower.includes(syn))
        if (hit) matchedWeight += weight
        evidence.push({
          skill,
          synonyms,
          weight,
          hit
        })
      })

      const coverage = totalWeight > 0 ? matchedWeight / totalWeight : 0
      let result = 'missing'
      if (coverage >= 0.7) result = 'matched'
      else if (coverage >= 0.3) result = 'partial'

      return {
        requirement: req,
        coreSkills: Array.from(coreSkills),
        fillerWords,
        evidence,
        coverage,
        result
      }
    })

    const matchedReqs = breakdown.filter((b) => b.result === 'matched').map((b) => b.requirement)
    const partialReqs = breakdown.filter((b) => b.result === 'partial').map((b) => b.requirement)
    const gaps = breakdown.filter((b) => b.result === 'missing').map((b) => b.requirement)

    const total = reqs.length || 1
    const scoreRaw =
      (matchedReqs.length * 1 + partialReqs.length * 0.5) / total * 100
    const mockScore = Math.max(0, Math.min(100, Math.round(scoreRaw)))

    const summary =
      mockScore >= 70
        ? 'Your CV aligns well with this role, with most key skills covered.'
        : mockScore >= 40
          ? 'Your CV meets some requirements, but there are important gaps.'
          : "Your CV does not strongly match this role's core requirements."

    setAnalysisResult({
      score: mockScore,
      matched: matchedReqs.length ? matchedReqs : ['No clear matches found'],
      gaps: gaps.length ? gaps : ['All requirements appear covered'],
      feedback: [
        'Tailor your CV summary to highlight the top requirements for this job.',
        'Quantify your recent achievements with metrics.',
        'Add or emphasize tooling mentioned in the requirements.'
      ],
      summary,
      breakdown,
      warnings
    })
    setAnalysisDebug((prev) => ({
      ...prev,
      breakdownBuilt: true,
      scoreCalculated: true,
      analysisError: warnings.length ? warnings.join('; ') : ''
    }))
    setAnalysisDone(true)
  }

  const handleAnalyze = () => {
    if (!selectedJob) return
    runAnalysis()
  }

  const scoreClass = () => {
    if (!analysisDone) return ''
    if (analysisResult.score < 40) return 'score-weak'
    if (analysisResult.score < 70) return 'score-moderate'
    return 'score-strong'
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero__text">
          <h1>ApplyTrail</h1>
          <p className="subhead">Find Kenya tech roles worth applying to.</p>
        </div>
        <div className="search search--below">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </header>

      <main className="content">
        {!selectedJob && (
          <section aria-label="Job listings">
            {filteredJobs.length ? (
              <div className="cards">
                {filteredJobs.map((job) => (
                  <article key={job.id} className="card">
                    <div className="card__header">
                      <h2>{job.title}</h2>
                      <p className="company">{job.company}</p>
                      <p className="location">{job.location}</p>
                    </div>
                    <p className="summary">{job.shortDescription}</p>
                    <button className="ghost" onClick={() => handleViewJob(job)}>
                      View Job
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty">
                <p>No jobs found. Try a different keyword.</p>
              </div>
            )}
          </section>
        )}

        {selectedJob && (
          <section className="detail" aria-label="Job detail">
            <button className="ghost back" onClick={handleBack}>
              &larr; Back to jobs
            </button>
            <div className="detail__card">
              <header className="detail__header">
                <h1>{selectedJob.title}</h1>
                <p className="company">{selectedJob.company}</p>
                <p className="location">{selectedJob.location}</p>
              </header>

              <div className="detail__section">
                <h3>Summary</h3>
                <p>{selectedJob.shortSummary}</p>
              </div>

              <div className="detail__section">
                <h3>Responsibilities</h3>
                <ul>
                  {selectedJob.responsibilities.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="detail__section">
                <h3>Requirements</h3>
                <ul>
                  {selectedJob.requirements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="actions">
                <button
                  className="primary"
                  onClick={() => handleApplyNow(selectedJob.applicationLink)}
                >
                  Apply Now
                </button>
                <button className="primary" onClick={handleOpenCvPanel}>
                  Check CV Fit
                </button>
                <button className="primary" onClick={() => handleTrackApplication(selectedJob)}>
                  Track Application
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      <TrackModal
        open={trackModalOpen}
        onClose={handleCloseTrackModal}
        onSave={handleTrackSave}
        defaultValues={trackDraft}
      />

      <footer className="footer">
        <p>© 2026 ApplyTrail</p>
      </footer>

      {/* CV Match side panel */}
      <div className={`sidepanel-overlay ${cvPanelOpen ? 'is-open' : ''}`} onClick={handleCloseCvPanel} />
      <aside className={`sidepanel ${cvPanelOpen ? 'is-open' : ''}`} aria-label="CV match panel">
        <div className="sidepanel__header">
          <h2>CV Match{selectedJob ? ` - ${selectedJob.title}` : ''}</h2>
          <button
            type="button"
            className="sidepanel__close"
            onClick={handleCloseCvPanel}
            aria-label="Close CV panel"
          >
            X
          </button>
        </div>
        <div className="sidepanel__body">
          <div className="sidepanel__section">
            <p className="sidepanel__label">Upload CV (PDF or DOC)</p>
            <label className="upload-box">
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvUpload} />
              <span>{cvFileName || 'Choose a file'}</span>
            </label>
            <button className="primary fullwidth" onClick={handleAnalyze} disabled={!cvFileName}>
              Analyze Match
            </button>
          </div>

          <div className="sidepanel__section">
            <p className="sidepanel__label">Match score</p>
            <div className={`score-box ${scoreClass()}`}>
              {analysisDone ? `${analysisResult.score}% match` : '�'}
            </div>
            <p className="score-summary">
              {analysisDone
                ? analysisResult.summary
                : 'Upload a CV and analyze to see how it fits this role.'}
            </p>
          </div>

          <div className="sidepanel__section">
            <p className="sidepanel__label">Matched Skills</p>
            <ul className="list-tight">
              {analysisDone
                ? analysisResult.matched.map((item, i) => <li key={i}>{item}</li>)
                : <li>Pending analysis</li>}
            </ul>
          </div>

          <div className="sidepanel__section">
            <p className="sidepanel__label">Missing Skills / Gaps</p>
            <ul className="list-tight">
              {analysisDone
                ? analysisResult.gaps.map((item, i) => <li key={i}>{item}</li>)
                : <li>Pending analysis</li>}
            </ul>
          </div>

          <div className="sidepanel__section">
            <p className="sidepanel__label">Areas for Improvement</p>
            <ul className="list-tight">
              {analysisDone
                ? analysisResult.feedback.map((item, i) => <li key={i}>{item}</li>)
                : <li>Pending analysis</li>}
            </ul>
          </div>

          <div className="sidepanel__debug always-on">
            <p className="debug-title">Debug CV Matching Logic</p>

            <div className="debug-block">
              <p className="debug-label">Job context</p>
              <p className="debug-text">
                {selectedJob
                  ? `Job ID: ${selectedJob.id} | Title: ${selectedJob.title}`
                  : 'No job selected'}
              </p>
            </div>

          <div className="debug-block">
            <p className="debug-label">CV data</p>
            <p className="debug-text">File: {extractionInfo.fileName || 'n/a'}</p>
            <p className="debug-text">Type: {extractionInfo.fileType || 'n/a'}</p>
            <p className="debug-text">Size: {extractionInfo.fileSize || 0} bytes</p>
            <p className="debug-text">Loaded: {extractionInfo.loaded ? 'true' : 'false'}</p>
            <p className="debug-text">PDF branch entered: {extractionInfo.steps?.some((s) => s.includes('PDF branch entered')) ? 'true' : 'false'}</p>
            <p className="debug-text">Parser called: {extractionInfo.parserCalled ? 'true' : 'false'}</p>
            <p className="debug-text">Parser available: {extractionInfo.parserAvailable ? 'true' : 'false'}</p>
            <p className="debug-text">Parser lib: {extractionInfo.parserLibrary || 'n/a'}</p>
            <p className="debug-text">Worker src: {extractionInfo.workerSrc || 'n/a'}</p>
            <p className="debug-text">Parser ran: {extractionInfo.parserRan ? 'true' : 'false'}</p>
            <p className="debug-text">Extraction succeeded: {extractionInfo.extractionSucceeded ? 'true' : 'false'}</p>
            <p className="debug-text">Extracted length: {extractionInfo.extractedLength}</p>
            <p className="debug-text">Error: {extractionInfo.error || 'none'}</p>
            <p className="debug-text">Steps:</p>
            <ul className="debug-list">
              {(extractionInfo.steps || []).length
                ? extractionInfo.steps.map((s, i) => <li key={i}>{s}</li>)
                : <li>No steps logged</li>}
            </ul>
            <pre className="debug-pre">
              {extractionInfo.sample || 'No CV text extracted or file not loaded.'}
            </pre>
          </div>

          <div className="debug-block">
            <p className="debug-label">Analysis debug</p>
            <p className="debug-text">Analysis entered: {analysisDebug.analysisEntered ? 'true' : 'false'}</p>
            <p className="debug-text">CV text stored for matching: {analysisDebug.cvTextAvailable ? 'true' : 'false'}</p>
            <p className="debug-text">CV text length to matcher: {analysisDebug.cvTextLength}</p>
            <p className="debug-text">Requirements passed to matcher: {analysisDebug.requirementsCount}</p>
            <p className="debug-text">Breakdown built: {analysisDebug.breakdownBuilt ? 'true' : 'false'}</p>
            <p className="debug-text">Score calculation run: {analysisDebug.scoreCalculated ? 'true' : 'false'}</p>
            <p className="debug-text">Analysis error: {analysisDebug.analysisError || 'none'}</p>
          </div>

            <div className="debug-block">
              <p className="debug-label">Requirements (raw)</p>
              <pre className="debug-pre">
                {selectedJob ? (selectedJob.requirements || []).join('\n') : 'No job selected'}
              </pre>
            </div>

            <div className="debug-block">
              <p className="debug-label">Extracted CV text (searchable)</p>
              <input
                type="text"
                placeholder="Search CV text e.g. python, sql, api"
                value={cvSearchTerm}
                onChange={(e) => setCvSearchTerm(e.target.value)}
                className="debug-input"
              />
              <p className="debug-text">
                Search hits: {cvSearchTerm
                  ? (cvText.toLowerCase().split(cvSearchTerm.toLowerCase()).length - 1)
                  : 0}
              </p>
              <pre className="debug-pre debug-pre-scroll">
                {cvText || 'No CV text available.'}
              </pre>
            </div>

            <div className="debug-block">
              <p className="debug-label">Analysis debug</p>
              <p className="debug-text">Analysis entered: {analysisDebug.analysisEntered ? 'true' : 'false'}</p>
              <p className="debug-text">CV text stored for matching: {analysisDebug.cvTextAvailable ? 'true' : 'false'}</p>
              <p className="debug-text">CV text length to matcher: {analysisDebug.cvTextLength}</p>
              <p className="debug-text">Requirements passed to matcher: {analysisDebug.requirementsCount}</p>
              <p className="debug-text">Breakdown built: {analysisDebug.breakdownBuilt ? 'true' : 'false'}</p>
              <p className="debug-text">Score calculation run: {analysisDebug.scoreCalculated ? 'true' : 'false'}</p>
              <p className="debug-text">Analysis error: {analysisDebug.analysisError || 'none'}</p>
            </div>

            <div className="debug-block">
              <p className="debug-label">CV warnings / errors</p>
              <ul className="debug-list">
                {(analysisResult.warnings || []).length
                  ? analysisResult.warnings.map((w, i) => <li key={i}>{w}</li>)
                  : <li>No warnings</li>}
              </ul>
            </div>

            <div className="debug-block">
              <p className="debug-label">Requirement breakdown</p>
              <div className="debug-requirements">
                {(analysisResult.breakdown || []).length
                  ? analysisResult.breakdown.map((b, i) => (
                    <div key={i} className={`debug-req-card debug-req-${b.result}`}>
                      <p className="debug-req-title">Requirement:</p>
                      <p className="debug-text">{b.requirement}</p>
                      <p className="debug-req-title">Core skills:</p>
                      <p className="debug-text">{(b.coreSkills || []).join(', ') || 'None'}</p>
                      <p className="debug-req-title">Filler words:</p>
                      <p className="debug-text">{(b.fillerWords || []).join(', ') || 'None'}</p>
                      <p className="debug-req-title">Evidence (weighted):</p>
                      <ul className="debug-list">
                        {(b.evidence || []).length
                          ? b.evidence.map((ev, idx) => (
                            <li key={idx}>
                              {ev.skill} (w={ev.weight}) → {ev.hit ? 'hit' : 'miss'} via [{ev.synonyms.join(', ')}]
                            </li>
                          ))
                          : <li>None</li>}
                      </ul>
                      <p className="debug-text">Coverage: {(b.coverage * 100).toFixed(0)}%</p>
                      <p className="debug-req-title">Result:</p>
                      <p className="debug-text debug-result">{b.result}</p>
                    </div>
                  ))
                  : <p className="debug-text">No breakdown data.</p>}
              </div>
            </div>

            <div className="debug-block">
              <p className="debug-label">Score calculation</p>
              <p className="debug-text">
                Total requirements: {analysisResult.breakdown?.length || 0}
              </p>
              <p className="debug-text">
                Matched: {analysisResult.breakdown?.filter((b) => b.result === 'matched').length || 0}
              </p>
              <p className="debug-text">
                Partial: {analysisResult.breakdown?.filter((b) => b.result === 'partial').length || 0}
              </p>
              <p className="debug-text">
                Final score: {analysisResult.score ?? 0}%
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default App

