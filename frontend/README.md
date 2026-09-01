# 🚀 Enterprise AI Copilot

### AI-Powered Enterprise Knowledge & Code Intelligence Platform

Enterprise AI Copilot is a full-stack **Retrieval-Augmented Generation (RAG)** platform designed to help teams search, understand, and interact with organizational knowledge and software repositories using natural language.

Instead of manually searching through documents or hundreds of source-code files, users can connect enterprise knowledge sources and ask questions through an AI-powered conversational interface.

The platform combines **FastAPI, Next.js, Gemini, Qdrant, MongoDB, FastEmbed, and GitHub integration** to provide context-aware answers with source references.

---

## ✨ Key Features

### 🤖 Enterprise RAG Assistant

Upload enterprise documents and interact with them using natural-language questions.

- Document parsing
- Intelligent chunking
- Semantic retrieval
- Vector search
- Context-aware AI responses
- Source references
- Persistent conversation history

---

### 🐙 GitHub Agent

Connect a GitHub repository and allow the AI to understand the codebase.

The GitHub Agent can:

- Connect public GitHub repositories
- Index supported source-code files
- Generate code embeddings
- Search repository knowledge semantically
- Answer codebase-specific questions
- Display source file references
- Open referenced files directly on GitHub
- Re-index repositories when code changes
- Delete old or failed repository indexes
- Display repository indexing statistics
- Track the last synchronization time

Example questions:

```text
Where is authentication implemented?

How does repository indexing work?

Explain the chat API.

Where is Qdrant used?

How does the frontend communicate with the backend?
```

---

## 🧠 How It Works

```text
                   ┌──────────────────────┐
                   │        User          │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │   Next.js Frontend   │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │   FastAPI Backend    │
                   └──────────┬───────────┘
                              │
               ┌──────────────┴──────────────┐
               │                             │
               ▼                             ▼
      ┌─────────────────┐           ┌─────────────────┐
      │  MongoDB Atlas  │           │  Qdrant Cloud   │
      │                 │           │                 │
      │ Users           │           │ Embeddings      │
      │ Agents          │           │ Document chunks │
      │ Documents       │           │ GitHub chunks   │
      │ Repositories    │           │ Vector metadata │
      │ Chat History    │           │                 │
      └─────────────────┘           └────────┬────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │ Gemini LLM      │
                                    │ Answer          │
                                    │ Generation      │
                                    └─────────────────┘
```

---

# 🔍 RAG Pipeline

The core retrieval pipeline works as follows:

```text
Document / GitHub Repository
            ↓
       Parse Content
            ↓
       Text Chunking
            ↓
      FastEmbed Model
            ↓
     384-D Embeddings
            ↓
       Qdrant Cloud
            ↓
       User Question
            ↓
    Query Embedding
            ↓
    Semantic Retrieval
            ↓
      Relevant Chunks
            ↓
        Gemini LLM
            ↓
   Context-Aware Answer
            ↓
     Source References
```

---

# 🐙 GitHub Repository Indexing

When a user connects a GitHub repository:

```text
GitHub Repository
        ↓
Clone Repository
        ↓
Detect Supported Files
        ↓
Read Source Code
        ↓
Chunk Source Files
        ↓
Generate Embeddings
        ↓
Store Vectors in Qdrant
        ↓
Store Repository Metadata
        ↓
Repository → Indexed
```

Each indexed code chunk contains metadata such as:

```json
{
  "agent_id": "agent-uuid",
  "repository_id": "repository-uuid",
  "file_path": "backend/api/chat.py",
  "language": "python",
  "chunk_index": 5,
  "source_type": "github"
}
```

This allows retrieval to remain isolated to the selected agent and repository.

---

# 🔄 Repository Re-Indexing

Repositories can be synchronized again when the source code changes.

```text
Click Re-index
      ↓
Identify Repository
      ↓
Delete Previous Qdrant Vectors
      ↓
Clone Latest Repository
      ↓
Parse + Chunk Code
      ↓
Generate New Embeddings
      ↓
Store Updated Vectors
      ↓
Update MongoDB Metadata
      ↓
Update Last Synced Time
```

This prevents old vectors from being mixed with the latest repository content.

---

# 🗑️ Repository Deletion

Users can remove repositories that are no longer required.

Deletion removes:

```text
Repository
    │
    ├── MongoDB repository metadata
    │
    └── Qdrant repository vectors
```

This is particularly useful for removing failed, outdated, or duplicate indexes.

---

# 💬 Persistent AI Chat

The application supports persistent repository and document conversations.

Chat messages are stored with their scope so conversations can be associated with the appropriate:

- Agent
- Document
- Repository
- User

Refreshing the application therefore does not automatically remove the conversation history.

---

# 🔗 Source References

AI responses include the sources used during retrieval.

For GitHub repositories, references can contain:

- File path
- Programming language
- Chunk information
- Relevance information
- GitHub source URL

Users can open the referenced source file directly on GitHub.

This improves answer transparency and makes generated responses easier to verify.

---

# 🏗️ Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- Lucide React

## Backend

- FastAPI
- Python
- REST APIs
- JWT Authentication
- Git repository processing

