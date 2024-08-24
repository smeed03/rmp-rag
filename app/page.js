'use client'
import Image from "next/image";
import { useState } from "react";
import { Box, Stack, TextField, Button } from "@mui/material"

export default function Home() {
  const[messages, setMessages] = useState([
    {
      "role": "assistant",
      "content": "Hi! I'm your RateMyProfessor Assistant. How can I help you?"
    }
  ])

  const [message, setMessage] = useState("")

// Added fields for uploading review
const [reviewData, setReviewData] = useState({
  professor: '',
  subject: '',
  review: '',
  stars: ''
});

const handleInputChange = (e) => {
  setReviewData({ ...reviewData, [e.target.name]: e.target.value });
};
const submitReview = async () => {
  const response = await fetch('/api/upsert-review', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reviewData),
  });

  if (response.ok) {
    console.log('Review successfully submitted!');
    // Optionally reset the form after submission
    setReviewData({ professor: '', subject: '', review: '', stars: '' });
  } else {
    console.error('Failed to submit the review.');
  }
};

//end 


  const sendMessage = async () => {
    setMessages((messages) => [
      ...messages,
      {"role": "user", "content": message},
      {"role": "assistant", "content": ""}
    ])

    setMessage("")

    const response = fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify([...messages, {role: "user", content: message}])
    }).then(async(res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let result = ""

      return reader.read().then(function processText({done, value}) {
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Uint8Array(), {stream: true})
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            {...lastMessage, content: lastMessage.content + text}
          ]
        })

        return reader.read().then(processText)
      })
    })
  }

  return (
    <Box
    width="100vw"
    height="100vh"
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    >
      <Stack
      direction="column"
      width="500px"
      height="700px"
      border="1px solid black"
      p={2}
      spacing={3}
      >
        <Stack
        direction="column"
        spacing={2}
        flexGrow={1}
        overflow={"auto"}
        maxHeight={"100%"}
        >
          {
            messages.map((message, index) => (
                <Box
                key={index}
                display="flex"
                justifyContent={message.role === "assistant" ? "flex-start" : "flex-end"}
                >
                  <Box
                  bgcolor={message.role === "assistant" ? "primary.main" : "secondary.main"}
                  color="white"
                  borderRadius="16px"
                  p={3}
                  >
                    {message.content}
                  </Box>
                </Box>
            ))
          }
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
          label="Message"
          fullWidth
          value={message}
          onChange={(e) => {setMessage(e.target.value)}}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Stack>

        {/* Section to Submit New Review*/}
    <Box>
      <Stack spacing={2}>
        <TextField
          label="Professor Name"
          name="professor"
          value={reviewData.professor}
          onChange={handleInputChange}
        />
        <TextField
          label="Subject"
          name="subject"
          value={reviewData.subject}
          onChange={handleInputChange}
        />
        <TextField
          label="Review"
          name="review"
          value={reviewData.review}
          onChange={handleInputChange}
          multiline
        />
        <TextField
          label="Stars"
          name="stars"
          type="number"
          value={reviewData.stars}
          onChange={handleInputChange}
        />
        <Button variant="contained" onClick={submitReview}>
          Submit Review
        </Button>
      </Stack>
    </Box>


    {/* End */}
      </Stack>
    </Box>
  )
}
