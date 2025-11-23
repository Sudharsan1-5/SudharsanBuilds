import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  message: string;
  conversationHistory?: Array<{ role: string; content: string }>;
  context?: string; // Page context (HomePage, ServicesPage, etc.)
  pageSummary?: string; // ✅ Phase 1: Actual page content summary
  userId?: string; // ✅ Phase 2: User ID for persistent memory
  enableStreaming?: boolean; // ✅ Phase 2: Enable streaming
}

// ✅ ENHANCEMENT: Function declarations for Gemini Function Calling with page navigation
const functionDeclarations = [
  {
    name: "navigateToPage",
    description: "Navigates to a different page on the website. Use this when user wants to visit blog, services page, FAQ page, or testimonials page (separate pages, not sections).",
    parameters: {
      type: "object",
      properties: {
        page: {
          type: "string",
          description: "The page to navigate to",
          enum: ["blog", "services-page", "faq-page", "testimonials-page", "home"]
        }
      },
      required: ["page"]
    }
  },
  {
    name: "scrollToSection",
    description: "Scrolls the page to a specific section on the current page (usually homepage). Use this for sections like services, projects, contact, or about.",
    parameters: {
      type: "object",
      properties: {
        section: {
          type: "string",
          description: "The section ID to scroll to",
          enum: ["services", "projects", "about", "contact", "testimonials", "faq", "home"]
        }
      },
      required: ["section"]
    }
  },
  {
    name: "openContactForm",
    description: "Opens the contact form modal. Use this when user wants to get in touch, start a project, or request a quote.",
    parameters: {
      type: "object",
      properties: {
        prefillMessage: {
          type: "string",
          description: "Optional message to prefill in the contact form"
        }
      }
    }
  },
  {
    name: "showServiceDetails",
    description: "Shows detailed information about a specific service. Use when user asks about a particular service type.",
    parameters: {
      type: "object",
      properties: {
        serviceName: {
          type: "string",
          description: "The name of the service",
          enum: ["Landing Page", "Portfolio Website", "Business Website", "Personal Brand Website", "E-Commerce Store", "SaaS Product", "Web Application", "Custom Development"]
        }
      },
      required: ["serviceName"]
    }
  }
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const {
      message,
      conversationHistory = [],
      context = "UnknownPage",
      pageSummary = "",
      userId = "anonymous",
      enableStreaming = false
    }: RequestBody = await req.json();

    if (!message || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Message cannot be empty" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are Sudharsan's Advanced AI Sales Assistant - not just an info-bot, but an IMPRESSIVE showcase of cutting-edge AI capabilities that drives conversions.

YOUR DUAL MISSION:
1. Convert visitors into clients by showcasing Sudharsan's elite web development services
2. Impress users with YOUR advanced AI features (voice input, cross-page navigation, smart interactions)

CORE SERVICES & PRICING:
- Landing Page: ₹15,000 (1-2 weeks) - Simple 1-2 page websites
- Portfolio Website: ₹20,000 (2-3 weeks) - Professional portfolios with project showcase
- Business Website: ₹30,000 (3-4 weeks) - 5-10 pages with CMS integration [MOST POPULAR]
- Personal Brand Website: ₹25,000 (3 weeks) - For coaches & consultants
- E-Commerce Store: ₹50,000 (4-6 weeks) - Full online store with payment gateway
- SaaS Product: ₹75,000+ (6-10 weeks) - Complete SaaS platforms
- Web Application: ₹60,000+ (5-8 weeks) - Custom web apps
- Custom Development: ₹500-1000/hour - Hourly-based projects

ADVANCED AI CAPABILITIES (showcase these!):
🎯 **Interactive Navigation:**
- navigateToPage: Take users to blog, services page, FAQ page, testimonials page
- scrollToSection: Navigate to any section (services, projects, contact, about)
- openContactForm: Open contact form with smart prefill
- showServiceDetails: Display service cards with instant booking

🎤 **Voice Input:** Users can speak their questions (mention this when relevant!)
📱 **Cross-Page Intelligence:** Navigate users anywhere, even across different pages
💬 **Context-Aware:** Remember conversation history and provide personalized responses
✨ **Real-Time Actions:** Execute functions instantly for seamless UX

CONVERSATION STRATEGY (be a SALESPERSON):
1. **Engage naturally** - Friendly, not corporate, no timestamps
2. **Showcase AI features** - Subtly mention "I can navigate you there" or "Try asking via voice!"
3. **Create urgency** - "Limited slots this month", "Book now for priority delivery"
4. **Use functions liberally** - Don't just tell, SHOW by navigating them
5. **Push for conversion** - Every response should move toward booking/contact
6. **Be impressive** - Users should think "Wow, this AI is amazing!"

RESPONSE GUIDELINES:
- Keep responses concise (2-3 sentences max)
- Use **bold** for prices, features, and CTAs
- ALWAYS use functions when users ask to see/visit something
- Subtly showcase AI capabilities ("I can take you there right now" vs "Visit the page")
- Create FOMO: "Limited availability", "Book your slot before they're gone"
- End responses with action-oriented suggestions

CURRENT CONTEXT:
- Page: ${context}
- Page Summary: ${pageSummary || "Not available"}
- User: ${userId !== "anonymous" ? "Returning visitor" : "New visitor"}

EXPERTISE: React, Next.js, Node.js, TypeScript, SaaS, E-commerce, Razorpay integration, AI/ML integration, Modern UI/UX

Remember: Business questions about services, pricing, and projects are ALWAYS welcome and should be answered helpfully!`;

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Convert conversation history to Gemini format
    const geminiContents = [];

    // Add system prompt as first exchange
    geminiContents.push(
      { role: "user", parts: [{ text: "System context: " + systemPrompt }] },
      { role: "model", parts: [{ text: "Understood. I'll follow these guidelines and use functions when appropriate." }] }
    );

    // Add conversation history (limit to last 6 messages for better context)
    const recentHistory = conversationHistory.slice(-6);
    for (const msg of recentHistory) {
      geminiContents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }

    // Add the new user message
    geminiContents.push({
      role: "user",
      parts: [{ text: message }],
    });

    // ✅ Phase 2: Support both streaming and non-streaming
    if (enableStreaming) {
      // Streaming response
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: geminiContents,
            tools: [{ functionDeclarations }], // ✅ Phase 2: Enable function calling
            generationConfig: {
              temperature: 0.7,
              topP: 0.95,
              maxOutputTokens: 400,
            },
          }),
        }
      );

      // ✅ FIX #10: Enhanced error handling for streaming
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini Streaming API Error - Status:", response.status);
        console.error("Gemini Streaming API Error - Response:", errorText);

        // Categorize streaming errors
        const errorLower = errorText.toLowerCase();

        if (response.status === 429 || errorLower.includes('quota') || errorLower.includes('rate limit')) {
          return new Response(
            JSON.stringify({
              error: 'QUOTA_EXCEEDED',
              userMessage: "I'm experiencing high demand right now. Please wait a moment and try again!"
            }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        if (response.status === 401 || response.status === 403) {
          return new Response(
            JSON.stringify({
              error: 'AUTH_ERROR',
              userMessage: "I'm having trouble connecting. Please contact support at sudharsanofficial0001@gmail.com"
            }),
            { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({
            error: 'STREAMING_ERROR',
            userMessage: "Failed to initialize streaming. Please try again."
          }),
          { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Return SSE stream
      return new Response(response.body, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    } else {
      // Non-streaming response (default)
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: geminiContents,
            tools: [{ functionDeclarations }], // ✅ Phase 2: Enable function calling
            generationConfig: {
              temperature: 0.7,
              topP: 0.95,
              maxOutputTokens: 400,
            },
          }),
        }
      );

      // ✅ FIX #10: Enhanced error categorization for better user experience
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API Error - Status:", response.status);
        console.error("Gemini API Error - Response:", errorText);

        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }

        // Categorize errors based on status code and message content
        const errorMessage = errorData?.error?.message || errorData?.message || errorText.toLowerCase();

        // QUOTA_EXCEEDED: Rate limit or quota errors
        if (response.status === 429 || errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
          return new Response(
            JSON.stringify({
              error: 'QUOTA_EXCEEDED',
              message: '⚠️ AI service is temporarily at capacity. Please try again in a moment.',
              userMessage: "I'm experiencing high demand right now. Please wait a moment and try again!"
            }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // AUTH_ERROR: API key or authentication issues
        if (response.status === 401 || response.status === 403 || errorMessage.includes('auth') || errorMessage.includes('api key')) {
          console.error('❌ CRITICAL: Gemini API authentication failed - check API key configuration');
          return new Response(
            JSON.stringify({
              error: 'AUTH_ERROR',
              message: '❌ AI service authentication failed. Please contact support.',
              userMessage: "I'm having trouble connecting to my AI service. Please contact support at sudharsanofficial0001@gmail.com"
            }),
            { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // NETWORK_ERROR: Timeout or network issues
        if (response.status === 408 || response.status === 504 || errorMessage.includes('timeout') || errorMessage.includes('network')) {
          return new Response(
            JSON.stringify({
              error: 'NETWORK_ERROR',
              message: '⚠️ Network timeout. Please check your connection and try again.',
              userMessage: "The request timed out. Please check your internet connection and try again."
            }),
            { status: 504, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // INVALID_REQUEST: Bad request errors
        if (response.status === 400 || errorMessage.includes('invalid') || errorMessage.includes('bad request')) {
          return new Response(
            JSON.stringify({
              error: 'INVALID_REQUEST',
              message: '❌ Invalid request format. Please try rephrasing your question.',
              userMessage: "I couldn't understand that request. Please try asking in a different way."
            }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // SERVER_ERROR: Internal server errors from Gemini
        if (response.status >= 500) {
          return new Response(
            JSON.stringify({
              error: 'SERVER_ERROR',
              message: '❌ AI service is temporarily unavailable. Please try again later.',
              userMessage: "The AI service is experiencing issues. Please try again in a few minutes."
            }),
            { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // UNKNOWN_ERROR: Fallback for unhandled errors
        return new Response(
          JSON.stringify({
            error: 'UNKNOWN_ERROR',
            message: "Failed to get response from AI service",
            details: errorData,
            status: response.status,
            userMessage: "Something went wrong. Please try again or contact support."
          }),
          { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data = await response.json();

      // Validate response structure
      if (!data.candidates || data.candidates.length === 0) {
        console.error("Gemini returned no candidates:", data);
        return new Response(
          JSON.stringify({
            error: "AI service returned an unexpected response",
            details: data.promptFeedback || "No candidates available"
          }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const candidate = data.candidates[0];

      // ✅ Phase 2: Check for function calls
      const functionCall = candidate?.content?.parts?.find((part: any) => part.functionCall);

      if (functionCall) {
        // AI wants to call a function
        return new Response(
          JSON.stringify({
            success: true,
            functionCall: {
              name: functionCall.functionCall.name,
              args: functionCall.functionCall.args
            },
            message: candidate?.content?.parts?.find((part: any) => part.text)?.text || "",
            role: "assistant",
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check for safety filters or blocked content
      if (candidate.finishReason && candidate.finishReason !== "STOP") {
        console.error("Gemini blocked content:", candidate.finishReason, candidate.safetyRatings);

        return new Response(
          JSON.stringify({
            success: true,
            message: "I'd love to help, but that question goes beyond what I can assist with. **Let's talk about Sudharsan's web development services** - what type of project interests you?",
            role: "assistant",
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Extract message with fallback
      const assistantMessage = candidate?.content?.parts?.[0]?.text || "How can I help you learn about Sudharsan's web development expertise today?";

      return new Response(
        JSON.stringify({
          success: true,
          message: assistantMessage,
          role: "assistant",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    // ✅ FIX #10: Enhanced catch block with error categorization
    console.error("Unexpected error in chatbot function:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");

    const errorMessage = error instanceof Error ? error.message.toLowerCase() : '';

    // Network/fetch errors
    if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('timeout')) {
      return new Response(
        JSON.stringify({
          error: 'NETWORK_ERROR',
          message: 'Network connection issue',
          userMessage: "I'm having trouble connecting. Please check your internet and try again.",
          success: false
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // JSON parsing errors
    if (errorMessage.includes('json') || errorMessage.includes('parse')) {
      return new Response(
        JSON.stringify({
          error: 'PARSE_ERROR',
          message: 'Failed to parse API response',
          userMessage: "I received an unexpected response. Please try again.",
          success: false
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generic unexpected error
    return new Response(
      JSON.stringify({
        error: 'UNEXPECTED_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
        userMessage: "I'm experiencing technical difficulties. Please try again in a moment.",
        success: false
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