## AI / RAG

- Google Gemini
- FastEmbed
- `sentence-transformers/all-MiniLM-L6-v2`
- Retrieval-Augmented Generation
- Semantic Search
- Prompt Engineering

## Databases

### MongoDB Atlas

Stores application and operational data:

- Users
- Agents
- Document metadata
- Repository metadata
- Chat history

### Qdrant Cloud

Stores:

- 384-dimensional embeddings
- Document chunks
- GitHub source-code chunks
- Retrieval metadata

---

# 🔐 Authentication

The platform uses JWT-based authentication.

```text
Login
  ↓
Credentials Verified
  ↓
JWT Generated
  ↓
Frontend Stores Token
  ↓
Authorization: Bearer <token>
  ↓
Protected FastAPI Routes
```

Protected operations include repository indexing, document access, chat, re-indexing, and deletion.

---

# 🗄️ Data Storage Architecture

| Data | Storage |
|---|---|
| Users | MongoDB Atlas |
| Shared AI Agents | MongoDB Atlas |
| Document metadata | MongoDB Atlas |
| Repository metadata | MongoDB Atlas |
| Chat history | MongoDB Atlas |
| Document embeddings | Qdrant Cloud |
| GitHub code embeddings | Qdrant Cloud |
| Chunk metadata | Qdrant Cloud |
| Source code | GitHub |
| Authentication token | Browser localStorage |
| Selected agent | Browser localStorage |
| Selected document | Browser localStorage |
| Selected repository | Browser localStorage |

---

# 📁 Project Structure

```text
Enterprise-AI-Copilot/
│
├── backend/
│   ├── api/
│   │   ├── auth.py
│   │   ├── chat.py
│   │   ├── documents.py
│   │   └── github.py
│   │
│   ├── database/
│   │   └── mongodb.py
│   │
│   ├── services/
│   │   ├── chat_service.py
│   │   ├── chunker.py
│   │   ├── github_service.py
│   │   ├── qdrant_service.py
│   │   └── chat_history_service.py
│   │
│   ├── utils/
│   │   └── auth.py
│   │
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/
│   │   │   ├── github/
│   │   │   ├── chat/
│   │   │   └── login/
│   │   │
│   │   ├── components/
│   │   │   └── github/
│   │   │
│   │   ├── lib/
│   │   └── services/
│   │
│   └── package.json
│
└── README.md
```

---

# ⚙️ Local Setup

## 1. Clone Repository

```bash
git clone <repository-url>
cd Enterprise-AI-Copilot
```

---

## 2. Backend Setup

```bash
cd backend

python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create:

```text
backend/.env
```

Configure the environment variables required by your deployment, such as:

```env
MONGODB_URI=
QDRANT_URL=
QDRANT_API_KEY=
QDRANT_COLLECTION=
GEMINI_API_KEY=
JWT_SECRET=
FRONTEND_URL=
```

Never commit real API keys or credentials.

Start FastAPI:

```bash
uvicorn main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

---

## 3. Frontend Setup

```bash
cd frontend

npm install
```

Create:

```text
frontend/.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Run:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

# ☁️ Deployment

The production architecture uses:

```text
Frontend
   │
   └── Vercel
         │
         ▼
Backend API
   │
   └── Render
         │
         ├── MongoDB Atlas
         ├── Qdrant Cloud
         ├── Gemini API
         └── GitHub
```

### Frontend

Deployed using **Vercel**.

Production frontend configuration:

```env
NEXT_PUBLIC_API_URL=<RENDER_BACKEND_URL>
```

### Backend

Deployed using **Render**.

Sensitive credentials such as Gemini, MongoDB, Qdrant, and JWT secrets are stored as backend environment variables rather than exposed to the frontend.

---

# 🔒 Security

- JWT-based authentication
- Protected API routes
- Agent-scoped retrieval
- Repository-scoped vector search
- Document-scoped vector search
- Environment-based secrets
- CORS configuration
- No API keys exposed to the browser
- Source-aware RAG responses

---

# 🎯 Problem Statement

Enterprise knowledge is often distributed across documents, repositories, and internal systems.

Developers and team members waste significant time:

- Searching through large repositories
- Finding implementation details
- Reading unfamiliar codebases
- Searching internal documentation
- Locating relevant source files
- Understanding relationships between different parts of a system

Enterprise AI Copilot provides a unified conversational interface over this knowledge.

---

# 💡 Future Improvements

- GitHub webhook-based automatic synchronization
- GitHub private repository authentication
- GitHub commit-aware incremental indexing
- Hybrid BM25 + vector retrieval
- Cross-encoder reranking
- Query rewriting
- Slack integration
- Jira integration
- Notion integration
- Confluence integration
- Google Drive integration
- Role-based access control
- RAG evaluation dashboard
- Repository analytics
- Streaming AI responses
- Multi-agent workflows

---

# 👩‍💻 Contributors

Built as an Enterprise AI / Developer Tools project focused on applying Retrieval-Augmented Generation to real-world organizational knowledge and software repositories.

---

# ⭐ Support

If you find the project useful, consider giving the repository a ⭐.

Contributions, suggestions, and feedback are welcome.