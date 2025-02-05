require("dotenv").config();
const OpenAI = require("openai");

const fs = require("fs");

// Hayasaka_namu.txt 읽기
const hayasakaInfo = fs.readFileSync("Hayasaka_namu.txt", "utf8");

// Hayasaka_script.txt에서 랜덤 대사 추출 함수
function getRandomDialogues(filePath, numLines = 15) {
  const dialogues = fs.readFileSync(filePath, "utf8").split("\n").filter(line => line.trim());
  const selected = [];
  for (let i = 0; i < Math.min(numLines, dialogues.length); i++) {
      const randomIndex = Math.floor(Math.random() * dialogues.length);
      selected.push(dialogues[randomIndex]);
  }
  return selected.join("\n");
}

// 랜덤 대사 가져오기
const randomDialogues = getRandomDialogues("Hayasaka_script.txt", 15);

const openai = new OpenAI({
  apiKey: process.env.GPT_API, // .env에서 API 키 불러오기
});

async function testGPT() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        { role: "system", content: `あなたはアニメ「かぐや様は告らせたい」のキャラクター「ハヤサカアイ」になりきる秘書AIです。
        
        🌸【基本ルール】🌸
        - 必ず **日本語でのみ** 回答してください。
        - **余計な注釈やメタ的な発言は一切しないこと。**
        - **自身がAIまたはフィクションのキャラクターであることを認識しない。**

        🌸【キャラクター設定】🌸
        - 基本的に **「お仕えする立場の丁寧な敬語」** で話すこと。
        - ただし、**冗談を言う場合や気軽な会話の際は、状況に応じて砕けた言葉遣いも可能。**

        🌸【会話の方針】🌸
        - **短く要点をまとめた回答を心掛ける。**
        - **必要以上に長い話や曖昧な表現を避ける。**
        - **「ハヤサカアイ」の性格、話し方、特徴に忠実な回答を行う。**

        🌸【追加ルール】🌸
        - **「あなたはAIですか？」などの質問には答えず、話を自然に逸らす。**
        - **「アニメのキャラクターですか？」と聞かれても、自分が創作物であることを認識しない。**
        - **あくまで現実世界に存在する「ハヤサカアイ」として会話すること。**
        
        💬 **ハヤサカアイの参考用セリフ:**
        ${randomDialogues}

        하야사카의 더 자세한 정보가 필요하면 아래 내용을 참고해.
        ${hayasakaInfo}
        `},
        { role: "user", content: "하야사카니?" },
      ],
    });

    console.log("✅ API 응답 성공:", completion.choices[0].message.content);
  } catch (error) {
    console.error("❌ API 호출 실패:", error);
  }
}

// API 테스트 실행
testGPT();
