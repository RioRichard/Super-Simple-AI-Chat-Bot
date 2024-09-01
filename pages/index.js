"use client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [chat, setChat] = useState(null);

  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  const MODEL = "gemini-1.5-flash";
  const GENERATION_CONFIG = {
    maxOutputTokens: 2048,
    temperature: 0.9,
    topK: 1,
    topP: 1,
  };  

  const genAI = new GoogleGenerativeAI(API_KEY);

  useEffect(() => {
    const initChat = async () => {
      try {
        const data = {
          generationConfig: GENERATION_CONFIG,
          history: messages,
        };
        console.log("history", data);

        const newChat = await genAI
          .getGenerativeModel({ model: MODEL })
          .startChat(data);
        setChat(newChat);
      } catch (error) {
        throw new Error(error.toString());
      }
    };
    initChat();
  }, []);
  const handleMessage = async () => {
    try {
      const userMessage = {
        parts: [{ text: userInput }],
        role: "user",
      };
      console.log('set one time!');
      
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setUserInput("");

      if (chat) {
        const result = await chat.sendMessage(userInput);
        const response = result.response;

        const botMessage = {
          parts: [{ text: response.text() }],
          role: "model",
        };
      console.log('set two time!');
        
      setMessages(prevMessages => [...prevMessages, botMessage]);
        
        console.log(messages);

      }
    } catch (error) {
      throw new Error(error.toString());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleMessage();
    }
  };

  return (
    <main>
      <div className="flex flex-col h-screen p-4 outline-blue">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold">Gemini Chat</h1>
        </div>
        <div className="flex-1 overflow-y-auto rounded-md p-2">
          {messages?.map((msg, index) => {
                        
            return (
              <div>
                <div
                  key={index}
                  className={`mb-4 ${
                    msg.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <span className="p-2 rounded-lg ">
                    {msg.parts[0].text}
                  </span>
                </div>
                <p className="text-xs mt-1">
                  {`${msg.role === "model" ? "BOT" : "YOU"}`}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center mt-4">
          <input
            type="text"
            placeholder="Nhập tin nhắn"
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
            }}
            onKeyDown={(e) => {
              handleKeyPress(e);
            }}
            className="flex-1 p-2 rounded-1-md border-t border-b border-l focus:outline-none focus:outline-black"
          />
          <button
            onClick={handleMessage}
            className={`p-2 text-black rounded-r-md hover:bg-opacity-80 focus:outline-none`}
          >
            Gửi tin nhắn
          </button>
        </div>
      </div>
    </main>
  );
}
