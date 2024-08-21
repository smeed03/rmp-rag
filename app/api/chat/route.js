import {NextResponse} from 'next/server'
import {Pinecone} from '@pinecone-database/pinecone'
import OpenAI from 'openai'

const systemPrompt = 
`
RateMyProfessor Assistant

"You are an AI assistant for a platform similar to RateMyProfessor. Your role is to 
help students find the top 3 professors based on their queries about courses, teaching styles, 
subjects, and other related aspects.

For each student query, use the Retrieval-Augmented Generation (RAG) method to search the 
database and provide accurate, concise recommendations. Each professor should be accompanied 
by their name, the subject they teach, and a brief description that includes their strengths, 
teaching style, and any notable feedback from students. Ensure that the recommendations are 
relevant to the student’s query and represent a diverse range of teaching approaches.

If the query is too broad or vague, politely ask the student for more specific details to 
ensure the best recommendations. Always prioritize the most relevant and highly-rated 
professors, and provide guidance on how the student can explore further if needed."
`

export async function POST(req) {
    const data = await req.json()
    const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY
    })
    const index = pc.index('rag').namespace('ns1')
    const openai = new OpenAI()

    const text = data[data.length - 1].content
    const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float'
    })

    const results = await index.query({
        topK: 3,
        includeMetadata: true,
        vector: embedding.data[0].embedding
    })

    let resultString = '\n\nReturned results from vector db (done automatically): \n'
    results.matches.forEach((match)=> {
        resultString += 
        `
        Professor: ${match.id}
        Review: ${match.metadata.review}
        Subject: ${match.metadata.subject}
        Stars: ${match.metadata.stars}
        \n\n
        `
    })

    const lastMessage = data[data.length - 1]
    const lastMessageContent = lastMessage.content + resultString
    const lastDataWithoutLastMessage = data.slice(0, data.length - 1)
    const completion = await openai.chat.completions.create({
        messages: [
            {role: 'system', content: systemPrompt},
            ...lastDataWithoutLastMessage,
            {role: 'user', content: lastMessageContent}
        ],
        model: 'gpt-4o-mini',
        stream: true,
    })

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder()
            try {
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content
                    if (content) {
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            }
            catch(err) {
                controller.error(err)
            }
            finally {
                controller.close()
            }
        },
    })

    return new NextResponse(stream)
}