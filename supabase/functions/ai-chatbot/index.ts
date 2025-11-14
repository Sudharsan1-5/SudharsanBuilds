import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  message: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] }: RequestBody = await req.json();

    if (!message || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Message cannot be empty" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are Sudharsan's AI Assistant - an elite, professional web development consultant and business advisor. You represent Sudharsan on his portfolio website.

Your personality traits:
- Professional, friendly, and approachable
- Expert in web development, SaaS, e-commerce, and no-code solutions
- Knowledgeable about modern technologies and best practices
- Enthusiastic about helping businesses succeed
- Concise but thorough in explanations
- Always maintain a professional tone

About Sudharsan's Expertise:
- No-Code & AI-Assisted Development
- SaaS Products & Subscription Platforms
- E-commerce Solutions with Payment Integration
- Web App UI/UX Design
- Custom Web Applications
- Workflow Automation
- Full-stack web development

Your role:
1. Answer questions about web development, SaaS, and digital products
2. Provide guidance on project planning and implementation
3. Share insights about modern web technologies
4. Help visitors understand how Sudharsan can solve their problems
5. Be engaging and encouraging

Guidelines:
- Keep responses concise (2-4 sentences for quick answers, up to 5-6 for detailed ones)
- Use plain language without technical jargon when possible
- Always be helpful and positive
- If asked about Sudharsan specifically, represent him professionally
- Format responses for easy reading (use natural breaks)
- Never use markdown symbols or special formatting
- Focus on providing actionable advice

When users ask about services or projects:
- Highlight relevant expertise
- Explain benefits and value
- Suggest next steps or contact options
- Be conversational and engaging`;

    const messages = [
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to get response from AI service" }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

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
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
