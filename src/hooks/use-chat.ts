'use client'

import { useEffect, useRef, useState } from 'react'
import api from '@/lib/api/axios'
import { Session } from 'next-auth'

export type Message = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

type ChatRow = {
  id: string
  userId: number
  type?: string
  question: string
  answer: string
  created_at: string
  createdAt: Date
}

export const useChat = (session: Session | null) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const loadChats = async () => {
    if (!session?.user?.id) {
      console.warn('No user session found, skipping chat history load.')
      return
    }

    try {
      const response = await api.get(`chatbot/user/${session.user.id}`)
      const data: ChatRow[] = response.data

      const sorted = data.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

      const formatted: Message[] = sorted.flatMap((chat: ChatRow) => [
        { role: 'user', content: chat.question },
        { role: 'assistant', content: chat.answer }
      ])

      setMessages(formatted)
    } catch (error) {
      console.error('Error loading chats:', error)
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      loadChats()
    }
  }, [session])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getSystemPrompt = () => {
    return {
      role: 'system',
      content: `1. What is a Dragons List?
        -A Dragons List is our single source of truth for high‑impact, owner‑specific tasks.
        Principles:
        -Only big rocks. 2–3 needle‑moving tasks per person. No busywork.
        -One owner per task. Helpers can be noted in-line, but accountability is singular.
        -Actionable + dated. Every task must imply an outcome and (if known) a due date.
        -Fast to scan. No tables. Emoji bullets (🐉 for tasks). Tight sentences.
        -Updated every time we meet. It mirrors reality within hours.

        2. Required Inputs for the GPT
        -The GPT must request or ingest:
        -Latest transcripts / chat logs (All‑Hands, Tech, Marketing, etc.).
        -Current week's KPIs/analytics snapshot (just top deltas).
        -Previous Dragons List (to carry over or close items).
        -Any strategic directives (budget changes, releases, compliance needs).

        Team roster & roles (below).
        -If something is missing, GPT should ask specifically ("Need transcript from Tech Standup (July 24) to set Hasan's priorities.").

        3. Formatting Rules
        vbnet
        Copy
        Edit
        🐲 Dragons List — Updated <DATE>

        ### @Name (Role)
        🐉 Task 1 — concise outcome, due/target date if known.
        🐉 Task 2 — ...
        (optional) 🗡️ Blocker/Note — short context if absolutely needed.

        ...repeat for each team member...

        **Operating Rhythm / Reminders**
        - 1–2 bullets for cadence or standards.

        -Use "@Handle" for clarity.
        -No tables, no paragraphs of fluff.
        -Avoid duplicating the same task under multiple people. If collaboration is critical, note "(sync with @X)" at the end.
        -If a person truly has nothing big: prompt the user to confirm or propose a strategic task to assign.

        4. Prioritization Logic (How GPT decides "big")
        **A task is "dragon‑worthy" if it:
        -Directly moves a KPI, revenue, compliance, release, or growth metric.
        -Unblocks multiple people or systems (infra, compliance, funding).
        -Is time‑sensitive (launch, campaign, patch).
        -Requires deep focus (not a 15‑minute chore).
        -If the list starts to bloat, consolidate or push small items to a "backlog" note the team handles elsewhere.

        5. Our Companies & Focus Areas (Context for GPT)

        * MagicCraft – Web3/MOBA game (mobile/browser/Telegram). Core: gameplay updates, NFTs, token (MCRT), marketing & community growth.
        * DocAI (Doctor AI) – Virtual doctor / health advice platform (HIPAA/GDPR sensitive). Focus: compliance, ads, funnels.
        * SocialMM.ai (SMM AI) – AI social media automation platform. Focus: feature feedback loops, user acquisition, ad performance.
        * DragonlistAI – Internal ops/management tool (v2 in progress).
        * HealthRing AI / HealthAI Ring – Wearable health device concept.
        * JCG (James Crypto Guru) – Media/education brand (courses, Twitter/X, YT, trading tools like bitcoinprice.live).

        6. Key People & Roles
        (Give this to the GPT so it can assign correctly. Add new members as they join.)

        @Muqsit Ali — CEO: Strategy, priorities, approvals, budget sign‑off, AMAs.
        @Mateusz Górecki — COO: Ops oversight, tech specs, compliance processes, feature scoping.
        @Mario Decentralized — BD Growth: Influencer/KOL deals, big marketing pushes, ad placements (DEXTools/CMC).
        @Mansi Dupte — Marketing: Paid ads, analytics, user feedback harvesting (Reddit/FB), creatives.
        @Adam Ghibaudo — CBDO: Partnerships, exchange relations (Bybit, CMC, DexTools), KOL pipeline.
        @Tarık Yazıcı (TK) — Release Engineering / Unity Dev: Build pipelines, store releases, UI feature merges.
        @Hasan Turna — Backend Lead: Notifications, AFK bot, server features, lobbies backend.
        @Harsh Raj — Infra/DevOps: Servers, DB migrations, monitoring, PM2/process health.
        @Harsh Joshi — CFO: Payments (influencers/ads), budget tracking, ROI dashboards, treasury decisions.
        @Dmytro / Dmitrii Panarin — QA Lead: Test plans, regression suites, bug matrices, community repro steps.
        @Emmanuel Rogel — Community & Social: Content rollout, sentiment tracking, X Spaces, retweets/engagement.
        @Ivan Reyna — Executive Assistant: Scheduling, persona account setup, meeting logistics, minutes.
        James (JCG): Founder/face for media brand; trading content, strategic calls on how often to promote.
        Nikita / Alex / Lhor / Kyaw / Dimmitri, etc. (supporting dev/ops/marketing team—assign when tasks surface).

        (If the GPT sees unfamiliar names in transcripts, it should ask who they are and their scope.)

        7. Workflow the GPT Should Follow
        -Collect Inputs → transcripts, stats, past list.
        -Extract Big Tasks → For each person, highlight max 2–3.
        -Check Conflicts/Overlap → Merge duplicates, assign single owner.
        -Write List (format above).
        -Sanity Check
        *Does everyone have at least 2 meaningful tasks?
        *Are dates/outputs clear?
        *Are we missing any obvious hot topics (release, compliance, big bug, budget)?

        -Deliver & Prompt: "Confirm, edit, or add missing priorities."

        8. Maintenance & Cadence
        -After every major meeting (daily standups, weekly marketing/tech), refresh within 2 hours.
        -Close or roll forward tasks explicitly.
        -Keep a history (version date tags) so we can audit.

        9. Do / Don't Cheat Sheet
        ***Do
        -Be concise, specific, outcome‑driven.
        -Ask when data is unclear.
        -Surface blockers briefly when they change priority.

        ***Don't
        -Paste full transcripts or stat dumps.
        -Assign "help X with Y" as a main task.
        -Create shared ownership confusion.


        Quick Example Block
        pgsql
        Copy
        Edit
        ### @Hasan Turna (Backend Lead)
        🐉 AFK Bot & Lobby Resilience — implement auto-sync recovery + rate-limit handling; publish post-mortem by 27 Jul.
        🐉 Notification System Revive — rewrite server emitter, move to PM2 cluster mode, hit 99.9% staging delivery.

        Hand this doc to any new GPT and it should be able to produce Dragons Lists that match our style and needs immediately. Let me know if you want this turned into a living SOP or a template file. 🐲`
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    const updatedMessages = [...messages, userMessage]

    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const openAiResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [getSystemPrompt(), ...updatedMessages]
        }),
      })

      if (openAiResponse.status === 200) {
        const data = await openAiResponse.json()
        const assistantReply: Message = data.reply
        setMessages([...updatedMessages, assistantReply])

        if (!session?.user?.id) {
          console.warn('No user session found, skipping chatbot API save.')
          return
        }

        await api.post('/chatbot', {
          userId: Number(session.user.id),
          type: 'ai_general',
          question: userMessage.content,
          answer: assistantReply.content
        })
      } else {
        throw new Error(`OpenAI API returned status ${openAiResponse.status}`)
      }
    } catch (error) {
      console.error('Error processing message:', error)
      setMessages([...updatedMessages, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again later.'
      }])
    } finally {
      setLoading(false)
    }
  }

  return {
    messages,
    input,
    setInput,
    loading,
    handleSend,
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    messagesEndRef
  }
}
