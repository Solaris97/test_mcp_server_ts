import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
const transport = new StdioClientTransport({
    command: "node",
    args: ["dist/index.js"] // 서버 실행 경로에 맞게 수정
});
const client = new Client({
    name: "example-client",
    version: "1.0.0"
});
async function main() {
    await client.connect(transport);
    // GPT tool 호출 예시
    const result = await client.callTool({
        name: "gpt",
        arguments: { prompt: "안녕 GPT!" }
    });
    console.log("GPT 응답:", result);
}
main();
