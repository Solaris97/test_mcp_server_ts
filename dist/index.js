import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fetch from "node-fetch";
const server = new McpServer({
    name: "Demo",
    version: "1.0.0"
});
server.tool("add", { a: z.number(), b: z.number() }, async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }]
}));
server.resource("greeting", new ResourceTemplate("greeting://{name}", { list: undefined }), async (uri, { name }) => ({
    contents: [{
            uri: uri.href,
            text: `안녕하세요, ${name}님!`
        }]
}));
// GPT tool 추가
server.tool("gpt", { prompt: z.string() }, async ({ prompt }) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return { content: [{ type: "text", text: "OPENAI_API_KEY 환경변수가 필요합니다." }] };
    }
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }]
        })
    });
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content ?? "No response";
    return { content: [{ type: "text", text }] };
});
const transport = new StdioServerTransport();
await server.connect(transport);
