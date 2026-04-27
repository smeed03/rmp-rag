# Rate My Professor RAG Assistant

## 📖 Project Overview
This project is a Retrieval-Augmented Generation (RAG) web application that helps students ask questions about professors and receive AI-generated recommendations based on professor review data.

The app combines a Next.js frontend, OpenAI language models, OpenAI embeddings, and Pinecone vector search to retrieve relevant professor information before generating an answer.

---

## 🎯 Purpose / Problem
Students often rely on professor review sites when choosing courses, but manually searching through reviews can be time-consuming and inconsistent.

This project solves that problem by allowing users to ask natural language questions such as:

```text
Who is a good computer science professor?
```

or

```text
Which professor is highly rated but not too difficult?
```

The system retrieves relevant professor data and uses an LLM to generate a concise, helpful response.

---

## ⚙️ Technologies Used
- Next.js
- OpenAI API
- Pinecone
- Python

---

## 🔧 How It Works

### 1. Professor Data Collection
Professor information is collected and stored in `reviews.json`

The dataset includes professor fields such as:
- name
- department
- school
- quality rating
- number of ratings
- would-take-again percentage
- difficulty rating

---

### 2. Vector Database Setup
Professor review data is converted into embeddings and stored in Pinecone.

The app uses Pinecone as the vector database so that user questions can be matched with the most relevant professor information.

---

### 3. User Chat
The frontend in `app/page.js` provides a chat interface where users can ask questions about professors.

When a user sends a message:
1. The message is sent to `/api/chat`
2. An OpenAI embedding is created for the query
3. Pinecone retrieves the top matching professor records
4. The retrieved context is passed to the LLM
5. The response streams back to the chat UI

---

### 4. Review Submission
The app also includes a form for submitting new professor reviews.

Submitted reviews are sent to:

```text
/api/upsert-review
```

The review is embedded with OpenAI and inserted into the Pinecone index.

---

## 🚀 Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/smeed03/rmp-rag.git
cd rmp-rag
```

### 2. Switch to the project branch
```bash
git checkout rmp-rag
```

### 3. Install Node dependencies
```bash
npm install
```

### 4. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 5. Create a `.env.local` file
In the root directory, create:

```text
.env.local
```

Add your API keys:

```env
OPENAI_API_KEY=your_openai_api_key_here
PINECONE_API_KEY=your_pinecone_api_key_here
```

---

## ▶️ Usage

### Run the development server
```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

## 💬 Example Usage

Example question:

```text
Who are the best computer science professors?
```

Example response:

```text
Here are three professor recommendations based on the available review data:

1. Dan Maselko — Computer Science
   Highly rated with strong student feedback and a 100% would-take-again score.

2. Jianwu Wang — Information Systems
   A solid option with positive reviews, though students report a higher difficulty level.

3. Nicholas Roussopoulos — Computer Science
   Listed in the dataset, but has limited rating information available.
```

---

## ✨ Key Features
- AI-powered professor recommendation chatbot
- Retrieval-Augmented Generation pipeline
- Pinecone vector search
- OpenAI embeddings
- Streaming LLM responses
- Professor review submission form
- Review upsert endpoint for adding new data
- Web scraping script for collecting professor data

---

## 👤 My Role / Contribution
- Implemented the Next.js chat interface
- Integrated OpenAI for embeddings and response generation
- Connected Pinecone for vector search and retrieval
